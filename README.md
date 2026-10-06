# 🔑 Das geheimnisvolle Mathe-Zimmer – Rationale Zahlen

Ein interaktives Mathe-Escape-Rätsel als Single-Page-Website, die ohne Build-Schritt direkt auf **GitHub Pages** läuft.

Im gezeichneten Zimmer (SVG) sind 8 Rätsel versteckt. Wer die richtigen Details im Zimmer findet und alle Aufgaben löst, öffnet die Tür – mit Konfetti. 🎉

## Dateien

| Datei       | Inhalt                                                                  |
|-------------|-------------------------------------------------------------------------|
| `index.html`| Seitenaufbau, das gezeichnete Zimmer (SVG) und das Modal                |
| `style.css` | Animationen (Modal, Hotspots, Tür, Kerze), Feedback-Farben              |
| `script.js` | Rätsel, Antwortprüfung, Fortschritt (wird im Browser gespeichert), Konfetti |
| `.nojekyll` | Sagt GitHub Pages, dass die Dateien unverändert ausgeliefert werden sollen |

Tailwind CSS, die Schriften und die Konfetti-Bibliothek kommen per CDN, es muss also nichts installiert werden.

## Die 8 Rätsel (Thema: rationale Zahlen)

Jedes Rätsel steckt hinter einem kleinen Detail im Zimmer. Die Fortschrittsanzeige nennt nur das Thema der Aufgabe, nicht das Versteck.

| # | Detail im Zimmer             | Thema                  | Aufgabe                                          | Lösung          |
|---|------------------------------|------------------------|--------------------------------------------------|-----------------|
| 1 | 🕯️ Kerze (Tisch)              | Bruchteil berechnen    | 20-cm-Kerze, 2,5 cm/h – Anteil nach 3 h          | 3/8 (0,375)     |
| 2 | 🌙 Mond (Fenster)             | Negative Zahlen vergleichen | Größte von −2/3, −0,6, −5/8, −0,65               | −0,6 (−3/5)     |
| 3 | 🐌 Schnecke (Fensterbank)     | Zahlengerade: Veränderung | Von 0,8 nach −1 1/5 – Veränderung                | −2              |
| 4 | ❓ Fragezeichen-Buch (Regal)  | Zahlenfolge mit Brüchen | 81, −54, 36, −24, 16, ?                          | −32/3 (−10 2/3) |
| 5 | 🟪 Lila Rechteck (Gemälde)    | Brüche dividieren      | Fläche 3/4 m², Länge 1 1/4 m – Breite?           | 3/5 (0,6)       |
| 6 | 🌡️ Thermometer (Wand)         | Addieren mit Vorzeichen | −4,5 °C + 7 1/4 − 5,5                            | −2,75 (−11/4)   |
| 7 | 🕒 Uhrzeiger (Wanduhr)        | Multiplizieren mit Minus | 21 Tage · (−2/5) Minute                          | −8,4 (−42/5)    |
| 8 | 🔒 Truhenschloss              | Mittelwert berechnen   | Mittelwert von −3/4, 1/2, −1 1/4, 2,5            | 1/4 (0,25)      |

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
