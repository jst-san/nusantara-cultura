"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StageView } from "./Stage";
import { ChoiceList, ConsequenceCard, DialogueBox } from "./Panels";
import { ObservationStage } from "./ObservationStage";
import { ReflectionForm } from "./ReflectionForm";
import { RewardReveal } from "./RewardReveal";
import { ChapterEndScreen, EpisodeResult, type EpisodeSummary } from "./StoryEnd";
import { StoryHud } from "./StoryHud";
import { QuizCard } from "@/components/games/QuizCard";
import { MatchingGame } from "@/components/games/MatchingGame";
import { OrderingGame } from "@/components/games/OrderingGame";
import { ListeningPlayer } from "@/components/games/ListeningPlayer";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Bits";
import { Modal } from "@/components/ui/Overlay";
import { Motif } from "@/components/brand/Motif";
import { ACHIEVEMENTS, getChapter, getEpisode } from "@/data";
import { conditionMet, episodeLockedReason, episodeStatus } from "@/lib/progression";
import { describeEffects, type EffectChip } from "@/lib/labels";
import { useGameStore } from "@/lib/store";
import { playSfx, stopSpeech } from "@/lib/audio";
import { useMotionEnabled, usePlaytimeCounter, useSaveReady } from "@/lib/hooks";
import type {
  Chapter,
  ChoiceOption,
  DecisionRecord,
  Effects,
  Episode,
  Hotspot,
  ObservationNode,
  ReflectionNode,
  RewardNode,
  SpeakerId,
  StoryNode,
  TaraExpression,
} from "@/lib/types";

type Phase =
  | "loading"
  | "resume"
  | "lines"
  | "choose"
  | "reaction"
  | "interact"
  | "reward"
  | "episodeEnd"
  | "chapterEnd"
  | "fatal";

interface SessionBaseline {
  knowledge: number;
  practice: number;
  decisions: number;
  collection: number;
}

interface SessionSnapshot extends SessionBaseline {
  /** Status selesai episode ini pada saat sesi dimulai (dipakai label "mengulang"). */
  wasCompleted: boolean;
}

function readBaseline(): SessionBaseline {
  const state = useGameStore.getState();
  return {
    knowledge: state.xp.knowledge,
    practice: state.xp.practice,
    decisions: state.decisions.length,
    collection: Object.values(state.collection).filter((item) => item.found).length,
  };
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-busy="true" aria-label="Menyiapkan episode">
      <div className="h-12 animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
      <div className="h-[34vh] min-h-[210px] animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
      <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
    </div>
  );
}

/**
 * Mesin pemutar cerita.
 *
 * Aturan yang dijaga:
 * - Node dengan kondisi yang tidak terpenuhi dilewati otomatis (variasi dialog).
 * - Efek node diberikan tepat sekali per sumber (store memakai kunci `awarded`).
 * - Setiap keputusan, refleksi, dan temuan tercatat di save state.
 * - Pemain tidak bisa "terjebak": semua episode bisa diselesaikan dengan
 *   pilihan apa pun, dan progres tersimpan otomatis.
 */
