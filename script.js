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
        <p class="text-center font-display text-2xl tracking-wide text-gold-300">12 · −6 · 3 · −1,5 · 0,75 · <span class="text-pink-300">?</span></p>
        <p>Welche Zahl gehört auf das letzte Buch? <span class="text-slate-400">(als Bruch oder Dezimalzahl)</span></p>`,
      hint: 'Von Buch zu Buch wird immer mit derselben Zahl multipliziert. 12 · ? = −6. Achte auf das Vorzeichen!',
      answer: -0.375, // −3/8
    },

    painting: {
      order: 2,
      icon: '🖼️',
      category: 'Bruchrechnen',
      title: 'Das Rechteck im Bild',
      question: `
        <p>Im Gemälde ist ein lila Rechteck versteckt. Auf der Rückseite steht, wie groß es in Wirklichkeit ist:</p>
        <svg class="puzzle-figure" viewBox="0 0 260 130" aria-hidden="true">
          <rect x="50" y="25" width="170" height="80" fill="rgba(167,139,250,.2)" stroke="#a78bfa" stroke-width="3"/>
          <text x="135" y="17" fill="#e2e8f0" font-size="15" text-anchor="middle">5/4 m</text>
          <text x="25" y="70" fill="#e2e8f0" font-size="15" text-anchor="middle">2/5 m</text>
        </svg>
        <p>Wie groß ist der <strong>Flächeninhalt</strong> des Rechtecks (in m²)? Gib das Ergebnis gekürzt oder als Dezimalzahl an.</p>`,
      hint: 'Fläche = Länge · Breite. Brüche multiplizieren: Zähler mal Zähler, Nenner mal Nenner – und dann kürzen.',
      answer: 0.5, // 1/2
    },

    clock: {
      order: 3,
      icon: '🕰️',
      category: 'Zeit als Bruch',
      title: 'Die stehengebliebene Uhr',
      question: `
        <p>Die Wanduhr ist um <strong>15:30 Uhr</strong> stehen geblieben. Der letzte Bus fährt um <strong>17:15 Uhr</strong>.</p>
        <svg class="puzzle-figure" viewBox="0 0 120 120" style="max-width:140px" aria-hidden="true">
          <circle cx="60" cy="60" r="54" fill="#fffbeb" stroke="#7c4a24" stroke-width="6"/>
          <g fill="#1f2937" font-size="12" text-anchor="middle" font-weight="700">
            <text x="60" y="20">12</text><text x="103" y="64">3</text><text x="60" y="108">6</text><text x="17" y="64">9</text>
          </g>
          <line x1="60" y1="60" x2="60" y2="100" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
          <line x1="60" y1="60" x2="89" y2="68" stroke="#b91c1c" stroke-width="5" stroke-linecap="round"/>
          <circle cx="60" cy="60" r="4" fill="#1f2937"/>
        </svg>
        <p>Wie viele <strong>Stunden</strong> bleiben bis zur Abfahrt? Gib die Antwort als Bruch oder Dezimalzahl an (nicht in Minuten!).</p>`,
      hint: 'Von 15:30 bis 17:15 sind es 1 Stunde und 45 Minuten. Welcher Bruchteil einer Stunde sind 45 Minuten?',
      answer: 1.75, // 7/4
    },

    snail: {
      order: 4,
      icon: '🐌',
      category: 'Zahlengerade',
      title: 'Die Schnecke auf der Zahlengeraden',
      question: `
        <p>Auf die Fensterbank ist eine Zahlengerade gemalt. Die Schnecke sitzt bei <strong>−2,5</strong>.</p>
        <svg class="puzzle-figure" viewBox="0 0 260 70" aria-hidden="true">
          <line x1="10" y1="40" x2="250" y2="40" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M250 40 l-8 -5 v10 z" fill="#e2e8f0"/>
          <g stroke="#e2e8f0" stroke-width="2">
            <line x1="20" y1="34" x2="20" y2="46"/><line x1="64" y1="34" x2="64" y2="46"/><line x1="108" y1="34" x2="108" y2="46"/>
            <line x1="152" y1="34" x2="152" y2="46"/><line x1="196" y1="34" x2="196" y2="46"/><line x1="240" y1="34" x2="240" y2="46"/>
          </g>
          <g fill="#e2e8f0" font-size="12" text-anchor="middle">
            <text x="20" y="62">−3</text><text x="64" y="62">−2</text><text x="108" y="62">−1</text>
            <text x="152" y="62">0</text><text x="196" y="62">1</text><text x="240" y="62">2</text>
          </g>
          <circle cx="42" cy="40" r="6" fill="#f97316" stroke="#fff" stroke-width="2"/>
          <text x="42" y="22" fill="#fdba74" font-size="16" text-anchor="middle">🐌</text>
        </svg>
        <p>Sie kriecht zuerst <strong>3 3/4</strong> Einheiten nach rechts und danach <strong>1/2</strong> Einheit nach links.</p>
        <p>Bei welcher Zahl sitzt sie jetzt?</p>`,
      hint: 'Nach rechts heißt plus, nach links heißt minus: −2,5 + 3,75 − 0,5.',
      answer: 0.75, // 3/4
    },

    chest: {
      order: 5,
      icon: '💰',
      category: 'Vorzeichenregeln',
      title: 'Das Zahlenschloss',
      question: `
        <p>Die Truhe öffnet sich nur mit dem Ergebnis dieser Rechnung:</p>
        <p class="text-center font-display text-2xl text-gold-300">( −1/2 − 1/4 ) : ( −3/8 )</p>
        <p>Wie lautet der Code?</p>`,
      hint: 'Zuerst die Klammer: −1/2 − 1/4 = −3/4. Durch einen Bruch teilt man, indem man mit dem Kehrwert multipliziert. Und: minus mal minus ergibt plus!',
      answer: 2,
    },
  };

  const IDS = Object.keys(PUZZLES).sort((a, b) => PUZZLES[a].order - PUZZLES[b].order);
  const TOTAL = IDS.length;
  const STORAGE_KEY = 'mathe-zimmer-rational-v1';

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
  //    Akzeptiert Brüche ("-3/8"), Dezimalzahlen ("-0,375"),
  //    gemischte Zahlen ("1 3/4") und Einheiten ("0,5 m²").
  // ---------------------------------------------------------------
  function parseAnswer(text) {
    const t = String(text)
      .replace(/[−–]/g, '-')     // typografische Minuszeichen
      .replace(/,/g, '.')
      .replace(/[:÷]/g, '/');
    const num = '(\\d+(?:\\.\\d+)?)';

    // gemischte Zahl, z. B. "-1 3/4"
    let m = t.match(new RegExp(`(-?)\\s*(\\d+)\\s+${num}\\s*/\\s*${num}`));
    if (m) {
      const value = parseInt(m[2], 10) + parseFloat(m[3]) / parseFloat(m[4]);
      return m[1] ? -value : value;
    }
    // Bruch, z. B. "-3/8" oder "3/-8"
    m = t.match(new RegExp(`(-?)\\s*${num}\\s*/\\s*(-?)\\s*${num}`));
    if (m) {
      const value = parseFloat(m[2]) / parseFloat(m[4]);
      return (m[1] ? -1 : 1) * (m[3] ? -1 : 1) * value;
    }
    // Dezimalzahl oder ganze Zahl
    m = t.match(/-?\s*\d+(\.\d+)?/);
    return m ? parseFloat(m[0].replace(/\s/g, '')) : NaN;
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

    if (Math.abs(value - PUZZLES[currentId].answer) < 1e-9 && Number.isFinite(value)) {
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
