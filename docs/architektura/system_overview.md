# BeatsPerMind - System Overview

## 1. Wprowadzenie

BeatsPerMind to aplikacja webowa typu Single Page Application (SPA) przeznaczona dla studentów, łącząca dwa kluczowe use case w jednym miejscu:

1. **Generator Playlist** - dopasowuje muzykę do aktywności, energii i preferencji
2. **Focus Mode** - timer Pomodoro z dźwiękami ambient

### Value Proposition (Unikalna Wartość Użytkowa)

BeatsPerMind to nie tylko stoper i odtwarzacz - to immersyjne, zsynchronizowane środowisko audio-wizualne, które:

- **Stymuluje skupienie** poprzez organiczny wizualizator oddechu oparty na 4 zaokrąglonych warstwach rozmycia eliminujących ostre krawędzie
- **Redukuje zmęczenie oczu** dzięki adaptacyjnemu Dark Mode z atramentowym tłem (`bg-[#020617]`) i poświatami zewnętrznych (`shadow-glow`) zamiast czarnych cieni
- **Synchronizuje wizualizację z muzyką** - paletę kolorów tła dynamicznie dopasowuje do nastroju playlisty (bordowo-fioletowa dla Focus, morsko-turkusowa dla Energy)
- **Dostarcza płynności 60 FPS** przy wyłącznym wykorzystaniu akceleracji sprzętowej GPU dla animacji Aurora i oddechowych

## 2. Architektura Systemu

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   React SPA (Vite)                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Landing   │→│    Quiz     │→│PlaylistView │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                          ↓                            │   │
│  │                  ┌─────────────┐                     │   │
│  │                  │ FocusMode   │                     │   │
│  │                  └─────────────┘                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌──────────────────────┐  ┌───────────────────────────┐    │
│  │  playlists.json      │  │  localStorage             │    │
│  │  (static data)       │  │  (quiz answers, settings) │    │
│  └──────────────────────┘  └───────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              YouTube Embed (iframe)                  │  │
│  │  - Full playlist playback                            │  │
│  │  - No API key required                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Komponenty Systemu

#### Frontend Components (React)

| Komponent | Opis | Dependencies |
|-----------|------|--------------|
| `Landing.jsx` | Strona powitalna, wejście do quizu | React Router |
| `Quiz.jsx` | Formularz 3 pytań o aktywność/energię | useQuiz hook |
| `PlaylistView.jsx` | Wyświetla dopasowaną playlistę + glassmorphism card | useQuiz, playlistMatcher |
| `FocusMode.jsx` | Kontener fullscreen z glassmorphism | ThemeContext, useTimer |
| `FocusModeTimer.jsx` | **Organiczny wizualizator oddechowy oparty na 4 zaokrąglonych warstwach rozmycia (`rounded-full`, `blur-[2px]`) eliminujących ostre krawędzie kontenerów** | useTimer hook |
| `AmbientPlayer.jsx` | Wybór i odtwarzanie dźwięków z glassmorphism kartami | useAudio hook |
| `LearnMore.jsx` | Sekcja edukacyjna z feature cards | - |
| `Navigation.jsx` | Nawigacja między stronami | React Router |

#### Global/Layout Context

| Kontekst | Opis |
|----------|------|
| `ThemeContext.jsx` | Zarządza dynamicznym renderowaniem 15 kół tła Aurory (`mood`-based) oraz adaptacyjnym Dark Mode |

#### Custom Hooks

| Hook | Opis |
|------|------|
| `useQuiz.js` | Zarządza stanem quizu (3 kroki, odpowiedzi) |
| `useTimer.js` | Logika Pomodoro: 25min work / 5min break |
| `useAudio.js` | Odtwarzanie ambient sounds z kontrolą głośności |

#### Utils

| Moduł | Opis |
|-------|------|
| `playlistMatcher.js` | Algorytm dopasowania playlist (activity=2, energy=1.5, lyrics=1) |
| `ambientSounds.js` | Konfiguracja 4 dźwięków (rain, white-noise, cafe, forest) |

### 2.3 Data Flow

```
User Journey:
Landing → Quiz (3 pytania) → PlaylistView → [Learn More] or [Focus Mode]

Data Flow:
1. User selects answers in Quiz
2. useQuiz stores answers in useState
3. playlistMatcher calculates best match from playlists.json
4. PlaylistView displays playlist + YouTube embed + Spotify link + injects mood parameter into ThemeContext
5. ThemeContext dynamically renders 15 Aurora circles based on playlist.mood (focus/relax/energy) and adapts color palette:
   - Focus mode: bordowo-fioletowa (bordo-grafit gradient)
   - Energy mode: morsko-turkusowa (turkus-granat gradient)
   - Relax mode: neutral adaptive
6. Optionally navigate to FocusMode for timer + ambient sounds with synchronized visual styling
```

## 3. Non-Functional Requirements

| Kategoria | Wymaganie |
|-----------|-----------|
| Performance | Time to first value: < 2 minuty |
| Availability | Frontend only - hostowane na Vercel |
| Scalability | Static hosting - skalowalne do 10k+ miesięcznie |
| Security | Brak wrażliwych danych, tylko statyczne JSON |
| Maintenance | < 1h/miesiąc - zero backendu |
| **UX & UI Fluidity** | **Animacje tła (Aurora) oraz oddechowe (`animate-breathe`) muszą działać z płynnością na poziomie 60 FPS, wykorzystując wyłącznie akcelerację sprzętową GPU** |
| **Security/Design (Dark Mode)** | **Bezpieczny Dark Mode: atramentowe tło `bg-[#020617]` + poświaty zewnętrzne `shadow-glow` o niskim kryciu zamiast czarnych cieni; standard glassmorphism card z `backdrop-blur-2xl bg-white/5`** |

## 4. Constraints

- **Budżet:** 0€ - tylko darmowe tier-y
- **Czas:** 15h limit - proste rozwiązania
- **Doświadczenie:** Początkujący - unikać complex stacków
- **Dane:** Tylko statyczne JSON + localStorage