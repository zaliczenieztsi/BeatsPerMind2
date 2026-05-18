# AGENTS.md - Zasady Pracy Agenta AI Developera

## Projekt: BeatsPerMind

### Referencja do Dokumentacji

Wszystkie szczegóły projektu znajdują się w katalogach `docs/biznes`, `docs/roles` i `docs/architektura`:

| Dokument | Opis |
|----------|------|
| `SPEC.md` | Specyfikacja techniczna - struktura projektu, komponenty, dane JSON, algorytm dopasowania (Priorytet: Najwyższy - obowiązkowa lektura przed każdą implementacją) |
| `README.md` | Główny opis projektu, funkcje MVP, tech stack (Priorytet: Wysoki - zrozumienie ogólnego projektu) |
| `docs/roles/architect.md` | Decyzje architektoniczne, hierarchia komponentów, modele systemu i integracje (Priorytet: Wysoki - zrozumienie struktury kodu i wzorców) |
| `docs/roles/developer.md` | Standardy kodu, konwencje JSX/Tailwind, workflow implementacji i checklistę (Priorytet: Wysoki - zgodność z kodową podstawą i konwencjami) |
| `docs/roles/ux_ui.md` | Rygorystyczne przestrzeganie standardów estetyki luksusowej, zakaz generowania płaskich, generycznych komponentów, zasady Glassmorphism i animacji (Priorytet: Najwyższy - kluczowe dla jakości wizualnej i płynności 60 FPS) |
| `docs/roles/tester.md` | Scenariusze testowe, przypadki edge-case i wymagania jakościowe (Priorytet: Średni - walidacja przed commit) |
| `docs/roles/product_owner.md` | Wizja produktu, backlog i metryki sukcesu (Priorytet: Środni - zrozumienie celów biznesowych) |
| `docs/roles/AGENTS.md` | Niniejszy plik - zasady pracy agenta AI (Priorytet: Obowiązkowy - bieżące odniesienie do zasad pracy) |
| `docs/architektura/adr.md` | Architecture Decision Records - kluczowe decyzje techniczne (w tym ADR-009 o animacjach GPU-only i ADR-010 o kształcie masek rozmycia) (Priorytet: Najwyższy - obowiązkowa lektura przed implementacją JSX/CSS) |
| `docs/architektura/diagrams.md` | Diagramy systemu (C4, przepływy danych, komponenty, stan) (Priorytet: Środni - zrozumienie architektury na wysokim poziomie) |
| `docs/architektura/system_overview.md` | Ogólny przegląd systemu, architektura wysokiego poziomu i komponenty (Priorytet: Środni - kontekst projektu) |

---

## Podstawowe Informacje o Projekcie

**BeatsPerMind** to aplikacja webowa dla studentów (projekt studencki MVP, bez backendu):

- **Cel:** Generator playlist muzycznych dopasowanych do aktywności, poziomu energii i preferencji muzycznych
- **Focus Mode:** Timer Pomodoro z ambient sounds (rain, white-noise, cafe, forest)
- **Tech Stack:** React 18 + Vite + Tailwind CSS + shadcn/ui
- **Dane:** Static JSON + LocalStorage (brak backendu, brak zewnętrznych API)
- **YouTube:** Embed iframe całych playlist (bez YouTube Data API)
- **Spotify:** Statyczne linki (klikalny przycisk bez API)
- **Wartość wizualna:** Aplikacja wykorzystuje interfejs immersyjny (Glassmorphism, system 15 animowanych kół tła Aurory oraz dynamicznie adaptujące się tła playlist w zależności od nastroju)

---

## Zasady UI/UX Premium (Rygorystyczne)

- **Zakaz ostrych krawędzi przy efektach rozmycia:** Agent musi używać klasy `rounded-full` na kontenerach z efektami `blur` i `shadow`, aby uniknąć błędów wizualnych i spójnie realizować styl Glassmorphism.
- **Zasada Dark Mode — brak czarnych cieni:** W trybie ciemnym zabrania się używania czarnych cieni (np. `shadow-black`). Należy stosować wyłącznie zewnętrzne poświaty o niskim kryciu, np. `dark:shadow-[0_0_40px_rgba(20,184,166,0.12)]` na głębokim tle `bg-[#020617]`. Dzięki temu zachowuje się efekt immersyjnej głębi bez artefaktów wyglądu płaskiego.
- **Kontrast tekstu na blurowych elementach:** Zawsze dbaj o to, by teksty na elementach rozmytych miały obniżony kontrast (np. `text-slate-700/90` zamiast pełnej czerni), co pozwala wtopić typografię w tło i buduje efekt luksusowej głębi.

