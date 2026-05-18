# SPEC.md - Specyfikacja Techniczna BeatsPerMind MVP

> **Technical Alignment Note:** This specification is synchronized with the implementation files in `src/`. All data structures, algorithm logic, and component interfaces must align with the code in this document.

## 1. Struktura Projektu

```
beats-per-mind/
├── public/
│   └── sounds/           # Pliki MP3 ambient sounds
│       ├── rain.mp3
│       ├── white-noise.mp3
│       ├── cafe.mp3
│       └── forest.mp3
├── src/
│   ├── components/
│   │   ├── Landing.jsx       # Strona powitalna
│   │   ├── Quiz.jsx          # 3 pytania (activity, energy, lyrics)
│   │   ├── PlaylistView.jsx  # Wyświetlanie playlisty + YouTube embed
│   │   ├── FocusMode.jsx     # Timer Pomodoro + ambient sounds
│   │   ├── Navigation.jsx   # Bottom nav / header
│   │   ├── AmbientPlayer.jsx # Odtwarzacz ambient sounds
│   │   ├── FocusModeTimer.jsx # Design Timera
│   │   ├── LearnMore.jsx     # Dowiedz się więcej (BPM)
│   │   ├── ThemeToggle.jsx   # Dark Mode Switch
│   │   └── Timer.jsx         # Komponent timera
│   ├── context/
│   │   └── ThemeContext.jsx # Dark Mode + Mood Management
│   ├── data/
│   │   ├── playlists.json    # 8 playlist z tagami + mood field
│   │   └── ambientSounds.js  # Konfiguracja dźwięków
│   ├── hooks/
│   │   ├── useQuiz.js        # Logika quizu
│   │   ├── useTimer.js       # Logika timera Pomodoro
│   │   └── useAudio.js       # Odtwarzanie ambient sounds
│   ├── utils/
│   │   └── playlistMatcher.js # Algorytm dopasowania + mood forwarding
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 2. Struktura Danych - playlists.json

```json
{
  "playlists": [
    {
      "id": "lofi-focus",
      "name": "Lo-Fi Focus",
      "bpm": "70-85",
      "mood": "focus",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["nauka", "praca"],
        "energy": ["low", "medium"],
        "lyrics": ["no-lyrics"]
      }
    },
    {
      "id": "upbeat-instrumental",
      "name": "Upbeat Instrumental",
      "bpm": "100-120",
      "mood": "focus",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["nauka", "praca"],
        "energy": ["high"],
        "lyrics": ["no-lyrics"]
      }
    },
    {
      "id": "classical-study",
      "name": "Classical Study",
      "bpm": "80-100",
      "mood": "focus",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["nauka"],
        "energy": ["low", "medium"],
        "lyrics": ["no-lyrics"]
      }
    },
    {
      "id": "workout-hype",
      "name": "Workout Hype",
      "bpm": "140-160",
      "mood": "energy",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["trening"],
        "energy": ["high"],
        "lyrics": ["lyrics", "no-lyrics"]
      }
    },
    {
      "id": "running-warmup",
      "name": "Running Warm-up",
      "bpm": "100-120",
      "mood": "energy",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["trening"],
        "energy": ["medium"],
        "lyrics": ["no-lyrics"]
      }
    },
    {
      "id": "coffee-shop",
      "name": "Coffee Shop Vibes",
      "bpm": "70-90",
      "mood": "relax",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["praca"],
        "energy": ["low", "medium"],
        "lyrics": ["lyrics", "no-lyrics"]
      }
    },
    {
      "id": "chill-relax",
      "name": "Chill & Relax",
      "bpm": "60-80",
      "mood": "relax",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["relaks"],
        "energy": ["low"],
        "lyrics": ["no-lyrics"]
      }
    },
    {
      "id": "weekend-vibes",
      "name": "Weekend Vibes",
      "bpm": "90-110",
      "mood": "relax",
      "youtubePlaylistId": "PL_LIST_ID",
      "spotifyUrl": "https://spotify.link/...",
      "tags": {
        "activity": ["relaks"],
        "energy": ["medium", "high"],
        "lyrics": ["lyrics"]
      }
    }
  ]
}
```

## 3. Algorytm Dopasowania Playlisty

```javascript
// playlistMatcher.js

// Funkcja obliczająca dopasowanie playlisty do odpowiedzi quizu
function calculateMatchScore(playlist, userAnswers) {
  let score = 0;
  
  // Sprawdź dopasowanie aktywności (najważniejsze - waga 2)
  if (playlist.tags.activity.includes(userAnswers.activity)) {
    score += 2;
  }
  
  // Sprawdź dopasowanie poziomu energii (waga 1.5)
  if (playlist.tags.energy.includes(userAnswers.energy)) {
    score += 1.5;
  }
  
  // Sprawdź preferencję tekstu (waga 1)
  if (playlist.tags.lyrics.includes(userAnswers.lyrics)) {
    score += 1;
  }
  
  return score;
}

