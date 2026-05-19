# BeatsPerMind - Architecture Decision Records (ADR)

## Architect's Alignment Note

> Włączenie reguł warstwy wizualnej i uxowej bezpośrednio w dokument ADR podnosi dojrzałość technologiczną projektu do poziomu korporacyjnych standardów inżynierskich. Tradycyjne ADR trackują wyłącznie decyzje strukturalne (framework, biblioteki, routing), co pozostawia lukę między architekturą a implementacją. Gdy reguły wizualne, perfomance budgets i obowiązujące konwencje UI nie są rejestrowane formalnie, programiści wprowadzają losowe zmiany w什telnym typie — co prowadzi do regresji wizualnych, naruszenia spójności marki i nieplanowanych spadków wydajności. Dodanie ADR-009 i ADR-010 wypełnia tę lukę, czyniąc decyzje dotyczące wyglądu i animacji tak samo wiążącymi dla systemów AI i zespołu, jak wybór frameworka frontendowego. Bez tego dpkumentu reguły UI pozostają w głowach programistów, a nie w kodzie.

---

## ADR-001: React + Vite zamiast Next.js

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba wybrać framework frontendowy dla aplikacji studentów z ograniczeniami czasowymi (15h) i budżetowymi (0€).

### Rozważane Opcje
- React + Vite
- Next.js

### Decyzja
Wybrano **React + Vite**.

### Uzasadnienie
| Kryterium | React + Vite | Next.js | Wybór |
|-----------|--------------|---------|-------|
| Setup Time | 2 minuty | 10 minut | Vite |
| Config | Zero config | Wiele opcji | Vite |
| SSR | Nie potrzebne | Tak | Vite |
| Bundle Size | Lżejszy | Cięższy | Vite |
| Learning Curve | Niska | Wyższa | Vite |

### Skutki
- ✅ Szybszy development
- ✅ Mniej plików konfiguracyjnych
- ✅ Brak SSR overhead dla prostego SPA

---

## ADR-002: Tailwind CSS + shadcn/ui zamiast Styled Components

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba wybrać bibliotekę stylingową dla szybkiego prototypowania UI, zarchitektury systemu dynamicznych nastrojów (Mood-Driven Themes) oraz zaawansowanych efektów Glassmorphism przy jednoczesnym zachowaniu zerowego budżetu wagowego paczki (bundle size).

### Rozważane Opcje
- Tailwind CSS + shadcn/ui
- Styled Components
- CSS Modules

### Decyzja
Wybrano **Tailwind CSS + shadcn/ui**.

### Uzasadnienie
- shadcn/ui dostarcza gotowe komponenty (Button, Card, Progress)
- Copy-paste implementacja bez vendor lock-in
- Responsive utilities wbudowane
- Theme-aware dark mode z Tailwind
- Wybór Tailwinda był podyktowany architektoniczną potrzebą budowy dynamicznego systemu nastrojów (Mood-Driven Themes) — zmiana wartości `playlist.mood` w czasie rzeczywistym musi generować płynne zmiany gradientów tła i oświetlenia bez renderowania nowych komponentów, co jest możliwe poprzez podmianę klas Tailwind bazowanych na zmiennych CSS.
- Architektoniczna potrzeba zaawansowanego Glassmorphismu (przeziskroczone kafelki, Tryb Focus) wymagała użycia natywnych klas `backdrop-blur`, `backdrop-brightness` oraz `bg-white/10` — narzędzi dostępnych bezpośrednio w Tailwindzie bez potrzeby pisania niestandardowego CSS.
- Tailwind umożliwia natywną obsługę animacji bez narzutu ciężkich skryptów JS (zob. ADR-009), co przekłada się na stały 60 FPS nawet na słabszych laptopach studenckich.

### Skutki
- ✅ Gotowe komponenty w 5 minut
- ✅ Spójny design system
- ✅ Łatwe modyfikacje stylów
- ✅ Architektoniczna obsługa dynamicznych nastrojów (Mood-Driven Themes)
- ✅ Natywny Glassmorphism bez dodatkowego CSS
- ✅ Animacje GPU-akcelerowane bez bibliotek zewnętrznych

