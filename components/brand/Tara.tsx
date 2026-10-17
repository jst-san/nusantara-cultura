"use client";

import { useId } from "react";
import type { TaraExpression } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Tara — Garuda kecil, tokoh utama TARA: Nusantara Story Quest.
 *
 * Ilustrasi SVG orisinal (bukan lambang negara, bukan maskot lembaga).
 * Ekspresi diatur lewat sistem sederhana: bentuk kelopak mata, alis, dan paruh.
 */

interface TaraProps {
  expression?: TaraExpression;
  className?: string;
  /** animasi mengambang lembut */
  idle?: boolean;
  /** membalik arah hadap */
  flip?: boolean;
  /** label untuk pembaca layar (kalau tidak diisi, dianggap dekoratif) */
  title?: string;
}

interface FaceConfig {
  eye: "open" | "wide" | "half" | "happy" | "closed";
  pupil: { dx: number; dy: number };
  brow: "neutral" | "raised" | "one-raised" | "worried" | "focused";
  beak: "closed" | "slight" | "open" | "smile";
  tilt: number;
  blush: boolean;
  extra?: "question" | "exclaim" | "sparkle" | "dots" | "stars";
  crest: number;
}

const FACES: Record<TaraExpression, FaceConfig> = {
  curious: { eye: "wide", pupil: { dx: 2, dy: -1 }, brow: "raised", beak: "slight", tilt: -3, blush: false, crest: 6 },
  confused: { eye: "open", pupil: { dx: 3, dy: 2 }, brow: "worried", beak: "slight", tilt: 4, blush: false, extra: "question", crest: -4 },
  happy: { eye: "happy", pupil: { dx: 0, dy: 0 }, brow: "raised", beak: "smile", tilt: -2, blush: true, crest: 10 },
  sad: { eye: "half", pupil: { dx: 0, dy: 3 }, brow: "worried", beak: "closed", tilt: 3, blush: false, crest: -8 },
  surprised: { eye: "wide", pupil: { dx: 0, dy: 0 }, brow: "raised", beak: "open", tilt: 0, blush: false, extra: "exclaim", crest: 14 },
  thinking: { eye: "half", pupil: { dx: 3, dy: -3 }, brow: "one-raised", beak: "closed", tilt: 2, blush: false, extra: "dots", crest: 0 },
  proud: { eye: "open", pupil: { dx: 0, dy: -1 }, brow: "raised", beak: "smile", tilt: -1, blush: true, extra: "sparkle", crest: 12 },
  reflective: { eye: "closed", pupil: { dx: 0, dy: 0 }, brow: "neutral", beak: "closed", tilt: -1, blush: false, extra: "stars", crest: 2 },
  determined: { eye: "open", pupil: { dx: 1, dy: -1 }, brow: "focused", beak: "closed", tilt: -2, blush: false, crest: 8 },
  warm: { eye: "happy", pupil: { dx: 0, dy: 0 }, brow: "neutral", beak: "slight", tilt: 0, blush: true, crest: 4 },
};

