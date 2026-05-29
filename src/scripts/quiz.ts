/* ═══════════════════════════════════════════════════════════════════════
   CODEX ARCANUM — the Sorting Rite island + the school modal
   The one interactive piece of the otherwise-static Arcana page. Reads its
   data from <script type="application/json"> payloads rendered by Quiz.astro,
   drives the question→result state machine, and opens the shared school modal
   (also used by the school cards and the triad-band scroll). Sigils are pulled
   from the #sigil-{id} sprite (SigilSprite.astro).
   ═══════════════════════════════════════════════════════════════════════ */

type SchoolId = string;
type TriadId = string;
type WeightMap = Record<SchoolId, number>;
interface QuizQuestion {
  q: string;
  answers: { t: string; w: WeightMap }[];
}
interface School {
  id: SchoolId;
  name: string;
  triad: TriadId;
  role: string;
  desc: string;
  flavour: string;
}
interface Triad {
  roman: string;
  name: string;
  en: string;
  schools: string[];
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const romanize = (n: number) => ROMAN[n] ?? String(n);

function readJSON<T>(id: string): T {
  const el = document.getElementById(id);
  return JSON.parse(el?.textContent ?? "null") as T;
}

const sigilUse = (id: SchoolId) =>
  `<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#sigil-${id}"/></svg>`;

/* ── modal (shared) ────────────────────────────────────────────────────── */

let SCHOOLS: School[] = [];
let TRIADS: Record<TriadId, Triad> = {};
let lastFocused: HTMLElement | null = null;
let modalBack: HTMLElement | null = null;
let modalEl: HTMLElement | null = null;

function trapFocus(e: KeyboardEvent) {
  if (e.key !== "Tab" || !modalEl) return;
  const focusable = modalEl.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openModal(schoolId: SchoolId, trigger?: HTMLElement | null) {
  const s = SCHOOLS.find((x) => x.id === schoolId);
  if (!s || !modalBack || !modalEl) return;
  const t = TRIADS[s.triad];
  lastFocused = trigger ?? (document.activeElement as HTMLElement | null);

  modalEl.innerHTML = `
    <button class="close" aria-label="Close">✕</button>
    <div class="frame-deco tl"><svg aria-hidden="true"><use href="#corner-orn"/></svg></div>
    <div class="frame-deco tr"><svg aria-hidden="true"><use href="#corner-orn"/></svg></div>
    <div class="frame-deco bl"><svg aria-hidden="true"><use href="#corner-orn"/></svg></div>
    <div class="frame-deco br"><svg aria-hidden="true"><use href="#corner-orn"/></svg></div>
    <div class="triad-tag">Triad ${t.roman} · ${t.name} · ${t.en}</div>
    <div class="nm" id="modal-title">${s.name}</div>
    <div class="role">${s.role}</div>
    <div class="sigil-row">
      <div class="sg">${sigilUse(s.id)}</div>
      <div class="pl">
        <strong>Sigillum</strong>
        Each school is taught and remembered by its own sigil. Apprentices copy it ten thousand times before they are permitted its first working.
      </div>
    </div>
    <h4>Definition</h4>
    <p>${s.desc}</p>
    <h4>Words of the Masters</h4>
    <p class="flavour">${s.flavour}</p>
    <h4>Kindred Schools</h4>
    <p>Within the triad of <em>${t.name}</em>, ${s.name} stands alongside ${t.schools
      .filter((x) => x !== s.name)
      .join(" and ")}.</p>
  `;
  modalEl.setAttribute("aria-labelledby", "modal-title");
  modalBack.classList.add("open");
  document.body.style.overflow = "hidden";
  modalEl.querySelector<HTMLButtonElement>(".close")?.addEventListener("click", closeModal);
  (modalEl.querySelector<HTMLElement>(".close") ?? modalEl).focus();
  document.addEventListener("keydown", trapFocus);
}

function closeModal() {
  if (!modalBack) return;
  modalBack.classList.remove("open");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", trapFocus);
  lastFocused?.focus();
  lastFocused = null;
}

/* ── quiz ──────────────────────────────────────────────────────────────── */

export function mountQuiz() {
  const QUIZ = readJSON<QuizQuestion[]>("quiz-data");
  SCHOOLS = readJSON<School[]>("school-data");
  TRIADS = readJSON<Record<TriadId, Triad>>("triad-data");
  if (!QUIZ || !SCHOOLS) return;

  const quizBody = document.getElementById("quiz-body");
  if (!quizBody) return;

  // wire up the modal chrome
  modalBack = document.getElementById("modal-back");
  modalEl = document.getElementById("modal");
  modalBack?.addEventListener("click", (e) => {
    if (e.target === modalBack) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // school cards → open modal
  document.querySelectorAll<HTMLElement>(".school-card[data-school]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.school as string, card));
  });
  // triad cards → scroll to band
  document.querySelectorAll<HTMLElement>(".triad-card[data-band]").forEach((card) => {
    card.addEventListener("click", () => {
      document.getElementById(`band-${card.dataset.band}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  let idx = 0;
  const answers: WeightMap[] = [];

  function renderQuiz() {
    if (!quizBody) return;
    if (idx >= QUIZ.length) return renderResult();
    const q = QUIZ[idx];
    const total = QUIZ.length;
    const steps = Array.from({ length: total }, (_, i) => {
      if (i < idx) return '<span class="step done"></span>';
      if (i === idx) return '<span class="step curr"></span>';
      return '<span class="step"></span>';
    }).join("");

    quizBody.innerHTML = `
      <div class="quiz-stage">
        <div class="quiz-progress">${steps}</div>
        <div class="quiz-counter">Question ${romanize(idx + 1)} of ${romanize(total)}</div>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-answers">
          ${q.answers
            .map(
              (a, ai) => `
            <button class="quiz-answer" type="button" data-idx="${ai}">
              <span class="marker">${String.fromCharCode(65 + ai)}</span>
              <span>${a.t}</span>
            </button>`,
            )
            .join("")}
        </div>
        <div class="quiz-nav">
          <button type="button" id="quiz-back" ${idx === 0 ? "disabled" : ""}>← Previous</button>
          <span></span>
        </div>
      </div>`;

    quizBody.querySelectorAll<HTMLButtonElement>(".quiz-answer").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[idx] = q.answers[Number(btn.dataset.idx)].w;
        idx++;
        renderQuiz();
      });
    });
    document.getElementById("quiz-back")?.addEventListener("click", () => {
      if (idx > 0) {
        idx--;
        renderQuiz();
      }
    });
  }

  function renderResult() {
    if (!quizBody) return;
    const totals: Record<SchoolId, number> = {};
    SCHOOLS.forEach((s) => (totals[s.id] = 0));
    answers.forEach((w) => {
      for (const k in w) totals[k] = (totals[k] || 0) + w[k];
    });
    const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const top = SCHOOLS.find((s) => s.id === ranked[0][0])!;
    const second = SCHOOLS.find((s) => s.id === ranked[1][0])!;
    const t = TRIADS[top.triad];

    quizBody.innerHTML = `
      <div class="quiz-stage result-stage">
        <div class="pre">The Codex has spoken</div>
        <div class="sigil">${sigilUse(top.id)}</div>
        <div class="nm">${top.name}</div>
        <div class="triad">Triad ${t.roman} · ${t.name} — ${t.en}</div>
        <div class="blurb">${top.desc}</div>
        <div class="flavour">${top.flavour}</div>
        <div class="alt">
          <strong>Second Affinity</strong><br/>
          <em>${second.name}</em> — ${second.role}
        </div>
        <div class="quiz-nav">
          <button type="button" class="restart" id="quiz-restart">↺ Begin the rite anew</button>
          <button type="button" id="quiz-readmore" data-school="${top.id}">Read full entry →</button>
        </div>
      </div>`;

    document.getElementById("quiz-restart")?.addEventListener("click", () => {
      idx = 0;
      answers.length = 0;
      renderQuiz();
    });
    document.getElementById("quiz-readmore")?.addEventListener("click", (e) => {
      const trigger = e.currentTarget as HTMLElement;
      openModal(trigger.dataset.school as string, trigger);
    });
  }

  renderQuiz();
}
