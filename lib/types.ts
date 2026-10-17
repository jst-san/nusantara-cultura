/**
 * TARA: Nusantara Story Quest
 * ------------------------------------------------------------------
 * Model data tunggal untuk seluruh prototype.
 *
 * Prinsip arsitektur:
 * - Semua konten cerita (chapter, episode, node) adalah DATA, bukan JSX.
 * - Komponen UI hanya merender data ini. Menambah cerita = menambah data.
 * - Kondisi & efek ditulis sebagai struktur data (bukan fungsi) supaya
 *   mudah dipindahkan ke backend/database di masa depan.
 */

/* ============================================================
 * 1. Dasar
 * ============================================================ */

export type FlagValue = boolean | number | string;

/** Latar adegan yang tersedia (dipetakan ke ilustrasi SVG di components/brand/Backdrop). */
export type SceneKey =
  | "hills_dawn"
  | "village_gate"
  | "village_square"
  | "pendopo_dusk"
  | "pendopo_night"
  | "screen_glow"
  | "workbench"
  | "banyan_dusk"
  | "fields_morning"
  | "sky_night";

export type TaraExpression =
  | "curious"
  | "confused"
  | "happy"
  | "sad"
  | "surprised"
  | "thinking"
  | "proud"
  | "reflective"
  | "determined"
  | "warm";

export type SpeakerId =
  | "tara"
  | "ndari"
  | "wagiman"
  | "rukmini"
  | "kakek"
  | "narrator"
  | "player";

export interface Character {
  id: SpeakerId;
  name: string;
  role: string;
  blurb: string;
  /** warna aksen untuk label nama pembicara */
  color: string;
  /** kunci avatar SVG */
  avatar: "tara" | "ndari" | "wagiman" | "rukmini" | "kakek" | "none";
  /** true bila tokoh sepenuhnya fiktif (diberi label di UI) */
  fictional: boolean;
}

/* ============================================================
 * 2. Kondisi & Efek (dipakai node cerita maupun quest)
 * ============================================================ */

export type Condition =
  | { kind: "always" }
  | { kind: "flag"; flag: string; value?: FlagValue }
  | { kind: "notFlag"; flag: string; value?: FlagValue }
  | { kind: "all"; of: Condition[] }
  | { kind: "any"; of: Condition[] }
  | { kind: "none"; of: Condition[] }
  | { kind: "episodeDone"; episodeId: string }
  | { kind: "chapterDone"; chapterId: string }
  | { kind: "questDone"; questId: string }
  | { kind: "collectionFound"; itemId: string }
  | { kind: "achievement"; achievementId: string }
  | { kind: "knowledgeXpAtLeast"; amount: number };

export interface Effects {
  flags?: Record<string, FlagValue>;
  knowledgeXp?: number;
  practiceXp?: number;
  unlockQuests?: string[];
  unlockCollection?: string[];
  unlockAchievements?: string[];
  /** id entri jurnal Tara yang ditambahkan */
  journal?: string[];
}

/* ============================================================
 * 3. Cerita
 * ============================================================ */

export interface Line {
  speaker: SpeakerId;
  text: string;
  /** ekspresi Tara setelah baris ini tampil */
  expression?: TaraExpression;
  /** arahan panggung kecil, ditampilkan miring di bawah dialog */
  cue?: string;
}

export interface ChoiceReaction {
  expression?: TaraExpression;
  text: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  hint?: string;
  /** jenis tindakan — dipakai untuk ikon & penanda konsekuensi */
  tone?: "ask" | "observe" | "help" | "reflect" | "neutral";
  tag?: string;
  effects?: Effects;
  /** kartu konsekuensi setelah pemain memilih */
  reaction?: ChoiceReaction;
  next: string;
  condition?: Condition;
  /** sekali dipilih, opsi ditandai di UI pada pemutaran ulang */
  once?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
  /** umpan balik untuk jawaban ini (tidak menghakimi) */
  feedback: string;
}

export interface Hotspot {
  id: string;
  label: string;
  /** posisi dalam persen relatif terhadap panggung */
  x: number;
  y: number;
  text: string;
  kind: "info" | "clue";
  effects?: Effects;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  text: string;
  note?: string;
}

export interface ListeningEntry {
  id: string;
  label: string;
  phonetics: string;
  meaning: string;
  note?: string;
  /** bunyi tersintesis (bukan rekaman) untuk instrumen; 'speech' memakai suara perangkat */
  sound?: "speech" | "gong" | "saron" | "kenong" | "bonang" | "kepyak" | "none";
}

interface NodeBase {
  id: string;
  episodeId: string;
  scene?: SceneKey;
  /** pembicara pendukung yang tampil di panggung */
  cast?: SpeakerId[];
  showTara?: boolean;
  /** skrip pembuka sebelum interaksi node */
  lines?: Line[];
  /**
   * Bila kondisi tidak terpenuhi, node dilewati otomatis (dipakai untuk
   * variasi dialog berdasarkan flag cerita).
   */
  condition?: Condition;
  effects?: Effects;
  /** node berikutnya setelah node ini selesai; null = episode selesai */
  next?: string | null;
  label?: string;
}

