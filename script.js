/* ================================================================
   Das geheimnisvolle Mathe-Zimmer – Spiellogik
   ================================================================ */
(() => {
  'use strict';

  // ---------------------------------------------------------------
  // 1. Die Rätsel
  //    answer: die richtige Zahl
  //    question: HTML (darf kleine SVG-Grafiken enthalten)
  // ---------------------------------------------------------------
  const PUZZLES = {
    sequence: {
      order: 1,
      icon: '📚',
      category: 'Zahlenfolge',
      title: 'Die Bücher-Reihe',
      question: `
        <p>Auf den Buchrücken im Regal stehen Zahlen – nur das letzte Buch ist unleserlich:</p>
        <p class="text-center font-display text-2xl tracking-wide text-gold-300">2 · 6 · 12 · 20 · 30 · <span class="text-pink-300">?</span></p>
        <p>Welche Zahl gehört auf das letzte Buch?</p>`,
      hint: 'Schau dir die Abstände zwischen den Zahlen an: +4, +6, +8 … Oder: 1·2, 2·3, 3·4 …',
      answer: 42,
    },

    painting: {
      order: 2,
      icon: '🖼️',
      category: 'Geometrie',
      title: 'Das Rechteck im Bild',
      question: `
        <p>Im Gemälde ist ein lila Rechteck versteckt. Auf der Rückseite steht:</p>
        <blockquote class="border-l-4 border-violet-400 pl-3 italic text-slate-300">
          „Mein Umfang beträgt <strong>30 cm</strong>. Ich bin doppelt so lang wie breit.“
        </blockquote>
        <svg class="puzzle-figure" viewBox="0 0 260 120" aria-hidden="true">
          <rect x="40" y="20" width="180" height="80" fill="rgba(167,139,250,.2)" stroke="#a78bfa" stroke-width="3"/>
          <text x="130" y="14" fill="#e2e8f0" font-size="14" text-anchor="middle">2·b</text>
          <text x="28" y="65" fill="#e2e8f0" font-size="14" text-anchor="middle">b</text>
        </svg>
        <p>Wie groß ist der <strong>Flächeninhalt</strong> des Rechtecks (in cm²)?</p>`,
      hint: 'Umfang = 2·Länge + 2·Breite = 2·(2b) + 2·b = 6b. Wenn 6b = 30 ist, wie groß ist b?',
      answer: 50,
    },

    clock: {
      order: 3,
      icon: '🕰️',
      category: 'Winkel',
      title: 'Die stehengebliebene Uhr',
      question: `
        <p>Die Wanduhr ist um genau <strong>15:30 Uhr</strong> stehen geblieben.</p>
        <svg class="puzzle-figure" viewBox="0 0 120 120" style="max-width:140px" aria-hidden="true">
          <circle cx="60" cy="60" r="54" fill="#fffbeb" stroke="#7c4a24" stroke-width="6"/>
          <g fill="#1f2937" font-size="12" text-anchor="middle" font-weight="700">
            <text x="60" y="20">12</text><text x="103" y="64">3</text><text x="60" y="108">6</text><text x="17" y="64">9</text>
          </g>
          <line x1="60" y1="60" x2="60" y2="100" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
          <line x1="60" y1="60" x2="89" y2="68" stroke="#b91c1c" stroke-width="5" stroke-linecap="round"/>
          <circle cx="60" cy="60" r="4" fill="#1f2937"/>
        </svg>
        <p>Wie groß ist der <strong>kleinere Winkel</strong> zwischen Stunden- und Minutenzeiger (in Grad)?</p>`,
      hint: 'Achtung: Der Stundenzeiger steht nicht genau auf der 3! In 60 Minuten wandert er 30°, in 30 Minuten also 15°.',
      answer: 75,
    },

    snail: {
      order: 4,
      icon: '🐌',
      category: 'Logik',
      title: 'Die fleißige Schnecke',
      question: `
        <p>Eine Schnecke sitzt am Boden eines <strong>10 m</strong> tiefen Brunnens.</p>
        <p>Jeden Tag kriecht sie <strong>3 m</strong> nach oben, jede Nacht rutscht sie im Schlaf <strong>2 m</strong> wieder hinunter.</p>
        <p>An welchem <strong>Tag</strong> erreicht sie zum ersten Mal den oberen Rand?</p>`,
      hint: 'Pro Tag-Nacht-Runde schafft sie nur 1 m. Aber: Wenn sie tagsüber oben ankommt, rutscht sie nicht mehr zurück!',
      answer: 8,
    },

    chest: {
      order: 5,
      icon: '💰',
      category: 'Logik-Code',
      title: 'Das Zahlenschloss',
      question: `
        <p>Die Truhe hat ein Schloss mit einem <strong>dreistelligen Code</strong>. Ein Zettel verrät:</p>
        <ul class="list-disc pl-5 space-y-1 text-slate-300">
          <li>Die erste Ziffer ist <strong>doppelt so groß</strong> wie die letzte.</li>
          <li>Die mittlere Ziffer ist um <strong>1 größer</strong> als die erste.</li>
          <li>Die Quersumme (Summe aller Ziffern) ist <strong>16</strong>.</li>
        </ul>
        <p>Wie lautet der Code?</p>`,
      hint: 'Nenne die letzte Ziffer x. Dann ist die erste 2x und die mittlere 2x + 1. Zusammen: 5x + 1 = 16.',
      answer: 673,
    },
  };

  const IDS = Object.keys(PUZZLES).sort((a, b) => PUZZLES[a].order - PUZZLES[b].order);
  const TOTAL = IDS.length;
  const STORAGE_KEY = 'mathe-zimmer-progress-v1';

  // ---------------------------------------------------------------
  // 2. Zustand (wird im Browser gespeichert, falls möglich)
  // ---------------------------------------------------------------
  let solved = new Set(loadProgress());

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter((id) => id in PUZZLES) : [];
    } catch {
      return [];
    }
  }
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved])); } catch { /* egal */ }
  }

  // ---------------------------------------------------------------
  // 3. DOM-Elemente
  // ---------------------------------------------------------------
  const $ = (sel) => document.querySelector(sel);
  const room        = $('#room');
  const modal       = $('#modal');
  const form        = $('#answer-form');
  const input       = $('#answer-input');
  const submitBtn   = form.querySelector('button[type="submit"]');
  const feedback    = $('#feedback');
  const hintBox     = $('#hint-box');
  const progressEl  = $('#progress-count');
  const progressBar = $('#progress-bar');
  const progressFill= $('#progress-fill');
  const dotsEl      = $('#progress-dots');
  const winBanner   = $('#win-banner');
  const hintToggle  = $('#hint-toggle');

  let currentId = null;
  let lastFocused = null;
  let closeTimer = null;

  // Fortschritts-Kacheln erzeugen
  IDS.forEach((id) => {
    const li = document.createElement('li');
    li.className = 'progress-dot rounded-lg bg-white/5 py-1.5 px-1 truncate';
    li.dataset.id = id;
    li.innerHTML = `<span aria-hidden="true">${PUZZLES[id].icon}</span> <span class="hidden sm:inline">${PUZZLES[id].category}</span>`;
    li.title = PUZZLES[id].title;
    dotsEl.appendChild(li);
  });

  // ---------------------------------------------------------------
  // 4. Antwort prüfen
  //    Akzeptiert z. B. "75", "75°", "75 Grad", "50 cm²", "Tag 8", "6,0"
  // ---------------------------------------------------------------
  function parseAnswer(text) {
    const match = String(text).replace(',', '.').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  }

  function checkAnswer(e) {
    e.preventDefault();
    if (!currentId || solved.has(currentId)) return;

    const value = parseAnswer(input.value);
    input.classList.remove('correct', 'wrong');
    feedback.classList.remove('correct', 'wrong');
    void input.offsetWidth; // Animation neu starten

    if (Number.isNaN(value)) {
      setFeedback('wrong', 'Bitte gib eine Zahl ein. 🙂');
      return;
    }

    if (Math.abs(value - PUZZLES[currentId].answer) < 1e-9) {
      setFeedback('correct', randomItem(['Richtig! 🎉', 'Super gemacht! ✅', 'Genau! Weiter so! 🌟']));
      markSolved(currentId);
      input.disabled = true;
      submitBtn.disabled = true;
      closeTimer = setTimeout(closeModal, 1300);
    } else {
      setFeedback('wrong', randomItem(['Leider falsch – versuch es nochmal! ❌', 'Nicht ganz… 🤔 Schau dir den Tipp an.', 'Fast! Probier es noch einmal. 🔁']));
      input.select();
    }
  }

  function setFeedback(type, text) {
    input.classList.add(type);
    feedback.classList.add(type);
    feedback.textContent = text;
  }

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ---------------------------------------------------------------
  // 5. Fortschritt & Raum aktualisieren
  // ---------------------------------------------------------------
  function markSolved(id) {
    solved.add(id);
    saveProgress();
    render();
    if (solved.size === TOTAL) setTimeout(celebrate, 1500);
  }

  function render() {
    const count = solved.size;
    progressEl.textContent = count;
    progressFill.style.width = `${(count / TOTAL) * 100}%`;
    progressBar.setAttribute('aria-valuenow', count);

    dotsEl.querySelectorAll('.progress-dot').forEach((li) => {
      li.classList.toggle('solved', solved.has(li.dataset.id));
    });

    room.querySelectorAll('.hotspot').forEach((el) => {
      const id = el.dataset.puzzle;
      const isSolved = solved.has(id);
      el.classList.toggle('solved', isSolved);
      const badge = el.querySelector('.badge-wrap');
      if (isSolved && !badge) addBadge(el);
      if (!isSolved && badge) badge.remove();
    });

    // Lämpchen an der Tür
    room.querySelectorAll('#door-locks circle').forEach((c, i) => c.classList.toggle('on', i < count));
  }

  // Grünes Häkchen an der Stelle des Hotspots
  function addBadge(hotspot) {
    const marker = hotspot.querySelector('.hint-marker');
    const NS = 'http://www.w3.org/2000/svg';
    const wrap = document.createElementNS(NS, 'g');
    wrap.setAttribute('class', 'badge-wrap');
    wrap.setAttribute('transform', marker.getAttribute('transform'));
    wrap.innerHTML = `
      <g class="solved-badge">
        <circle r="15" fill="#22c55e" stroke="#fff" stroke-width="3"/>
        <path d="M-7 0 L-2 6 L8 -6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
    hotspot.appendChild(wrap);
  }

  // ---------------------------------------------------------------
  // 6. Modal öffnen / schließen
  // ---------------------------------------------------------------
  function openModal(id) {
    const p = PUZZLES[id];
    if (!p) return;
    clearTimeout(closeTimer);
    currentId = id;
    lastFocused = document.activeElement;

    $('#modal-icon').textContent = p.icon;
    $('#modal-category').textContent = `Rätsel ${p.order} · ${p.category}`;
    $('#modal-title').textContent = p.title;
    $('#modal-question').innerHTML = p.question;
    $('#modal-hint').textContent = p.hint;
    hintBox.open = false;

    input.classList.remove('correct', 'wrong');
    feedback.classList.remove('correct', 'wrong');
    feedback.textContent = '';

    const isSolved = solved.has(id);
    input.value = isSolved ? p.answer : '';
    input.disabled = isSolved;
    submitBtn.disabled = isSolved;
    if (isSolved) setFeedback('correct', 'Dieses Rätsel hast du schon gelöst! ✅');

    modal.classList.remove('closing');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => (isSolved ? modal.querySelector('[data-close].rounded-full') : input).focus(), 50);
  }

  function closeModal() {
    if (!modal.classList.contains('open') || modal.classList.contains('closing')) return;
    clearTimeout(closeTimer);
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentId = null;
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }, 200);
  }

  // Fokus im Modal halten (Tastatur-Bedienung)
  function trapFocus(e) {
    if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
    const focusables = [...modal.querySelectorAll('button, input, summary')].filter((el) => !el.disabled);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---------------------------------------------------------------
  // 7. Erfolg!
  // ---------------------------------------------------------------
  function celebrate() {
    closeModal();
    room.classList.add('door-open');
    winBanner.classList.remove('hidden');
    fireConfetti();
  }

  function fireConfetti() {
    if (typeof window.confetti !== 'function') return;
    const colors = ['#fbbf24', '#f472b6', '#a78bfa', '#4ade80', '#38bdf8'];
    const end = Date.now() + 2500;
    (function frame() {
      window.confetti({ particleCount: 6, angle: 60,  spread: 60, origin: { x: 0, y: 0.7 }, colors });
      window.confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    window.confetti({ particleCount: 160, spread: 100, startVelocity: 45, origin: { y: 0.55 }, colors });
  }

  function resetGame() {
    solved = new Set();
    saveProgress();
    room.classList.remove('door-open');
    winBanner.classList.add('hidden');
    render();
  }

  // ---------------------------------------------------------------
  // 8. Event-Listener
  // ---------------------------------------------------------------
  room.querySelectorAll('.hotspot').forEach((el) => {
    el.addEventListener('click', () => openModal(el.dataset.puzzle));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el.dataset.puzzle); }
    });
  });

  form.addEventListener('submit', checkAnswer);
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    trapFocus(e);
  });

  hintToggle.addEventListener('click', () => {
    const on = room.classList.toggle('show-hints');
    hintToggle.setAttribute('aria-pressed', String(on));
    hintToggle.textContent = on ? '🙈 Verstecke ausblenden' : '✨ Verstecke zeigen';
  });

  $('#reset-btn').addEventListener('click', () => {
    if (solved.size === 0 || confirm('Wirklich neu starten? Dein Fortschritt geht verloren.')) resetGame();
  });
  $('#play-again').addEventListener('click', resetGame);

  // Start
  render();
  if (solved.size === TOTAL) {
    room.classList.add('door-open');
    winBanner.classList.remove('hidden');
  }
})();
