/**
 * Pemeriksa alur (smoke test) memakai Chrome DevTools Protocol — tanpa dependensi.
 * Menjalankan skenario langkah-demi-langkah di dalam halaman sungguhan.
 *
 * Pakai:
 *   node tools/smoke.mjs [base-url] [skenario]
 *   CDP_PORT=9440 node tools/smoke.mjs http://localhost:3100 play-e1
 *
 * Skenario: default | storage | onboarding | play-e1 | resume | replay | mobile
 *           | full-chapter | reduced-motion | secondary-pages | debug-*
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = Number(process.env.CDP_PORT ?? 9333);
const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const scenarioName = process.argv[3] ?? "default";
const PROFILE = "/tmp/opencode/cdp-profile-" + PORT;
const SAVE_KEY = "tara-nusantara-save-v1";
const HEADLESS = process.env.SMOKE_HEADLESS !== "false";

const chrome = spawn(
  "google-chrome",
  [
    ...(HEADLESS ? ["--headless=new"] : []),
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitForTarget() {
  for (let i = 0; i < 150; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // belum siap
    }
    await delay(200);
  }
  throw new Error("Chrome tidak siap");
}

let id = 0;
const pending = new Map();

function send(ws, method, params = {}) {
  id += 1;
  const messageId = id;
  ws.send(JSON.stringify({ id: messageId, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(messageId, { resolve, reject });
    setTimeout(() => {
      if (pending.has(messageId)) {
        pending.delete(messageId);
        reject(new Error(`Timeout ${method}`));
      }
    }, 30000);
  });
}

/* ---------- skenario ---------- */

