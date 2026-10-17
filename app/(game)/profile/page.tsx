"use client";

import { useState } from "react";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { PLAYER_AVATARS, PlayerAvatar } from "@/components/brand/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, ProgressBar, StatTile } from "@/components/ui/Bits";
import { TextField } from "@/components/ui/Controls";
import { ACHIEVEMENTS } from "@/data";
import { counts, levelFromSave } from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { useSaveReady } from "@/lib/hooks";
import { playSfx } from "@/lib/audio";
import { cn, formatDateTime, formatDuration, percent } from "@/lib/utils";

const NAME_MAX = 24;

/* ------------------------------------------------------------------
 * Formulir identitas
 *
 * Komponen ini baru dipasang setelah save selesai dimuat dari perangkat,
 * sehingga nilai awalnya selalu sesuai dengan apa yang tersimpan.
 * ------------------------------------------------------------------ */

function ProfileForm({ initialName, initialAvatar }: { initialName: string; initialAvatar: string }) {
  const player = useGameStore((s) => s.player);
  const updatePlayer = useGameStore((s) => s.updatePlayer);
  const pushNotification = useGameStore((s) => s.pushNotification);

  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [nameTouched, setNameTouched] = useState(false);

  const trimmed = name.trim();
  const tooLong = trimmed.length > NAME_MAX;
  const normalized = trimmed === "" ? "Sahabat Tara" : trimmed;
  const dirty = normalized !== player.name || avatar !== player.avatar;

  const saveProfile = () => {
    setNameTouched(true);
    if (tooLong) return;
    updatePlayer({ name: normalized, avatar });
    pushNotification({
      kind: "info",
      title: "Profil tersimpan",
      body: `Tara akan memanggilmu ${normalized}.`,
    });
    playSfx("success");
  };

  return (
    <section aria-label="Identitas penjelajah" className="panel p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <PlayerAvatar id={avatar} className="h-14 w-14" />
        <div className="min-w-0">
          <p className="font-display text-lg text-[var(--ink)]">{normalized}</p>
          <p className="text-xs text-[var(--ink-subtle)]">
            Perjalanan dimulai {formatDateTime(player.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <TextField
          label="Nama panggilanmu"
          placeholder="cth. Adi, Sari, atau nama bebas"
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
          hint={`Kosongkan pun boleh — Tara akan memanggilmu “Sahabat Tara”. Maksimal ${NAME_MAX} huruf.`}
          error={nameTouched && tooLong ? `Maksimal ${NAME_MAX} huruf, ya.` : undefined}
          autoComplete="off"
        />
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-[var(--ink)]">Lambang penjelajah</legend>
        <div role="radiogroup" aria-label="Pilih lambang" className="flex flex-wrap gap-2">
          {PLAYER_AVATARS.map((option) => {
            const active = option.id === avatar;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Lambang ${option.label}`}
                title={option.label}
                onClick={() => {
                  playSfx("select");
                  setAvatar(option.id);
                }}
                className={cn(
                  "focus-ring flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs transition-all",
                  active
                    ? "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] text-[var(--gold-soft)]"
                    : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]",
                )}
              >
                <PlayerAvatar id={option.id} className="h-8 w-8" />
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="primary" motif="star" disabled={tooLong} onClick={saveProfile}>
          Simpan profil
        </Button>
        {dirty ? (
          <span className="text-xs text-[var(--gold-soft)]">Ada perubahan yang belum disimpan.</span>
        ) : (
          <span className="text-xs text-[var(--ink-subtle)]">Perubahan tersimpan di perangkat ini.</span>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Halaman
 * ------------------------------------------------------------------ */

export default function ProfilePage() {
  const save = useGameStore((s) => s);
  const ready = useSaveReady();

  const level = levelFromSave(save);
  const stats = counts(save);
  const unlockedCount = ACHIEVEMENTS.filter((achievement) => save.achievements[achievement.id]?.unlocked).length;

  return (
    <div className="space-y-6">
      {/* ---------- Kepala ---------- */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Profil</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Profil penjelajah</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Nama dan lambang ini yang dipakai Tara untuk menyapamu di dalam cerita. Semuanya tersimpan di perangkat
            ini — tidak ada akun dan tidak ada yang dikirim ke server.
          </p>
        </div>
        <Chip tone="gold" motif="star">
          Level {level.level} · {level.title}
        </Chip>
      </header>

      {/* ---------- Identitas + level ---------- */}
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {ready ? (
          <ProfileForm initialName={save.player.name} initialAvatar={save.player.avatar} />
        ) : (
          <section aria-label="Identitas penjelajah" aria-busy="true" className="panel p-4 sm:p-5">
            <p role="status" className="text-sm text-[var(--ink-subtle)]">
              Memuat profil…
            </p>
          </section>
        )}

        <div className="space-y-4">
          <section aria-label="Level perjalanan" className="panel p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <div className="eyebrow">Level perjalanan</div>
              <span className="text-xs tabular-nums text-[var(--ink-subtle)]">
                {save.completedEpisodes.length}/{stats.episodesTotal} episode
              </span>
            </div>
            <p className="font-display mt-1.5 text-lg text-[var(--ink)]">
              Level {level.level} · {level.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">{level.blurb}</p>
            <ProgressBar
              value={level.episodesIntoLevel}
              max={level.episodesForLevel}
              label={
                level.nextTitle
                  ? `Menuju: ${level.nextTitle} (${percent(level.episodesIntoLevel, level.episodesForLevel)}%)`
                  : "Tingkat tertinggi di prototipe"
              }
              tone="gold"
              className="mt-3"
            />
          </section>

          <section aria-label="Arti XP" className="panel-soft p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Motif motif="book" className="h-4 w-4 text-[var(--gold)]" />
              <h2 className="eyebrow">Cara membaca XP-mu</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
              <strong className="text-[var(--knowledge)]">XP pengetahuan</strong> bertambah dari cerita dan tantangan di
              dalam aplikasi. <strong className="text-[var(--practice)]">XP praktik</strong> bertambah dari misi latihan
              yang kamu <em>laporkan sendiri</em> sudah dijalankan — aplikasi tidak bisa memverifikasi aktivitas di
              luar. Keduanya sengaja tidak dicampur, dan tidak ada streak atau hukuman karena jeda.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip tone="knowledge" motif="book">
                {save.xp.knowledge} XP pengetahuan
              </Chip>
              <Chip tone="practice" motif="thread">
                {save.xp.practice} XP praktik
              </Chip>
            </div>
          </section>
        </div>
      </div>

      {/* ---------- Total catatan ---------- */}
      <section aria-label="Total catatan perjalanan" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Episode"
          value={`${stats.episodesCompleted}/${stats.episodesTotal}`}
          motif="spiral"
          tone="default"
          sub="selesai dimainkan"
        />
        <StatTile
          label="Misi"
          value={`${stats.questsCompleted}/${stats.questsTotal}`}
          motif="star"
          tone="gold"
          sub="ditandai selesai"
        />
        <StatTile
          label="Koleksi"
          value={`${stats.collectionFound}/${stats.collectionTotal}`}
          motif="kawung"
          tone="gold"
          sub="catatan ditemukan"
        />
        <StatTile
          label="Praktik"
          value={`${stats.practiceCompleted}/${stats.practiceTotal}`}
          motif="thread"
          tone="practice"
          sub="latihan nyata dilaporkan"
        />
      </section>

      {/* ---------- Pencapaian ---------- */}
      <section aria-label="Pencapaian" className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <Motif motif="gong" className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span className="eyebrow">Pencapaian</span>
          </div>
          <h2 className="font-display mt-1 text-xl text-[var(--ink)]">Jejak yang tercatat</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Pencapaian di sini mencatat apa yang terjadi di dalam aplikasi, bukan penilaian atas kemampuanmu di dunia
            nyata. Pencapaian tersembunyi baru tampak setelah terbuka.
          </p>
        </div>

        <ProgressBar
          value={unlockedCount}
          max={ACHIEVEMENTS.length}
          label={`Pencapaian terbuka: ${unlockedCount}/${ACHIEVEMENTS.length}`}
          tone="gold"
          showValue
        />

        <ul className="grid gap-3.5 sm:grid-cols-2">
          {ACHIEVEMENTS.map((achievement) => {
            const progress = save.achievements[achievement.id];
            const unlocked = Boolean(progress?.unlocked);

            if (!unlocked && achievement.hidden) {
              return (
                <li key={achievement.id} className="h-full">
                  <div className="panel-soft flex h-full items-center gap-3 border-dashed p-4 sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-subtle)]">
                      <Motif motif="eye" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)]">Pencapaian tersembunyi</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[var(--ink-subtle)]">
                        Terbuka dari hal yang belum kamu temukan di dalam perjalanan.
                      </p>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={achievement.id} className="h-full">
                <article
                  className={cn("panel relative h-full overflow-hidden p-4 sm:p-5", !unlocked && "border-dashed")}
                >
                  <Motif
                    motif={achievement.motif as MotifKey}
                    className={cn(
                      "pointer-events-none absolute -right-4 -top-4 h-20 w-20 opacity-[0.08]",
                      unlocked ? "text-[var(--gold)]" : "text-[var(--ink-subtle)]",
                    )}
                  />
                  <div className="relative flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
                        unlocked
                          ? "border-[color-mix(in_oklab,var(--gold)_45%,transparent)] text-[var(--gold)]"
                          : "border-[var(--line)] text-[var(--ink-subtle)]",
                      )}
                    >
                      <Motif motif={achievement.motif as MotifKey} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={cn(
                            "font-display text-base",
                            unlocked ? "text-[var(--ink)]" : "text-[var(--ink-muted)]",
                          )}
                        >
                          {achievement.title}
                        </h3>
                        {unlocked ? (
                          <Chip tone="success" motif="gong">
                            Terbuka
                          </Chip>
                        ) : (
                          <Chip tone="muted">Belum terbuka</Chip>
                        )}
                      </div>
                      <p
                        className={cn(
                          "mt-1 text-sm leading-relaxed",
                          unlocked ? "text-[var(--ink-muted)]" : "text-[var(--ink-subtle)]",
                        )}
                      >
                        {achievement.description}
                      </p>
                      {unlocked ? (
                        <div className="mt-2.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
                          <p className="eyebrow">Apa yang sebenarnya dicatat</p>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">
                            {achievement.criterion}
                          </p>
                        </div>
                      ) : null}
                      {unlocked && progress?.unlockedAt ? (
                        <p className="mt-2 text-xs text-[var(--ink-subtle)]">
                          Terbuka {formatDateTime(progress.unlockedAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
          Setiap pencapaian yang terbuka menampilkan dasar pencatatannya apa adanya, supaya jelas mana yang terekam
          aplikasi dan mana yang bukan. Tidak ada pencapaian yang bisa dibeli atau dipercepat.
        </p>
      </section>

      {/* ---------- Catatan permainan ---------- */}
      <section aria-label="Catatan permainan" className="panel-soft p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Motif motif="lamp" className="h-4 w-4 text-[var(--gold)]" />
          <h2 className="eyebrow">Catatan permainan</h2>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Waktu bermain" value={formatDuration(save.stats.playSeconds)} motif="lamp" tone="default" />
          <StatTile label="Pilihan diambil" value={save.stats.choiceCount} motif="spiral" tone="default" />
          <StatTile
            label="Tantangan"
            value={`${save.stats.quizCorrect}/${save.stats.quizAttempts}`}
            motif="book"
            tone="knowledge"
            sub="jawaban benar dari percobaan"
          />
          <StatTile
            label="Temuan"
            value={save.stats.hotspotsFound}
            motif="eye"
            tone="gold"
            sub="dari adegan pengamatan"
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
          Angka-angka ini hanya mencatat apa yang terjadi di dalam aplikasi: waktu dihitung selama cerita berjalan,
          tantangan menghitung percobaan menjawab (bukan penilaian pengetahuan), dan temuan berasal dari adegan
          pengamatan. Tidak ada target, tidak ada perbandingan dengan pemain lain, dan tidak ada yang dikirim ke luar
          perangkat ini.
        </p>
      </section>

      {/* ---------- Tautan ---------- */}
      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/journal" variant="secondary" motif="book">
          Buka jurnal
        </ButtonLink>
        <ButtonLink href="/settings" variant="secondary" motif="gong">
          Buka pengaturan
        </ButtonLink>
        <ButtonLink href="/collection" variant="ghost" motif="kawung">
          Lihat koleksi
        </ButtonLink>
      </div>
    </div>
  );
}