export interface ScriptNode extends NodeBase {
  type: "script";
}

export interface ChoiceNode extends NodeBase {
  type: "choice";
  prompt?: string;
  footnote?: string;
  options: ChoiceOption[];
}

export interface QuizNode extends NodeBase {
  type: "quiz";
  question: string;
  context?: string;
  options: QuizOption[];
  /** ringkasan singkat setelah pemain menjawab */
  aftermath?: string;
}

export interface MatchingNode extends NodeBase {
  type: "matching";
  instruction: string;
  pairs: MatchPair[];
  /** catatan kehati-hatian yang tampil di bawah (mis. variasi antar daerah) */
  caveat?: string;
}

export interface OrderingNode extends NodeBase {
  type: "ordering";
  instruction: string;
  items: OrderItem[];
  correctOrder: string[];
  caveat?: string;
}

export interface ObservationNode extends NodeBase {
  type: "observation";
  instruction: string;
  backdrop: SceneKey;
  hotspots: Hotspot[];
  /** jumlah temuan minimum untuk lanjut */
  requiredCount: number;
}

export interface ReflectionNode extends NodeBase {
  type: "reflection";
  prompt: string;
  helper?: string;
  /** chip bantuan untuk memulai tulisan */
  chips?: string[];
  minLength?: number;
}

export interface ListeningNode extends NodeBase {
  type: "listening";
  instruction: string;
  entries: ListeningEntry[];
}

export interface RewardNode extends NodeBase {
  type: "reward";
  title: string;
  subtitle?: string;
}

export interface ChapterEndNode extends NodeBase {
  type: "chapterEnd";
  chapterId: string;
}

export type StoryNode =
  | ScriptNode
  | ChoiceNode
  | QuizNode
  | MatchingNode
  | OrderingNode
  | ObservationNode
  | ReflectionNode
  | ListeningNode
  | RewardNode
  | ChapterEndNode;

export interface Episode {
  id: string;
  chapterId: string;
  index: number;
  title: string;
  summary: string;
  scene: SceneKey;
  /** estimasi durasi bermain, untuk transparansi */
  duration: string;
  nodes: StoryNode[];
  startNodeId?: string;
}

export interface ContentNote {
  /** cerita fiktif / informasi terdokumentasi / campuran */
  kind: "fiction" | "documented" | "mixed";
  text: string;
}

export interface Chapter {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  region: string;
  theme: string;
  premise: string;
  teaser: string;
  scene: SceneKey;
  motif: string;
  cast: SpeakerId[];
  themes: string[];
  collections: string[];
  quests: string[];
  contentNote: ContentNote;
  unlock: { requires?: Condition; reason: string; hint: string };
  episodes: Episode[];
  /** garis besar episode untuk bab yang belum dapat dimainkan */
  plannedEpisodes?: { title: string; summary: string }[];
}

/* ============================================================
 * 4. Quest
 * ============================================================ */

export type QuestCategory = "side" | "hidden" | "practice";
export type QuestStatus = "locked" | "available" | "active" | "completed";

export interface QuestStep {
  id: string;
  title: string;
  body: string;
  kind: "learn" | "do" | "reflect" | "note";
}

export interface QuestAlternative {
  label: string;
  body: string;
}

export type QuestExercise =
  | { kind: "quiz"; intro?: string; question: string; options: QuizOption[] }
  | { kind: "matching"; instruction: string; pairs: MatchPair[]; caveat?: string }
  | { kind: "ordering"; instruction: string; items: OrderItem[]; correctOrder: string[]; caveat?: string }
  | { kind: "pronunciation"; instruction: string; entries: ListeningEntry[] }
  | { kind: "checklist"; instruction: string; items: { id: string; text: string }[] };

export interface Quest {
  id: string;
  category: QuestCategory;
  title: string;
  tagline: string;
  motif: string;
  goal: string;
  storyLink: string;
  duration: string;
  activityType: string;
  /** jenis penyelesaian: latihan di aplikasi, refleksi tertulis, atau laporan aktivitas nyata */
  completion: "exercise" | "reflection" | "report";
  unlock: { requires?: Condition; reason: string; hint: string };
  reward: {
    knowledgeXp?: number;
    practiceXp?: number;
    collection?: string[];
    achievements?: string[];
    journal?: string[];
  };
  steps: QuestStep[];
  exercise?: QuestExercise;
  reflectionPrompt?: string;
  reflectionHelper?: string;
  /** pemain harus menulis refleksi sebelum menandai selesai */
  requiresReflection?: boolean;
  /** pemain harus menyatakan sudah mencoba (dengan alternatif yang setara) */
  requiresDeclaration?: boolean;
  declarationLabel?: string;
  alternatives: QuestAlternative[];
  /** catatan jujur: mis. "aktivitas dilaporkan sendiri, tidak diverifikasi" */
  honestyNote: string;
  /** quest ini punya versi "laporan" dari aktivitas nyata */
  selfReported?: boolean;
}