const STEP_HELPERS = `
  // CATATAN: blok ini adalah template literal di Node, jadi setiap escape regex
  // harus ditulis ganda (\\\\d untuk \\d, \\\\s untuk \\s) supaya sampai utuh ke halaman.
  window.__t = {
    text: () => document.body.innerText.replace(/\\s+/g, " ").trim(),
    save: () => {
      const raw = localStorage.getItem(${JSON.stringify(SAVE_KEY)});
      return raw ? JSON.parse(raw) : null;
    },
    saveState: () => {
      const raw = localStorage.getItem(${JSON.stringify(SAVE_KEY)});
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.state ?? parsed;
    },
    clickText: (needle, opts = {}) => {
      const scope = opts.within ? document.querySelector(opts.within) : document;
      if (!scope) return { ok: false, reason: "scope kosong: " + opts.within };
      const nodes = [...scope.querySelectorAll('button, a, [role="button"], [role="radio"], [role="link"], summary')];
      const clean = (el) => (el.innerText || el.getAttribute("aria-label") || "").replace(/\\s+/g, " ").trim();
      const exact = opts.exact ?? false;
      const hit = nodes.find((el) => (exact ? clean(el) === needle : clean(el).includes(needle)));
      if (!hit) {
        return { ok: false, reason: "tidak ketemu: " + needle, candidates: nodes.map(clean).filter(Boolean).slice(0, 40) };
      }
      hit.scrollIntoView({ block: "center" });
      hit.click();
      return { ok: true, text: clean(hit).slice(0, 90) };
    },
    clickSel: (sel, index = 0) => {
      const nodes = [...document.querySelectorAll(sel)];
      const hit = nodes[index];
      if (!hit) return { ok: false, reason: "tidak ketemu: " + sel + "[" + index + "] dari " + nodes.length };
      hit.scrollIntoView({ block: "center" });
      hit.click();
      return { ok: true, tag: hit.tagName, text: (hit.innerText || hit.getAttribute("aria-label") || "").replace(/\\s+/g, " ").trim().slice(0, 90) };
    },
    clickAll: (sel) => {
      const nodes = [...document.querySelectorAll(sel)];
      nodes.forEach((n) => n.click());
      return { ok: nodes.length > 0, count: nodes.length };
    },
    setValue: (sel, value) => {
      const el = document.querySelector(sel);
      if (!el) return { ok: false, reason: "tidak ketemu: " + sel };
      const proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return { ok: true, value: el.value };
    },
    press: (key) => {
      const target = document.activeElement && document.activeElement !== document.body ? document.activeElement : document.body;
      const opts = { key, code: key.length === 1 && /[a-z0-9]/i.test(key) ? "Key" + key.toUpperCase() : key, bubbles: true, cancelable: true };
      if (key === " ") opts.code = "Space";
      target.dispatchEvent(new KeyboardEvent("keydown", opts));
      target.dispatchEvent(new KeyboardEvent("keyup", opts));
      return { ok: true, key };
    },
    phase: () => {
      const hud = document.querySelector("[data-story-hud]");
      return {
        heading: (document.querySelector("h1, h2")?.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 120),
        hasModal: Boolean(document.querySelector('[role="dialog"]')),
        buttons: [...document.querySelectorAll("button, a")].map((el) => (el.innerText || "").replace(/\\s+/g, " ").trim()).filter(Boolean).slice(0, 30),
        hud: hud ? hud.innerText.replace(/\\s+/g, " ").trim().slice(0, 200) : null,
      };
    },
  };

  /**
   * Pemutar otomatis: menyelesaikan satu aksi pada layar saat ini.
   * Mengembalikan nama aksi supaya pemanggil bisa mencatat alurnya.
   */
  window.__autoState = window.__autoState || { tried: {}, quiz: [], ordering: null };
  window.__auto = (match, opts = {}) => {
    const st = window.__autoState;
    const t = window.__t.text();
    const main = document.querySelector("main") ?? document.body;
    const clean = (el) => (el.innerText || el.getAttribute("aria-label") || "").replace(/\\s+/g, " ").trim();
    const buttons = () => [...main.querySelectorAll("button")];
    const byText = (re) => buttons().find((b) => re.test(clean(b)) && !b.disabled);
    const choiceIndex = opts.choice ?? 1;

    if (new RegExp(match, "i").test(t)) return "done";
    if (/Baris \\d+ dari \\d+/.test(t)) {
      window.__t.press(" ");
      return "advance";
    }

    // Refleksi: isi minimum lalu simpan.
    const ta = main.querySelector("textarea");
    if (ta) {
      const minMatch = t.match(/(\\d+)\\/(\\d+) huruf minimum/);
      const min = Number(minMatch?.[2] ?? 20);
      const enoughText = (ta.value || "").trim().length >= min;
      const save = byText(/^Simpan catatan & lanjut$/i);
      if (!enoughText) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        setter.call(ta, ("Aku mengamati dan bertanya dengan sopan, lalu mencatat hal baru yang kudengar dari warga. " + "Catatan ini diisi otomatis oleh pemeriksa alur prototype. ").slice(0, Math.max(min + 40, 60)));
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        return "reflection-fill";
      }
      if (save) {
        save.click();
        return "reflection-submit";
      }
      return "reflection-wait";
    }

    // Urutan: buka petunjuk, lalu susun sesuai petunjuk.
    if (main.querySelector("[aria-label^='Naikkan:']")) {
      if (/Urutannya sudah tepat/i.test(t)) {
        byText(/^Lanjutkan$/i)?.click();
        return "order-continue";
      }
      const items = [...main.querySelectorAll("[aria-label^='Naikkan:']")].map((b) =>
        (b.getAttribute("aria-label") || "").replace(/^Naikkan:\\s*/, ""),
      );
      const hintList = [...main.querySelectorAll("ol")].find((ol) => !ol.querySelector("button"));
      if (!st.ordering && hintList) {
        st.ordering = [...hintList.querySelectorAll("li")].map((li) => clean(li).replace(/^\\d+\\.?\\s*/, "").trim());
      }
      if (!st.ordering) {
        const check = byText(/^Periksa urutan$/i);
        const hintBtn = byText(/^Tampilkan urutan yang disarankan$/i);
        if (hintBtn) {
          hintBtn.click();
          return "order-open-hint";
        }
        if (check) {
          check.click();
          return "order-check";
        }
        return "order-wait";
      }
      for (let i = 0; i < st.ordering.length; i += 1) {
        if (items[i] && items[i] === st.ordering[i]) continue;
        const from = items.findIndex((text, j) => j > i && text === st.ordering[i]);
        if (from > i) {
          const move = buttons().find((b) => b.getAttribute("aria-label") === "Naikkan: " + st.ordering[i] && !b.disabled);
          if (move) {
            move.click();
            return "order-move-up";
          }
        }
      }
      byText(/^Periksa urutan$/i)?.click();
      return "order-check";
    }

    // Mencocokkan pasangan.
    const lists = [...main.querySelectorAll("ul")].filter((ul) => ul.querySelector("button"));
    if (/\\bcocok\\b/.test(t) && lists.length >= 2 && !/PILIHANMU/.test(t)) {
      const left = [...lists[0].querySelectorAll("button")].filter((b) => !b.disabled);
      const right = [...lists[1].querySelectorAll("button")].filter((b) => !b.disabled);
      if (!left.length) {
        byText(/^Lanjutkan$/i)?.click();
        return "match-done";
      }
      const L = left[0];
      if (L.getAttribute("aria-pressed") !== "true") {
        L.click();
        return "match-pick-left";
      }
      const key = clean(L);
      st.tried[key] = st.tried[key] || [];
      const cand = right.find((b) => !st.tried[key].includes(clean(b)));
      if (!cand) return "match-stuck";
      st.tried[key].push(clean(cand));
      cand.click();
      return "match-try-right";
    }

    // Mendengarkan suara.
    const listen = buttons().filter((b) => (b.getAttribute("aria-label") || "").startsWith("Dengarkan"));
    if (listen.length) {
      const unplayed = listen.find((b) => !st.tried[b.getAttribute("aria-label")]);
      if (unplayed) {
        st.tried[unplayed.getAttribute("aria-label")] = true;
        unplayed.click();
        return "listen-play";
      }
      const go = buttons().find((b) => !b.disabled && /^(Lanjutkan cerita|Lanjutkan|Selesai)$/i.test(clean(b)));
      if (go) {
        go.click();
        return "listen-continue";
      }
      return "listen-wait";
    }

    // Mengamati titik-titik di adegan.
    const hotspots = buttons().filter((b) => /^(Periksa|Baca lagi): /.test(b.getAttribute("aria-label") || ""));
    if (hotspots.length) {
      const fresh = hotspots.find((b) => (b.getAttribute("aria-label") || "").startsWith("Periksa"));
      if (fresh) {
        fresh.click();
        return "observe-open";
      }
      const go = buttons().find((b) => !b.disabled && /^Lanjutkan cerita$/i.test(clean(b)));
      if (go) {
        go.click();
        return "observe-continue";
      }
      return "observe-wait";
    }

    // Kuis: coba pilihan sampai semua opsi terkunci (soal terjawab), lalu lanjut.
    const quizOptions = buttons().filter((b) => /^[A-E] /.test(clean(b)) && !/PILIHANMU/i.test(t));
    if (quizOptions.length) {
      const signature = quizOptions.map(clean).join("|");
      if (st.quizSet !== signature) {
        st.quizSet = signature;
        st.quiz = [];
      }
      const enabled = quizOptions.filter((b) => !b.disabled);
      if (!enabled.length) {
        byText(/^Lanjutkan cerita$/i)?.click();
        return "quiz-continue";
      }
      const fresh = enabled.find((b) => !st.quiz.includes(clean(b)));
      if (fresh) {
        st.quiz.push(clean(fresh));
        fresh.click();
        return "quiz-try";
      }
      return "quiz-wait";
    }

    // Pilihan cerita: ambil opsi sesuai permintaan.
    const choiceButtons = buttons().filter((b) => /^\\d+ /.test(clean(b)) && !b.disabled);
    if (choiceButtons.length) {
      const option = choiceButtons.find((b) => new RegExp("^" + choiceIndex + "\\\\b").test(clean(b))) ?? choiceButtons[0];
      option.click();
      return "choose-" + clean(option).split(" ")[0];
    }

    const cont = buttons().find((b) => !b.disabled && /^(Lanjutkan cerita|Lanjutkan|Lanjut)$/i.test(clean(b)));
    if (cont) {
      cont.click();
      return "continue";
    }
    return "idle";
  };

  true;
`;

const EMPTY_STORAGE = `(() => { localStorage.clear(); return true; })()`;

function expectExpr(expr, expected) {
  return `${JSON.stringify({ ok: undefined })} && (() => { const v = (${expr}); const expected = ${JSON.stringify(expected)}; const pass = typeof expected === "object" ? true : JSON.stringify(v) === JSON.stringify(expected); return { value: v, pass }; })()`;
}

