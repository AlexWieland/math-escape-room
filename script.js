/* ================================================================
   Das geheimnisvolle Mathe-Zimmer – Spiellogik
   ================================================================ */
(() => {
  'use strict';

  // ---------------------------------------------------------------
  // 1. Die Rätsel
  //    name: Name des Verstecks im Zimmer
  //    category: kurze Beschreibung der Aufgabe (erscheint in der Fortschrittsanzeige)
  //    clue: Text-Hinweis auf das Versteck (1. Stufe des Hinweis-Buttons)
  //    answer: die richtige Zahl
  //    question: HTML (darf kleine SVG-Grafiken enthalten)
  // ---------------------------------------------------------------
  // Zahlen einer Aufzählung, getrennt durch „|“ – nicht durch „·“,
  // das man mit einem Malzeichen verwechseln könnte.
  const numberList = (...items) =>
    `<p class="num-list">${items
      .map((x) => `<span class="num-item">${x}</span>`)
      .join('<span class="num-sep" aria-hidden="true">|</span>')}</p>`;

  const PUZZLES = {
    candle: {
      order: 1,
      icon: '🕯️',
      name: 'Kerze',
      category: 'Bruchteil berechnen',
      title: 'Die brennende Kerze',
      question: `
        <p>Die Kerze auf dem Tisch war am Anfang <strong>20 cm</strong> lang. Pro Stunde brennen <strong>2,5 cm</strong> ab.</p>
        <p>Welcher <strong>Bruchteil</strong> der Kerze ist nach <strong>3 Stunden</strong> abgebrannt?</p>
        <p class="text-slate-400 text-sm">Gib das Ergebnis als gekürzten Bruch oder als Dezimalzahl an.</p>`,
      clue: 'Auf dem kleinen Tisch brennt etwas ganz langsam herunter.',
      hint: 'In 3 Stunden brennen 3 · 2,5 cm = 7,5 cm ab. Der Bruchteil ist 7,5 / 20. Erweitere mit 2, damit keine Kommazahl mehr im Bruch steht.',
      answer: 0.375, // 3/8
    },

    moon: {
      order: 2,
      icon: '🌙',
      name: 'Mond',
      category: 'Negative Zahlen vergleichen',
      title: 'Der Mond und die negativen Zahlen',
      question: `
        <p>Neben dem Mond leuchten vier Sterne mit Zahlen. Nur der Stern mit der <strong>größten</strong> Zahl zeigt den Weg:</p>
        ${numberList('−2/3', '−0,6', '−5/8', '−0,65')}
        <p>Welche Zahl ist die größte?</p>`,
      clue: 'Schau aus dem Fenster: Am Nachthimmel leuchtet etwas Rundes, das nur halb zu sehen ist.',
      hint: 'Wandle alle Zahlen in Dezimalzahlen um (−2/3 ≈ −0,667; −5/8 = −0,625). Bei negativen Zahlen ist die Zahl am größten, die am nächsten bei 0 liegt.',
      answer: -0.6,
    },

    snail: {
      order: 3,
      icon: '🐌',
      name: 'Schnecke',
      category: 'Zahlengerade: Veränderung',
      title: 'Die Schnecke auf der Fensterbank',
      question: `
        <p>Auf die Fensterbank ist eine Zahlengerade gemalt. Am Morgen sitzt die Schnecke bei <strong>0,8</strong>, am Abend bei <strong>−1 1/5</strong>.</p>
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
          <circle cx="187.2" cy="40" r="6" fill="#f97316" stroke="#fff" stroke-width="2"/>
          <text x="187.2" y="22" font-size="16" text-anchor="middle">🐌</text>
          <circle cx="99.2" cy="40" r="5" fill="none" stroke="#fdba74" stroke-width="2" stroke-dasharray="3 2"/>
          <text x="99.2" y="22" fill="#fdba74" font-size="14" text-anchor="middle">?</text>
        </svg>
        <p>Um wie viel hat sich ihre Position verändert? Gib die Veränderung <strong>mit Vorzeichen</strong> an (nach links = negativ).</p>`,
      clue: 'Auf der Fensterbank ist jemand seeehr langsam unterwegs.',
      hint: 'Veränderung = Endwert − Startwert = −1,2 − 0,8.',
      answer: -2,
    },

    sequence: {
      order: 4,
      icon: '❓',
      name: 'Fragezeichen-Buch',
      category: 'Zahlenfolge mit Brüchen',
      title: 'Das Buch mit dem Fragezeichen',
      question: `
        <p>Im Regal stehen Bücher mit Zahlen auf dem Rücken – auf dem letzten steht nur ein <strong>?</strong>:</p>
        ${numberList('81', '−54', '36', '−24', '16', '<span class="text-pink-300">?</span>')}
        <p>Welche Zahl gehört auf das Fragezeichen-Buch? <span class="text-slate-400">(als Bruch oder gemischte Zahl)</span></p>`,
      clue: 'Im großen Bücherregal kann man einen Buchrücken nicht lesen.',
      hint: 'Von Buch zu Buch wird immer mit demselben Bruch multipliziert: 81 · ? = −54. Kürze −54/81!',
      answer: -32 / 3, // −10 2/3
    },

    painting: {
      order: 5,
      icon: '🟪',
      name: 'Lila Rechteck',
      category: 'Brüche dividieren',
      title: 'Das lila Rechteck im Gemälde',
      question: `
        <p>Auf der Rückseite des Gemäldes steht: Das lila Rechteck hat eine Fläche von <strong>3/4 m²</strong> und ist <strong>1 1/4 m</strong> lang.</p>
        <svg class="puzzle-figure" viewBox="0 0 260 130" aria-hidden="true">
          <rect x="50" y="25" width="170" height="80" fill="rgba(167,139,250,.2)" stroke="#a78bfa" stroke-width="3"/>
          <text x="135" y="17" fill="#e2e8f0" font-size="15" text-anchor="middle">1 1/4 m</text>
          <text x="28" y="70" fill="#fdba74" font-size="18" text-anchor="middle">?</text>
          <text x="135" y="72" fill="#e2e8f0" font-size="15" text-anchor="middle">A = 3/4 m²</text>
        </svg>
        <p>Wie <strong>breit</strong> ist das Rechteck (in m)?</p>`,
      clue: 'Im Gemälde mit den Bergen versteckt sich eine Form, die nicht in die Landschaft passt.',
      hint: 'Breite = Fläche : Länge = 3/4 : 5/4. Durch einen Bruch dividiert man, indem man mit dem Kehrwert multipliziert.',
      answer: 0.6, // 3/5
    },

    thermo: {
      order: 6,
      icon: '🌡️',
      name: 'Thermometer',
      category: 'Addieren mit Vorzeichen',
      title: 'Das Thermometer an der Wand',
      question: `
        <p>Das Thermometer zeigt den Temperaturverlauf eines Wintertages:</p>
        <ul class="list-disc pl-5 space-y-1 text-slate-300">
          <li>Morgens: <strong>−4,5 °C</strong></li>
          <li>Bis Mittag steigt die Temperatur um <strong>7 1/4 Grad</strong>.</li>
          <li>Bis zum Abend sinkt sie um <strong>5,5 Grad</strong>.</li>
        </ul>
        <p>Wie viel Grad zeigt das Thermometer am Abend?</p>`,
      clue: 'Neben der Tür hängt etwas, das verrät, wie kalt es draußen ist.',
      hint: 'Steigen heißt plus, sinken heißt minus: −4,5 + 7,25 − 5,5. Ist das Ergebnis über oder unter 0?',
      answer: -2.75, // −11/4
    },

    clock: {
      order: 7,
      icon: '🕒',
      name: 'Uhrzeiger',
      category: 'Multiplizieren mit Minus',
      title: 'Die ungenaue Wanduhr',
      question: `
        <p>Die Wanduhr geht jeden Tag <strong>2/5 Minute nach</strong> (sie ist zu langsam). Eine Abweichung nach hinten zählt <strong>negativ</strong>.</p>
        <svg class="puzzle-figure" viewBox="0 0 120 120" style="max-width:120px" aria-hidden="true">
          <circle cx="60" cy="60" r="54" fill="#fffbeb" stroke="#7c4a24" stroke-width="6"/>
          <g fill="#1f2937" font-size="12" text-anchor="middle" font-weight="700">
            <text x="60" y="20">12</text><text x="103" y="64">3</text><text x="60" y="108">6</text><text x="17" y="64">9</text>
          </g>
          <line x1="60" y1="60" x2="60" y2="100" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
          <line x1="60" y1="60" x2="89" y2="68" stroke="#b91c1c" stroke-width="5" stroke-linecap="round"/>
          <circle cx="60" cy="60" r="4" fill="#1f2937"/>
        </svg>
        <p>Um wie viele Minuten weicht sie nach <strong>3 Wochen</strong> ab? Gib das Ergebnis mit Vorzeichen an.</p>`,
      clue: 'Die Zeit steht still – schau dir die Zeiger ganz genau an.',
      hint: '3 Wochen sind 21 Tage. Rechne 21 · (−2/5). Plus mal minus ergibt minus.',
      answer: -8.4, // −42/5
    },

    chest: {
      order: 8,
      icon: '🔒',
      name: 'Truhenschloss',
      category: 'Mittelwert berechnen',
      title: 'Das Schloss der Schatztruhe',
      question: `
        <p>Das letzte Schloss! Auf vier Rädchen stehen diese Zahlen:</p>
        ${numberList('−3/4', '1/2', '−1¼', '2,5')}
        <p>Der Code ist ihr <strong>Mittelwert</strong> (Durchschnitt). Wie lautet er?</p>`,
      clue: 'Der Schatz bleibt verschlossen – untersuche das kleine goldene Teil vorne an der Truhe.',
      hint: 'Mittelwert = Summe aller Zahlen : Anzahl. Addiere zuerst: −0,75 + 0,5 − 1,25 + 2,5. Teile das Ergebnis dann durch 4.',
      answer: 0.25, // 1/4
    },
  };

  const IDS = Object.keys(PUZZLES).sort((a, b) => PUZZLES[a].order - PUZZLES[b].order);
  const TOTAL = IDS.length;
  const STORAGE_KEY = 'mathe-zimmer-rational-v3';

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
  const hintText    = $('#hint-text');
  const modalCard   = modal.querySelector('.modal-card');
  const symbolKeys  = [...modal.querySelectorAll('[data-insert]')];

  // Touch-Gerät (Handy/Tablet)? Dann z. B. die Tastatur nicht sofort öffnen.
  const isTouch = () =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches || navigator.maxTouchPoints > 0;

  let currentId = null;
  let lastFocused = null;
  let closeTimer = null;

  // Anzahl der Rätsel in der Anzeige eintragen
  $('#progress-total').textContent = TOTAL;
  progressBar.setAttribute('aria-valuemax', TOTAL);

  // Fortschritts-Kacheln erzeugen
  IDS.forEach((id) => {
    const li = document.createElement('li');
    const p = PUZZLES[id];
    li.className = 'progress-dot flex items-center gap-2 rounded-lg bg-white/5 py-1.5 px-2 min-w-0 text-left';
    li.dataset.id = id;
    // Beschreibung der Mathe-Aufgabe – verrät nicht, wo das Rätsel versteckt ist
    li.innerHTML = `
      <span class="dot-num" aria-hidden="true">${p.order}</span>
      <span class="min-w-0 text-[0.7rem] sm:text-xs lg:text-sm leading-tight">${p.category}</span>`;
    li.title = `Rätsel ${p.order}: ${p.category}`;
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
      setInputEnabled(false);
      input.blur(); // Handy-Tastatur schließen
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

  // ---------------------------------------------------------------
  // Hinweis-Button – zweistufig für ein zufälliges, ungelöstes Versteck:
  //   1. Klick: Text-Hinweis anzeigen (Stufe 1)
  //   2. Klick: dasselbe Versteck im Bild markieren (Stufe 2)
  //   3. Klick: ein anderes Versteck wählen → wieder mit Text beginnen
  // ---------------------------------------------------------------
  let hintedId = null;
  let hintStage = 0; // 0 = kein Hinweis, 1 = Text, 2 = Markierung im Bild

  function onHintClick() {
    if (hintStage === 1) {
      hintStage = 2;
      updateHint();
      // Das Versteck ins Bild holen (auf dem Handy auch seitlich scrollen)
      const el = room.querySelector(`.hotspot[data-puzzle="${hintedId}"]`);
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      return;
    }
    const open = IDS.filter((id) => !solved.has(id));
    if (open.length === 0) return;
    const choices = open.length > 1 ? open.filter((id) => id !== hintedId) : open;
    hintedId = randomItem(choices);
    hintStage = 1;
    updateHint();
  }

  function updateHint() {
    if (hintedId && solved.has(hintedId)) { hintedId = null; hintStage = 0; } // gelöst → Hinweis weg
    room.querySelectorAll('.hotspot').forEach((el) => {
      el.classList.toggle('hinted', hintStage === 2 && el.dataset.puzzle === hintedId);
    });

    hintText.classList.toggle('hidden', hintStage === 0);
    if (hintStage > 0) hintText.querySelector('.hint-clue').textContent = PUZZLES[hintedId].clue;

    const open = TOTAL - solved.size;
    hintToggle.disabled = open === 0;
    if (open === 0) hintToggle.textContent = '✨ Alles gefunden';
    else if (hintStage === 1) hintToggle.textContent = '🔍 Versteck markieren';
    else if (hintStage === 2 && open > 1) hintToggle.textContent = '✨ Anderer Hinweis';
    else hintToggle.textContent = '✨ Hinweis';
  }

  function render() {
    const count = solved.size;
    progressEl.textContent = count;
    progressFill.style.width = `${(count / TOTAL) * 100}%`;
    progressBar.setAttribute('aria-valuenow', count);

    dotsEl.querySelectorAll('.progress-dot').forEach((li) => {
      const isSolved = solved.has(li.dataset.id);
      const p = PUZZLES[li.dataset.id];
      li.classList.toggle('solved', isSolved);
      li.querySelector('.dot-num').textContent = isSolved ? '✓' : p.order;
      li.setAttribute('aria-label', `Rätsel ${p.order}, ${p.category}: ${isSolved ? 'gelöst' : 'noch offen'}`);
    });

    room.querySelectorAll('.hotspot').forEach((el) => {
      const id = el.dataset.puzzle;
      const isSolved = solved.has(id);
      el.classList.toggle('solved', isSolved);
      const badge = el.querySelector('.badge-wrap');
      if (isSolved && !badge) addBadge(el);
      if (!isSolved && badge) badge.remove();
    });

    updateHint();

    // Lämpchen an der Tür
    room.querySelectorAll('#door-locks circle').forEach((c, i) => c.classList.toggle('on', i < count));
  }

  // Grünes Häkchen an der oberen rechten Ecke des Details
  function addBadge(hotspot) {
    const area = hotspot.querySelector('.hotspot-area');
    const x = Number(area.getAttribute('x')) + Number(area.getAttribute('width'));
    const y = Number(area.getAttribute('y'));
    const NS = 'http://www.w3.org/2000/svg';
    const wrap = document.createElementNS(NS, 'g');
    wrap.setAttribute('class', 'badge-wrap');
    wrap.setAttribute('transform', `translate(${x} ${y})`);
    wrap.innerHTML = `
      <g class="solved-badge">
        <circle r="11" fill="#22c55e" stroke="#fff" stroke-width="2.5"/>
        <path d="M-5 0 L-1.5 4.5 L5.5 -4.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
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
    setInputEnabled(!isSolved);
    if (isSolved) setFeedback('correct', 'Dieses Rätsel hast du schon gelöst! ✅');

    modal.classList.remove('closing');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    fitModalToViewport();
    modal.querySelector('.modal-body').scrollTop = 0;

    // Auf Touch-Geräten nicht sofort die Tastatur öffnen – sie würde die Aufgabe verdecken.
    const target = isSolved || isTouch() ? modalCard : input;
    setTimeout(() => target.focus({ preventScroll: true }), 50);
  }

  function setInputEnabled(enabled) {
    input.disabled = !enabled;
    submitBtn.disabled = !enabled;
    symbolKeys.forEach((b) => (b.disabled = !enabled));
  }

  // Das Modal an den sichtbaren Bereich anpassen (wichtig, wenn die
  // Bildschirmtastatur auf iOS/Android einen Teil des Bildschirms verdeckt).
  function fitModalToViewport() {
    const vv = window.visualViewport;
    if (!vv) return;
    modal.style.top = `${vv.offsetTop}px`;
    modal.style.height = `${vv.height}px`;
    modal.style.bottom = 'auto';
  }

  // Sonderzeichen an der Cursor-Position einfügen (− und / sind auf Handy-Tastaturen versteckt)
  function insertSymbol(sym) {
    if (input.disabled) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    if (sym === 'backspace') {
      if (start !== end) input.setRangeText('', start, end, 'end');
      else if (start > 0) input.setRangeText('', start - 1, start, 'end');
    } else {
      input.setRangeText(sym, start, end, 'end');
    }
    input.classList.remove('correct', 'wrong');
    input.focus({ preventScroll: true });
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
    // Auf dem Handy das Zimmer ins Bild holen, damit man die Tür aufgehen sieht
    if (window.innerWidth < 640) {
      room.querySelector('#door').scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
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
    hintedId = null;
    hintStage = 0;
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
    // Sichtbares Feedback beim Antippen
    el.addEventListener('pointerdown', () => el.classList.add('tapped'));
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) =>
      el.addEventListener(type, () => setTimeout(() => el.classList.remove('tapped'), 150)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el.dataset.puzzle); }
    });
  });

  form.addEventListener('submit', checkAnswer);

  symbolKeys.forEach((btn) => {
    // pointerdown verhindern, damit das Eingabefeld den Fokus (und die Tastatur) behält
    btn.addEventListener('pointerdown', (e) => e.preventDefault());
    btn.addEventListener('click', () => insertSymbol(btn.dataset.insert));
  });

  // Eingabefeld sichtbar halten, wenn die Tastatur aufgeht
  input.addEventListener('focus', () => {
    if (!isTouch()) return;
    setTimeout(() => input.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => modal.classList.contains('open') && fitModalToViewport());
    window.visualViewport.addEventListener('scroll', () => modal.classList.contains('open') && fitModalToViewport());
  }
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    trapFocus(e);
  });

  hintToggle.addEventListener('click', onHintClick);

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
