"use client";

import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Motif } from "@/components/brand/Motif";
import { Button } from "@/components/ui/Button";
import { Segmented, Slider, Toggle } from "@/components/ui/Controls";
import { Modal } from "@/components/ui/Overlay";
import { useGameStore } from "@/lib/store";
import { playSfx } from "@/lib/audio";
import { cn } from "@/lib/utils";
import type { AnimationPref, DisplayTheme, TextSizePref } from "@/lib/types";

/* ------------------------------------------------------------------
 * Baris pengaturan
 * ------------------------------------------------------------------ */

function SettingRow({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
  return (
    <div className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 max-w-md">
          <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
          {description ? <p className="mt-0.5 text-xs leading-relaxed text-[var(--ink-subtle)]">{description}</p> : null}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Halaman
 * ------------------------------------------------------------------ */

export default function SettingsPage() {
  const router = useRouter();
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);
  const toggleSetting = useGameStore((s) => s.toggleSetting);
  const exportSave = useGameStore((s) => s.exportSave);
  const importSave = useGameStore((s) => s.importSave);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const pushNotification = useGameStore((s) => s.pushNotification);

  const fileRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const handleExport = () => {
    const blob = new Blob([exportSave()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "tara-nusantara-save.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    pushNotification({
      kind: "info",
      title: "Salinan progres diunduh",
      body: "Berkas tara-nusantara-save.json tersimpan di folder unduhanmu.",
    });
  };

  const handleImportFile = async (file: File) => {
    let text: string;
    try {
      text = await file.text();
    } catch {
      setImportResult({ ok: false, message: "Berkas tidak bisa dibaca. Coba pilih berkas salinan lagi." });
      return;
    }
    const result = importSave(text);
    if (result.ok) {
      setImportResult({ ok: true, message: `Progres dari “${file.name}” berhasil dipulihkan.` });
      pushNotification({
        kind: "info",
        title: "Progres dipulihkan",
        body: "Perjalananmu dari berkas salinan sudah dimuat.",
      });
      playSfx("success");
    } else {
      setImportResult({ ok: false, message: result.error ?? "Berkas bukan salinan progres yang sah." });
    }
  };

  const onPickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void handleImportFile(file);
  };

  const confirmReset = (keepPlayer: boolean) => {
    resetProgress(keepPlayer);
    setResetOpen(false);
    playSfx("gentle");
    router.push(keepPlayer ? "/home" : "/");
  };

  return (
    <div className="space-y-6">
      {/* ---------- Kepala ---------- */}
      <header>
        <div className="eyebrow">Pengaturan</div>
        <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Atur kenyamanan bermainmu</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
          Semua pilihan di halaman ini tersimpan di perangkatmu dan langsung berlaku. Tidak ada pengaturan yang
          mengunci fitur — kamu bisa mengubahnya kapan saja.
        </p>
      </header>

      {/* ---------- Tampilan ---------- */}
      <section aria-label="Pengaturan tampilan" className="panel p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Motif motif="lamp" className="h-4 w-4 text-[var(--gold)]" />
          <h2 className="font-display text-lg text-[var(--ink)]">Tampilan</h2>
        </div>
        <div className="mt-1 divide-y divide-[var(--line)]">
          <SettingRow label="Tema" description="Malam hangat atau fajar terang — pilih yang nyaman untuk matamu.">
            <Segmented<DisplayTheme>
              value={settings.theme}
              onChange={(value) => setSettings({ theme: value })}
              label="Tema tampilan"
              options={[
                { value: "night", label: "Malam", description: "Latar gelap hangat" },
                { value: "dawn", label: "Fajar", description: "Latar terang hangat" },
              ]}
            />
          </SettingRow>
          <SettingRow label="Ukuran teks" description="Perbesar teks bila huruf kecil terasa sulit dibaca.">
            <Segmented<TextSizePref>
              value={settings.textSize}
              onChange={(value) => setSettings({ textSize: value })}
              label="Ukuran teks"
              options={[
                { value: "normal", label: "Normal" },
                { value: "large", label: "Besar", description: "Teks dan jarak antarbaris lebih besar" },
              ]}
            />
          </SettingRow>
          <SettingRow
            label="Gerakan & animasi"
            description="Dikurangi menghentikan animasi perpindahan dan getaran halus. “Ikut sistem” memakai pengaturan perangkatmu."
          >
            <Segmented<AnimationPref>
              value={settings.animations}
              onChange={(value) => setSettings({ animations: value })}
              label="Gerakan dan animasi"
              options={[
                { value: "full", label: "Penuh" },
                { value: "reduced", label: "Dikurangi" },
                { value: "system", label: "Ikut sistem" },
              ]}
            />
          </SettingRow>
        </div>
      </section>

      {/* ---------- Suara ---------- */}
      <section aria-label="Pengaturan suara" className="panel p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Motif motif="gong" className="h-4 w-4 text-[var(--gold)]" />
          <h2 className="font-display text-lg text-[var(--ink)]">Suara</h2>
        </div>
        <div className="mt-1 divide-y divide-[var(--line)]">
          <SettingRow
            label="Efek suara"
            description="Bunyi tombol, tantangan, dan hadiah kecil — disintesis aplikasi, bukan rekaman."
          >
            <Toggle
              checked={settings.sfx}
              onChange={(next) => setSettings({ sfx: next, ambience: next ? settings.ambience : false })}
              label="Efek suara"
            />
          </SettingRow>
          <SettingRow label="Suara latar" description="Nada lembut yang diputar pelan selama cerita berjalan.">
            <Toggle checked={settings.ambience} onChange={(next) => setSettings({ ambience: next })} label="Suara latar" />
          </SettingRow>
          <SettingRow label="Volume" description="Berlaku untuk efek suara dan suara latar.">
            <div className="w-44">
              <Slider value={settings.volume} onChange={(value) => setSettings({ volume: value })} label="Volume" />
            </div>
          </SettingRow>
        </div>
        <p className="mt-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
          Semua bunyi dan instrumen di TARA disintesis di perangkat dengan Web Audio API — ini simulasi, bukan rekaman
          gamelan atau penutur asli. Beberapa latihan pelafalan dapat memakai suara perangkat bila tersedia.
        </p>
      </section>

      {/* ---------- Bantuan bermain ---------- */}
      <section aria-label="Pengaturan bantuan" className="panel p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Motif motif="thread" className="h-4 w-4 text-[var(--gold)]" />
          <h2 className="font-display text-lg text-[var(--ink)]">Bantuan bermain</h2>
        </div>
        <div className="mt-1">
          <SettingRow
            label="Petunjuk saat bermain"
            description="Preferensi ini tersimpan di perangkatmu. Di prototipe ini petunjuk masih tampil sama di setiap layar — pilihanmu dicatat untuk pengembangan berikutnya."
          >
            <Toggle
              checked={settings.tutorialHints}
              onChange={() => toggleSetting("tutorialHints")}
              label="Petunjuk saat bermain"
            />
          </SettingRow>
        </div>
      </section>

      {/* ---------- Data tersimpan ---------- */}
      <section aria-label="Data tersimpan" className="panel p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Motif motif="book" className="h-4 w-4 text-[var(--gold)]" />
          <h2 className="font-display text-lg text-[var(--ink)]">Progresmu</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)]">
          Seluruh progres (cerita, misi, koleksi, jurnal, pengaturan) tersimpan di perangkat ini memakai localStorage.
          Tidak ada akun, tidak ada server, dan tidak ada data yang dikirim ke mana pun. Menghapus data peramban juga
          menghapus progres ini — karena itu salinan unduhan disediakan.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" motif="lamp" onClick={handleExport}>
            Unduh salinan (JSON)
          </Button>
          <Button variant="secondary" motif="spiral" onClick={() => fileRef.current?.click()}>
            Pulihkan dari berkas
          </Button>
          <Button variant="danger" onClick={() => setResetOpen(true)}>
            Hapus data…
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onPickFile}
        />

        <p className="mt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
          Mengimpor berkas salinan akan menggantikan seluruh progres yang sedang aktif. Unduh salinan dulu bila ingin
          menyimpan keadaan saat ini.
        </p>

        {importResult ? (
          <p
            role="status"
            className={cn(
              "mt-3 rounded-[var(--radius-sm)] border p-3 text-xs leading-relaxed",
              importResult.ok
                ? "border-[color-mix(in_oklab,var(--success)_45%,transparent)] text-[var(--success)]"
                : "border-[color-mix(in_oklab,var(--danger)_45%,transparent)] text-[var(--danger)]",
            )}
          >
            {importResult.message}
          </p>
        ) : null}
      </section>

      {/* ---------- Dialog hapus data ---------- */}
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Hapus data perjalanan?"
        description="Tindakan ini tidak bisa dibatalkan. Pilih dengan tenang — tidak ada yang memaksamu."
        size="md"
        footer={
          <>
            <Button variant="danger" onClick={() => confirmReset(true)}>
              Hapus progres, simpan profil
            </Button>
            <Button variant="danger" onClick={() => confirmReset(false)}>
              Hapus semuanya
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm leading-relaxed text-[var(--ink-muted)]">
          <ul className="space-y-2.5">
            <li className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3.5">
              <p className="font-medium text-[var(--ink)]">Hapus progres, simpan profil</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">
                Cerita, misi, koleksi, jurnal, dan statistik dihapus. Nama dan lambangmu tetap tersimpan, jadi kamu
                bisa langsung melanjutkan dari awal tanpa perkenalan ulang.
              </p>
            </li>
            <li className="rounded-[var(--radius-sm)] border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] p-3.5">
              <p className="font-medium text-[var(--danger)]">Hapus semuanya</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">
                Seluruh data dihapus, termasuk profil dan pengaturan. Kamu akan kembali ke halaman perkenalan.
              </p>
            </li>
          </ul>
          <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
            Butuh cadangan dulu? Tutup dialog ini dan gunakan “Unduh salinan (JSON)” sebelum menghapus.
          </p>
        </div>
      </Modal>
    </div>
  );
}