const SCENARIOS = {
  default: [
    { nav: "/", helpers: true },
    { capture: "window.__t.text().slice(0, 500)", as: "text" },
  ],

  storage: [
    { nav: "/", helpers: true },
    { capture: "window.__t.saveState()", as: "save" },
  ],

  onboarding: [
    { nav: "/", helpers: true, clear: true },
    { wait: 800 },
    { assert: "!window.__t.saveState()?.onboardingComplete", label: "belum onboarding" },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Lampu" },
    { capture: "window.__t.saveState()?.player ?? null", as: "playerBeforeStart" },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { assert: "location.pathname === '/home'", label: "pindah ke /home" },
    { capture: "window.__t.saveState()?.player", as: "player" },
    { assert: "window.__t.saveState()?.onboardingComplete === true", label: "onboardingComplete" },
    { capture: "window.__t.text().slice(0, 200)", as: "homeText" },
  ],

  "debug-key": [
    { nav: "/", helpers: true, clear: true },
    { wait: 500 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { nav: "/play/ch1/e1_kedatangan", helpers: true },
    { wait: 1500 },
    {
      capture: `(async () => {
        window.__keyLog = [];
        window.addEventListener("keydown", (e) => window.__keyLog.push(e.key), true);
        const count = () => document.body.innerText.match(/Baris (\\d+) dari (\\d+)/)?.[0] ?? null;
        const btn = () => [...document.querySelectorAll("button")].find((b) => /Berikutnya|Lanjut/.test(b.innerText));
        const before = count();
        btn()?.click();
        await new Promise((r) => setTimeout(r, 400));
        const afterClick = count();
        window.__t.press(" ");
        await new Promise((r) => setTimeout(r, 400));
        const afterKey = count();
        return { before, afterClick, afterKey, keyLog: window.__keyLog, btnText: btn()?.innerText };
      })()`,
      as: "keyTest",
    },
  ],

  "debug-prompt": [
    { nav: "/", helpers: true, clear: true },
    { wait: 500 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { nav: "/play/ch1/e1_kedatangan", helpers: true },
    { wait: 1200 },
    {
      capture: `(async () => {
        const out = [];
        for (let i = 0; i < 13; i++) {
          const t = window.__t.text();
          out.push({
            i,
            bar: t.match(/Baris \\d+ dari \\d+/)?.[0] ?? null,
            hasPrompt: t.includes("Bagaimana Tara mendekati desa"),
            test: new RegExp("desa\\\\?", "i").test(t),
            choicePhase: t.includes("PILIHANMU"),
            snippet: (t.match(/PILIHANMU.{0,60}/) ?? [null])[0],
          });
          window.__t.press(" ");
          await new Promise((r) => setTimeout(r, 220));
        }
        return out;
      })()`,
      as: "trace",
    },
  ],

  "debug-order": [
    { nav: "/", helpers: true, clear: true },
    { wait: 500 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { capture: `(async () => {
        const storeModule = localStorage.getItem(${JSON.stringify(SAVE_KEY)});
        const parsed = JSON.parse(storeModule);
        parsed.state.completedEpisodes = ["e1_kedatangan", "e2_berkumpul", "e3_pilihan", "e4_petunjuk"];
        parsed.state.flags = { ...parsed.state.flags, tone_friendly: true, met_ndari: true, met_dalang: true, met_sinden: true, asked_about_tradition: true, observed_scene_clue: true, offered_help: true, heard_guyub: true, discovered_hidden_term: true, notebook_examined: true, notebook_understood: true, ringgit_explained: true, guyub_explained: true, learned_greeting: true, listened_to_tale: true };
        parsed.state.episodeResume = {};
        localStorage.setItem(${JSON.stringify(SAVE_KEY)}, JSON.stringify(parsed));
        return true;
      })()`, as: "seed" },
    { nav: "/play/ch1/e5_pemahaman_baru", helpers: true },
    { wait: 1200 },
    { advanceUntil: { match: "Periksa urutan", max: 40 } },
    { wait: 300 },
    { capture: "window.__auto('Episode 5 selesai')", as: "step1" },
    { wait: 300 },
    { capture: "window.__auto('Episode 5 selesai')", as: "step2" },
    { wait: 300 },
    { capture: "window.__auto('Episode 5 selesai')", as: "step3" },
    { capture: `(() => {
        const main = document.querySelector("main") ?? document.body;
        const ols = [...main.querySelectorAll("ol")];
        return {
          url: location.pathname,
          olCount: ols.length,
          ols: ols.map((ol) => ({ buttons: ol.querySelectorAll("button").length, text: ol.innerText.replace(/\\s+/g, " ").trim().slice(0, 220) })),
          hasNaikkan: Boolean(main.querySelector("[aria-label^='Naikkan:']")),
          bodyHint: document.body.innerText.includes("Petunjuk"),
        };
      })()`, as: "dom" },
    { capture: `(() => {
        // buka petunjuk 2x periksa lalu lihat isi st.ordering
        const main = document.querySelector("main") ?? document.body;
        const click = (re) => { const b = [...main.querySelectorAll("button")].find((x) => re.test((x.innerText||"").trim()) && !x.disabled); if (b) { b.click(); return true; } return false; };
        click(/^Periksa urutan$/i); click(/^Periksa urutan$/i);
        return { afterChecks: window.__autoState };
      })()`, as: "checks" },
    { wait: 400 },
    { capture: `(() => { window.__auto("Episode 5 selesai"); return window.__autoState; })()`, as: "stateAfterAuto" },
    { wait: 300 },
    { capture: `(() => {
        const main = document.querySelector("main") ?? document.body;
        const ols = [...main.querySelectorAll("ol")];
        return { ols: ols.map((ol) => ({ buttons: ol.querySelectorAll("button").length, text: ol.innerText.replace(/\\s+/g, " ").trim().slice(0, 200) })) };
      })()`, as: "domAfter" },
  ],

  "debug-lines": [
    { nav: "/", helpers: true, clear: true },
    { wait: 500 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { nav: "/play/ch1/e1_kedatangan", helpers: true },
    { wait: 1200 },
    {
      capture: `(async () => {
        const out = [];
        for (let i = 0; i < 10; i++) {
          const t = window.__t.text();
          const line = (t.match(/Baris (\\d+) dari (\\d+)/) ?? [])[0] ?? null;
          const dialog = [...document.querySelectorAll("main p")].map((p) => p.innerText).find((x) => x && x.length > 20) ?? null;
          out.push({ i, line, dialog: dialog ? dialog.slice(0, 90) : null, body: t.slice(-160), hasDesa: t.includes("Sebuah desa"), prompt: t.includes("Bagaimana Tara mendekati desa") });
          window.__t.press(" ");
          await new Promise((r) => setTimeout(r, 260));
        }
        return out;
      })()`,
      as: "lines",
    },
  ],

  resume: [
    { nav: "/", helpers: true, clear: true },
    { wait: 600 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { nav: "/play/ch1/e1_kedatangan" },
    { wait: 1000 },
    // berhenti di tengah episode 1
    { advanceUntil: { match: "Sebuah desa. Kecil, tapi hidup", max: 12 } },
    { capture: "window.__t.saveState().episodeResume", as: "resumePoint" },
    // keluar lalu kembali
    { nav: "/home" },
    { wait: 600 },
    { nav: "/play/ch1/e1_kedatangan" },
    { wait: 1200 },
    { assert: "window.__t.phase().hasModal === true", label: "modal lanjutkan muncul" },
    { capture: "window.__t.text().slice(0, 300)", as: "modalText" },
    { assert: "/Lanjutkan dari titik terakhir/i.test(window.__t.text())", label: "judul modal benar" },
    { assert: "window.__t.text().includes('Menyimak percakapan di bawah') || window.__t.text().includes('Titik terakhir')", label: "titik terakhir disebut" },
    { assert: "!window.__t.text().includes('Cerita terhenti di tengah jalan')", label: "latar modal bukan galat" },
    { click: "Lanjutkan", exact: true },
    { wait: 600 },
    { assert: "window.__t.phase().hasModal === false", label: "modal tertutup" },
    { capture: "window.__t.text().slice(0, 200)", as: "afterResume" },
    // kembali ke awal saat diminta
    { nav: "/play/ch1/e1_kedatangan" },
    { wait: 1200 },
    { click: "Mulai dari awal" },
    { wait: 600 },
    { assert: "window.__t.text().includes('Langit timur masih pucat')", label: "mulai dari awal bekerja" },
  ],

  replay: [
    { nav: "/", helpers: true, clear: true },
    { wait: 600 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { nav: "/play/ch1/e1_kedatangan" },
    { autoplay: { match: "Episode 1 selesai", choice: 2 } },
    { capture: "window.__t.saveState().xp", as: "xpFirstRun" },
    { stash: ["window.__t.saveState().xp.knowledge", "xpAfterFirst"] },
    { click: "Ulangi episode ini" },
    { wait: 700 },
    { autoplay: { match: "Episode 1 selesai", choice: 2 } },
    { wait: 400 },
    { capture: "window.__t.text().slice(-420)", as: "replayEnd" },
    { assert: "/XP pengetahuan\\s*\\+0/i.test(window.__t.text())", label: "XP pengetahuan +0 saat ulang" },
    { assert: "/Episode ini kamu ulang/i.test(window.__t.text())", label: "catatan jujur saat ulang" },
    { assert: "window.__t.saveState().xp.knowledge === window.__stash.xpAfterFirst", label: "XP tidak bertambah saat ulang" },
    { capture: "window.__t.saveState().xp", as: "xpAfterReplay" },
  ],

  mobile: [
    { nav: "/", helpers: true, clear: true },
    { wait: 800 },
    { viewport: { width: 390, height: 844, mobile: true } },
    { wait: 600 },
    { capture: "({ w: innerWidth, h: innerHeight })", as: "viewport" },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { assert: "location.pathname === '/home'", label: "beranda" },
    { capture: "({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth })", as: "overflow" },
    { assert: "document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1", label: "tidak ada geser horizontal" },
    { capture: "document.querySelectorAll('nav button, nav a').length", as: "navCount" },
    { assert: "document.querySelectorAll('nav a, nav button').length >= 5", label: "navigasi bawah tersedia" },
    { capture: "getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()", as: "bgVar" },
    { assert: "getComputedStyle(document.querySelector('.panel') ?? document.body).backgroundColor.length > 0", label: "panel berwarna" },
  ],

  "reduced-motion": [
    { nav: "/", helpers: true },
    { capture: "(() => { try { localStorage.setItem('tara-nusantara-save-v1', JSON.stringify({ state: { ...(JSON.parse(localStorage.getItem('tara-nusantara-save-v1'))?.state ?? {}), onboardingComplete: true, settings: { ...(JSON.parse(localStorage.getItem('tara-nusantara-save-v1'))?.state?.settings ?? {}), animations: 'reduced' } }, version: 1 })); } catch (e) { return String(e); } return true; })()", as: "setReduced" },
    { nav: "/home" },
    { wait: 900 },
    { assert: "document.documentElement.dataset.motion === 'reduced'", label: "atribut data-motion=reduced" },
    { nav: "/play/ch1/e1_kedatangan" },
    { wait: 1000 },
    { assert: "document.documentElement.dataset.motion === 'reduced'", label: "story tetap reduced" },
    { assert: "window.__t.text().includes('Langit timur masih pucat')", label: "cerita tetap jalan" },
    { advanceUntil: { match: "Bagaimana Tara mendekati desa", max: 20 } },
    { capture: "window.__t.text().slice(0, 160)", as: "reducedChoice" },
    { press: "1" },
    { wait: 500 },
    { assert: "window.__t.saveState().flags.tone_careful === true", label: "pilihan tetap tercatat saat reduced" },
  ],

  "full-chapter": [
    { nav: "/", helpers: true, clear: true },
    { wait: 600 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    // Episode 1 — pilihan sikap (opsi 3: mulai dari wajah, bukan tempat)
    { nav: "/play/ch1/e1_kedatangan" },
    { autoplay: { match: "Episode 1 selesai", choice: 3 } },
    // Episode 2 — observasi
    { nav: "/play/ch1/e2_berkumpul" },
    { autoplay: { match: "Episode 2 selesai" } },
    // Episode 3 — tiga cabang pertanyaan
    { nav: "/play/ch1/e3_pilihan" },
    { autoplay: { match: "Episode 3 selesai", choice: 1 } },
    // Episode 4 — kuis, mencocokkan, observasi
    { nav: "/play/ch1/e4_petunjuk" },
    { autoplay: { match: "Episode 4 selesai" } },
    // Episode 5 — urutan, mendengar, refleksi
    { nav: "/play/ch1/e5_pemahaman_baru" },
    { autoplay: { match: "Episode 5 selesai" } },
    // Episode 6 — cabang pilihan
    { nav: "/play/ch1/e6_undangan" },
    { autoplay: { match: "Episode 6 selesai", choice: 2 } },
    // Episode 7 — refleksi & penutup bab
    { nav: "/play/ch1/e7_refleksi" },
    { autoplay: { match: "Bab 1 selesai|Jejak Pertama selesai" } },
    { capture: "window.__t.text().slice(0, 300)", as: "chapterEndTop" },
    { capture: "window.__t.saveState()", as: "finalSave" },
    { assert: "window.__t.saveState().completedEpisodes.length === 7", label: "7 episode selesai" },
    { assert: "window.__t.saveState().flags.chapter1_complete === true", label: "flag chapter1_complete" },
    { assert: "Object.values(window.__t.saveState().collection).filter((c) => c.found).length >= 10", label: "koleksi terkumpul" },
    { assert: "window.__t.saveState().journal.reflections.length >= 2", label: "refleksi tercatat" },
    { assert: "window.__t.saveState().xp.practice === 0", label: "XP praktik 0 (belum ada aktivitas nyata)" },
  ],

  "secondary-pages": [
    { nav: "/", helpers: true, clear: true },
    { wait: 700 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    // Benih progres: seluruh Bab 1 selesai + flag cerita yang membuka semua misi.
    {
      capture: `(() => {
        const key = ${JSON.stringify(SAVE_KEY)};
        const parsed = JSON.parse(localStorage.getItem(key));
        const state = parsed.state;
        state.completedEpisodes = ["e1_kedatangan", "e2_berkumpul", "e3_pilihan", "e4_petunjuk", "e5_pemahaman_baru", "e6_undangan", "e7_refleksi"];
        state.flags = { ...state.flags, tone_friendly: true, met_ndari: true, learned_greeting: true, asked_about_tradition: true, listened_to_tale: true, discovered_hidden_term: true, notebook_examined: true, offered_help: true, chapter1_complete: true };
        state.episodeResume = {};
        state.lastPlayed = null;
        localStorage.setItem(key, JSON.stringify(parsed));
        return { completedEpisodes: state.completedEpisodes.length, flags: Object.keys(state.flags).length };
      })()`,
      as: "seed",
    },

    /* ---------- Pusat misi ---------- */
    { nav: "/quests", helpers: true },
    { wait: 900 },
    { assert: "window.__t.text().includes('Misi untuk Tara')", label: "pusat misi tampil" },
    { assert: "window.__t.text().includes('Suara Pertama')", label: "misi praktik tampil" },
    { assert: "window.__t.text().includes('laporanmu sendiri')", label: "penjelasan XP jujur" },
    { assert: "window.__t.text().includes('Misi tersembunyi ditemukan: 2/2')", label: "hitungan misi tersembunyi nyata" },
    { click: "Misi praktik" },
    { wait: 500 },
    {
      assert:
        "window.__t.text().includes('Suara Pertama') && !window.__t.text().includes('Makna di Balik Bayangan')",
      label: "filter misi praktik menyaring daftar",
    },
    { click: "Semua" },
    { wait: 300 },

    /* ---------- Detail misi praktik: mulai → refleksi → pernyataan → selesai ---------- */
    { clickSel: 'a[href="/quests/pq_suara_pertama"]' },
    { waitFor: { expr: "location.pathname === '/quests/pq_suara_pertama'" } },
    { assert: "location.pathname === '/quests/pq_suara_pertama'", label: "buka misi dari daftar" },
    { assert: "window.__t.text().includes('laporan aktivitas nyata · tidak diverifikasi')", label: "label kejujuran misi" },
    { assert: "window.__t.text().includes('Misi ini siap dijalankan')", label: "status misi terbuka" },
    { click: "Mulai misi" },
    { waitFor: { expr: "window.__t.saveState().quests.pq_suara_pertama?.status === 'active'" } },
    { assert: "window.__t.saveState().quests.pq_suara_pertama?.status === 'active'", label: "misi berjalan" },
    {
      assert:
        "[...document.querySelectorAll('button')].find((b) => (b.innerText || '').trim() === 'Tandai selesai')?.disabled === true",
      label: "tombol selesai terkunci sebelum syarat lengkap",
    },
    { assert: "window.__t.text().includes('Tulis refleksi minimal 20 huruf')", label: "syarat refleksi dijelaskan" },
    { assert: "window.__t.text().includes('Tandai pernyataan bahwa kamu sudah mencoba')", label: "syarat pernyataan dijelaskan" },
    { type: ["textarea", "Aku mencoba tiga sapaan itu pelan-pelan; yang tersulit justru menahan tawa."] },
    { waitFor: { expr: "window.__t.saveState().quests.pq_suara_pertama?.reflection.includes('menahan tawa')" } },
    {
      assert: "window.__t.saveState().quests.pq_suara_pertama?.reflection.includes('menahan tawa')",
      label: "refleksi tersimpan di draf misi",
    },
    { clickSel: '[role="switch"]' },
    { waitFor: { expr: "window.__t.saveState().quests.pq_suara_pertama?.declared === true" } },
    { assert: "window.__t.saveState().quests.pq_suara_pertama?.declared === true", label: "pernyataan dicatat" },
    {
      assert:
        "[...document.querySelectorAll('button')].find((b) => (b.innerText || '').trim() === 'Tandai selesai')?.disabled === false",
      label: "tombol selesai terbuka setelah syarat lengkap",
    },
    { stash: ["window.__t.saveState().xp.knowledge", "knowledgeBefore"] },
    { click: "Tandai selesai" },
    { waitFor: { expr: "window.__t.saveState().quests.pq_suara_pertama?.status === 'completed'" } },
    { assert: "window.__t.saveState().quests.pq_suara_pertama?.status === 'completed'", label: "misi selesai" },
    { assert: "window.__t.saveState().quests.pq_suara_pertama?.method === 'laporan aktivitas'", label: "metode penyelesaian jujur" },
    { assert: "window.__t.saveState().xp.practice === 60", label: "XP praktik bertambah dari laporan sendiri" },
    { assert: "window.__t.saveState().xp.knowledge === window.__stash.knowledgeBefore", label: "XP pengetahuan tidak ikut bertambah" },
    { assert: "window.__t.saveState().flags.practice_greeting_done === true", label: "flag misi selesai" },
    { assert: "window.__t.saveState().collection.vocab_sugeng_rawuh?.found === true", label: "koleksi dari misi" },
    { assert: "window.__t.saveState().journal.entries.includes('j10_suara_pertama')", label: "jurnal dari misi" },
    { assert: "/misi selesai/i.test(window.__t.text()) && /laporanmu sendiri/i.test(window.__t.text())", label: "ringkasan selesai jujur" },

    /* ---------- Koleksi: tautan langsung ---------- */
    { nav: "/collection?item=vocab_sugeng_rawuh", helpers: true },
    { waitFor: { expr: "Boolean(document.querySelector('[role=\"dialog\"]'))" } },
    { assert: "document.querySelector('[role=\"dialog\"]')?.getAttribute('aria-label') === 'Sugeng rawuh'", label: "tautan langsung membuka panel catatan" },
    { assert: "window.__t.text().includes('Terdokumentasi umum')", label: "label keandalan tampil" },
    { assert: "/catatan sumber/i.test(window.__t.text())", label: "catatan sumber tampil" },

    /* ---------- Jurnal ---------- */
    { nav: "/journal", helpers: true },
    { waitFor: { expr: "window.__t.text().includes('Suara Pertama yang Keluar')" } },
    { assert: "window.__t.text().includes('Suara Pertama yang Keluar')", label: "catatan Tara dari misi muncul" },
    { click: "Refleksimu" },
    { waitFor: { expr: "window.__t.text().includes('Belum ada refleksi')" } },
    { assert: "window.__t.text().includes('Belum ada refleksi')", label: "refleksi misi tidak diaku sebagai refleksi jurnal" },
    { click: "Keputusan" },
    { waitFor: { expr: "window.__t.text().includes('Menyelesaikan misi: Suara Pertama')" } },
    { assert: "window.__t.text().includes('Menyelesaikan misi: Suara Pertama')", label: "keputusan menulis judul misi, bukan id" },

    /* ---------- Profil ---------- */
    { nav: "/profile", helpers: true },
    { wait: 900 },
    { assert: "window.__t.saveState().player.name === 'Sari'", label: "nama awal" },
    { type: ['input[autocomplete="off"]', "Sari Jaya"] },
    { click: "Simpan profil" },
    { waitFor: { expr: "window.__t.saveState().player.name === 'Sari Jaya'" } },
    { assert: "window.__t.saveState().player.name === 'Sari Jaya'", label: "nama profil tersimpan" },

    /* ---------- Pengaturan ---------- */
    { nav: "/settings", helpers: true },
    { wait: 900 },
    { assert: "document.documentElement.dataset.theme === 'night'", label: "tema awal malam" },
    { click: "Fajar" },
    { waitFor: { expr: "document.documentElement.dataset.theme === 'dawn'" } },
    { assert: "document.documentElement.dataset.theme === 'dawn'", label: "tema berubah ke fajar" },
    { assert: "window.__t.saveState().settings.theme === 'dawn'", label: "pilihan tema tersimpan" },

    /* ---------- Bantuan & tentang ---------- */
    { nav: "/help", helpers: true },
    { wait: 900 },
    { assert: "window.__t.text().includes('Kontrol papan tombol')", label: "bantuan memuat kontrol" },
    { clickSel: "summary", nth: 0 },
    { waitFor: { expr: "document.querySelectorAll('details[open]').length >= 1" } },
    { assert: "document.querySelectorAll('details[open]').length >= 1", label: "FAQ bisa dibuka" },
    { nav: "/about", helpers: true },
    { wait: 900 },
    { assert: "window.__t.text().includes('Status jujur')", label: "halaman tentang memuat status jujur" },
    { assert: "window.__t.text().includes('Kebijakan konten')", label: "kebijakan konten ada" },
  ],

  "divergent-paths": [
    { nav: "/", helpers: true, clear: true },
    { wait: 800 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    // Cerita awal seperti biasa.
    { nav: "/play/ch1/e1_kedatangan", helpers: true },
    { autoplay: { match: "Episode 1 selesai", choice: 1 } },
    { nav: "/play/ch1/e2_berkumpul" },
    { autoplay: { match: "Episode 2 selesai" } },
    // Episode 3 — pilihan inti (opsi 1: bertanya), lalu cabang "membiarkan dulu" (opsi 3).
    { nav: "/play/ch1/e3_pilihan" },
    { advanceUntil: { match: "Apa yang Tara lakukan sambil menunggu pertunjukan dimulai", max: 60 } },
    { press: "1" },
    { wait: 400 },
    { advanceUntil: { match: "Apa yang Tara lakukan dengan kata yang belum ia pahami", max: 60 } },
    { press: "3" },
    { wait: 500 },
    { capture: "window.__t.text().slice(0, 260)", as: "letGoReaction" },
    { assert: "window.__t.text().includes('Tara menutup bukunya')", label: "reaksi cabang membiarkan tampil" },
    { assert: "!window.__t.saveState().flags.discovered_hidden_term", label: "kata guyub tidak dicatat" },
    { assert: "!window.__t.saveState().quests.hq_kata_tertinggal", label: "misi tersembunyi belum terbuka" },
    { assert: "!window.__t.text().includes('Petunjuk tersembunyi tercatat')", label: "kartu hadiah jalur lain dilewati" },
    { autoplay: { match: "Episode 3 selesai" } },
    { assert: "window.__t.saveState().decisions.some((d) => d.answer === 'let_go')", label: "keputusan let_go tercatat" },
    { assert: "!window.__t.saveState().flags.discovered_hidden_term", label: "tetap tanpa catatan tersembunyi" },
    // Episode 4 & 5 harus tetap bisa diselesaikan tanpa petunjuk tersembunyi itu.
    { nav: "/play/ch1/e4_petunjuk" },
    { autoplay: { match: "Episode 4 selesai" } },
    { assert: "window.__t.saveState().completedEpisodes.includes('e4_petunjuk')", label: "episode 4 selesai di jalur berbeda" },
    { nav: "/play/ch1/e5_pemahaman_baru" },
    { autoplay: { match: "Episode 5 selesai" } },
    { assert: "window.__t.saveState().completedEpisodes.includes('e5_pemahaman_baru')", label: "episode 5 selesai di jalur berbeda" },
    // Episode 6 — cabang permainan (opsi 1), bukan bunyi (opsi 2) seperti biasanya.
    { nav: "/play/ch1/e6_undangan" },
    { advanceUntil: { match: "Apa yang Tara pilih pagi ini", max: 50 } },
    { press: "1" },
    { wait: 500 },
    { assert: "window.__t.text().includes('Tara mengikuti Ndari ke halaman belakang')", label: "reaksi cabang permainan tampil" },
    { assert: "window.__t.saveState().collection.game_engklek?.found !== true", label: "koleksi permainan belum ada sebelum cabangnya" },
    { autoplay: { match: "Episode 6 selesai" } },
    { assert: "window.__t.saveState().flags.chosen_game_branch === true", label: "flag cabang permainan" },
    { assert: "!window.__t.saveState().flags.chosen_gamelan_branch", label: "cabang bunyi tidak diambil" },
    { assert: "window.__t.saveState().collection.game_engklek?.found === true", label: "koleksi cabang permainan" },
    { assert: "window.__t.saveState().journal.entries.includes('j11_pagi_di_halaman')", label: "jurnal cabang permainan" },
    { assert: "window.__t.saveState().quests.sq_biji_petak?.status === 'available'", label: "misi cabang permainan terbuka" },
    // Penutup bab tetap bisa dicapai dari jalur ini.
    { nav: "/play/ch1/e7_refleksi" },
    { autoplay: { match: "Bab 1 selesai|Jejak Pertama selesai" } },
    { assert: "window.__t.saveState().flags.chapter1_complete === true", label: "bab 1 selesai dari jalur berbeda" },
    { assert: "window.__t.saveState().completedEpisodes.length === 7", label: "tujuh episode selesai" },
  ],

  "play-e1": [
    { nav: "/", helpers: true, clear: true },
    { wait: 600 },
    { type: ['input[autocomplete="off"]', "Sari"] },
    { click: "Mulai perjalanan" },
    { waitFor: { expr: "location.pathname === '/home'" } },
    { nav: "/play/ch1/e1_kedatangan", helpers: true },
    { wait: 1200 },
    { capture: "window.__t.text().slice(0, 240)", as: "opening" },
    { assert: "window.__t.text().includes('Langit timur masih pucat')", label: "n1 baris 1 tampil" },
    // maju sampai prompt pilihan e1-n3
    { advanceUntil: { match: "Bagaimana Tara mendekati desa", max: 20 } },
    { capture: "window.__t.text().slice(0, 400)", as: "atChoice" },
    { assert: "window.__t.text().includes('Bertengger di pohon besar')", label: "opsi 1 tampil" },
    { assert: "window.__t.text().includes('Terbang langsung ke halaman desa')", label: "opsi 2 tampil" },
    // pilih opsi 2: terjun langsung (tone_bold)
    { press: "2" },
    { wait: 500 },
    { capture: "window.__t.text().slice(0, 260)", as: "reactionText" },
    { assert: "window.__t.saveState().flags.tone_bold === true", label: "flag tone_bold" },
    { assert: "window.__t.saveState().flags.tone_careful !== true", label: "tone_careful tidak diambil" },
    { capture: "window.__t.saveState().decisions[0] ?? null", as: "firstDecision" },
    { click: "Lanjutkan cerita" },
    { wait: 500 },
    { capture: "window.__t.text().slice(0, 260)", as: "n4bText" },
    { assert: "/berdebum|debu/i.test(window.__t.text())", label: "adegan n4b (terjun) tampil" },
    { assert: "!/beringin/i.test(window.__t.text())", label: "adegan n4a (mengamati) dilewati" },
    // lanjut sampai akhir episode 1
    { advanceUntil: { match: "Episode 1 selesai", max: 60 } },
    { capture: "window.__t.text().slice(-500)", as: "episodeEndText" },
    { capture: "window.__t.saveState()", as: "saveAfterE1" },
    { assert: "window.__t.saveState().completedEpisodes.includes('e1_kedatangan')", label: "episode 1 selesai" },
    { assert: "window.__t.saveState().collection.vocab_ringgit?.found === true", label: "koleksi vocab_ringgit" },
    { assert: "window.__t.saveState().journal.entries.includes('j1_hari_pertama')", label: "jurnal j1_hari_pertama" },
    { assert: "window.__t.saveState().flags.met_ndari === true", label: "flag met_ndari" },
    { assert: "window.__t.saveState().xp.knowledge > 0", label: "XP pengetahuan bertambah" },
  ],
};

/* ---------- pelaksana ---------- */

async function main() {
  const wsUrl = await waitForTarget();
  const ws = new WebSocket(wsUrl);
  const events = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
      return;
    }
    events.push(msg);
  });
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

  await send(ws, "Runtime.enable");
  await send(ws, "Log.enable");
  await send(ws, "Page.enable");
  await send(ws, "Network.enable");

  const consoleErrors = [];
  const failedRequests = [];
  const badResponses = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? a.type).join(" ").slice(0, 300));
    }
    if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      consoleErrors.push(`[exception] ${d.text} ${d.exception?.description ?? ""}`.slice(0, 400));
    }
    if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
      consoleErrors.push(`[log] ${msg.params.entry.text}`.slice(0, 300));
    }
    if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400) {
      badResponses.push(`${msg.params.response.status} ${msg.params.response.url}`.slice(0, 200));
    }
    if (msg.method === "Network.loadingFailed" && !msg.params.canceled) {
      failedRequests.push(`${msg.params.type} ${msg.params.errorText}`);
    }
  });

  const evaluate = async (expression) => {
    const result = await send(ws, "Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      return { __error: result.exceptionDetails.text + " " + (result.exceptionDetails.exception?.description ?? "") };
    }
    return result.result.value;
  };

  const runRaw = async (expression) => {
    const value = await evaluate(expression);
    return value;
  };

  const steps = [];
  let failed = 0;

  const nav = async (path) => {
    await send(ws, "Page.navigate", { url: `${BASE}${path}` });
    await delay(600);
    await evaluate(`(() => { ${STEP_HELPERS} })()`);
  };

  const runStep = async (step) => {
    if (step.nav) {
      if (step.clear) {
        await nav(step.nav);
        await evaluate(EMPTY_STORAGE);
        await nav(step.nav);
      } else {
        await nav(step.nav);
      }
      if (step.helpers) await evaluate(`(() => { ${STEP_HELPERS} })()`);
      await delay(step.wait ?? 700);
      await evaluate(`(() => { ${STEP_HELPERS} })()`);
      return { step, ok: true, info: `nav ${step.nav}` };
    }
    if (step.type) {
      const [sel, value] = step.type;
      let res;
      // Halaman bisa belum selesai hidrasi setelah navigasi; coba lagi sebentar.
      for (let attempt = 0; attempt < 10; attempt += 1) {
        res = await evaluate(`window.__t.setValue(${JSON.stringify(sel)}, ${JSON.stringify(value)})`);
        if (res?.ok) break;
        await delay(400);
      }
      const ok = Boolean(res?.ok);
      if (!ok) failed += 1;
      return { step: "type", ok, info: res };
    }
    if (step.click) {
      let res;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        res = await evaluate(
          `window.__t.clickText(${JSON.stringify(step.click)}, ${JSON.stringify({ exact: step.exact ?? false, within: step.within })})`,
        );
        if (res?.ok) break;
        await delay(400);
      }
      const ok = Boolean(res?.ok);
      if (!ok) failed += 1;
      return { step: `click ${step.click}`, ok, info: res };
    }
    if (step.clickSel) {
      let res;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        res = await evaluate(
          `window.__t.clickSel(${JSON.stringify(step.clickSel)}, ${step.nth ?? 0})`,
        );
        if (res?.ok) break;
        await delay(400);
      }
      const ok = Boolean(res?.ok);
      if (!ok) failed += 1;
      return { step: `clickSel ${step.clickSel}`, ok, info: res };
    }
    if (step.clickAll) {
      const res = await evaluate(`window.__t.clickAll(${JSON.stringify(step.clickAll)})`);
      return { step: `clickAll ${step.clickAll}`, ok: Boolean(res?.ok), info: res };
    }
    if (step.press) {
      await evaluate(`window.__t.press(${JSON.stringify(step.press)})`);
      await delay(step.wait ?? 120);
      return { step: `press ${step.press}`, ok: true };
    }
    if (step.viewport) {
      const { width, height, mobile: isMobile = false } = step.viewport;
      await send(ws, "Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: isMobile ? 2 : 1,
        mobile: isMobile,
      });
      await delay(400);
      return { step: `viewport ${width}x${height}`, ok: true };
    }
    if (step.stash) {
      const [expr, name] = step.stash;
      const res = await runRaw(`(() => { window.__stash = window.__stash || {}; window.__stash[${JSON.stringify(name)}] = (${expr}); return window.__stash[${JSON.stringify(name)}]; })()`);
      return { step: `stash ${name}`, ok: res !== undefined, info: { [name]: res } };
    }
    if (step.autoplay) {
      const { match, max = 400, choice = 1, settle = 260 } = step.autoplay;
      const actions = {};
      let done = false;
      let idleStreak = 0;
      for (let i = 0; i < max; i += 1) {
        const action = await runRaw(`window.__auto(${JSON.stringify(match)}, ${JSON.stringify({ choice })})`);
        const key = typeof action === "string" ? action : "error";
        actions[key] = (actions[key] ?? 0) + 1;
        if (key === "done") {
          done = true;
          break;
        }
        if (key === "idle" || key === "error") {
          idleStreak += 1;
          if (idleStreak > 6) break;
        } else {
          idleStreak = 0;
        }
        await delay(settle);
      }
      if (!done) failed += 1;
      const tail = done ? undefined : await runRaw("window.__t.text().slice(-350)");
      return { step: `autoplay /${match}/`, ok: done, info: { actions, tail } };
    }
    if (step.advanceUntil) {
      const { match, max = 40, press = " " } = step.advanceUntil;
      let found = false;
      let clicks = 0;
      let stalls = 0;
      let lastSignature = "";
      for (let i = 0; i < max; i += 1) {
        const probe = await runRaw(
          `({ hit: new RegExp(${JSON.stringify(match)}, "i").test(window.__t.text()),
              sig: (window.__t.text().match(/Baris \\d+ dari \\d+/) ?? [""])[0] + "|" + window.__t.text().length })`,
        );
        if (probe?.hit) {
          found = true;
          break;
        }
        // Layar yang hanya bisa dilanjutkan dengan klik (kartu konsekuensi, hadiah).
        if (probe?.sig === lastSignature) {
          const clicked = await runRaw(
            `(() => {
               const scope = document.querySelector("main") ?? document;
               const btn = [...scope.querySelectorAll("button")].find((b) => /^(Lanjut|Lanjutkan cerita)$/i.test((b.innerText || "").trim()));
               if (!btn) return null;
               btn.click();
               return (btn.innerText || "").trim();
             })()`,
          );
          if (clicked) {
            clicks += 1;
            lastSignature = "";
            await delay(step.wait ?? 320);
            continue;
          }
        }
        lastSignature = probe?.sig ?? "";
        await evaluate(`window.__t.press(${JSON.stringify(press)})`);
        stalls += 1;
        await delay(step.wait ?? 220);
      }
      if (!found) failed += 1;
      let hint;
      if (!found) hint = await runRaw("window.__t.text().slice(-320)");
      return {
        step: `advanceUntil /${match}/`,
        ok: found,
        info: found ? { presses: stalls, clicks } : { text: hint },
      };
    }
    if (step.wait) {
      await delay(step.wait);
      return { step: `wait ${step.wait}`, ok: true };
    }
    if (step.waitFor) {
      const { expr, max = 10000, interval = 300 } = step.waitFor;
      const deadline = Date.now() + max;
      let value = false;
      while (Date.now() < deadline) {
        value = (await runRaw(`Boolean(${expr})`)) === true;
        if (value) break;
        await delay(interval);
      }
      if (!value) failed += 1;
      const hint = value ? undefined : await runRaw("window.__t?.text?.().slice(0, 200) ?? location.href");
      return { step: `waitFor ${expr}`, ok: value, info: value ? undefined : { text: hint } };
    }
    if (step.capture) {
      const value = await runRaw(step.capture);
      return { step: `capture ${step.as ?? "value"}`, ok: value !== undefined, info: { [step.as ?? "value"]: value } };
    }
    if (step.assert) {
      const value = await runRaw(`Boolean(${step.assert})`);
      const ok = value === true;
      if (!ok) failed += 1;
      let hint;
      if (!ok) hint = await runRaw("window.__t.text().slice(0, 300)");
      return { step: `assert ${step.label ?? step.assert}`, ok, info: ok ? undefined : { text: hint } };
    }
    return { step: "tidak dikenal", ok: false, info: step };
  };

  const list = SCENARIOS[scenarioName];
  if (!list) throw new Error(`Skenario tidak dikenal: ${scenarioName}`);

  for (const step of list) {
    const res = await runStep(step);
    steps.push(res);
    if (process.env.SMOKE_VERBOSE) {
      console.error(JSON.stringify(res));
    }
  }

  const report = {
    base: BASE,
    scenario: scenarioName,
    failed,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 10),
    failedRequests: [...new Set(failedRequests)].slice(0, 10),
    badResponses: [...new Set(badResponses)].slice(0, 10),
    steps,
  };
  console.log(JSON.stringify(report, null, 2));

  ws.close();
  chrome.kill();
  process.exit(failed > 0 || consoleErrors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("GAGAL:", error.message);
  chrome.kill();
  process.exit(2);
});
