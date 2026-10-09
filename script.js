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
  const PUZZLES = {
    candle: {
      order: 1,
      icon: '🕯️',
      name: 'Kerze',
      category: 'Ganze Zahlen subtrahieren',
      title: 'Die brennende Kerze',
      clue: 'Auf dem kleinen Tisch brennt etwas ganz langsam herunter.',
      question: `
        <p>In das Wachs der Kerze ist eine Rechnung geritzt:</p>
        <p class="calc">(−6) − (+10) = ?</p>
        <p>Berechne das Ergebnis.</p>`,
      hint: 'Vorzeichenregel: „− (+a)“ wird zu „− a“. Also rechnest du −6 − 10. Du gehst auf der Zahlengeraden von −6 noch 10 Schritte nach links.',
      answer: -16,
    },

    moon: {
      order: 2,
      icon: '🌙',
      name: 'Mond',
      category: 'Brüche addieren',
      title: 'Die Sternenschrift am Mond',
      clue: 'Schau aus dem Fenster: Am Nachthimmel leuchtet etwas Rundes, das nur halb zu sehen ist.',
      question: `
        <p>Neben dem Mond formen die Sterne eine Rechnung:</p>
        <p class="calc">(−5/6) + (+1/3) = ?</p>
        <p>Gib das Ergebnis gekürzt als Bruch oder als Dezimalzahl an.</p>`,
      hint: 'Zuerst gleichnamig machen: 1/3 = 2/6. Dann −5/6 + 2/6: verschiedene Vorzeichen → Beträge subtrahieren (5 − 2) und das Vorzeichen der Zahl mit dem größeren Betrag nehmen. Am Ende kürzen!',
      answer: -0.5, // −1/2
    },

    snail: {
      order: 3,
      icon: '🐌',
      name: 'Schnecke',
      category: 'Negative Zahl subtrahieren',
      title: 'Die Schnecke auf der Fensterbank',
      clue: 'Auf der Fensterbank ist jemand seeehr langsam unterwegs.',
      question: `
        <p>Die Schnecke hat mit ihrer Schleimspur eine Rechnung auf die Fensterbank geschrieben:</p>
        <p class="calc">(−3) − (−11) = ?</p>
        <p>Was kommt heraus?</p>`,
      hint: 'Vorzeichenregel: „− (−a)“ wird zu „+ a“ – minus minus ergibt plus! Also rechnest du −3 + 11.',
      answer: 8,
    },

    sequence: {
      order: 4,
      icon: '❓',
      name: 'Fragezeichen-Buch',
      category: 'Mehrere Faktoren multiplizieren',
      title: 'Das Buch mit dem Fragezeichen',
      clue: 'Im großen Bücherregal kann man einen Buchrücken nicht lesen.',
      question: `
        <p>Auf den Buchrücken neben dem Fragezeichen-Buch stehen fünf Zahlen. Auf das <strong>?</strong> gehört ihr <strong>Produkt</strong>:</p>
        <p class="calc">(−2) · (+5) · (−3) · (−1) · (+2) = ?</p>
        <p>Wie lautet das Ergebnis?</p>`,
      hint: 'Rechne zuerst ohne Vorzeichen: 2 · 5 · 3 · 1 · 2. Dann zähle die Minuszeichen: Ist ihre Anzahl gerade, ist das Ergebnis positiv – ist sie ungerade, ist es negativ.',
      answer: -60,
    },

    painting: {
      order: 5,
      icon: '🟪',
      name: 'Lila Rechteck',
      category: 'Ganze Zahlen dividieren',
      title: 'Das lila Rechteck im Gemälde',
      clue: 'Im Gemälde mit den Bergen versteckt sich eine Form, die nicht in die Landschaft passt.',
      question: `
        <p>Im lila Rechteck hat der Maler winzig klein eine Rechnung versteckt:</p>
        <p class="calc">(−72) : (+8) = ?</p>
        <p>Berechne den Quotienten.</p>`,
      hint: 'Beim Dividieren gelten dieselben Regeln wie beim Multiplizieren: gleiche Vorzeichen → plus, verschiedene Vorzeichen → minus. 72 : 8 = 9 – und welches Vorzeichen?',
      answer: -9,
    },

    thermo: {
      order: 6,
      icon: '🌡️',
      name: 'Thermometer',
      category: 'Dezimalzahlen mit Vorzeichen',
      title: 'Das Thermometer an der Wand',
      clue: 'Neben der Tür hängt etwas, das verrät, wie kalt es draußen ist.',
      question: `
        <p>Am Morgen zeigt das Thermometer <strong>−2,5 °C</strong>. Bis zum Abend sinkt die Temperatur um <strong>3,8 Grad</strong>:</p>
        <p class="calc">(−2,5) − (+3,8) = ?</p>
        <p>Wie viel Grad zeigt das Thermometer am Abend?</p>`,
      hint: '„− (+3,8)“ wird zu „− 3,8“. Von −2,5 aus geht es also noch weiter ins Minus: Beträge addieren (2,5 + 3,8), das Ergebnis ist negativ.',
      answer: -6.3,
    },

    clock: {
      order: 7,
      icon: '🕒',
      name: 'Uhrzeiger',
      category: 'Brüche multiplizieren',
      title: 'Die stehengebliebene Uhr',
      clue: 'Die Zeit steht still – schau dir die Zeiger ganz genau an.',
      question: `
        <p>Auf der Rückseite der Uhr klebt ein Zettel:</p>
        <p class="calc">(−2/3) · (−9/4) = ?</p>
        <p>Gib das Ergebnis gekürzt, als gemischte Zahl oder als Dezimalzahl an.</p>`,
      hint: 'Minus mal minus ergibt plus. Dann Zähler mal Zähler und Nenner mal Nenner: (2 · 9) / (3 · 4) – und kürzen nicht vergessen!',
      answer: 1.5, // 3/2
    },

    chest: {
      order: 8,
      icon: '🔒',
      name: 'Truhenschloss',
      category: 'Punkt vor Strich',
      title: 'Das Schloss der Schatztruhe',
      clue: 'Der Schatz bleibt verschlossen – untersuche das kleine goldene Teil vorne an der Truhe.',
      question: `
        <p>Das letzte Schloss! Der Code ist das Ergebnis dieser Rechnung:</p>
        <p class="calc">(−12) : (−4) − (+2) · (−5) = ?</p>
        <p>Achtung: Punktrechnung geht vor Strichrechnung!</p>`,
      hint: 'Rechne zuerst die beiden Punktrechnungen: (−12) : (−4) = ? und (+2) · (−5) = ?. Dann subtrahierst du: erstes Ergebnis − zweites Ergebnis. Achtung: minus minus ergibt plus!',
      answer: 13,
    },
  };

  const IDS = Object.keys(PUZZLES).sort((a, b) => PUZZLES[a].order - PUZZLES[b].order);
  const TOTAL = IDS.length;
  // Seiten-Einstellungen (z. B. /klassenzimmer/): eigene Hinweistexte und eigener Spielstand
  const ROOM = window.ROOM_CONFIG || {};
  Object.entries(ROOM.clues || {}).forEach(([id, clue]) => {
    if (PUZZLES[id]) PUZZLES[id].clue = clue;
  });

  const STORAGE_KEY = 'mathe-zimmer-rational-v4' + (ROOM.id ? `-${ROOM.id}` : '');

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
  // Geräusche – werden direkt im Browser erzeugt (Web Audio), keine Dateien nötig
  // ---------------------------------------------------------------
  const SOUND_KEY = 'mathe-zimmer-sound';
  let soundOn = true;
  try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch { /* egal */ }
  let audioCtx = null;

  function ctx() {
    if (!soundOn) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // Ein Ton mit Tonhöhen-Verlauf: freqs = [[Zeit in s, Frequenz], …]
  function tone({ type = 'sine', freqs, dur, vol = 0.2, filter, delay = 0 }) {
    const ac = ctx();
    if (!ac) return;
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    freqs.forEach(([t, f], i) => (i === 0 ? osc.frequency.setValueAtTime(f, t0 + t) : osc.frequency.linearRampToValueAtTime(f, t0 + t)));
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.04, dur / 4));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = osc;
    if (filter) {
      const f = ac.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      osc.connect(f);
      node = f;
    }
    node.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // Kurzes Rauschen (Rascheln, Klick, Wusch)
  function noise({ dur, vol = 0.15, freq = 2000, q = 1, delay = 0 }) {
    const ac = ctx();
    if (!ac) return;
    const t0 = ac.currentTime + delay;
    const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = q;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(gain).connect(ac.destination);
    src.start(t0);
  }

  const SOUNDS = {
    // Miauen als Lautfolge „m – i – a – u“: Stimme (Sägezahn) durch drei Formant-Filter,
    // deren Frequenzen sich wie beim Sprechen von Vokal zu Vokal verschieben.
    meow() {
      const ac = ctx();
      if (!ac) return;
      const t = ac.currentTime;
      const dur = 0.85 + Math.random() * 0.2;      // jedes Miau etwas anders
      const k = 0.9 + Math.random() * 0.2;         // Tonhöhe (kleine/große Katze)
      const at = (x) => t + x * dur;

      // Laute mit Zeitpunkt (Anteil der Dauer) und Formanten F1/F2/F3 in Hz
      const VOWELS = [
        [0.00, [300, 1100, 2400]],   // m (geschlossener Mund, nasal)
        [0.12, [330, 2500, 3300]],   // i
        [0.22, [380, 2300, 3200]],
        [0.38, [850, 1450, 2800]],   // a
        [0.58, [800, 1300, 2700]],
        [0.78, [420, 850, 2400]],    // u
        [1.00, [350, 700, 2300]],
      ];

      // Stimmquelle: Tonhöhe steigt beim „i-a“ und fällt beim „u“
      const voice = ac.createOscillator();
      voice.type = 'sawtooth';
      voice.frequency.setValueAtTime(520 * k, t);
      voice.frequency.linearRampToValueAtTime(640 * k, at(0.15));
      voice.frequency.linearRampToValueAtTime(700 * k, at(0.45));
      voice.frequency.linearRampToValueAtTime(560 * k, at(0.75));
      voice.frequency.linearRampToValueAtTime(430 * k, at(1));
      const vib = ac.createOscillator();           // leichtes Vibrato
      vib.frequency.value = 6;
      const vibAmt = ac.createGain();
      vibAmt.gain.value = 8 * k;
      vib.connect(vibAmt).connect(voice.frequency);

      const mix = ac.createGain();
      [[0, 1.0, 9], [1, 0.7, 11], [2, 0.3, 12]].forEach(([n, level, q]) => {
        const f = ac.createBiquadFilter();
        f.type = 'bandpass';
        f.Q.value = q;
        VOWELS.forEach(([x, fs], i) =>
          (i === 0 ? f.frequency.setValueAtTime(fs[n], at(x)) : f.frequency.linearRampToValueAtTime(fs[n], at(x))));
        const g = ac.createGain();
        g.gain.value = level * 1.8;
        voice.connect(f).connect(g).connect(mix);
      });

      // „m“: Mund erst geschlossen (dumpf), dann offen; am Ende wieder etwas geschlossen („u“)
      const mouth = ac.createBiquadFilter();
      mouth.type = 'lowpass';
      mouth.frequency.setValueAtTime(400, t);
      mouth.frequency.linearRampToValueAtTime(400, at(0.08));
      mouth.frequency.exponentialRampToValueAtTime(5000, at(0.16));
      mouth.frequency.exponentialRampToValueAtTime(1800, at(1));

      const out = ac.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(0.18, at(0.08));    // leises „m“
      out.gain.exponentialRampToValueAtTime(0.5, at(0.2));      // offenes „i-a“
      out.gain.setValueAtTime(0.5, at(0.6));
      out.gain.exponentialRampToValueAtTime(0.25, at(0.85));    // „u“ wird leiser
      out.gain.exponentialRampToValueAtTime(0.0001, at(1));

      mix.connect(mouth).connect(out).connect(ac.destination);
      voice.start(t); vib.start(t);
      voice.stop(at(1) + 0.05); vib.stop(at(1) + 0.05);
    },
    boing() {
      tone({ type: 'sine', vol: 0.25, dur: 0.5, freqs: [[0, 330], [0.08, 520], [0.5, 140]] });
      tone({ type: 'sine', vol: 0.12, dur: 0.35, delay: 0.45, freqs: [[0, 300], [0.35, 160]] });
    },
    squeak() {
      tone({ type: 'sine', vol: 0.16, dur: 0.25, freqs: [[0, 1100], [0.1, 1900], [0.25, 1300]] });
    },
    chime() {
      [1319, 1760, 2093].forEach((f, i) => tone({ type: 'sine', vol: 0.08, dur: 1.2, delay: i * 0.12, freqs: [[0, f]] }));
    },
    whoosh() { noise({ dur: 0.6, vol: 0.12, freq: 800, q: 0.7 }); },
    rustle() {
      for (let i = 0; i < 4; i++) noise({ dur: 0.12, vol: 0.08, freq: 3500 + i * 400, q: 0.8, delay: i * 0.09 });
    },
    click() { noise({ dur: 0.03, vol: 0.3, freq: 3000, q: 2 }); },
    thud() {
      tone({ type: 'sine', vol: 0.3, dur: 0.18, freqs: [[0, 160], [0.18, 60]] });
      noise({ dur: 0.05, vol: 0.15, freq: 1200 });
    },
    flap() { noise({ dur: 0.18, vol: 0.12, freq: 1500, q: 0.6 }); },
    chalk() {
      tone({ type: 'square', filter: 5000, vol: 0.05, dur: 0.45, freqs: [[0, 2600], [0.2, 3100], [0.45, 2400]] });
      noise({ dur: 0.4, vol: 0.05, freq: 6000, q: 4 });
    },
    creak() {
      tone({ type: 'sawtooth', filter: 900, vol: 0.12, dur: 0.5, freqs: [[0, 140], [0.25, 95], [0.5, 120]] });
    },
    tick() {
      [0, 0.25, 0.5].forEach((d) => noise({ dur: 0.03, vol: 0.2, freq: 4000, q: 3, delay: d }));
    },
  };

  // ---------------------------------------------------------------
  // Deko-Gegenstände: kleine Animation, Geräusch und manchmal ein Text
  // ---------------------------------------------------------------
  const FUN = {
    hamster:    { anim: 'shake',  sound: 'squeak', texts: ['Fiep!', 'Fiep fiep!', '*knabber*'] },
    board:      { sound: 'chalk',  texts: ['Iiiieh!', '*quietsch*'] },
    chair:      { anim: 'wiggle', sound: 'creak',  texts: ['Knarz!'] },
    bag:        { anim: 'wiggle', sound: 'rustle', texts: ['Hausaufgaben?'] },
    cat:        { anim: 'wiggle', sound: 'meow',   texts: ['Miau!', 'Miauuu?', 'Schnurr …'] },
    ball:       { anim: 'bounce', sound: 'boing',  texts: ['Boing!'] },
    teddy:      { anim: 'jump',   sound: 'squeak', texts: ['Quietsch!', 'Hallo!'] },
    chandelier: { anim: 'swing',  sound: 'chime' },
    globe:      { anim: 'spin',   sound: 'whoosh', texts: ['Hui!'] },
    hourglass:  { anim: 'flip',   sound: 'whoosh' },
    plant:      { anim: 'sway',   sound: 'rustle' },
    calendar:   { anim: 'flap',   sound: 'flap' },
    dart:       { anim: 'shake',  sound: 'thud',   texts: ['Treffer!', 'Volltreffer!'] },
    yarn:       { anim: 'wiggle', sound: 'rustle' },
    slippers:   { anim: 'shake',  sound: 'rustle' },
    switch:     { sound: 'click' },
  };

  function playFun(el) {
    const name = el.dataset.fun;
    const fx = FUN[name];
    if (!fx) return;
    if (name === 'switch') room.classList.toggle('lamp-off');
    if (fx.anim) {
      const cls = `play-${fx.anim}`;
      el.classList.remove(cls);
      void el.getBBox(); // Animation neu starten
      el.classList.add(cls);
      el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
    }
    if (fx.sound) SOUNDS[fx.sound]();
    if (fx.texts) showPop(el, randomItem(fx.texts));
  }

  function showPop(el, text) {
    const box = el.getBBox();
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('class', 'fun-pop');
    t.setAttribute('x', box.x + box.width / 2);
    t.setAttribute('y', box.y - 8);
    t.setAttribute('text-anchor', 'middle');
    t.textContent = text;
    room.appendChild(t);
    setTimeout(() => t.remove(), 1400);
  }

  const soundBtn = $('#sound-toggle');
  function updateSoundBtn() {
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.setAttribute('aria-label', soundOn ? 'Geräusche ausschalten' : 'Geräusche einschalten');
  }
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch { /* egal */ }
    updateSoundBtn();
  });
  updateSoundBtn();

  room.querySelectorAll('.fun').forEach((el) => el.addEventListener('click', () => playFun(el)));

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
