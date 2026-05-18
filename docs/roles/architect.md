# Architect - BeatsPerMind

**Architect's Review Note:**
Integracja logiki biznesowej z warstwą wizualną na poziomie architektury chroni aplikację przed chaosem w kodzie (tzw. spaghetti CSS). Przesunięcie destrukturyzacji stanu nastroju do komponentu `App` jako Global App State sprawia, że wszystkie pozostałe komponenty konsumują wizualny kontekst w sposób deklaratywny, bez bezpośrednich manipulacji klasami CSS w rozproszonych miejscach. System motywów staje się własnością architektury, a nie przypadkowym dodatkiem w komponentach liściowych.

## Decyzje Techniczne

### Stack Decisions
| Warstwa | Technologia | Powód |
|---------|-------------|-------|
| Frontend | React 18 + Vite | Szybki setup, zero config |
| Styling | Tailwind CSS + shadcn/ui | Gotowe komponenty, obsługa dynamicznych motywów (Light/Dark Mode), efektów rozmycia warstwowego (Glassmorphism za pomocą backdrop-blur) oraz sprzętowo akcelerowanych animacji CSS bez używania ciężkich bibliotek JS |
| Routing | React Router v6 | Standard przemysłu |
| State | useState + Context | Wystarczające dla MVP |
| Audio | HTML5 Audio + YouTube Embed | Proste usecase |
| Data | Static JSON + localStorage | Zero kosztów |
| Hosting | Vercel | Free tier, easy deploy |

### Architektura Komponentów
```
Component Hierarchy:
App.jsx (Router + Global App State)
├── Landing.jsx
│   └── DynamicBackground (warstwa tła Aurory zależna od moodTheme)
├── Quiz.jsx → useQuiz hook
├── PlaylistView.jsx
│   ├── LearnMore.jsx
│   └── FocusMode button
│   └── [propaguje mood theme do Layout Context]
├── FocusMode.jsx
│   ├── Timer.jsx → useTimer hook
│   └── AmbientPlayer.jsx → useAudio hook
│   └── [odczytuje themeVariant z Global App State]
└── Navigation.jsx
```

## Modele Systemu

### Component Model
```mermaid
classDiagram
    class App {
        +routes
        +moodTheme
    }
    class Quiz {
        -currentStep
        -answers
        +handleSubmit()
    }
    class useQuiz {
        +currentStep
        +answers
        +setAnswer()
    }
    class PlaylistView {
        +bestPlaylist
        +isPlaying
        +mood
        +backgroundColor
        +glowIntensity
    }
    class FocusMode {
        +mode
        +timeLeft
        +themeVariant
    }
    class useTimer {
        +timeLeft
        +isRunning
        +toggle()
        +reset()
    }
    App --> Quiz
    App --> PlaylistView
    App --> FocusMode
    Quiz --> useQuiz
    FocusMode --> useTimer
    PlaylistView ..> App : mood propagates
    FocusMode ..> App : themeVariant reads
```

### Data Model
```
Playlist JSON Schema:
{
  "id": "playlist-1",
  "title": "Deep Focus Instrumental",
  "youtubePlaylistId": "PLxxxxxxxxx",
  "spotifyUrl": "https://...",
  "tags": {
    "activity": "study",
    "energy": "low",
    "lyrics": "instrumental"
  },
  "bpm": "60-80",
  "mood": "focus" | "relax" | "energy"
}

Klucz "mood" jest punktem wejścia dla systemu renderowania tła — jego wartość determinuje paletę Aurory, intensywność poświaty (glow) w trybie Dark Mode oraz redukcję ostrych krawędzi kontenerów na całej aplikacji.

AmbientSound Schema:
{
  "id": "rain",
  "name": "Rain",
  "icon": "CloudRain",
  "src": "/sounds/rain.mp3",
  "color": "blue",
  "moodAlignment": ["focus", "relax"]
}

Każdy dźwięk środowiskowy ma przypisaną listę nastrojów (moodAlignment), co pozwala na automatyczne dopasowanie palety tła do aktywnie odtwarzanego dźwięku w trybie Focus Mode.
```

### State Flow
```
Quiz Flow:
User answers → useQuiz stores → playlistMatcher → PlaylistView

Mood & Theme Flow:
PlaylistView (odczytuje playlist.mood) → Global App State / Layout Context → Dynamic Background Render
(Aplikowanie klas Tailwind: kolory Aurory, natężenie poświaty 'glow' w trybie Dark Mode, redukcja ostrych krawędzi kontenerów)

Timer Flow:
useTimer manages (work/break) → FocusMode displays → Auto-switch at 0

Audio Flow:
AmbientPlayer sets sound → useAudio plays → Volume control
```

## Integracje

### External Integrations
| Service | Typ | Status |
|---------|-----|--------|
| YouTube Embed | Embed iframe | ✅ Active |
| Spotify Link | External URL | ✅ Active |
| Vercel | Hosting | ✅ Active |

### YouTube Integration Details
- **Method:** Embed iframe (not API)
- **URL Format:** `https://www.youtube.com/embed/videoseries?list={PLAYLIST_ID}&autoplay=1`
- **Benefits:** 
  - No API key needed
  - No quota limits
  - Autoplay support
  - Full playlist playback

### Future Integrations (Not MVP)
| Integration | When | Priority |
|-------------|------|----------|
| Supabase Auth | Phase 2 | Low |
| Spotify API | User requested | Medium |
| Stripe | Monetization | Low |