export function StoryPlayer({ chapterId, episodeId }: { chapterId: string; episodeId: string }) {
  const ready = useSaveReady();
  const chapter = getChapter(chapterId);
  const episode = getEpisode(chapterId, episodeId);
  const motionOn = useMotionEnabled();

  const nodeIndex = useMemo(() => {
    const map = new Map<string, StoryNode>();
    for (const node of episode?.nodes ?? []) map.set(node.id, node);
    return map;
  }, [episode]);

  const save = useGameStore();

  const [phase, setPhaseState] = useState<Phase>("loading");
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [lineIndex, setLineIndexState] = useState(0);
  const [speaker, setSpeaker] = useState<SpeakerId>("narrator");
  const [expression, setExpression] = useState<TaraExpression>("curious");
  const [choice, setChoice] = useState<ChoiceOption | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [rewardState, setRewardState] = useState<{ chips: EffectChip[]; alreadyOwned: boolean } | null>(null);
  const [fatalMessage, setFatalMessage] = useState<string | null>(null);

  /**
   * Cermin sinkron dari state mesin.
   *
   * Ketukan spasi/enter yang cepat bisa datang sebelum React sempat render ulang.
   * Kalau handler hanya membaca state hasil render, ketukan kedua akan memakai
   * indeks baris yang basi dan terasa "hilang". Ref di bawah membuat setiap
   * ketukan selalu membaca posisi terkini.
   */
  const phaseRef = useRef<Phase>("loading");
  const nodeIdRef = useRef<string | null>(null);
  const lineIndexRef = useRef(0);
  const foundRef = useRef<string[]>([]);

  const setPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  };

  const setLineIndex = (next: number) => {
    lineIndexRef.current = next;
    setLineIndexState(next);
  };

  const setFoundList = (next: string[]) => {
    foundRef.current = next;
    setFound(next);
  };

  const startedRef = useRef(false);
  const [sessionKey, setSessionKey] = useState(0);

  /**
   * Cuplikan sesi dibaca sekali setelah save siap (sebelum efek adegan mana pun
   * dijalankan) supaya ringkasan akhir episode melaporkan selisih yang jujur,
   * termasuk saat episode diulang. `sessionKey` naik saat pemain menekan
   * "Ulangi episode", sehingga cuplikan dihitung ulang dari keadaan terbaru.
   */
  const session = useMemo<SessionSnapshot | null>(() => {
    if (!ready || !episode) return null;
    void sessionKey;
    return {
      ...readBaseline(),
      wasCompleted: useGameStore.getState().completedEpisodes.includes(episode.id),
    };
  }, [ready, episode, sessionKey]);

  const currentNode = nodeId ? (nodeIndex.get(nodeId) ?? null) : null;

  usePlaytimeCounter(ready && phase !== "fatal");

  /* ---------- mesin ---------- */

  function applyEffects(effects: Effects | undefined, sourceId: string) {
    useGameStore.getState().applyEffects(effects, { sourceId, chapterId, episodeId });
  }

  function resolveFrom(startId: string | null | undefined): { node: StoryNode | null; missing: string | null } {
    if (!startId) return { node: null, missing: null };
    let current: string | null = startId;
    let guard = 0;
    while (current && guard < 250) {
      const candidate = nodeIndex.get(current);
      if (!candidate) return { node: null, missing: current };
      if (conditionMet(useGameStore.getState(), candidate.condition)) return { node: candidate, missing: null };
      current = candidate.next ?? null;
      guard += 1;
    }
    return { node: null, missing: null };
  }

  function finishEpisode(target: Phase) {
    const state = useGameStore.getState();
    state.completeEpisode(episodeId, chapterId);
    playSfx(target === "chapterEnd" ? "achievement" : "success");
    setPhase(target);
  }

  function advanceTo(next: string | null) {
    if (next === null) {
      finishEpisode("episodeEnd");
      return;
    }
    const { node: resolved, missing } = resolveFrom(next);
    if (missing) {
      setFatalMessage(`Adegan "${missing}" tidak ditemukan di data episode ini.`);
      setPhase("fatal");
      return;
    }
    if (!resolved) {
      finishEpisode("episodeEnd");
      return;
    }
    beginNode(resolved);
  }

  function proceedToMain(node: StoryNode) {
    switch (node.type) {
      case "script":
        applyEffects(node.effects, `node:${node.id}`);
        advanceTo(node.next ?? null);
        return;
      case "choice":
        setPhase("choose");
        return;
      case "quiz":
      case "matching":
      case "ordering":
      case "listening":
      case "observation":
      case "reflection":
        setPhase("interact");
        return;
      case "reward": {
        const state = useGameStore.getState();
        const xpAlready = Boolean(state.awarded[`xp:node:${node.id}`]);
        const chips = describeEffects(node.effects).filter((item) => {
          if (item.id === "xp-knowledge" || item.id === "xp-practice") return !xpAlready;
          if (item.id.startsWith("col-")) return !state.collection[item.id.slice(4)]?.found;
          if (item.id.startsWith("quest-")) {
            const quest = state.quests[item.id.slice(6)];
            return !quest || quest.status === "locked";
          }
          if (item.id.startsWith("ach-")) return !state.achievements[item.id.slice(4)]?.unlocked;
          if (item.id.startsWith("jr-")) return !state.journal.entries.includes(item.id.slice(3));
          if (item.id.startsWith("flag-")) return !state.flags[item.id.slice(5)];
          return true;
        });
        applyEffects(node.effects, `node:${node.id}`);
        setRewardState({ chips, alreadyOwned: xpAlready });
        setPhase("reward");
        playSfx("unlock");
        return;
      }
      case "chapterEnd":
        applyEffects(node.effects, `node:${node.id}`);
        finishEpisode("chapterEnd");
        return;
    }
  }

  function beginNode(node: StoryNode) {
    useGameStore.getState().markVisited(node.episodeId, chapterId, node.id);
    stopSpeech();
    nodeIdRef.current = node.id;
    setNodeId(node.id);
    setLineIndex(0);
    setChoice(null);
    setFoundList([]);
    setActiveHotspot(null);
    setRewardState(null);
    const lines = node.lines ?? [];
    const first = lines[0];
    setSpeaker(first?.speaker ?? "narrator");
    if (first?.expression) setExpression(first.expression);
    if (lines.length > 0) {
      setPhase("lines");
      return;
    }
    proceedToMain(node);
  }

  function beginAt(startId: string) {
    const { node: resolved, missing } = resolveFrom(startId);
    if (missing) {
      setFatalMessage(`Adegan "${missing}" tidak ditemukan di data episode ini.`);
      setPhase("fatal");
      return;
    }
    if (!resolved) {
      finishEpisode("episodeEnd");
      return;
    }
    beginNode(resolved);
  }

  function restartEpisode() {
    setSessionKey((key) => key + 1);
    const startId = episode?.startNodeId ?? episode?.nodes[0]?.id;
    if (startId) beginAt(startId);
  }

  /* ---------- interaksi ---------- */

  function handleAdvance() {
    const node = nodeIdRef.current ? (nodeIndex.get(nodeIdRef.current) ?? null) : null;
    if (!node || phaseRef.current !== "lines") return;
    const lines = node.lines ?? [];
    const index = lineIndexRef.current;
    if (index < lines.length - 1) {
      const nextIndex = index + 1;
      const line = lines[nextIndex];
      setLineIndex(nextIndex);
      setSpeaker(line.speaker);
      if (line.expression) setExpression(line.expression);
      playSfx("advance");
      return;
    }
    proceedToMain(node);
  }

  function currentStoryNode(): StoryNode | null {
    return nodeIdRef.current ? (nodeIndex.get(nodeIdRef.current) ?? null) : null;
  }

  /** Opsi yang lolos kondisi. Dipakai saat render (dari state) maupun handler (dari ref). */
  function optionsForNode(node: StoryNode | null): ChoiceOption[] {
    if (!node || node.type !== "choice") return [];
    const state = useGameStore.getState();
    return node.options.filter((option) => conditionMet(state, option.condition));
  }

  function handleChoose(option: ChoiceOption) {
    const node = currentStoryNode();
    if (!node || node.type !== "choice") return;
    if (phaseRef.current !== "choose") return;
    playSfx("select");
    applyEffects(option.effects, `choice:${node.id}:${option.id}`);
    useGameStore.getState().countChoice();
    useGameStore.getState().recordDecision({
      nodeId: node.id,
      episodeId,
      chapterId,
      question: node.prompt ?? node.label ?? "Pilihan cerita",
      answer: option.id,
      answerLabel: option.label,
      kind: "choice",
      outcome: option.reaction?.text,
    });
    setChoice(option);
    if (option.reaction) {
      if (option.reaction.expression) setExpression(option.reaction.expression);
      setPhase("reaction");
      return;
    }
    applyEffects(node.effects, `node:${node.id}`);
    advanceTo(option.next);
  }

  function handleChooseIndex(index: number) {
    const option = optionsForNode(currentStoryNode())[index];
    if (option) handleChoose(option);
  }

  function handleFind(hotspot: Hotspot) {
    const node = currentStoryNode();
    if (!node || node.type !== "observation") return;
    if (foundRef.current.includes(hotspot.id)) {
      setActiveHotspot(hotspot.id);
      return;
    }
    const next = [...foundRef.current, hotspot.id];
    setFoundList(next);
    useGameStore.getState().countHotspot();
    applyEffects(hotspot.effects, `hotspot:${node.id}:${hotspot.id}`);
    if (hotspot.kind === "clue") {
      applyEffects({ unlockAchievements: ["ach_careful_observer"] }, `obs-clue:${node.id}:${hotspot.id}`);
    }
    if (next.length === node.hotspots.length) {
      applyEffects({ unlockAchievements: ["ach_detail_hunter"] }, `obs-all:${node.id}`);
    }
    playSfx(hotspot.kind === "clue" ? "select" : "click");
    setActiveHotspot(hotspot.id);
  }

  function handleObservationComplete(node: ObservationNode) {
    const foundCount = foundRef.current.filter((id) => node.hotspots.some((h) => h.id === id)).length;
    useGameStore.getState().recordDecision({
      nodeId: node.id,
      episodeId,
      chapterId,
      question: node.instruction,
      answer: `${foundCount}`,
      answerLabel: `${foundCount} dari ${node.hotspots.length} detail diperiksa`,
      kind: "observation",
    });
    applyEffects(node.effects, `node:${node.id}`);
    advanceTo(node.next ?? null);
  }

  function handleExerciseComplete(node: StoryNode, kind: DecisionRecord["kind"], label: string) {
    useGameStore.getState().recordDecision({
      nodeId: node.id,
      episodeId,
      chapterId,
      question: node.label ?? "Latihan cerita",
      answer: kind,
      answerLabel: label,
      kind,
    });
    applyEffects(node.effects, `node:${node.id}`);
    playSfx("success");
    advanceTo(node.next ?? null);
  }

  function handleQuizResolved(node: StoryNode) {
    if (node.type !== "quiz") return;
    const correct = node.options.find((option) => option.correct);
    useGameStore.getState().recordDecision({
      nodeId: node.id,
      episodeId,
      chapterId,
      question: node.question,
      answer: correct?.id ?? "benar",
      answerLabel: correct?.label ?? "Jawaban tepat",
      kind: "quiz",
      outcome: node.aftermath,
    });
    applyEffects(node.effects, `node:${node.id}`);
    playSfx("success");
    advanceTo(node.next ?? null);
  }

  function handleReflectionSubmit(node: ReflectionNode, text: string, chips: string[]) {
    useGameStore.getState().addReflection({
      nodeId: node.id,
      episodeId,
      chapterId,
      prompt: node.prompt,
      text,
      chips,
    });
    useGameStore.getState().recordDecision({
      nodeId: node.id,
      episodeId,
      chapterId,
      question: node.prompt,
      answer: "refleksi",
      answerLabel: "Catatan refleksi ditulis",
      kind: "reflection",
      outcome: text.slice(0, 160),
    });
    applyEffects(node.effects, `node:${node.id}`);
    playSfx("success");
    advanceTo(node.next ?? null);
  }

  /* ---------- referensi handler untuk papan ketik ---------- */

  const handlersRef = useRef({ advance: handleAdvance, chooseIndex: handleChooseIndex, beginAt, restartEpisode });
  useEffect(() => {
    handlersRef.current = { advance: handleAdvance, chooseIndex: handleChooseIndex, beginAt, restartEpisode };
  });

  /* ---------- mulai episode ---------- */

  const episodePlayStatus = chapter && episode ? episodeStatus(save, chapter, episode) : "locked";
  const blocked = !ready || !chapter || !episode || !save.onboardingComplete || episodePlayStatus === "locked";
  const startNodeId = episode ? (episode.startNodeId ?? episode.nodes[0]?.id ?? null) : null;

  /**
   * Titik lanjut yang menunggu keputusan pemain. Dihitung saat render (bukan
   * disimpan lewat efek) supaya tidak ada state yang di-set di dalam effect.
   */
  const pendingResume = useMemo<string | null>(() => {
    if (!ready || !episode || !session || blocked) return null;
    if (phase !== "loading" || session.wasCompleted) return null;
    const resumeId = useGameStore.getState().episodeResume[episode.id]?.nodeId;
    if (!resumeId || resumeId === startNodeId || !nodeIndex.has(resumeId)) return null;
    return resumeId;
  }, [ready, episode, session, blocked, phase, startNodeId, nodeIndex]);

  useEffect(() => {
    if (blocked || startedRef.current || !chapter || !episode) return;
    startedRef.current = true;
    if (!startNodeId) return;
    // Kalau ada titik terakhir yang bisa dilanjutkan, tunggu keputusan pemain
    // lewat modal "Lanjutkan dari titik terakhir?".
    if (pendingResume) return;
    // Boot mesin cerita dijalankan di microtask, bukan langsung di badan efek:
    // pembaruan state pertama (adegan, fase, pemain) tidak perlu menghalangi
    // commit React dan tidak memicu render berantai.
    queueMicrotask(() => handlersRef.current.beginAt(startNodeId));
  }, [blocked, chapter, episode, nodeIndex, startNodeId, session, pendingResume]);

  useEffect(() => () => stopSpeech(), []);

  /* ---------- papan ketik: spasi/enter lanjut, angka memilih ---------- */

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (phase === "lines" && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        handlersRef.current.advance();
        return;
      }
      if (phase === "choose" && /^[1-9]$/.test(event.key)) {
        handlersRef.current.chooseIndex(Number(event.key) - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  /* ---------- ringkasan akhir ---------- */

  const visitedCount = episode ? (save.visited[episode.id]?.length ?? 0) : 0;
  const totalNodes = episode?.nodes.length ?? 0;

  const summary: EpisodeSummary = {
    knowledgeXp: session ? Math.max(0, save.xp.knowledge - session.knowledge) : 0,
    practiceXp: session ? Math.max(0, save.xp.practice - session.practice) : 0,
    decisions: session ? Math.max(0, save.decisions.length - session.decisions) : 0,
    collectionFound: session
      ? Math.max(0, Object.values(save.collection).filter((item) => item.found).length - session.collection)
      : 0,
    visited: visitedCount,
    total: totalNodes,
  };

  const episodeIndex = chapter ? chapter.episodes.findIndex((item) => item.id === episodeId) : -1;
  const nextEpisode = chapter && episodeIndex >= 0 ? chapter.episodes[episodeIndex + 1] : undefined;
  const nextResult: Parameters<typeof EpisodeResult>[0]["next"] =
    chapter && nextEpisode
      ? episodeStatus(save, chapter, nextEpisode) === "locked"
        ? { episode: nextEpisode, lockedReason: episodeLockedReason(save, chapter, nextEpisode) ?? "" }
        : { episode: nextEpisode, href: `/play/${chapter.id}/${nextEpisode.id}` }
      : null;

  /* ---------- tampilan ---------- */

  if (!ready) return <Skeleton />;

  if (!chapter || !episode) {
    return (
      <EmptyState
        title="Episode tidak ditemukan"
        body="Alamat cerita ini tidak cocok dengan episode mana pun di prototipe. Kembali ke peta perjalanan untuk memilih episode yang tersedia."
        motif="spiral"
        action={
          <ButtonLink href="/journey" variant="primary" motif="spiral">
            Buka peta perjalanan
          </ButtonLink>
        }
      />
    );
  }

  if (!save.onboardingComplete) {
    return (
      <EmptyState
        title="Kenalan dulu dengan Tara"
        body="Sebelum cerita dimulai, buat nama penjelajah dan pilih lambang untuk Tara di halaman pembuka."
        motif="leaf"
        action={
          <ButtonLink href="/" variant="primary" motif="leaf">
            Buka halaman pembuka
          </ButtonLink>
        }
      />
    );
  }

  if (!startNodeId) {
    return (
      <EmptyState
        title="Episode ini belum memiliki adegan awal"
        body="Data episode ini belum lengkap di prototype. Kembali ke peta perjalanan dan pilih episode lain yang tersedia."
        motif="spiral"
        action={
          <ButtonLink href={`/journey/${chapter.id}`} variant="primary" motif="spiral">
            Kembali ke daftar episode
          </ButtonLink>
        }
      />
    );
  }

  if (episodePlayStatus === "locked") {
    return (
      <EmptyState
        title="Episode ini masih terkunci"
        body={episodeLockedReason(save, chapter, episode) ?? "Selesaikan episode sebelumnya untuk membuka episode ini."}
        motif="lamp"
        action={
          <ButtonLink href={`/journey/${chapter.id}`} variant="primary" motif="kawung">
            Kembali ke daftar episode
          </ButtonLink>
        }
      />
    );
  }

  // Alias non-optional: dipakai di dalam fungsi render & JSX di bawah,
  // supaya penyempitan tipe dari penjagaan di atas tetap berlaku.
  const activeChapter: Chapter = chapter;
  const activeEpisode: Episode = episode;

  const scene = currentNode?.scene ?? activeEpisode.scene;
  const cast = currentNode?.cast ?? [];
  const showTara = currentNode?.showTara ?? true;
  const previouslyChosen = save.decisions.filter((row) => row.nodeId === currentNode?.id).map((row) => row.answer);

  const chapterCollections = activeChapter.collections.filter((id) => save.collection[id]?.found).length;
  const chapterQuests = activeChapter.quests.filter((id) => Boolean(save.quests[id])).length;
  const achievementsUnlocked = ACHIEVEMENTS.filter((item) => save.achievements[item.id]?.unlocked).length;
  const chapterReflections = save.journal.reflections.filter((row) => row.chapterId === activeChapter.id).length;

  function renderPanel() {
    if (phase === "lines" && currentNode?.lines?.length) {
      const lines = currentNode.lines;
      const line = lines[Math.min(lineIndex, lines.length - 1)];
      return (
        <DialogueBox
          line={line}
          playerName={save.player.name}
          index={Math.min(lineIndex, lines.length - 1)}
          total={lines.length}
          onAdvance={handleAdvance}
        />
      );
    }

    if (phase === "choose" && currentNode?.type === "choice") {
      return (
        <ChoiceList
          prompt={currentNode.prompt ?? "Apa yang Tara lakukan?"}
          footnote={currentNode.footnote}
          options={optionsForNode(currentNode)}
          onChoose={handleChoose}
          previouslyChosen={previouslyChosen}
        />
      );
    }

    if (phase === "reaction" && choice && currentNode) {
      return (
        <ConsequenceCard
          option={choice}
          playerName={save.player.name}
          onContinue={() => {
            applyEffects(currentNode.effects, `node:${currentNode.id}`);
            advanceTo(choice.next);
          }}
        />
      );
    }

    if (phase === "reward" && currentNode?.type === "reward") {
      const node = currentNode as RewardNode;
      return (
        <RewardReveal
          node={node}
          chips={rewardState?.chips ?? []}
          alreadyOwned={rewardState?.alreadyOwned}
          onContinue={() => advanceTo(node.next ?? null)}
          playerName={save.player.name}
        />
      );
    }

    if (phase === "interact" && currentNode) {
      switch (currentNode.type) {
        case "quiz":
          return (
            <QuizCard
              question={currentNode.question}
              context={currentNode.context}
              options={currentNode.options}
              aftermath={currentNode.aftermath}
              restartKey={currentNode.id}
              onAttempt={(correct) => useGameStore.getState().countQuizAttempt(correct)}
              onResolved={() => handleQuizResolved(currentNode)}
            />
          );
        case "matching":
          return (
            <MatchingGame
              instruction={currentNode.instruction}
              pairs={currentNode.pairs}
              caveat={currentNode.caveat}
              seed={`${activeChapter.id}:${currentNode.id}`}
              restartKey={currentNode.id}
              onComplete={() =>
                handleExerciseComplete(currentNode, "matching", `${currentNode.pairs.length} pasangan dicocokkan`)
              }
            />
          );
        case "ordering":
          return (
            <OrderingGame
              instruction={currentNode.instruction}
              items={currentNode.items}
              correctOrder={currentNode.correctOrder}
              caveat={currentNode.caveat}
              seed={`${activeChapter.id}:${currentNode.id}`}
              restartKey={currentNode.id}
              onComplete={() =>
                handleExerciseComplete(currentNode, "ordering", `${currentNode.items.length} langkah disusun`)
              }
            />
          );
        case "listening":
          return (
            <ListeningPlayer
              instruction={currentNode.instruction}
              entries={currentNode.entries}
              restartKey={currentNode.id}
              completeLabel="Lanjutkan cerita"
              onComplete={() =>
                handleExerciseComplete(currentNode, "listening", `${currentNode.entries.length} suara didengar`)
              }
            />
          );
        case "reflection":
          return (
            <ReflectionForm
              key={currentNode.id}
              node={currentNode}
              playerName={save.player.name}
              onSubmit={(text, chips) => handleReflectionSubmit(currentNode, text, chips)}
            />
          );
        default:
          return <p className="text-sm text-[var(--ink-subtle)]">Menyiapkan bagian ini…</p>;
      }
    }

    return <p className="text-sm text-[var(--ink-subtle)]">Menyiapkan adegan…</p>;
  }

  function renderBody() {
    if (phase === "episodeEnd") {
      return (
        <EpisodeResult
          chapter={activeChapter}
          episode={activeEpisode}
          summary={summary}
          replayed={session?.wasCompleted ?? false}
          next={nextResult}
          onReplay={restartEpisode}
        />
      );
    }

    if (phase === "chapterEnd") {
      return (
        <ChapterEndScreen
          chapter={activeChapter}
          foundCollections={chapterCollections}
          questsUnlocked={chapterQuests}
          achievements={achievementsUnlocked}
          reflections={chapterReflections}
          onReplay={restartEpisode}
        />
      );
    }

    if (phase === "loading") {
      return <Skeleton />;
    }

    if (phase === "fatal" || !currentNode) {
      return (
        <EmptyState
          title="Cerita terhenti di tengah jalan"
          body={
            fatalMessage ??
            "Ada bagian data cerita yang tidak dapat dibuka. Ini kemungkinan kesalahan prototype, bukan kesalahanmu."
          }
          motif="eye"
          action={
            <ButtonLink href={`/journey/${activeChapter.id}`} variant="primary" motif="spiral">
              Kembali ke daftar episode
            </ButtonLink>
          }
        />
      );
    }

    if (phase === "interact" && currentNode.type === "observation") {
      return (
        <ObservationStage
          node={currentNode}
          found={found}
          activeId={activeHotspot}
          onFind={handleFind}
          onReopen={(hotspot) => setActiveHotspot(hotspot.id)}
          onComplete={() => handleObservationComplete(currentNode)}
          playerName={save.player.name}
        />
      );
    }

    return (
      <div className="space-y-4">
        <StageView
          scene={scene}
          expression={expression}
          speaker={speaker}
          cast={cast}
          showTara={showTara}
          caption={currentNode.label}
        />
        <motion.div
          key={`${currentNode.id}:${phase}`}
          className="panel p-4 sm:p-6"
          initial={motionOn ? { opacity: 0, y: 10 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionOn ? 0.28 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderPanel()}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <StoryHud
            chapter={activeChapter}
            episode={activeEpisode}
            visited={visitedCount}
            total={totalNodes}
            currentLabel={currentNode?.label}
            playerName={save.player.name}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl">{renderBody()}</div>

      <Modal
        open={Boolean(pendingResume)}
        onClose={() => {
          if (pendingResume) beginAt(pendingResume);
          else restartEpisode();
        }}
        title="Lanjutkan dari titik terakhir?"
        description="Kamu pernah berhenti di tengah episode ini. Cerita bisa dilanjutkan dari sana."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={restartEpisode}>
              Mulai dari awal
            </Button>
            <Button
              variant="primary"
              size="lg"
              motif="spiral"
              onClick={() => {
                if (pendingResume) beginAt(pendingResume);
                else restartEpisode();
              }}
            >
              Lanjutkan
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-[var(--ink-muted)]">
          <p className="flex items-start gap-2">
            <Motif motif="book" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
            Titik terakhir:{" "}
            <strong className="text-[var(--ink)]">
              {pendingResume ? (nodeIndex.get(pendingResume)?.label ?? pendingResume) : "-"}
            </strong>
          </p>
          <p className="text-xs text-[var(--ink-subtle)]">
            Memilih salah satu di sini tidak menghapus apa pun. Koleksi, misi, dan catatanmu tetap tersimpan.
          </p>
        </div>
      </Modal>
    </>
  );
}