---

## ADR-003: useState + Context zamiast Redux/Zustand

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba zarządzania stanem aplikacji przy minimalnym kodzie, w tym globalnego kontrolera nastroju aplikacji (ThemeContext), który steruje wizualną prezentacją całej warstwy wizualnej.

### Rozważane Opcje
- useState + Context API
- Redux Toolkit
- Zustand

### Decyzja
Wybrano **useState + Context API**.

### Uzasadnienie
- MVP wymaga tylko 3 stanów globalnych: quiz, timer, audio
- Redux: 5+ plików dla prostego stanu
- Zustand: dodatkowa zależność niepotrzebna
- Context API wystarcza dla 3-4 komponentów
- ThemeContext jest powołany nie tylko do przełączania trybów Light/Dark, ale jako globalny odbiornik parametru `playlist.mood` — każda zmiana wartości mood wywołuje globalny re-render gradientów Aurora i reguluje natężenie poświaty `glow`, co jest osiągalne na poziomie Context bez żadnej zewnętrznej biblioteki do zarządzania stanem

```javascript
// Wystarczy prosty useContext
const QuizContext = createContext()
const TimerContext = createContext()
const ThemeContext = createContext()
```

### Skutki
- ✅ Mniej kodu
- ✅ Brak dodatkowych zależności
- ✅ Prostsze debugowanie
- ✅ ThemeContext działa jako pojedynczy punkt prawdy dla wszystkich zmian nastroju wizualnego

---

## ADR-004: React Router v6 zamiast Wouter

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba routingu dla 4 stron: Landing, Quiz, PlaylistView, FocusMode.

### Rozważane Opcje
- React Router v6
- Wouter
- Brak routingu (single page)

### Decyzja
Wybrano **React Router v6**.

### Uzasadnienie
- Standard przemysłu - łatwo znaleźć pomoc
- Dla 3-4 routes nie ma przewagi Wouter
- Nested routes dostępne jeśli potrzebne

### Skutki
- ✅ Standardowy routing
- ✅ Dobla dokumentacja
- ✅ Łatwe deployment na Vercel

---

## ADR-005: HTML5 Audio zamiast Howler.js

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba odtwarzać ambient sounds (deszcz, white noise, kawiarnia, las).

### Rozważane Opcje
- HTML5 Audio API
- Howler.js
- Web Audio API

### Decyzja
Wybrano **HTML5 Audio API**.

### Uzasadnienie
- YouTube embed używa iframe (nie audio API)
- Ambient sounds to proste MP3 playback
- Howler.js to overhead dla prostego use case

```javascript
// Wystarczy native HTML5
const audio = new Audio('/sounds/rain.mp3')
audio.play()
audio.volume = 0.7
```

### Skutki
- ✅ Mniej kodu
- ✅ Brak dodatkowej zależności
- ✅ Prostsze cache'owanie

---

## ADR-006: Static JSON + LocalStorage zamiast Backendu

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba przechowywania danych przy zerowym budżecie.

### Rozważane Opcje
- Static JSON + LocalStorage
- Firebase
- Supabase

### Decyzja
Wybrano **Static JSON + LocalStorage**.

### Uzasadnienie
- Playlisty to statyczne dane (8 playlist)
- Odpowiedzi quizu w localStorage
- Zero kosztów utrzymania
- Zero serwerów do konfigurowania

### Struktura danych
```
src/data/
  playlists.json    # 8 playlist z tagami energy/activity/lyrics
  
localStorage keys:
  - quizAnswers    # {activity, energy, lyrics}
  - settings       # volume, preferences
```

### Skutki
- ✅ Zero kosztów
- ✅ Zero maintenance
- ✅ Proste backupy (git)

---

## ADR-007: YouTube Embed zamiast YouTube Data API

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba odtwarzać playlisty bez reklam i przerw.

### Rozważane Opcje
- YouTube Embed (iframe)
- YouTube Data API

### Decyzja
Wybrano **YouTube Embed (iframe)**.

