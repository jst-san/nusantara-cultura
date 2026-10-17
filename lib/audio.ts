/**
 * Lapisan audio TARA.
 *
 * Semua bunyi dibuat sendiri dengan Web Audio API (osilator + noise),
 * jadi prototype tidak bergantung pada berkas audio atau layanan eksternal.
 *
 * Catatan kejujuran: bunyi instrumen di sini adalah SIMULASI, bukan rekaman
 * gamelan asli. Hal ini ditulis apa adanya di UI (lihat ListeningPlayer).
 */

export type SfxKind =
  | "click"
  | "select"
  | "advance"
  | "success"
  | "gentle"
  | "unlock"
  | "achievement"
  | "transition";

export type InstrumentSound = "gong" | "saron" | "kenong" | "bonang" | "kepyak";

interface AudioSettings {
  sfx: boolean;
  ambience: boolean;
  volume: number;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambienceBus: GainNode | null = null;
let ambienceTimer: number | null = null;

const state: AudioSettings = { sfx: true, ambience: false, volume: 0.8 };

/** Volume selalu angka 0–1; simpanan lama bisa saja tidak memilikinya. */
function safeVolume(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0.7;
  return Math.min(1, Math.max(0, value));
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function ensureContext(): AudioContext | null {
  if (!isBrowser()) return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = safeVolume(state.volume) * 0.5;
  master.connect(ctx.destination);
  ambienceBus = ctx.createGain();
  ambienceBus.gain.value = 0;
  ambienceBus.connect(master);
  return ctx;
}

/** Dipanggil sekali di klien: membuka audio setelah interaksi pertama. */
export function unlockAudioOnFirstGesture(): void {
  if (!isBrowser()) return;
  const handler = () => {
    const context = ensureContext();
    if (context && context.state === "suspended") void context.resume();
    window.removeEventListener("pointerdown", handler);
    window.removeEventListener("keydown", handler);
  };
  window.addEventListener("pointerdown", handler, { once: true });
  window.addEventListener("keydown", handler, { once: true });
}

export function configureAudio(next: Partial<AudioSettings>): void {
  Object.assign(state, next);
  state.volume = safeVolume(state.volume);
  state.sfx = state.sfx !== false;
  state.ambience = state.ambience === true;
  if (master && ctx) {
    master.gain.setTargetAtTime(state.sfx || state.ambience ? state.volume * 0.5 : 0, ctx.currentTime, 0.05);
  }
  if (state.ambience && ambienceTimer === null) startAmbience();
  if (!state.ambience) stopAmbience();
}

function envelope(
  context: AudioContext,
  target: AudioNode,
  start: number,
  attack: number,
  decay: number,
  peak: number,
): GainNode {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  gain.connect(target);
  return gain;
}

function tone(
  context: AudioContext,
  target: AudioNode,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  peak: number,
  attack = 0.008,
): void {
  const osc = context.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  const gain = envelope(context, target, start, attack, duration, peak);
  osc.connect(gain);
  osc.start(start);
  osc.stop(start + duration + attack + 0.05);
}

function noiseBurst(
  context: AudioContext,
  target: AudioNode,
  start: number,
  duration: number,
  peak: number,
  filterFreq: number,
): void {
  const frames = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, frames, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  const gain = envelope(context, target, start, 0.002, duration, peak);
  source.connect(filter);
  filter.connect(gain);
  source.start(start);
}

/* ============================================================
 * Efek antarmuka
 * ============================================================ */

export function playSfx(kind: SfxKind): void {
  if (!state.sfx) return;
  const context = ensureContext();
  const bus: GainNode | null = master;
  if (!context || !bus) return;
  if (context.state === "suspended") void context.resume();
  const t = context.currentTime;
  switch (kind) {
    case "click":
      tone(context, bus, 620, t, 0.06, "triangle", 0.05);
      break;
    case "select":
      tone(context, bus, 520, t, 0.09, "sine", 0.07);
      tone(context, bus, 780, t + 0.04, 0.09, "sine", 0.045);
      break;
    case "advance":
      tone(context, bus, 880, t, 0.05, "sine", 0.035);
      break;
    case "success":
      [523.25, 659.25, 783.99].forEach((f, i) => tone(context, bus, f, t + i * 0.075, 0.22, "sine", 0.06));
      break;
    case "gentle":
      tone(context, bus, 392, t, 0.16, "sine", 0.05);
      tone(context, bus, 466.16, t + 0.06, 0.2, "sine", 0.035);
      break;
    case "unlock":
      [587.33, 880].forEach((f, i) => tone(context, bus, f, t + i * 0.09, 0.3, "triangle", 0.055));
      noiseBurst(context, bus, t, 0.18, 0.05, 2400);
      break;
    case "achievement":
      [659.25, 830.61, 987.77, 1318.51].forEach((f, i) =>
        tone(context, bus, f, t + i * 0.08, 0.36, "sine", 0.05),
      );
      break;
    case "transition":
      tone(context, bus, 220, t, 0.7, "sine", 0.06, 0.25);
      noiseBurst(context, bus, t + 0.05, 0.5, 0.03, 900);
      break;
    default:
      break;
  }
}

/* ============================================================
 * Simulasi bunyi instrumen
 * ============================================================ */

export function playInstrument(sound: InstrumentSound): void {
  const context = ensureContext();
  if (!context || !master) return;
  if (context.state === "suspended") void context.resume();
  const target = state.sfx ? master : null;
  if (!target) return;
  const t = context.currentTime;
  switch (sound) {
    case "gong":
      tone(context, target, 98, t, 3.4, "sine", 0.16, 0.02);
      tone(context, target, 147.5, t, 2.6, "sine", 0.07);
      tone(context, target, 196.5, t, 1.9, "sine", 0.04);
      noiseBurst(context, target, t, 0.35, 0.06, 400);
      break;
    case "saron":
      [1046.5, 2093, 3136].forEach((f, i) => tone(context, target, f, t, 0.55 - i * 0.12, "triangle", 0.07 - i * 0.02));
      noiseBurst(context, target, t, 0.06, 0.05, 3200);
      break;
    case "kenong":
      tone(context, target, 392, t, 1.5, "sine", 0.12);
      tone(context, target, 587.33, t, 1.1, "sine", 0.05);
      noiseBurst(context, target, t, 0.12, 0.04, 1600);
      break;
    case "bonang":
      tone(context, target, 698.46, t, 0.9, "sine", 0.1);
      tone(context, target, 1052, t, 0.6, "sine", 0.04);
      break;
    case "kepyak":
      for (let i = 0; i < 4; i += 1) {
        noiseBurst(context, target, t + i * 0.16, 0.05, 0.09, 1800 + i * 120);
        tone(context, target, 1180 + i * 40, t + i * 0.16, 0.05, "square", 0.03);
      }
      break;
    default:
      break;
  }
}

/* ============================================================
 * Ambient lembut (opsional, bisa dimatikan)
 * ============================================================ */

/** Nada dasar bergaya tangga nada lima (pendekatan, bukan pelog/slendro presisi). */
const AMBIENT_STEPS = [0, 2.4, 4.8, 7.2, 9.6, 12];

function playAmbientNote(context: AudioContext, bus: GainNode, freq: number): void {
  const t = context.currentTime;
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.05, t + 1.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);
  osc.connect(gain);
  gain.connect(bus);
  osc.start(t);
  osc.stop(t + 6);
}

export function startAmbience(): void {
  const context = ensureContext();
  if (!context || !ambienceBus) return;
  if (context.state === "suspended") void context.resume();
  ambienceBus.gain.setTargetAtTime(safeVolume(state.volume) * 0.35, context.currentTime, 0.8);
  if (ambienceTimer !== null) return;
  const tick = () => {
    if (!ctx || !ambienceBus) return;
    const root = 130.81;
    const step = AMBIENT_STEPS[Math.floor(Math.random() * AMBIENT_STEPS.length)];
    playAmbientNote(ctx, ambienceBus, root * Math.pow(2, step / 12));
    if (Math.random() > 0.7) {
      setTimeout(() => {
        if (ctx && ambienceBus) {
          const s2 = AMBIENT_STEPS[Math.floor(Math.random() * AMBIENT_STEPS.length)];
          playAmbientNote(ctx, ambienceBus, root * 2 * Math.pow(2, s2 / 12));
        }
      }, 1400);
    }
  };
  tick();
  ambienceTimer = window.setInterval(tick, 5200);
}

export function stopAmbience(): void {
  if (ambienceTimer !== null && isBrowser()) {
    window.clearInterval(ambienceTimer);
    ambienceTimer = null;
  }
  if (ambienceBus && ctx) {
    ambienceBus.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  }
}

/* ============================================================
 * Pelafalan memakai suara perangkat (opsional)
 * ============================================================ */

export function speechAvailable(): boolean {
  return isBrowser() && typeof window.speechSynthesis !== "undefined";
}

export function speak(text: string, lang = "id-ID"): boolean {
  if (!speechAvailable()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1;
  const voices = synth.getVoices();
  const match = voices.find((v) => v.lang?.toLowerCase().startsWith("id"));
  if (match) utterance.voice = match;
  synth.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (speechAvailable()) window.speechSynthesis.cancel();
}
