# 🔑 Das geheimnisvolle Mathe-Zimmer – Rationale Zahlen

Ein interaktives Mathe-Escape-Rätsel als Single-Page-Website, die ohne Build-Schritt direkt auf **GitHub Pages** läuft.

Im gezeichneten Zimmer (SVG) sind 5 Rätsel versteckt. Wer die richtigen Details im Zimmer findet und alle Aufgaben löst, öffnet die Tür – mit Konfetti. 🎉

## Dateien

| Datei       | Inhalt                                                                  |
|-------------|-------------------------------------------------------------------------|
| `index.html`| Seitenaufbau, das gezeichnete Zimmer (SVG) und das Modal                |
| `style.css` | Animationen (Modal, Hotspots, Tür, Kerze), Feedback-Farben              |
| `script.js` | Rätsel, Antwortprüfung, Fortschritt (wird im Browser gespeichert), Konfetti |
| `.nojekyll` | Sagt GitHub Pages, dass die Dateien unverändert ausgeliefert werden sollen |

Tailwind CSS, die Schriften und die Konfetti-Bibliothek kommen per CDN, es muss also nichts installiert werden.

## Die 5 Rätsel (Thema: rationale Zahlen)

Jedes Rätsel steckt hinter einem kleinen Detail im Zimmer (von links nach rechts):

| # | Detail im Zimmer            | Thema                 | Aufgabe                                  | Lösung        |
|---|-----------------------------|-----------------------|------------------------------------------|---------------|
| 1 | 🐌 Schnecke (Fensterbank)    | Zahlengerade          | −1¾ + 2,5 − 1¼                           | −1/2 (−0,5)   |
| 2 | ❓ Fragezeichen-Buch (Regal) | Zahlenfolge           | 12, −6, 3, −1,5, 0,75, ?                 | −3/8 (−0,375) |
| 3 | 🟪 Lila Rechteck (Gemälde)   | Brüche addieren       | Umfang eines Rechtecks 5/4 m × 2/5 m     | 33/10 (3,3)   |
| 4 | 🕒 Uhrzeiger (Wanduhr)       | Zeit als Bruch        | 15:30 bis 17:15 in Stunden               | 7/4 (1,75)    |
| 5 | 🔒 Truhenschloss             | Vorzeichenregeln      | (−1/2 − 1/4) : (−3/8)                    | 2             |

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