### Uzasadnienie
- API wymaga klucza i quota
- OAuth to overkill dla MVP
- Embed odtwarza całą playlistę
- Brak reklam w embed (dla własnych filmów)

```html
<iframe 
  src="https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID&autoplay=1"
  allowfullscreen>
</iframe>
```

### Skutki
- ✅ Zero konfiguracji API
- ✅ Zero limitów requestów
- ✅ Prostsze wdrożenie

---

## ADR-008: Timer w Foreground zamiast Web Workers

**Status:** Zaakceptowane  
**Date:** 2026-04-05

### Kontekst
Potrzeba działającego timera Pomodoro kiedy karta jest aktywna.

### Rozważane Opcje
- setTimeout/setInterval (foreground)
- Web Workers
- Background sync API

### Decyzja
Wybrano **setTimeout/setInterval w foreground**.

### Uzasadnienie
- MVP nie wymaga działania w tle
- Użytkownik widzi timer = karta aktywna
- Web Workers = overkill
- Background timers = niepotrzebne dla studentów

### Algorytm Pomodoro
```
WORK: 25 minutes → BREAK: 5 minutes → WORK: 25 minutes...
Auto-switch przy zakończeniu fazy
Pomodoro counter zwiększa się po WORK→BREAK
```

### Skutki
- ✅ Prostsza implementacja
- ✅ Mniej kodu
- ✅ OK dla użytkownika (patrzy na timer)

---

## ADR-009: Sprzętowo akcelerowane animacje CSS zamiast bibliotek zewnętrznych (Framer Motion / GSAP)

**Status:** Zaakceptowane  
**Date:** 2026-05-18

### Kontekst
Potrzeba wdrożenia płynnych, immersyjnych animacji (pulsowanie kół Aurory w tle, organiczne przewijanie gradientów nastrojów, płynne przejścia między stanami Focus Mode) przy jednoczesnym zachowaniu zerowego budżetu wagowego paczki (bundle size) i maksymalnej płynności na słabszych laptopach studenckich.

### Rozważane Opcje
- Framer Motion (React Motion Library)
- GSAP (GreenSock Animation Platform)
- Czyste Tailwind CSS z customowym keyframes (GPU-only)
- CSS Transition na węzłach DOM

### Decyzja
Wybrano **Czyste Tailwind CSS z customowym keyframes, ograniczonym wyłącznie do właściwości akcelerowanych sprzętowo: `transform` i `opacity`**.

### Uzasadnienie
| Kryterium | Framer Motion | GSAP | Czysty Tailwind GPU-only | Wybór |
|-----------|--------------|------|--------------------------|-------|
| Bundle Impact | +45 KB gzipped | +35 KB gzipped | 0 KB (native CSS) | Tailwind |
| FPS Consistency | Zależna od JS thread | Zależna od JS thread | Stałe 60 FPS (GPU) | Tailwind |
| Złożoność animacji | Bardzo wysoka | Bardzo wysoka | Umiarkowana (MVP ok) | Tailwind |
| Wsparcie Tailwind | Tak | Nie | Tak (full support) | Tailwind |
| JS Overhead | Taki (runtime JS) | Taki (runtime JS) | Żaden (CSS-only) | Tailwind |

- Stałe 60 FPS gwarantowane przez composting na GPU, bez wzajemnego blokowania wątku JS podczas trwania animacji
- Każda właściwość poza `transform` i `opacity` (np. `width`, `height`, `top`, `left`, `background-color`) wywołuje reflow layout — jest bezwzględnie zablokowana w implementacji Aurora
- Brak dodatkowych kilobajtów bibliotek JS w bundle
- Pełna kontrola nad zachowanie klas w Tailwindzie — deweloper widzi dokładnie co się dzieje, bez "magii" bibliotek

```javascript
// Przykład: pulsowanie kół Aurory (CSS-only, GPU-akcelerowane)
// tailwind.config.js
animation: {
  'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
  'float': 'float 6s ease-in-out infinite',
},
keyframes: {
  'pulse-slow': {
    '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
  },
  'float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}
```