---

## Podstawowe Zasady Pracy Agenta

### 1. Przed Implementacją
- **ZAWSZE** sprawdź aktualną specyfikację w `docs/biznes/SPEC.md`
- **NIE** twórz kodu bez znajomości specyfikacji
- **NIE** dodawaj funkcji spoza zakresu MVP
- **Zanim napiszesz choćby jedną linię kodu JSX/CSS, przeanalizuj plik ADR (szczególnie ADR-009 i ADR-010) oraz ux_ui, aby upewnić się, że komponent nie wygeneruje błędów krawędzi bluru (artefakt prostokąta) i będzie zoptymalizowany pod 60 FPS**

### 2. Podczas Implementacji
- Stosuj się do struktury projektu z `SPEC.md`
- Używaj dokładnie tych technologii: React + Vite + Tailwind + shadcn/ui
- **NIE** używaj: Next.js, TypeScript, Supabase, Firebase, Stripe, Spotify API, YouTube Data API
- Dane playlist trzymaj w `src/data/playlists.json` (format z `SPEC.md`)
- Ambient sounds w `public/sounds/` (rain.mp3, white-noise.mp3, cafe.mp3, forest.mp3)
- Zawsze dbaj o to, by teksty na elementach rozmytych miały obniżony kontrast (np. `text-slate-700/90` zamiast pełnej czerni)

### 3. Struktura Kodu
```
src/
├── components/     # Komponenty React
├── data/           # playlists.json, ambientSounds.js
├── hooks/          # useQuiz, useTimer, useAudio
├── utils/          # playlistMatcher.js (algorytm dopasowania)
├── App.jsx
└── main.jsx
```

### 4. Algorytm Dopasowania Playlisty
- Każda playlista ma tagi: `activity`, `energy`, `lyrics`
- Scoring: activity=2pkt, energy=1.5pkt, lyrics=1pkt
- Wygrywa playlista z najwyższym wynikiem
- Fallback: pierwsza playlista z listy

### 5. Timer Pomodoro
- Domyślne ustawienia: 25 min praca / 5 min przerwa
- Działa tylko w foreground (aplikacja aktywna)
- Nie wymaga Web Workers w MVP

### 6. Walidacja Przed Commit
- Sprawdź czy kod jest zgodny z `SPEC.md`
- Upewnij się że nie używasz zakazanych technologii
- Verify that JSON data matches the expected format
- Przetestuj wygenerowany kod mentalnie pod kątem scenariuszy opisanych w pliku tester. Jeśli kod nie spełnia kryteriów płynności lub estetyki luksusowej – popraw go przed oddaniem użytkownikowi.

### 7. Komunikacja
- Jeśli coś jest niejasne, zapytaj przed implementacją
- Nie zakładaj specyfikacji które nie istnieją w dokumentacji
- Report problems with specific document references

---

## Ograniczenia (Red Lines)

| NIE UŻYWAJ | Powód |
|------------|-------|
| Next.js | Overhead dla SPA bez SSR |
| TypeScript | Wydłuża setup dla początkującego |
| Supabase/Firebase | Niepotrzebne bez backendu |
| Spotify API | Wymaga OAuth - nie w MVP |
| YouTube Data API | Wymaga klucza API - użyj embed iframe |
| Redux/Zustand | Overhead - wystarczy useState + Context |
| Docker/Kubernetes | Niepotrzebne dla MVP |
| Ciężkie biblioteki animacji (Framer Motion, GSAP) | Wszystkie efekty (breathe, aurora flare) muszą być pisane w czystym Tailwind CSS/CSS ze względu na optymalizację wydajności i stałe 60 FPS |

---

## Metryki Sukcesu MVP

- Time to first value: < 2 minuty
- Quiz (3 pytania) działa w <2 min
- Playlista generowana w <10 sekund
- Focus Mode timer działa poprawnie
- 4 ambient sounds odtwarzają się

---

## Kontakt

W razie wątpliwości sprawdź dokumentację w `docs/biznes` lub zapytaj.