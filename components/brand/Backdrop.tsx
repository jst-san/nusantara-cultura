"use client";

import { useId } from "react";
import type { SceneKey } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Latar adegan. Semua ilustrasi dibuat sendiri sebagai SVG (tanpa berkas gambar
 * eksternal), dengan gradien dan siluet berlapis supaya punya kedalaman.
 *
 * Ilustrasi ini bersifat fantasi/storybook, bukan penggambaran geografis.
 */

interface BackdropProps {
  scene: SceneKey;
  className?: string;
  /** tampilkan lapisan suasana (kabut, kunang-kunang, bintang) */
  ambient?: boolean;
}

function Hills({ color, opacity, y, scale = 1 }: { color: string; opacity: number; y: number; scale?: number }) {
  return (
    <path
      d={`M-50 900 L${-50 + 220 * scale} ${y} Q${300 * scale} ${y - 120 * scale} ${620 * scale} ${y} T${1100 * scale} ${y + 20} T1650 900 Z`}
      fill={color}
      opacity={opacity}
    />
  );
}

function House({ x, y, scale = 1, color = "#0B1029", light = "#F4CD84" }: { x: number; y: number; scale?: number; color?: string; light?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 L46 -34 L92 0 Z" fill={color} />
      <path d="M-6 -1 L46 -36 L98 -1 L98 3 L46 -32 L-6 3 Z" fill={color} opacity={0.7} />
      <rect x="8" y="0" width="76" height="46" fill={color} />
      <rect x="18" y="10" width="16" height="18" fill={light} opacity={0.75} />
      <rect x="58" y="10" width="16" height="18" fill={light} opacity={0.45} />
    </g>
  );
}

function Tree({ x, y, scale = 1, color = "#070A18", opacity = 0.95 }: { x: number; y: number; scale?: number; color?: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <path d="M-4 0 Q-12 -60 -28 -110 Q-6 -96 0 -60 Q6 -104 30 -116 Q12 -58 4 0 Z" fill={color} />
      <path d="M-34 -96 Q-8 -132 22 -128 Q54 -124 64 -92 Q40 -104 8 -100 Q-16 -98 -34 -96 Z" fill={color} />
      <path d="M-52 -74 Q-30 -100 -4 -98 Q22 -96 36 -74 Q10 -84 -14 -80 Q-36 -76 -52 -74 Z" fill={color} opacity={0.9} />
    </g>
  );
}

function Fireflies({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  const spots = [
    { x: 220, y: 520, d: "0s" },
    { x: 420, y: 610, d: "-2.5s" },
    { x: 680, y: 470, d: "-5s" },
    { x: 980, y: 560, d: "-1.2s" },
    { x: 1240, y: 480, d: "-3.6s" },
    { x: 1420, y: 620, d: "-6.4s" },
  ];
  return (
    <g>
      {spots.map((s) => (
        <circle key={s.x} cx={s.x} cy={s.y} r={3.4} fill="#F7DE9A" className="animate-firefly" style={{ animationDelay: s.d }} />
      ))}
    </g>
  );
}

function Stars({ enabled, count = 40, uid }: { enabled: boolean; count?: number; uid: string }) {
  if (!enabled) return null;
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 7;
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const x = (seed / 233280) * 1600;
    seed = (seed * 9301 + 49297) % 233280;
    const y = (seed / 233280) * 380;
    dots.push({ x, y, r: i % 5 === 0 ? 2.6 : 1.6, o: 0.25 + ((i * 13) % 50) / 100 });
  }
  return (
    <g key={uid}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#FFF6DE" opacity={d.o} className={i % 4 === 0 ? "animate-pulse-soft" : undefined} />
      ))}
    </g>
  );
}

function Mist({ color }: { color: string }) {
  return (
    <g opacity={0.35}>
      <ellipse cx={320} cy={700} rx={420} ry={60} fill={color} />
      <ellipse cx={900} cy={760} rx={520} ry={70} fill={color} opacity={0.8} />
      <ellipse cx={1450} cy={690} rx={380} ry={54} fill={color} opacity={0.7} />
    </g>
  );
}