// Wybierz najlepszą playlistę
function findBestPlaylist(playlists, userAnswers) {
  let bestMatch = null;
  let highestScore = 0;
  
  playlists.forEach(playlist => {
    const score = calculateMatchScore(playlist, userAnswers);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = playlist;
    }
  });
  
  // Fallback: jeśli brak dopasowania, zwróć pierwszą playlistę
  const result = bestMatch || playlists[0];
  
  // Forwarduj mood wybranej playlisty do ThemeContext
  // – inicjuje natychmiastowe, płynne dostosowanie kolorystyki tła
  if (result && result.mood) {
    themeContext.setMood(result.mood);
  }
  
  return result;
}
```

**Logika:**
- Każda playlista ma tagi: activity, energy, lyrics
- Użytkownik wybiera 3 wartości w quizie
- Algorytm sumuje dopasowania (aktywność=2pkt, energia=1.5pkt, tekst=1pkt)
- Wygrywa playlista z najwyższym wynikiem

## 4. Konfiguracja Ambient Sounds

```javascript
// ambientSounds.js

export const ambientSounds = [
  {
    id: 'rain',
    name: 'Deszcz',
    icon: '🌧️',
    src: '/sounds/rain.mp3',
    color: '#3B82F6'
  },
  {
    id: 'white-noise',
    name: 'Biały szum',
    icon: '📻',
    src: '/sounds/white-noise.mp3',
    color: '#8B5CF6'
  },
  {
    id: 'cafe',
    name: 'Kawiarnia',
    icon: '☕',
    src: '/sounds/cafe.mp3',
    color: '#F59E0B'
  },
  {
    id: 'forest',
    name: 'Las',
    icon: '🌲',
    src: '/sounds/forest.mp3',
    color: '#10B981'
  }
];

export const defaultTimerSettings = {
  workDuration: 25 * 60,    // 25 minut w sekundach
  breakDuration: 5 * 60,    // 5 minut w sekundach
  longBreakDuration: 15 * 60
};
```

## 5. Flow Aplikacji

```
Landing → Quiz → PlaylistView → (opcjonalnie) Focus Mode
```

**Ścieżki:**
1. Landing → Quiz → PlaylistView → (opcjonalnie) Focus Mode
2. PlaylistView → Focus Mode (przycisk w interfejsie)
3. Focus Mode → PlaylistView (wyjście z focus mode)

## 6. Odpowiedzi Quizu

```javascript
// Struktura odpowiedzi użytkownika
const userAnswers = {
  activity: 'nauka',      // nauka | trening | praca | relaks
  energy: 'medium',       // low | medium | high
  lyrics: 'no-lyrics'    // lyrics | no-lyrics
};
```

## 7. Tech Stack

| Warstwa | Technologia |
|---------|-------------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + shadcn/ui (z rozszerzeniem o system dynamicznych motywów i efektów Glassmorphism) |
| Routing | React Router v6 |
| Stan | useState + Context |
| Audio | HTML5 Audio + YouTube IFrame API |
| Dane | Static JSON + LocalStorage |
| Hosting | Vercel (free tier) |

## 8. Standardy Wykonania UI/UX (UI Engine Specs)

### 8.1 Warstwowość Blasku – Blur Layers

FocusModeTimer blur layers must use `rounded-full` only for circular elements. 

**Zakazane (bad examples):**
```jsx
// ❌ Square blur layer with rounded-lg - inconsistent
<div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg" />

// ❌ Mixed border radius values
<div className="blur-layer rounded-t-xl rounded-b-full" />
```

**Poprawny (good example):**
```jsx
// ✅ Circular blur layer with rounded-full
<div className="absolute w-64 h-64 bg-white/10 backdrop-blur-md rounded-full" />
```

### 8.2 Specyfikacja Dark Mode

Dark mode styling uses GPU-accelerated opacity transitions instead of shadows.

| Element | Specyfikacja |
|---------|--------------|
| Background | `bg-[#020617]` (navy-950) |
| Card surfaces | `bg-slate-900/50` with `backdrop-blur` |
| Glow effect | `dark:shadow-[0_0_40px_rgba(r,g,b,0.12)]` - soft colored glow |

### 8.3 Wydajność Animacji

Wszystkie animacje systemowe muszą używać wyłącznie właściwości przyspieszonych GPU:

**Dozwolone:** `transform`, `opacity`, `filter`

**Zakazane:** `width`, `height`, `top`, `left`, `margin`, `padding`, keyframe `box-shadow`

```css
/* Poprawny przykład */
@keyframes pulseGlow {
  0% { opacity: 0.5; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.1); }
  100% { opacity: 0.5; filter: brightness(1); }
}
```

### 8.4 System Mądrych Motywów – Adaptacyjne Tła

ThemeContext przechowuje aktualny mood (`focus`, `energy`, `relax`) i zarządza:
- Centralizowanym gradientem tła
- Efektami Glassmorphism (backdrop-blur + transparency)
- Automatycznym forwardowaniem mood z `playlistMatcher.js` do ThemeProvider

## 9. Uwagi

- BPM jest statyczny (hardcoded) - tylko informacja dla użytkownika
- Timer działa tylko w foreground (aplikacja aktywna)
- Spotify linki są statyczne - klikalny przycisk bez API
- YouTube embed - całe playlisty, nie pojedyncze utwory
- Aplikacja nie używa prawdziwego AI - proste reguły dopasowania (tagi + scoring)
