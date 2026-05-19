# Tester - BeatsPerMind

## Strategia Testów

### Test Types
| Type | Scope | Tools | Frequency |
|------|-------|-------|-----------|
| Unit | Hooks, utils | Jest/Vitest | On change |
| Integration | Component props | React Testing Library | On PR |
| E2E | User flows | Manual | Before release |
| Visual | UI consistency, glass effects, aurora animations | Playwright Component Testing | On PR |

### Test Environments
- Development: `http://localhost:5173`
- Production: Vercel deployed URL

## Scenariusze Testowe

### Quiz Flow Tests
```
Test QR-001: Quiz displays 3 questions
Given: User navigates to /quiz
When: Page loads
Then: Q1 (activity), Q2 (energy - 3 buttons: low/medium/high), Q3 (lyrics) are visible

Test QR-002: Answers are saved
Given: User selects answers
When: User clicks "Show Playlist"
Then: Answers stored in useState and passed to matcher

Test QR-003: Playlist is matched
Given: User submits quiz
When: playlistMatcher runs
Then: Best matching playlist from JSON is returned
```

### Focus Mode Tests
```
Test FM-001: Timer starts at 25:00
Given: User enters Focus Mode
When: Timer initializes
Then: Display shows "25:00"

Test FM-002: Work → Break transition
Given: Timer reaches 0 in WORK mode
When: Timer completes
Then: Automatically switches to BREAK (5:00)

Test FM-003: Break → Work transition
Given: Timer reaches 0 in BREAK mode
When: Timer completes
Then: Automatically switches to WORK (25:00)
And: pomodoroCount increases

Test FM-004: Ambient sound plays
Given: User selects "Rain" sound
When: User clicks play
Then: Audio file plays
And: Volume control works

Test FM-005: Aurora animation performance
Given: Focus Mode active with animate-breathe
When: 15 animated circles render during timer countdown
Then: Animation maintains 60 FPS
And: No CPU spikes during 25-minute work session
```

### Playlist View Tests
```
Test PV-001: YouTube embed loads
Given: Playlist with YouTube ID
When: User clicks "Play"
Then: Iframe appears with autoplay=1

Test PV-002: Spotify link works
Given: Playlist with Spotify URL
When: User clicks Spotify button
Then: Opens new tab to Spotify link

Test PV-003: Adaptive background color changes
Given: Playlist with mood tags (Focus/Relax or Energy)
When: Playlist is rendered
Then: Background displays bordowo-fioletowa palette for Focus/Relax
And: Background displays morsko-turkusowa palette for Energy
And: Colors adapt correctly in both Light and Dark themes
```

## Przypadki Edge-Case

### Data Edge Cases
| Case | Input | Expected | Status |
|------|-------|----------|--------|
| Empty playlists | No songs in JSON | Fallback to first playlist | ✅ |
| Missing YouTube ID | null playlistId | Show error message | ⚠️ |
| Invalid BPM range | BPM: "invalid" | Display as string | ✅ |
| No ambient sounds | Empty sounds array | Disable player | ✅ |

### User Flow Edge Cases
| Case | Scenario | Expected |
|------|----------|----------|
| Refresh during quiz | User refreshes mid-quiz | Answers lost (OK for MVP) |
| Tab switch during timer | User switches tabs | Timer pauses (OK for MVP) |
| Multiple ambient | User clicks multiple sounds | Only last plays |
| Volume extremes | Volume 0 or 100% | Audio adjusts accordingly |

### Dark Mode Edge Cases
| Case | Requirement | Status |
|------|-------------|--------|
| Glass morphism contrast | bg-white/50 vs bg-[#020617] glass panels | ⚠️ |
| Glow visibility | dark:shadow-accent glow on buttons/cards | ⚠️ |
| Glow color variants | shadow-indigo-500, shadow-purple-500, shadow-pink-500 visible | ⚠️ |
| Glow contrast ratio | Glow effect maintains WCAG AA on slate-900 | ⚠️ |
| Glass border visibility | Glass container borders distinguishable in dark | ⚠️ |

### Browser Compatibility
| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 100+ | ✅ Primary | Full support |
| Firefox 100+ | ✅ Tested | Full support |
| Safari 15+ | ⚠️ Untested | May need prefix |
| Mobile Safari | ⚠️ Partial | Audio autoplay restrictions |

### Performance Edge Cases
| Case | Metric | Threshold | Status |
|------|--------|-----------|--------|
| Build time | `npm run build` | < 30s | ✅ |
| Bundle size | dist/assets | < 500KB | ✅ |
| First load | Page render | < 2s | ✅ |
| Timer accuracy | 25min work | ±1s | ✅ |
| Aurora animation FPS | 15 animated circles | ≥60 FPS constant | ⚠️ |
| Glass effect rendering | Backdrop-filter blur | No jank during transitions | ⚠️ |
| Glow animation | shadow-... animate-pulse | Smooth 60 FPS | ⚠️ |

### Accessibility Edge Cases
| Case | Requirement | Status |
|------|-------------|--------|
| Keyboard nav | Tab through elements | ⚠️ |
| Screen reader | ARIA labels | ⚠️ |
| Color contrast | WCAG AA minimum | ✅ |
| Focus indicators | Visible on all buttons | ✅ |