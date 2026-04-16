# Medest - plan nowej wersji strony

## Założenie strategiczne

Przyjmuję kierunek marki bardziej premium/lifestyle niż stricte medyczny. Nowa strona powinna więc eksponować estetykę, komfort, dyskrecję i jakość doświadczenia, a warstwę medyczną wykorzystywać do wzmacniania zaufania, nie jako dominujący styl komunikacji.

## Potwierdzone decyzje

- Cennik jest publiczny i dostaje osobną stronę `/cennik/`.
- Sekcji aktualności nie rozwijamy.
- Docelowy kierunek techniczny: static site.
- Rekomendowany generator: `Hugo`.
- Priorytet migracyjny SEO: zachować obecne URL-e 1:1 wszędzie tam, gdzie to możliwe.

## 1. Diagnoza obecnej strony

### Obecny stan

- Brak lokalnego kodu źródłowego w repo - plan bazuje na analizie live site: `https://medest.pl/`.
- Aktualna strona działa na starym WordPressie (`4.9.8`) i własnym motywie `medest_v2.1`.
- Główne menu jest bardzo uproszczone, ale w strukturze strony istnieje więcej podstron niż widać w nawigacji.
- Treści są nierówne jakościowo: część podstron zawiera opisy zabiegów, część wygląda na porzuconą lub sprowadza się do formularza kontaktowego.

### Zidentyfikowane problemy

1. Struktura informacji nie prowadzi użytkownika naturalnie od potrzeby do kontaktu.
2. Komunikacja jest zbyt ogólna i mało współczesna.
3. Za mało miejsca poświęcono zaufaniu, bezpieczeństwu, FAQ i przebiegowi konsultacji.
4. Podstrony są rozproszone i niespójne.
5. Brakuje nowoczesnej strategii local SEO.
6. Podstrony formalne istnieją, ale nie są sensownie osadzone w architekturze.

## 2. Rekomendowana nowa architektura informacji

### Główne menu

1. Start
2. Zabiegi
3. Problemy / Wskazania
4. O lekarzu i gabinecie
5. Bezpieczeństwo i FAQ
6. Kontakt / Umów wizytę

### Footer

- RODO / polityka prywatności
- Standardy ochrony małoletnich
- Dane działalności
- Dojazd i parking
- Cennik

## 3. Proponowana struktura treści

### Start

- mocny nagłówek z obietnicą wartości,
- krótkie przedstawienie lekarki i gabinetu,
- najpopularniejsze zabiegi,
- problemy pacjentów,
- sekcja "dlaczego warto",
- przebieg pierwszej konsultacji,
- bezpieczeństwo i kwalifikacje,
- CTA do kontaktu / umówienia wizyty.

### Zabiegi

Zamiast płaskiej listy nazw zabiegów: grupy tematyczne i stały szablon każdej podstrony.

Proponowane grupy:

- wygładzanie zmarszczek,
- modelowanie i objętość,
- poprawa jakości skóry,
- przebarwienia i naczynka,
- okolica oczu,
- włosy i skóra głowy,
- depilacja.

Każda strona zabiegu:

- dla kogo,
- co daje,
- przebieg,
- przeciwwskazania,
- zalecenia po zabiegu,
- bezpieczeństwo,
- CTA.

### Problemy / Wskazania

Ścieżka dla użytkownika, który nie zna nazw zabiegów:

- zmarszczki i utrata jędrności,
- trądzik i blizny,
- przebarwienia,
- naczynka i rumień,
- nadpotliwość,
- cienie pod oczami,
- nadmierne owłosienie,
- wypadanie włosów,
- rewitalizacja skóry.

### O lekarzu i gabinecie

- bio i doświadczenie,
- specjalizacja,
- certyfikaty i szkolenia,
- zdjęcia gabinetu,
- jak wygląda wizyta,
- wartości gabinetu.

### Bezpieczeństwo i FAQ

- kwalifikacja do zabiegów,
- przeciwwskazania,
- przygotowanie,
- rekonwalescencja,
- najczęstsze pytania,
- zasady bezpieczeństwa.

### Kontakt / Umów wizytę

- telefon, e-mail, adres,
- mapa i dojazd,
- prosty formularz,
- informacja, jak wygląda pierwszy kontakt,
- widoczne CTA mobilne.

### Cennik

- publiczna strona z cenami startowymi lub widełkami,
- cross-linki do odpowiednich zabiegów,
- informacja o finalnej kwalifikacji podczas konsultacji,
- CTA do kontaktu.

## 4. Kierunek nowego copy

### Co zmienić

- skrócić i uprościć teksty,
- pisać językiem bardziej empatycznym,
- mówić o problemie, efekcie i bezpieczeństwie,
- uporządkować terminologię,
- budować komunikację premium i aspiracyjną, ale bez agresywnego beauty-marketingu.

### Główne akcenty komunikacyjne

- estetyczny efekt osiągany w bezpieczny sposób,
- indywidualne podejście i dyskrecja,
- komfort wizyty i butikowy charakter miejsca,
- gabinet prowadzony przez lekarza,
- nowoczesne, sprawdzone metody i wygodna lokalizacja w Katowicach.

## 5. Rekomendowane etapy prac

1. Audyt i decyzje strategiczne - pozycjonowanie marki, polityka dla legacy pages, zakres treści.
2. Finalna sitemap i content model - typy stron, relacje między zabiegami a problemami, CTA, dokładna mapa URL-i.
3. Copywriting i SEO - nowe treści głównych stron, opisów zabiegów i stron problemowych, metadata.
4. Projekt UX/UI - mapowanie treści do designów.
5. Wdrożenie - frontend statyczny, migracja, prawdziwe 301, SEO techniczne.

## 6. Priorytet na start

Najpierw warto przygotować:

1. stronę główną,
2. stronę o lekarzu i gabinecie,
3. kontakt,
4. cennik,
5. topowe zabiegi,
6. topowe problemy pacjentów,
7. FAQ i bezpieczeństwo.

## 7. Migracja SEO i URL-i

- Zachować obecne URL-e 1:1 dla stron głównych, zabiegów, wskazań, kontaktu i stron formalnych.
- Nie zmieniać slugów tylko po to, by dopasować je do nowej etykiety menu.
- Dla stron usuwanych lub scalanych użyć prawdziwych `301`, nie tylko aliasów generatora.
- Stare techniczne URL-e sitemap WordPressa przekierować do nowego `/sitemap.xml`.
- Pełna tabela mapowania jest w `docs/medest-current-site-audit-and-url-map.md`.

## 8. Decyzje do potwierdzenia

1. Czy na nowej stronie będą opinie / referencje i w jakiej formule.