export function Backdrop({ scene, className, ambient = true }: BackdropProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const skyId = `sky-${uid}`;
  const glowId = `glow-${uid}`;
  const screenId = `screen-${uid}`;

  const defs = (
    <defs>
      <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={SCENE_COLORS[scene].skyTop} />
        <stop offset="60%" stopColor={SCENE_COLORS[scene].skyMid} />
        <stop offset="100%" stopColor={SCENE_COLORS[scene].skyBottom} />
      </linearGradient>
      <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE7B0" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#F0B94C" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#F0B94C" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={screenId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF3D2" stopOpacity="0.98" />
        <stop offset="100%" stopColor="#F3CE86" stopOpacity="0.85" />
      </linearGradient>
    </defs>
  );

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    >
      {defs}
      <rect width="1600" height="900" fill={`url(#${skyId})`} />
      {SCENE_ART[scene]?.(uid, ambient, skyId, glowId, screenId)}
      <rect width="1600" height="900" fill="url(#vignette)" opacity="0" />
    </svg>
  );
}

const SCENE_COLORS: Record<SceneKey, { skyTop: string; skyMid: string; skyBottom: string }> = {
  hills_dawn: { skyTop: "#1B2450", skyMid: "#7A5B7E", skyBottom: "#E9A46B" },
  village_gate: { skyTop: "#22305E", skyMid: "#6382A8", skyBottom: "#E7C58A" },
  village_square: { skyTop: "#25406B", skyMid: "#6E9DBE", skyBottom: "#E9D4A4" },
  pendopo_dusk: { skyTop: "#2A2550", skyMid: "#9A5C63", skyBottom: "#ECAE63" },
  pendopo_night: { skyTop: "#05070F", skyMid: "#141B3C", skyBottom: "#2A2A54" },
  screen_glow: { skyTop: "#07060E", skyMid: "#2A1C22", skyBottom: "#5A3A22" },
  workbench: { skyTop: "#233050", skyMid: "#6C7FA0", skyBottom: "#DCC69B" },
  banyan_dusk: { skyTop: "#1E2350", skyMid: "#7B5470", skyBottom: "#E59E64" },
  fields_morning: { skyTop: "#2B4470", skyMid: "#84AFCB", skyBottom: "#EFDCAC" },
  sky_night: { skyTop: "#03050E", skyMid: "#0D1430", skyBottom: "#242A56" },
};

type SceneArt = (
  uid: string,
  ambient: boolean,
  skyId: string,
  glowId: string,
  screenId: string,
) => React.ReactNode;