/* ============================================================
 * 5. Koleksi, jurnal, pencapaian
 * ============================================================ */

export type CollectionCategory =
  | "vocabulary"
  | "folklore"
  | "games"
  | "crafts"
  | "performing"
  | "notes"
  | "memories";

/** Status keandalan informasi — ditampilkan apa adanya ke pemain. */
export type Reliability = "documented" | "needs-verification" | "fiction" | "device-borrowed";

export interface CollectionItem {
  id: string;
  category: CollectionCategory;
  title: string;
  subtitle: string;
  summary: string;
  context: string;
  region?: string;
  reliability: Reliability;
  sourceNote: string;
  /** saran cara memverifikasi ke sumber tepercaya */
  verifyHint?: string;
  foundIn?: { chapterId: string; episodeId?: string };
  motif: string;
  related?: string[];
  /** item yang isinya diperjelas setelah flag tertentu tercapai */
  clarify?: { flag: string; text: string };
  tags?: string[];
}

export interface JournalEntry {
  id: string;
  chapterId: string;
  episodeId?: string;
  title: string;
  text: string;
  requires?: Condition;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** apa yang dicatat oleh pencapaian ini (jujur soal cakupannya) */
  criterion: string;
  motif: string;
  hidden?: boolean;
  note?: string;
}

/* ============================================================
 * 6. Progres pemain
 * ============================================================ */

export interface Reflection {
  id: string;
  nodeId: string;
  episodeId: string;
  chapterId: string;
  prompt: string;
  text: string;
  chips: string[];
  createdAt: number;
}

export interface DecisionRecord {
  id: string;
  nodeId: string;
  episodeId: string;
  chapterId: string;
  question: string;
  answer: string;
  answerLabel: string;
  kind: "choice" | "quiz" | "matching" | "ordering" | "listening" | "observation" | "reflection" | "quest";
  outcome?: string;
  createdAt: number;
}

export interface QuestProgress {
  status: QuestStatus;
  revealedBy?: string;
  startedAt?: number;
  completedAt?: number;
  /** jawaban refleksi/aktivitas quest */
  reflection?: string;
  exerciseDone?: boolean;
  declared?: boolean;
  method?: string;
  note?: string;
}

export interface CollectionProgress {
  found: boolean;
  foundAt?: number;
  fromEpisode?: string;
}

export type AnimationPref = "full" | "reduced" | "system";
export type TextSizePref = "normal" | "large";
export type DisplayTheme = "night" | "dawn";

export interface Settings {
  sfx: boolean;
  ambience: boolean;
  volume: number;
  animations: AnimationPref;
  textSize: TextSizePref;
  theme: DisplayTheme;
  tutorialHints: boolean;
}

export interface PlayerState {
  name: string;
  avatar: string;
  createdAt: number;
}

export interface SaveState {
  version: number;
  player: PlayerState;
  onboardingComplete: boolean;
  flags: Record<string, FlagValue>;
  xp: { knowledge: number; practice: number };
  completedEpisodes: string[];
  /** titik lanjut bermain per episode */
  episodeResume: Record<string, { nodeId: string; updatedAt: number }>;
  /** node yang pernah dikunjungi per episode (untuk indikator progres) */
  visited: Record<string, string[]>;
  lastPlayed?: { chapterId: string; episodeId: string; nodeId: string; updatedAt: number };
  /** hadiah yang sudah pernah diberikan (mencegah pemain menanam XP berulang) */
  awarded: Record<string, boolean>;
  quests: Record<string, QuestProgress>;
  collection: Record<string, CollectionProgress>;
  achievements: Record<string, { unlocked: boolean; unlockedAt?: number }>;
  journal: { entries: string[]; reflections: Reflection[] };
  decisions: DecisionRecord[];
  settings: Settings;
  stats: {
    choiceCount: number;
    quizAttempts: number;
    quizCorrect: number;
    hotspotsFound: number;
    episodesStarted: number;
    playSeconds: number;
  };
}

/** Notifikasi non-persisten (toast & kartu pembukaan). */
export interface AppNotification {
  id: string;
  kind: "quest" | "collection" | "achievement" | "xp" | "journal" | "info" | "level";
  title: string;
  body?: string;
  meta?: string;
  createdAt: number;
}

/* ============================================================
 * 7. Tampilan turunan
 * ============================================================ */

export interface EpisodeView {
  chapter: Chapter;
  episode: Episode;
  status: "locked" | "available" | "in-progress" | "completed";
  lockedReason?: string;
  progressPercent: number;
}
