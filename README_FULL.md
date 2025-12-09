# 🎯 Habit Tracker

Ein moderner Gewohnheits-Tracker mit täglichen Streaks und Kalenderübersicht.

## Features

### ✨ Hauptfunktionen
- **Gewohnheiten verwalten**: Erstelle, verfolge und lösche Gewohnheiten
- **Tägliche Streaks**: Verfolge aktuelle und beste Streaks für jede Gewohnheit
- **Kalenderübersicht**: Visualisiere deine Fortschritte in einem interaktiven Kalender
- **Erfolgsquote**: Sieh deine Abschlussrate im Überblick
- **Persistente Speicherung**: Alle Daten werden lokal im Browser gespeichert

### 📊 Statistiken
- **Aktueller Streak**: Wie viele aufeinanderfolgende Tage du die Gewohnheit erfüllt hast
- **Best Streak**: Dein längster bisheriger Streak
- **Erfolgsquote**: Prozentsatz der abgeschlossenen Tage
- **30-Tage Übersicht**: Detaillierte Ansicht der letzten 30 Tage

### 📅 Kalenderansicht
- Farbkodierung:
  - 🟩 **Grün**: Alle Gewohnheiten des Tages erledigt
  - 🟨 **Gelb**: Einige Gewohnheiten erledigt
  - 🟥 **Rot**: Keine Gewohnheiten erledigt (vergangene Tage)
- Navigation zwischen Monaten
- Detaillierte Statistiken pro Gewohnheit

## Verwendung

1. **Gewohnheit hinzufügen**
   - Text eingeben und "Hinzufügen" klicken
   - Die neue Gewohnheit erscheint in der Liste

2. **Gewohnheit abhaken**
   - "Abhaken" Button klicken um heute zu markieren
   - Der Button wird blau wenn heute erledigt

3. **Statistiken anzeigen**
   - Auf eine Gewohnheitskarte klicken für detaillierte Statistiken
   - Siehe aktuelle Streaks, beste Streaks und Erfolgsquote
   - Betrachte eine 30-Tage Übersicht im Modal

4. **Kalender navigieren**
   - Verwende die Pfeile um durch Monate zu navigieren
   - Sehe auf einen Blick wie viele Gewohnheiten pro Tag erfüllt wurden

## Technologie

- **HTML5**: Semantische Struktur
- **CSS3**: Modernes Design mit Gradienten und Animationen
- **JavaScript (ES6+)**: Objektorientierte Architektur mit LocalStorage

## Datenspeicherung

Alle Daten werden in LocalStorage gespeichert:
- `habits`: Array aller Gewohnheiten
- `completions`: Objekt mit Abschlussstatistiken pro Gewohnheit und Datum

## Browser-Kompatibilität

- Chrome/Edge (neueste Versionen)
- Firefox (neueste Versionen)
- Safari (neueste Versionen)
- Responsive Design für mobile Geräte

## Tipps zum Erfolg

💡 **Beste Praktiken**:
- Starte mit 2-3 Gewohnheiten
- Wähle realistische, spezifische Ziele
- Checke täglich ab für konsistente Streaks
- Nutze die Kalendaransicht zur Motivationshilfe
