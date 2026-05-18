# Wzorzec Planu Pracy dla Agenta AI Developera

## Zasady Ogólne

- **Reguła jednej funkcjonalności**: Plan może dotyczyć TYLKO jednej małej funkcjonalności.
- **Mała funkcjonalność**: Definiuj jako coś, co da się wdrożyć w jednej sesji roboczej (max 2-3 godziny pracy).

---

## Struktura Planu

### Sekcja 1: Przygotowanie

- [ ] 1. Zweryfikuj czy funkcjonalność jest mała (jedna sekcja agenta)
- [ ] 2. Sprawdź dokumentację w docs/biznes/SPEC.md
- [ ] 3. Zidentyfikuj zależności (dane, komponenty, hooki)
- [ ] 4. Przygotuj kodstarterowy (opcjonalnie)

**Testowanie po sekcji 1:**
- Zweryfikuj czy masz wszystkie potrzebne informacje z dokumentacji

---

### Sekcja 2: Implementacja

- [ ] 5. Utwórz/brakuj potrzebne pliki danych (src/data/*.json)
- [ ] 6. Zaimplementuj logikę biznesową w src/utils/ lub src/hooks/
- [ ] 7. Utwórz/brakuj komponenty w src/components/
- [ ] 8. Zintegruj z istniejącym kodem aplikacji
- [ ] 9. Dodaj obsługę błędów (opcjonalnie)

**Testowanie po sekcji 2:**
- Zweryfikuj działanie funkcjonalności w przeglądarce

---

### Sekcja 3: Walidacja i Finalizacja

- [ ] 10. Uruchom testy (jeśli istnieją: npm test lub równoważne)
- [ ] 11. Zbuduj aplikację (npm run build lub równoważne)
- [ ] 12. Sprawdź czy aplikacja działa poprawnie
- [ ] 13. Zaktualizuj rejestry dokumentacji:
  * docs/plans/zaimplementowane-plany.md - dodaj link do planu
  * docs/plans/zaimplementowane-funkcjonalności.md - dodaj nową funkcjonalność ze statusem DONE

**Testowanie po sekcji 3:**
- Upewnij się że build przechodzi bez błędów
- Zweryfikuj że aplikacja uruchamia się poprawnie

---

## Wytyczne Implementacji

1. **Checkboxy i numeracja**: Każdy element planu MUSI mieć format -[ ] numer. opis
2. **Testowanie manualne**: Po każdej sekcji dodaj sekcję Testowanie po sekcji X z opisem co zweryfikować
3. **Build i testy**: Po ostatniej sekcji uruchom:
   - Testy jednostkowe (jeśli istnieją)
   - Budowanie aplikacji
   - Weryfikację działania
4. **Rejestry dokumentacji**: Po wdrożeniu zaktualizuj dwa pliki rejestru (nie checkboxy, ale listy)
---

## Przykład Użycia

Gdy użytkownik prosi o implementację funkcjonalności:

1. oceń czy funkcjonalność jest mała
2. jeśli NIE jest mała - odrzuć i poproś o podział na mniejsze części
3. jeśli TAK - wygeneruj plan korzystając z tego wzorca

---

## Format Zapisu Planu Po Wdrożeniu

```
# [Data: YYYY-MM-DD] [Nazwa Funkcjonalności]

## Sekcja 1: Przygotowanie
- [x] 1. ...
- [x] 2. ...

Testowanie: ...

## Sekcja 2: Implementacja
- [x] 5. ...
...

## Sekcja 3: Walidacja
- [x] 10. ...
...
```