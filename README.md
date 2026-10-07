# 🔑 Das geheimnisvolle Mathe-Zimmer – Rationale Zahlen

Ein interaktives Mathe-Escape-Rätsel als Single-Page-Website, die ohne Build-Schritt direkt auf **GitHub Pages** läuft.

Im großen, vollgestellten Zimmer (SVG) sind 8 Rätsel zwischen vielen Gegenständen und Ablenkungen versteckt. Wer die richtigen Details im Zimmer findet und alle Aufgaben löst, öffnet die Tür – mit Konfetti. 🎉

## Zwei Räume

| Seite | Adresse | Bild |
|-------|---------|------|
| Mathe-Zimmer | `/` (Startseite) | gezeichnetes, vollgestelltes Zimmer |
| Klassenzimmer | `/klassenzimmer/` | möglichst fotorealistisch gezeichnetes Klassenzimmer am Abend (Zentralperspektive, Licht und Schatten, Holz- und Putzstruktur, Filmkorn) |

Beide Seiten verwenden dieselben 8 Rätsel sowie dieselbe `style.css` und `script.js`. Jede Seite hat ihren eigenen Spielstand. Das Klassenzimmer legt über `window.ROOM_CONFIG` in `klassenzimmer/index.html` eigene Hinweistexte fest, die zu den Verstecken im Klassenzimmer passen. Später kann das gezeichnete Klassenzimmer durch ein echtes Foto ersetzt werden; die Verstecke werden dann auf passende Details im Foto gelegt.

## Dateien

| Datei       | Inhalt                                                                  |
|-------------|-------------------------------------------------------------------------|
| `index.html`| Seitenaufbau, das gezeichnete Zimmer (SVG) und das Modal                |
| `klassenzimmer/index.html` | Zweite Seite: das Klassenzimmer (SVG) mit eigenen Hinweistexten |
| `style.css` | Animationen (Modal, Hotspots, Tür, Kerze), Feedback-Farben              |
| `script.js` | Rätsel, Antwortprüfung, Fortschritt (wird im Browser gespeichert), Konfetti |
| `.nojekyll` | Sagt GitHub Pages, dass die Dateien unverändert ausgeliefert werden sollen |

Tailwind CSS, die Schriften und die Konfetti-Bibliothek kommen per CDN, es muss also nichts installiert werden.

## Die 8 Rätsel (7. Schulstufe: Rechnen mit rationalen Zahlen)

Die Aufgaben üben Addieren, Subtrahieren, Multiplizieren und Dividieren mit ganzen Zahlen, Dezimalzahlen und Brüchen – in der Klammer-Schreibweise, damit die **Vorzeichenregeln** wiederholt werden. Jedes Rätsel steckt hinter einem kleinen Detail im Zimmer; die Fortschrittsanzeige nennt nur das Thema der Aufgabe, nicht das Versteck.

| # | Detail im Zimmer             | Thema                            | Rechnung                          | Lösung        |
|---|------------------------------|----------------------------------|-----------------------------------|---------------|
| 1 | 🕯️ Kerze                      | Ganze Zahlen subtrahieren        | (−6) − (+10)                      | −16           |
| 2 | 🌙 Mond                       | Brüche addieren                  | (−5/6) + (+1/3)                   | −1/2 (−0,5)   |
| 3 | 🐌 Schnecke                   | Negative Zahl subtrahieren       | (−3) − (−11)                      | 8             |
| 4 | ❓ Fragezeichen-Buch          | Mehrere Faktoren multiplizieren  | (−2) · (+5) · (−3) · (−1) · (+2)  | −60           |
| 5 | 🟪 Lila Rechteck              | Ganze Zahlen dividieren          | (−72) : (+8)                      | −9            |
| 6 | 🌡️ Thermometer                | Dezimalzahlen mit Vorzeichen     | (−2,5) − (+3,8)                   | −6,3          |
| 7 | 🕒 Uhrzeiger                  | Brüche multiplizieren            | (−2/3) · (−9/4)                   | 3/2 (1,5)     |
| 8 | 🔒 Truhenschloss              | Punkt vor Strich                 | (−12) : (−4) − (+2) · (−5)        | 13            |

Jeder Tipp erklärt die passende Vorzeichenregel. Zusätzlich gibt es in jedem Rätsel-Fenster einen ausklappbaren Spickzettel **„📘 Vorzeichenregeln“** (Klammern auflösen, Multiplizieren/Dividieren, Addieren).

**Hinweis-Button:** Ein Klick auf „✨ Hinweis“ wählt zufällig ein noch nicht gelöstes Versteck und zeigt zuerst nur einen Text-Hinweis (z. B. „Auf der Fensterbank ist jemand seeehr langsam unterwegs.“). Erst der zweite Klick („🔍 Versteck markieren“) lässt das Versteck im Bild pulsieren. Die Hinweistexte stehen im Feld `clue` jedes Rätsels in `script.js`.

**Lebendiges Zimmer:** Einige Deko-Gegenstände ohne Rätsel reagieren beim Anklicken mit einer kleinen Animation und einem Geräusch – z. B. miaut die Katze, der Ball hüpft, der Teddy quietscht, der Kronleuchter schwingt und klingt, der Globus dreht sich und der Lichtschalter schaltet die Wandlampe. Die Geräusche werden im Browser erzeugt (Web Audio, keine Audiodateien) und lassen sich mit 🔊/🔇 ausschalten. Welche Gegenstände wie reagieren, steht im Objekt `FUN` in `script.js`.

Antworten dürfen als Bruch (`-3/8`), Dezimalzahl (`-0,375`) oder gemischte Zahl (`1 3/4`) eingegeben werden. Gleichwertige Brüche (z. B. `14/8`) werden ebenfalls als richtig erkannt.

## Auf GitHub Pages veröffentlichen

1. Die Dateien müssen **im Hauptverzeichnis** des Repositorys liegen, die Startseite muss genau **`index.html`** heißen (kleingeschrieben).
2. Auf GitHub: **Settings → Pages**.
3. Unter *Build and deployment* → *Source*: **Deploy from a branch** wählen.
4. Branch wählen (z. B. `main`), Ordner **`/ (root)`**, dann **Save**.
5. Nach ca. 1 Minute ist die Seite erreichbar unter
   `https://<dein-benutzername>.github.io/<repository-name>/`

## Lokal testen

`index.html` einfach im Browser öffnen, oder einen kleinen Server starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Eigene Rätsel einbauen

Alle Rätsel stehen ganz oben in `script.js` im Objekt `PUZZLES`. Für jedes Rätsel gibt es eine Frage (`question`, darf HTML enthalten), einen Tipp (`hint`) und die Lösung (`answer`). Der Schlüssel (z. B. `clock`) muss zum Attribut `data-puzzle="clock"` des passenden Gegenstands in `index.html` passen.