const SCENE_ART: Record<SceneKey, SceneArt> = {
  hills_dawn: (uid, ambient) => (
    <g>
      <Stars enabled={ambient} count={18} uid={uid} />
      <circle cx={1280} cy={560} r={210} fill="#F7D48A" opacity={0.28} />
      <Hills color="#6C5878" opacity={0.75} y={520} scale={0.9} />
      <Hills color="#463F63" opacity={0.85} y={600} scale={1.05} />
      <Hills color="#2A2745" opacity={0.95} y={690} scale={1.2} />
      <Mist color="#F1C79A" />
      <g opacity={0.9}>
        <House x={420} y={700} scale={0.9} color="#181733" light="#F6D08A" />
        <House x={560} y={716} scale={1.1} color="#12102A" light="#EFC075" />
        <House x={760} y={706} scale={0.8} color="#1A1838" light="#F6D08A" />
      </g>
      <Tree x={1120} y={760} scale={1.5} color="#15132C" />
      <Tree x={230} y={790} scale={1.9} color="#0F0D24" />
      <g stroke="#100E22" strokeWidth={3} fill="none" opacity={0.8}>
        <path d="M300 420 q18 -12 36 0 q18 12 36 0" />
        <path d="M380 380 q14 -10 28 0 q14 10 28 0" />
      </g>
      <Fireflies enabled={false} />
    </g>
  ),

  village_gate: (uid, ambient) => (
    <g>
      <circle cx={1180} cy={210} r={160} fill="#FFF0C4" opacity={0.35} />
      <Hills color="#41608A" opacity={0.6} y={480} scale={0.95} />
      <Hills color="#2A3F63" opacity={0.9} y={600} scale={1.15} />
      <g opacity={0.95}>
        <House x={980} y={680} scale={1.3} color="#1B2444" light="#F5D28C" />
        <House x={1180} y={700} scale={1} color="#141B36" light="#EFC075" />
        <House x={1320} y={686} scale={1.15} color="#1B2444" light="#F5D28C" />
      </g>
      <g>
        <rect x={170} y={470} width={26} height={330} rx={8} fill="#2A1D12" />
        <rect x={470} y={470} width={26} height={330} rx={8} fill="#2A1D12" />
        <path d="M150 470 q170 -90 366 0 l0 34 -366 0 Z" fill="#3A2A1A" />
        <path d="M176 500 q150 -66 288 0" stroke="#5C4426" strokeWidth={12} fill="none" opacity={0.7} />
        <g fill="#7C4B1E" opacity={0.85}>
          <rect x={196} y={520} width={70} height={18} rx={6} />
          <rect x={392} y={520} width={70} height={18} rx={6} />
        </g>
      </g>
      <path d="M330 900 Q400 700 520 640 Q640 700 700 900 Z" fill="#3B2E1E" opacity={0.9} />
      <Tree x={760} y={780} scale={1.7} color="#16203C" />
      <Tree x={1420} y={800} scale={2.1} color="#111A30" />
      <Fireflies enabled={ambient} />
    </g>
  ),

  village_square: (uid, ambient) => (
    <g>
      <circle cx={1320} cy={170} r={140} fill="#FFF3CC" opacity={0.4} />
      <Hills color="#4A6C93" opacity={0.5} y={440} scale={1} />
      <Tree x={90} y={700} scale={1.6} color="#152340" />
      <Tree x={1520} y={720} scale={1.8} color="#152340" />
      {/* pendopo */}
      <g>
        <path d="M520 380 L800 250 L1080 380 Z" fill="#3A2A1A" />
        <path d="M540 380 L800 262 L1060 380 L1060 396 L800 278 L540 396 Z" fill="#5C4426" opacity={0.8} />
        <rect x={560} y={380} width={480} height={26} fill="#2A1D12" />
        <g fill="#2A1D12">
          <rect x={600} y={406} width={20} height={210} />
          <rect x={700} y={406} width={20} height={210} />
          <rect x={900} y={406} width={20} height={210} />
          <rect x={1000} y={406} width={20} height={210} />
        </g>
        <rect x={560} y={616} width={480} height={18} fill="#3A2A1A" />
      </g>
      {/* layar (kelir) */}
      <g>
        <rect x={700} y={300} width={200} height={110} rx={4} fill={`url(#screen-${uid})`} opacity={0.95} />
        <rect x={690} y={290} width={220} height={12} rx={4} fill="#3A2A1A" />
        <rect x={690} y={408} width={220} height={12} rx={4} fill="#3A2A1A" />
      </g>
      {/* gamelan */}
      <g>
        <rect x={1150} y={560} width={300} height={22} rx={6} fill="#3A2A1A" />
        <rect x={1170} y={582} width={16} height={90} fill="#2A1D12" />
        <rect x={1414} y={582} width={16} height={90} fill="#2A1D12" />
        <g fill="#D9A94A">
          {[1180, 1220, 1260, 1300, 1340].map((x) => (
            <rect key={x} x={x} y={540} width={30} height={18} rx={5} />
          ))}
        </g>
        <g fill="#C08A2E" opacity={0.85}>
          <ellipse cx={1400} cy={548} rx={26} ry={16} />
          <ellipse cx={1448} cy={548} rx={22} ry={14} />
        </g>
      </g>
      {/* gedebog: batang pisang */}
      <g>
        <rect x={330} y={640} width={190} height={44} rx={20} fill="#4E6B34" />
        <rect x={330} y={640} width={190} height={14} rx={7} fill="#63853F" opacity={0.8} />
        <g fill="#2A1D12">
          <circle cx={368} cy={652} r={3.4} />
          <circle cx={404} cy={650} r={3.4} />
          <circle cx={440} cy={654} r={3.4} />
          <circle cx={476} cy={649} r={3.4} />
        </g>
      </g>
      {/* kothak: kotak wayang */}
      <g transform="translate(200 560)">
        <rect width={170} height={96} rx={12} fill="#7C4B1E" />
        <rect y={0} width={170} height={30} rx={12} fill="#9A6432" opacity={0.75} />
        <path d="M0 40h170" stroke="#5C3413" strokeWidth={4} />
        <circle cx={85} cy={20} r={6} fill="#F0B94C" />
      </g>
      <rect y={820} width={1600} height={80} fill="#3A2E1C" opacity={0.85} />
      <Fireflies enabled={ambient} />
    </g>
  ),

  pendopo_dusk: (uid, ambient, _sky, glowId) => (
    <g>
      <circle cx={1240} cy={520} r={280} fill={`url(#${glowId})`} />
      <Hills color="#4A3B63" opacity={0.7} y={520} scale={1} />
      <Hills color="#2C2447" opacity={0.9} y={640} scale={1.2} />
      <g>
        <path d="M360 340 L800 170 L1240 340 Z" fill="#211933" />
        <path d="M380 340 L800 182 L1220 340 L1220 358 L800 200 L380 358 Z" fill="#3E2E4B" opacity={0.85} />
        <rect x={400} y={340} width={800} height={30} fill="#1A1428" />
        <g fill="#1A1428">
          <rect x={460} y={370} width={26} height={280} />
          <rect x={640} y={370} width={26} height={280} />
          <rect x={960} y={370} width={26} height={280} />
          <rect x={1140} y={370} width={26} height={280} />
        </g>
        <rect x={400} y={650} width={800} height={22} fill="#211933" />
      </g>
      <g fill="#2A1F16" opacity={0.9}>
        <g transform="translate(620 600)">
          <ellipse cx={0} cy={50} rx={70} ry={12} opacity={0.5} />
          <circle cx={0} cy={0} r={22} />
          <path d="M-26 76 q26 -40 52 0 Z" />
        </g>
        <g transform="translate(1010 620)">
          <ellipse cx={0} cy={46} rx={60} ry={11} opacity={0.5} />
          <circle cx={0} cy={0} r={19} />
          <path d="M-22 70 q22 -36 44 0 Z" />
        </g>
      </g>
      <g>
        {[430, 700, 1180].map((x) => (
          <g key={x} transform={`translate(${x} 300)`}>
            <path d="M0 0 q14 30 0 60" stroke="#3A2A1A" strokeWidth={4} fill="none" />
            <circle cx={0} cy={68} r={16} fill={`url(#${glowId})`} />
            <rect x={-7} y={54} width={14} height={20} rx={4} fill="#7C4B1E" />
          </g>
        ))}
      </g>
      <rect y={840} width={1600} height={60} fill="#2A2118" opacity={0.9} />
      <Fireflies enabled={ambient} />
    </g>
  ),

  pendopo_night: (uid, ambient, _sky, glowId, screenId) => (
    <g>
      <Stars enabled={ambient} count={56} uid={uid} />
      <Hills color="#0B1029" opacity={0.9} y={560} scale={1.1} />
      <g>
        <path d="M300 330 L800 140 L1300 330 Z" fill="#080B1A" />
        <rect x={340} y={330} width={920} height={28} fill="#080B1A" />
        <g fill="#080B1A">
          <rect x={400} y={358} width={26} height={320} />
          <rect x={600} y={358} width={26} height={320} />
          <rect x={1000} y={358} width={26} height={320} />
          <rect x={1180} y={358} width={26} height={320} />
        </g>
      </g>
      {/* layar bercahaya */}
      <g>
        <rect x={640} y={250} width={340} height={230} rx={6} fill={`url(#${screenId})`} />
        <rect x={640} y={250} width={340} height={230} rx={6} fill={`url(#${glowId})`} opacity={0.55} />
        <g fill="#2A1A12" opacity={0.72}>
          <path d="M700 460 q6 -110 34 -140 q16 30 14 140 Z" />
          <path d="M770 460 q-4 -80 22 -110 q22 26 18 110 Z" />
          <path d="M850 460 q8 -120 40 -150 q14 34 12 150 Z" />
        </g>
        <g stroke="#0A0C18" strokeWidth={12} fill="none">
          <path d="M620 250 L620 490" />
          <path d="M1000 250 L1000 490" />
        </g>
      </g>
      <circle cx={560} cy={400} r={90} fill={`url(#${glowId})`} />
      <g fill="#05070F" opacity={0.92}>
        {[
          { x: 320, y: 700, s: 1 },
          { x: 430, y: 730, s: 0.9 },
          { x: 1080, y: 720, s: 0.95 },
          { x: 1240, y: 700, s: 1.05 },
          { x: 820, y: 780, s: 1.4 },
          { x: 960, y: 800, s: 1.2 },
        ].map((p) => (
          <g key={p.x} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
            <circle cx={0} cy={0} r={20} />
            <path d="M-24 66 q24 -40 48 0 Z" />
          </g>
        ))}
      </g>
      <rect y={860} width={1600} height={40} fill="#04050C" />
      <Fireflies enabled={ambient} />
    </g>
  ),

  screen_glow: (uid, ambient, _sky, glowId, screenId) => (
    <g>
      <rect x={180} y={60} width={1240} height={780} rx={26} fill={`url(#${screenId})`} opacity={0.92} />
      <rect x={180} y={60} width={1240} height={780} rx={26} fill={`url(#${glowId})`} opacity={0.5} />
      <g fill="#3A2317" opacity={0.55}>
        <path d="M520 840 q20 -420 90 -560 q60 140 40 560 Z" />
        <path d="M900 840 q-16 -320 78 -430 q58 120 34 430 Z" />
      </g>
      <g stroke="#1A1208" strokeWidth={34} fill="none" opacity={0.35}>
        <path d="M200 120 L200 800" />
        <path d="M1400 120 L1400 800" />
      </g>
      <g fill="#F7DE9A" opacity={0.6}>
        <circle cx={760} cy={120} r={5} />
        <circle cx={880} cy={150} r={3.4} />
      </g>
      {ambient ? <circle cx={1300} cy={220} r={180} fill={`url(#${glowId})`} opacity={0.5} /> : null}
    </g>
  ),

  workbench: (uid, ambient) => (
    <g>
      <circle cx={300} cy={180} r={190} fill="#FFF0C8" opacity={0.28} />
      <rect y={620} width={1600} height={280} fill="#3A2C1E" />
      <rect y={620} width={1600} height={26} fill="#5C4426" opacity={0.8} />
      <g>
        <rect x={190} y={470} width={260} height={160} rx={14} fill="#7C4B1E" />
        <rect x={190} y={470} width={260} height={44} rx={14} fill="#9A6432" opacity={0.7} />
        <path d="M190 520h260" stroke="#5C3413" strokeWidth={5} />
      </g>
      <g>
        <rect x={520} y={530} width={300} height={80} rx={10} fill="#4B3A26" opacity={0.9} />
      </g>
      <g stroke="#C08A2E" strokeWidth={7} strokeLinecap="round">
        <path d="M860 640 L1010 500" />
        <path d="M890 660 L1040 520" />
      </g>
      <g>
        <rect x={1080} y={430} width={110} height={140} rx={12} fill="#8B5A2B" />
        <rect x={1080} y={430} width={110} height={34} rx={12} fill="#B57C22" opacity={0.75} />
        <circle cx={1135} cy={520} r={16} fill="#F7DE9A" opacity={0.9} />
        <path d="M1135 486 q10 16 0 30 q-10 -14 0 -30Z" fill="#FFE7B0" />
      </g>
      <g transform="translate(300 330)">
        <rect x={0} y={0} width={190} height={130} rx={10} fill="#F1DCB0" opacity={0.95} />
        <rect x={0} y={0} width={190} height={130} rx={10} fill="none" stroke="#C08A2E" strokeWidth={3} />
        <path d="M20 34h150M20 62h150M20 90h110" stroke="#B57C22" strokeWidth={5} opacity={0.55} />
        <path d="M120 12 L190 82" stroke="#C08A2E" strokeWidth={4} opacity={0.7} />
      </g>
      <g opacity={0.95}>
        <rect x={1260} y={560} width={240} height={70} rx={12} fill="#EAD9B4" opacity={0.55} />
        <path d="M1260 596h240" stroke="#C08A2E" strokeWidth={4} opacity={0.5} />
      </g>
      <Fireflies enabled={ambient} />
    </g>
  ),

  banyan_dusk: (uid, ambient, _sky, glowId) => (
    <g>
      <circle cx={1220} cy={540} r={250} fill={`url(#${glowId})`} />
      <Hills color="#4A3B63" opacity={0.65} y={540} scale={1} />
      <Hills color="#2A2344" opacity={0.9} y={660} scale={1.15} />
      <g transform="translate(420 720)">
        <path d="M-40 180 q-30 -180 20 -300 q-10 -60 10 -110 q10 50 24 84 q40 -40 90 -30 q-30 30 -40 74 q60 -10 96 34 q-60 6 -84 46 q50 20 60 80 q-70 -20 -110 22 q30 40 20 100 Z" fill="#150F28" />
        <path d="M40 180 q-6 -60 -20 -110" stroke="#0C0818" strokeWidth={10} fill="none" opacity={0.8} />
      </g>
      <g stroke="#150F28" strokeWidth={8} fill="none" opacity={0.7}>
        <path d="M380 620 q-10 120 6 220" />
        <path d="M520 600 q16 120 4 240" />
      </g>
      <rect y={860} width={1600} height={40} fill="#1A1430" />
      <Fireflies enabled={ambient} />
    </g>
  ),

  fields_morning: (uid, ambient) => (
    <g>
      <circle cx={1240} cy={200} r={180} fill="#FFF6D6" opacity={0.4} />
      <Hills color="#4C6E8A" opacity={0.55} y={420} scale={0.9} />
      <g>
        <path d="M-20 520 Q400 460 820 540 T1620 520 L1620 900 L-20 900 Z" fill="#5C7C3A" />
        <path d="M-20 600 Q400 540 820 620 T1620 600 L1620 900 L-20 900 Z" fill="#4A6A2E" opacity={0.9} />
        <path d="M-20 700 Q400 640 820 720 T1620 700 L1620 900 L-20 900 Z" fill="#3A5826" opacity={0.9} />
        <g stroke="#2E4A1E" strokeWidth={3} opacity={0.5}>
          {[560, 640, 720, 800].map((y, i) => (
            <path key={y} d={`M-20 ${y} Q400 ${y - 60 + i * 4} 820 ${y + 20} T1620 ${y}`} fill="none" />
          ))}
        </g>
      </g>
      <Tree x={180} y={640} scale={1.8} color="#22331A" />
      <Tree x={1420} y={640} scale={2} color="#22331A" />
      <g fill="#22331A" opacity={0.9}>
        <path d="M980 640 q10 -120 40 -170 q6 90 -6 170 Z" />
        <path d="M1010 640 q30 -110 68 -150 q-12 92 -34 150 Z" />
      </g>
      <g>
        <rect x={1080} y={556} width={210} height={20} rx={6} fill="#8B5A2B" opacity={0.85} />
        <rect x={1104} y={576} width={14} height={60} fill="#7C4B1E" />
        <rect x={1252} y={576} width={14} height={60} fill="#7C4B1E" />
      </g>
      <Fireflies enabled={ambient} />
    </g>
  ),

  sky_night: (uid, ambient) => (
    <g>
      <Stars enabled={ambient} count={80} uid={uid} />
      <circle cx={1300} cy={180} r={78} fill="#FFF6DE" opacity={0.92} />
      <circle cx={1330} cy={160} r={74} fill="var(--stage)" opacity={0.55} />
      <Hills color="#0A0F26" opacity={0.9} y={620} scale={1.1} />
      <Hills color="#05070F" opacity={1} y={740} scale={1.2} />
      <g opacity={0.5}>
        <ellipse cx={400} cy={260} rx={220} ry={40} fill="#1B2450" />
        <ellipse cx={860} cy={330} rx={260} ry={46} fill="#1B2450" />
      </g>
      <path d="M0 900 Q420 820 820 880 T1600 860 L1600 900 Z" fill="#04060E" />
      <Fireflies enabled={ambient} />
    </g>
  ),
};