function EyeShape({ config, cx, cy }: { config: FaceConfig; cx: number; cy: number }) {
  const { eye, pupil } = config;
  if (eye === "happy") {
    return (
      <path
        d={`M${cx - 8} ${cy + 2} Q${cx} ${cy - 7} ${cx + 8} ${cy + 2}`}
        fill="none"
        stroke="var(--tara-ink)"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
    );
  }
  if (eye === "closed") {
    return (
      <path
        d={`M${cx - 8} ${cy} Q${cx} ${cy + 4} ${cx + 8} ${cy}`}
        fill="none"
        stroke="var(--tara-ink)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  }
  const rx = eye === "wide" ? 9 : 8;
  const ry = eye === "wide" ? 10 : eye === "half" ? 6 : 9;
  const pupilR = eye === "wide" ? 3.4 : 4.2;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFFDF6" />
      <circle cx={cx + pupil.dx} cy={cy + pupil.dy} r={pupilR} fill="var(--tara-ink)" />
      <circle cx={cx + pupil.dx - 1.4} cy={cy + pupil.dy - 1.6} r={1.3} fill="#FFFDF6" opacity={0.9} />
      {eye === "half" ? <path d={`M${cx - 9} ${cy - 4} L${cx + 9} ${cy - 4}`} stroke="var(--tara-ink)" strokeWidth={4} strokeLinecap="round" /> : null}
      <ellipse cx={cx} cy={cy - ry - 1} rx={rx + 0.6} ry={2.4} fill="var(--tara-ink)" opacity={0.75} />
    </g>
  );
}

function Brows({ brow }: { brow: FaceConfig["brow"] }) {
  const stroke = {
    fill: "none",
    stroke: "var(--tara-ink)",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
  };
  switch (brow) {
    case "raised":
      return (
        <g {...stroke}>
          <path d="M86 74 Q95 68 104 73" />
          <path d="M116 73 Q125 68 134 74" />
        </g>
      );
    case "one-raised":
      return (
        <g {...stroke}>
          <path d="M86 75 Q95 71 104 75" />
          <path d="M116 70 Q125 64 134 71" />
        </g>
      );
    case "worried":
      return (
        <g {...stroke}>
          <path d="M86 71 Q95 76 104 76" />
          <path d="M116 76 Q125 76 134 71" />
        </g>
      );
    case "focused":
      return (
        <g {...stroke}>
          <path d="M86 73 Q95 69 104 74" />
          <path d="M116 74 Q125 69 134 73" />
        </g>
      );
    default:
      return (
        <g {...stroke}>
          <path d="M86 74 Q95 70 104 74" />
          <path d="M116 74 Q125 70 134 74" />
        </g>
      );
  }
}

function Beak({ beak }: { beak: FaceConfig["beak"] }) {
  const lower =
    beak === "open" ? 12 : beak === "smile" ? 7 : beak === "slight" ? 4 : 2.5;
  return (
    <g>
      <path d="M110 96 L120 106 L110 112 L100 106 Z" fill="url(var(--tara-beak))" />
      <path
        d={`M110 ${106} L117 ${106 + 1} L110 ${106 + lower} L103 ${107}`}
        fill="var(--tara-beak-dark)"
        opacity={beak === "closed" ? 0.9 : 1}
      />
      {beak === "open" || beak === "smile" ? (
        <ellipse cx={110} cy={108 + lower * 0.5} rx={5} ry={2.2} fill="#5B2A12" opacity={0.55} />
      ) : null}
    </g>
  );
}

function ExtraMark({ extra }: { extra: FaceConfig["extra"] }) {
  if (!extra) return null;
  switch (extra) {
    case "question":
      return (
        <text x={152} y={62} fill="var(--gold-soft)" fontSize={26} fontFamily="var(--font-display)" opacity={0.95}>
          ?
        </text>
      );
    case "exclaim":
      return (
        <text x={150} y={60} fill="var(--gold-soft)" fontSize={30} fontFamily="var(--font-display)">
          !
        </text>
      );
    case "sparkle":
      return (
        <g fill="var(--gold-soft)">
          <path d="M158 52l2.6 6.2 6.2.5-4.8 3.8 1.5 6-5.5-3.4-5.5 3.4 1.5-6-4.8-3.8 6.2-.5z" opacity={0.9} />
          <path d="M64 44l1.9 4.4 4.4.4-3.4 2.7 1 4.3-3.9-2.4-3.9 2.4 1-4.3-3.4-2.7 4.4-.4z" opacity={0.7} />
        </g>
      );
    case "dots":
      return (
        <g fill="var(--gold-soft)">
          <circle cx={150} cy={54} r={2.6} />
          <circle cx={160} cy={50} r={2.2} />
          <circle cx={169} cy={45} r={1.8} />
        </g>
      );
    case "stars":
      return (
        <g fill="var(--gold-soft)" opacity={0.75}>
          <circle cx={156} cy={56} r={2.4} />
          <circle cx={166} cy={68} r={1.8} />
          <circle cx={64} cy={52} r={2} />
          <circle cx={56} cy={66} r={1.6} />
        </g>
      );
    default:
      return null;
  }
}

export function Tara({ expression = "curious", className, idle = false, flip = false, title }: TaraProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const config = FACES[expression] ?? FACES.curious;
  const bodyGradient = `tara-body-${uid}`;
  const bellyGradient = `tara-belly-${uid}`;
  const beakGradient = `tara-beak-${uid}`;

  return (
    <svg
      viewBox="0 0 220 230"
      className={cn("select-none", idle && "animate-float-slow", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={
        {
          "--tara-ink": "#3A2413",
          "--tara-beak": `url(#${beakGradient})`,
          "--tara-beak-dark": "#C97F24",
          transform: flip ? "scaleX(-1)" : undefined,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient id={bodyGradient} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#F8E3A6" />
          <stop offset="46%" stopColor="#E9B949" />
          <stop offset="100%" stopColor="#B57C22" />
        </linearGradient>
        <linearGradient id={bellyGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF7E4" />
          <stop offset="100%" stopColor="#F1DCB0" />
        </linearGradient>
        <linearGradient id={beakGradient} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#F7C75B" />
          <stop offset="100%" stopColor="#D98F1F" />
        </linearGradient>
      </defs>

      {/* bayangan */}
      <ellipse cx={112} cy={214} rx={46} ry={8} fill="#000" opacity={0.18} />

      <g transform={`rotate(${config.tilt} 110 150)`}>
        {/* ekor */}
        <g>
          {[-42, -21, 0, 21, 42].map((angle, i) => (
            <g key={angle} transform={`rotate(${angle} 110 182)`}>
              <path
                d="M104 182 Q110 214 106 232 Q112 224 116 232 Q112 214 116 182 Z"
                fill={`url(#${bodyGradient})`}
                transform={`rotate(${angle * -0.12} 110 200)`}
                opacity={0.95 - Math.abs(i - 2) * 0.06}
              />
              <circle cx={110} cy={214} r={1.6} fill="#8A5A16" opacity={0.55} />
              <circle cx={110} cy={224} r={1.3} fill="#8A5A16" opacity={0.45} />
            </g>
          ))}
        </g>

        {/* kaki */}
        <g stroke="#C97F24" strokeWidth={4.2} strokeLinecap="round" fill="none">
          <path d="M100 196 L98 208" />
          <path d="M120 196 L122 208" />
        </g>
        <g stroke="#B4711C" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d="M98 208 L90 212M98 208 L98 214M98 208 L105 212" />
          <path d="M122 208 L114 212M122 208 L122 214M122 208 L129 212" />
        </g>

        {/* badan */}
        <ellipse cx={110} cy={152} rx={44} ry={42} fill={`url(#${bodyGradient})`} />
        <ellipse cx={110} cy={160} rx={27} ry={29} fill={`url(#${bellyGradient})`} />

        {/* tas kecil + buku */}
        <path d="M88 122 Q110 146 132 168" stroke="#7C4B1E" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
        <g transform="rotate(-8 140 172)">
          <rect x={124} y={160} width={32} height={25} rx={7} fill="#8B5A2B" />
          <rect x={127} y={157} width={20} height={9} rx={2.4} fill="#F6E7C8" />
          <rect x={127} y={157} width={4} height={9} rx={1.6} fill="#E9B949" />
        </g>

        {/* sayap */}
        <g className="animate-sway" style={{ transformOrigin: "72px 140px" }}>
          <path d="M74 126 Q44 138 46 172 Q56 168 62 176 Q70 162 82 148 Z" fill={`url(#${bodyGradient})`} stroke="#B57C22" strokeWidth={1.4} opacity={0.98} />
          <path d="M62 148 Q58 160 58 168" stroke="#B57C22" strokeWidth={1.6} fill="none" opacity={0.6} />
        </g>
        <g className="animate-sway" style={{ transformOrigin: "148px 140px", animationDelay: "-2.4s" }}>
          <path d="M146 126 Q176 138 174 172 Q164 168 158 176 Q150 162 138 148 Z" fill={`url(#${bodyGradient})`} stroke="#B57C22" strokeWidth={1.4} opacity={0.98} />
          <path d="M158 148 Q162 160 162 168" stroke="#B57C22" strokeWidth={1.6} fill="none" opacity={0.6} />
        </g>

        {/* kepala */}
        <g transform={`rotate(${config.tilt * -0.6} 110 92)`}>
          <g stroke="#B57C22" strokeWidth={2} fill="none">
            <path d="M96 62 Q88 42 74 34" strokeWidth={3} />
            <path d="M110 56 Q108 34 110 20" strokeWidth={3.2} />
            <path d="M124 62 Q132 42 146 34" strokeWidth={3} />
          </g>
          <g transform={`translate(0 ${-config.crest * 0.06})`}>
            <circle cx={74} cy={34} r={4} fill="#E9B949" stroke="#B57C22" strokeWidth={1.2} />
            <circle cx={110} cy={20} r={4.6} fill="#E9B949" stroke="#B57C22" strokeWidth={1.2} />
            <circle cx={146} cy={34} r={4} fill="#E9B949" stroke="#B57C22" strokeWidth={1.2} />
          </g>
          <ellipse cx={110} cy={92} rx={35} ry={33} fill={`url(#${bodyGradient})`} />
          <ellipse cx={110} cy={102} rx={22} ry={20} fill={`url(#${bellyGradient})`} opacity={0.55} />

          <g className="animate-blink" style={{ transformOrigin: "110px 88px" }}>
            <EyeShape config={config} cx={96} cy={88} />
            <EyeShape config={config} cx={124} cy={88} />
          </g>

          <Brows brow={config.brow} />
          {config.blush ? (
            <g fill="#E98A6B" opacity={0.35}>
              <ellipse cx={80} cy={101} rx={7} ry={4.4} />
              <ellipse cx={140} cy={101} rx={7} ry={4.4} />
            </g>
          ) : null}
          <Beak beak={config.beak} />
        </g>
      </g>

      <ExtraMark extra={config.extra} />
    </svg>
  );
}
