# 🔑 Das geheimnisvolle Mathe-Zimmer

Ein interaktives Mathe-Escape-Rätsel als Single-Page-Website, die ohne Build-Schritt direkt auf **GitHub Pages** läuft.

Im gezeichneten Zimmer (SVG) sind 5 Rätsel versteckt. Wer auf die richtigen Gegenstände klickt und alle Aufgaben löst, öffnet die Tür – mit Konfetti. 🎉

## Dateien

| Datei       | Inhalt                                                                  |
|-------------|-------------------------------------------------------------------------|
| `index.html`| Seitenaufbau, das gezeichnete Zimmer (SVG) und das Modal                |
| `style.css` | Animationen (Modal, Hotspots, Tür, Kerze), Feedback-Farben              |
| `script.js` | Rätsel, Antwortprüfung, Fortschritt (wird im Browser gespeichert), Konfetti |
| `.nojekyll` | Sagt GitHub Pages, dass die Dateien unverändert ausgeliefert werden sollen |

Tailwind CSS, die Schriften und die Konfetti-Bibliothek kommen per CDN, es muss also nichts installiert werden.

## Die 5 Rätsel

| Gegenstand    | Thema       | Lösung |
|---------------|-------------|--------|
| 📚 Bücherregal | Zahlenfolge | 42     |
| 🖼️ Gemälde     | Geometrie (Fläche) | 50 |
| 🕰️ Wanduhr     | Winkel      | 75     |
| 🐌 Fenster     | Logik       | 8      |
| 💰 Schatztruhe | Logik-Code  | 673    |

Eingaben wie `75°`, `50 cm²` oder `Tag 8` werden ebenfalls als richtig erkannt.

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
