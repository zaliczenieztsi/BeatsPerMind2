# UX/UI Designer - BeatsPerMind

## Makiety (Mockups)

### Screen Flow

```
Screen 1: Landing
┌─────────────────────────────────────┐
│            BeatsPerMind             │
│                                     │
│    [ Rozpocznij Quiz ]              │
│    [ Dowiedz się więcej ]           │
└─────────────────────────────────────┘

Screen 2: Quiz (3 Steps)
┌─────────────────────────────────────┐
│  Krok 1 z 3: Jaka aktywność?       │
│  [🎓 Nauka] [💪 Trening] [💼 Praca] │
│                                     │
│  Krok 2 z 3: Poziom energii        │
│  [Low ◉————————● High]              │
│                                     │
│  Krok 3 z 3: Preferencje           │
│  [Tekst] [Instrumentalna]          │
│                                     │
│  [ Pokaż playlistę ]               │
└─────────────────────────────────────┘

Screen 3: Playlist View
┌─────────────────────────────────────┐
│  [Playlist Cover]                   │
│  Your Focus Playlist 🎵            │
│  BPM: 60-80                         │
│                                     │
│  [▶ Play] [Focus Mode] [Spotify]   │
│                                     │
│  [Dowiedz się więcej] ▼            │
└─────────────────────────────────────┘

Screen 4: Focus Mode
┌─────────────────────────────────────┐
│  FOCUS MODE ⏱️                     │
│                                     │
│        25:00                        │
│  [⏸] [⟲] [BREAK]                   │
│                                     │
│  Ambient Sounds:                    │
│  [🌧️ Rain] [☕ Cafe] [🌲 Forest]    │
└─────────────────────────────────────┘
```

## Przepływy Użytkownika (User Flows)

### Flow 1: Nowy Użytkownik → Playlista
```
1. Wejdź na stronę (/)
2. Kliknij "Rozpocznij quiz"
3. Odpowiedz na 3 pytania:
   - Aktywność: Nauka
   - Energia: Medium
   - Tekst: Instrumentalna
4. Kliknij "Pokaż playlistę"
5. Zobacz dopasowaną playlistę
6. Kliknij "Play" lub "Focus Mode"
```

### Flow 2: Focus Session
```
1. W PlaylistView kliknij "Focus Mode"
2. Ustaw timer (domyślnie 25 min)
3. Wybierz dźwięk ambient (np. Rain)
4. Kliknij Play
5. Po 25 min → automatyczny BREAK 5 min
6. Po 5 min → powrót do WORK
```

## Zasady UX

### Design Principles
1. **Minimalizm** - Mniej UI, więcej wartości
2. **Szybkość** - Time to first value < 2 minuty
3. **Intuicyjność** - Brak instrukcji, wszystko oczywiste
4. **Spójność** - Ten sam design na wszystkich ekranach
5. **Premium Feel** - Glassmorphism, miękkie cienie, adaptacyjne kolory

### Glassmorphism Design System
- **Karty i panele**: `bg-white/40 dark:bg-black/30 backdrop-blur-xl`
- **Ramki**: `border border-white/20 dark:border-white/10`
- **Zaokrąglenia**: `rounded-xl` (12px) jako standard
- **Cienie**: `shadow-lg` dla podniesienia, `shadow-none` w stanie podstawowym
- **Efekt głębi**: Warstwy z różnym poziomem przeźroczystości i rozmycia

### Color Palette
```
Light Mode:
- Primary: oklch(0.55 0.15 150) - Teal accent
- Background: oklch(0.98 0.01 260) - Biały z odcieniem
- Text: oklch(0.2 0.02 260) - Ciemny szary

Dark Mode:
- Primary: oklch(0.55 0.15 150) - Ten sam teal
- Background: bg-[#020617] - Atramentowe tło (głęboki niebiesko-czarny)
- Text: oklch(0.8 0.02 260) - Jasny szary (dla kontrastu)
- Glow Effect: dark:shadow-[0_0_40px_rgba(20,184,166,0.12)] - Głęboka poświata dla elementów interaktywnych i kart
```

### Typography
- Font: System fonts (San Francisco, Segoe UI, Roboto)
- Headings: font-semibold, responsive size
- Body: font-normal, 16px base

### Interaction Patterns
- **Hover**: 
  - Przyciski i karty: `scale(1.05) + shadow-xl` (podniesienie i zwiększenie cienia)
  - Karty dźwięków otoczenia: `translateY(-2px) + shadow-2xl` (uniesienie i głębszy cień)
  - Elementy aktywne: pulsowanie `animate-pulse` przy kliknięciu
- **Active/Focus**:
  - Przyciski: `scale(0.98) + shadow-lg` (lekki wciśnięcie)
  - Elementy fokusu: `ring-2 ring-primary/50 outline-none` (dostępność)
  - Kart w stanie aktywnym: `ring-4 ring-primary/30` (delikatna poświata)
- **Transitions**: `duration-300 ease-out` dla wszystkich zmian stanu
- **Feedback**: 
  - Wizualne: zmiana koloru, podniesienie, poświata
  - Hover stany na wszystkich elementach interaktywnych
  - Efekt falowania (ripple) przy kliknięciu w materiały

### Adaptive Playlist Backgrounds
- **Mechanizm**: Dynamiczne dostosowywanie gradientu tła na podstawie kategorii playlisty
- **Typy playlist i ich palety kolorów**:
  - **Relax/Focus** (Nauka, Medytacja, Czytanie): 
    - Gradient: `from-purple-50 via-purple-100 to-purple-50` (jasny fiolet)
    - Dark Mode: `from-purple-900/20 via-purple-800/10 to-purple-900/20` (ciemny fiolet z przeźroczystością)
    - Dodatkowy efekt: `animate-pulse` wolne pulsujące światło
  - **Energy** (Trening, Praca, Impreza):
    - Gradient: `from-teal-50 via-teal-100 to-teal-50` (jasny turkus)
    - Dark Mode: `from-teal-900/20 via-teal-800/10 to-teal-900/20` (ciemny turkus z przeźroczystością)
    - Dodatkowy efekt: subtelny `animate-bounce` dla energicznych playlist
  - **Mixed/Universal**:
    - Gradient: `from-gray-50 via-gray-100 to-gray-50` (neutralny)
    - Dark Mode: `from-gray-900/20 via-gray-800/10 to-gray-900/20`
- **Implementacja Tailwind**:
  - Użycie klas `bg-gradient-to-b` z dynamicznymi kolorami
  - Przezroczystość w Dark Mode: `bg-[length:100%_100%]` z `bg-blend-overlay`
  - Efekt Glassmorphizmu nałożony na gradient: `bg-white/30 dark:bg-black/20 backdrop-blur-lg` nad gradientem
- **Przejścia**: Płynne zmiany kolorów przy zmianie playlisty poprzez `transition-all duration-500`