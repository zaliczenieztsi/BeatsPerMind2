# Developer - BeatsPerMind

## Standardy Kodu

### JavaScript/JSX Conventions
```javascript
// ✅ Good
const [isActive, setIsActive] = useState(false)
const handleClick = () => setIsActive(true)

// ❌ Bad
let active = false
function click() { active = true }

// Component naming - PascalCase
function TimerDisplay() {}

// Function naming - camelCase
function calculatePlaylistMatch() {}

// Constants - UPPER_SNAKE_CASE
const WORK_DURATION = 25 * 60
```

### File Structure
```
src/
├── components/     # React components
├── data/           # Static JSON, ambientSounds.js
├── hooks/          # Custom hooks (useQuiz, useTimer, useAudio)
├── utils/          # playlistMatcher.js
├── App.jsx
└── main.jsx
```

### Import Order
```javascript
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party
import { Button } from '@/components/ui/button'

// 3. Local components
import { Quiz } from './Quiz'

// 4. Utils/Hooks
import { useQuiz } from '@/hooks/useQuiz'
```

## Konwencje

### Tailwind CSS - Standardy UI Premium

#### Glassmorphism
```jsx
// ✅ Glass card - oficjalna klasa dla "szklanych" kart
<div className="bg-background/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full">

// Unikalna poświata wokół karty (obowiązkowe dla glass cards nakładających blur)
<div className="shadow-[0_0_30px_rgba(20,184,166,0.15)]">

// Dark mode glow - zewnętrzna poświata zamiast czarnych cieni
<div className="dark:shadow-[0_0_40px_rgba(20,184,166,0.12)]">
```

#### Zmiękczanie Kontenerów (No Sharp Rectangles)
```jsx
// ✅ Absolute rule: Kontenery z blur/shadow MUSZĄ używać rounded-full
// Unikamy efektu "ducha prostokąta" - wzór z image_10.png

// ❌ BAD - tworzy trójkątny "duch" krawędzi przy blurze
<div className="bg-background/40 backdrop-blur-xl rounded-lg">

// ✅ GOOD - zaokrąglone maskowanie eliminuje efekt prostokąta
<div className="bg-background/40 backdrop-blur-xl rounded-full">
```

#### Dark Mode Glow
```jsx
// ✅ W trybie ciemnym stosujemy zewnętrzną poświatę zamiast czarnych cieni
// Krycie cienia 0.12 dla delikatnego, nieinwazyjnego efektu

<div className="dark:shadow-[0_0_40px_rgba(20,184,166,0.12)]">
<div className="dark:shadow-[0_0_40px_rgba(168,85,247,0.12)]"> // purple accent
<div className="dark:shadow-[0_0_40px_rgba(251,146,60,0.12)]"> // orange accent

// Dostępne kolory poświaty:
// teal: rgba(20,184,166,0.12) - focus/relaxed moods
// purple: rgba(168,85,247,0.12) - calm moods
// orange: rgba(251,146,60,0.12) - energy moods
```

#### Dark Mode Variants
```jsx
// ✅ Dark mode variants with glow
<div className="bg-white dark:bg-slate-900 dark:shadow-[0_0_40px_rgba(20,184,166,0.12)]">
```

### Animation Conventions
```jsx
// ✅ Use native, hardware-optimized CSS animations
// Our premium animations (animate-breathe) are GPU-accelerated

// Layered animation delays for wave effect
<div style={{ animationDelay: '0ms' }}>
<div style={{ animationDelay: '200ms' }}>
<div style={{ animationDelay: '400ms' }}>
<div style={{ animationDelay: '600ms' }}>
<div style={{ animationDelay: '800ms' }}>
<div style={{ animationDelay: '1000ms' }}>

// Aurora wave animation pattern
<div className="absolute rounded-full animate-breathe" />
```

### State Management
```javascript
// Quiz state shape
const initialQuizState = {
  currentStep: 0,
  answers: {
    activity: null,
    energy: null,
    lyrics: null
  },
  bestPlaylist: null
}

// Timer state shape
const initialTimerState = {
  mode: 'work',      // work | break
  timeLeft: 25 * 60,
  isRunning: false,
  pomodoroCount: 0
}

// Playlist state shape - extended with mood for dynamic theming
const initialPlaylistState = {
  selectedPlaylist: null,
  mood: 'focus',     // 'focus' | 'relax' | 'energy'
  colorTheme: {
    primary: '#14b8a6',   // teal for focus
    glow: 'rgba(20,184,166,0.12)'
  }
}

### Component Props
```jsx
// Destructure props
function PlaylistCard({ playlist, onSelect }) {
  return (
    <Card onClick={() => onSelect(playlist)}>
      <h3>{playlist.title}</h3>
    </Card>
  )
}
```

## Workflow Implementacji

### Development Process
1. **Branch:** `feature/nazwa-funkcjonalnosci`
2. **Implement:** Follow checklist in plan
3. **Test:** `npm run dev` - manual testing
4. **Build:** `npm run build` - verify no errors
5. **Commit:** Clear message referencing plan

### Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint (if configured)
npm run lint
```

### Implementation Checklist
- [ ] Read SPEC.md for requirements
- [ ] Check existing components for patterns
- [ ] Create/update components
- [ ] Test in dev server
- [ ] Run production build
- [ ] Update plan file

### Error Handling
```javascript
// Console log errors during dev
useEffect(() => {
  if (error) {
    console.error('Quiz error:', error)
  }
}, [error])
```

### Performance Considerations
- Use `React.memo` for expensive components
- Debounce search/filter inputs
- Lazy load YouTube iframe
- Keep bundle small (no heavy libraries)
- **Animation Performance - Absolute Requirements:**
  - Maintain 60 FPS for all background animations (Aurora, breathing effects)
  - **FORBIDDEN:** Properties triggering continuous browser repaint (width, height, left, top)
  - **ALLOWED:** transform, opacity (GPU-accelerated)
  - Use `will-change: transform` for animated elements
  - Prefer `transform3d(0,0,0)` to force GPU acceleration

---

## Code Review Note (Lead Frontend Developer)

Te wyżej zapisane standardy inżynieryjne zapewniają, że kod aplikacji będzie:

1. **Łatwy w utrzymaniu** - Spójna konwencja Glassmorphism i dark mode glow eliminuje niepotrzebne decyzje architektoniczne przy każdym commicie
2. **Bezpieczny wydajnościowo** - Zakaz właściwości wymuszających repaint + wymóg 60 FPS gwarantuje płynność 15 kół Aurora nawet na urządzeniach mobilnych
3. **Jakość klasy AAA** - Eliminacja prostokątnych "duchów" oraz spójna poświata tworzy interfejs premium bez szarpnięć wizualnych