### Skutki
- ✅ Stała wydajność 60 FPS bez względu na warunki sieci lub wydajność JS thread
- ✅ Brak "jankowania" (szarpania) interfejsu podczas trwania animacji
- ✅ Zero dodatkowej zależności w node_modules
- ❌ Nieco trudniejsze pisanie bardziej złożonych sekwencji orchestracji (co w MVP jest akceptowalnym kompromisem)

---

## ADR-010: Rygorystyczny kształt masek rozmycia (Koła `rounded-full` zamiast prostokątów)

**Status:** Zaakceptowane  
**Date:** 2026-05-18

### Kontekst
Wykrycie krytycznego błędu wizualnego (tzw. efektu "ducha prostokąta"), gdzie warstwy bluru nakładane na kwadratowe kontenery generowały nieestetyczne, ostre krawędzie niszczące efekt luksusowej głębi i przeziskroczonego Glassmorphismu. Problem ujawniał się szczególnie przy zmianie rozmiaru okna przeglądarki i przy przeskalowywaniu kontenerów rodzica.

### Rozważane Opcje
- Łagodzenie za pomocą `overflow: hidden` na kontenerach rodzicach
- Użycie dodatkowych pseudo-elementów do rozmycia krawędzi
- Architektoniczny nakaz stosowania wyłącznie kształtów kołowych (`rounded-full`) dla wszystkich warstw generujących blask

### Decyzja
Wybrano **Architektoniczny nakaz stosowania wyłącznie kształtów kołowych (`rounded-full`) dla wszystkich warstw generujących blask, tła Aurora oraz tła wizualizera w `FocusModeTimer.jsx`**.

### Uzasadnienie
- Każda warstwa z `backdrop-blur` ma zastosowany `rounded-full` bez względu na kontekst rodzica
- Kołowy kształt maski eliminuje całkowicie efekt ostrych krawędzi bluru w dowolnym rozmiarze
- Czysta implementacja CSS: jedna klasa `rounded-full` — bez dodatkowych pseudo-elementów, bez dodatkowych wyliczeń layout
- Architektoniczny nakaz zapobiegający wprowadzeniu prostokątnych kontenerów przez członków zespołu lub systemy AI — obowiązek jest formalnie dokumentowany, a nie pozostawiony jako niepisana reguła

```jsx
<!-- ✅ Wymagany wzorzec — TYLKO rounded-full -->
<div className="absolute rounded-full backdrop-blur-3xl ..." />
<div className="absolute rounded-full brightness-150 ..." />
<div className="rounded-full overflow-hidden"> {/* wizualizer w FocusMode */} 

<!-- ❌ Zabroniony wzorzec -->
<div className="backdrop-blur-xl" />  {/* brak rounded-full = ghost rectangle */}
```

### Skutki
- ✅ Całkowicie eliminowany efekt "ducha prostokąta"
- ✅ Jednolity, luksusowy wygląd warstw Glassmorphism w 100% przypadków rozmiaru okna
- ✅ Brak dodatkowego kodu CSS ani logiki JS do obsługi krawędzi
- ❌ Wymuszenie kołowych kształtów może być ograniczeniem w niektórych kontekstach layout, które wymagają prostokątnych elementów — wymaga to oceny eksplicitej przy każdym nowym komponencie z backdrop-blur

---

## Podsumowanie

| Decyzja | Wybór | Powód |
|---------|-------|-------|
| Framework | React + Vite | Szybki setup, brak SSR |
| Styling | Tailwind + shadcn | Gotowe komponenty, Mood Themes, Glassmorphism |
| State | useState + Context | Prosty, wystarczający, ThemeContext jako punkt prawdy |
| Routing | React Router | Standard przemysłu |
| Audio | HTML5 Audio | Proste usecase |
| Data | Static JSON | Zero kosztów |
| Media | YouTube Embed | Bez API key |
| Timer | Foreground | UX-appropriate |
| Animacje | CSS GPU-only | 60 FPS, 0 KB, brak jankowania |
| Kształt blur | Tylko rounded-full | Eliminacja efektu ducha prostokąta |
