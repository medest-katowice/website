# Medest - audyt obecnej strony i mapa URL-i do migracji

## Założenia przyjęte do migracji

- Celem jest maksymalnie bezpieczna migracja SEO.
- Domyślna zasada: **zachowujemy obecny URL 1:1**, jeśli nowa strona ma sensowny odpowiednik treściowy.
- Aktualności nie wracają jako blog.
- Cennik dostaje nową publiczną stronę: `/cennik/`.
- Docelowy stack: static site, rekomendowany `Hugo`.

## Najważniejsze wnioski z audytu

1. Obecna struktura jest mniejsza, niż sugeruje menu, ale większa, niż wynika z samej nawigacji.
2. Największą wartość SEO mają strony główne, strony zabiegowe i strony wskazań - te należy zachować pod tymi samymi URL-ami.
3. Część stron pomocniczych pod `/o-gabinecie/` i `/nowosci/` jest dziś faktycznie pusta lub sprowadza się do formularza kontaktowego.
4. Poza stronami treściowymi istnieje zestaw technicznych URL-i sitemap WordPressa, które po migracji nie powinny zwracać 404.

## Rekomendowany model wdrożenia

- Generator statyczny: `Hugo`
- Hosting: rozwiązanie z natywnymi redirectami 301, np. Netlify, Cloudflare Pages, Vercel albo własny serwer
- Reguła migracyjna: **realne 301 na poziomie hostingu**, nie tylko alias pages

## Nowe URL-e, które warto dodać

| Nowy URL | Cel |
| --- | --- |
| `/cennik/` | Publiczny cennik / widełki cenowe |
| `/bezpieczenstwo/` | Bezpieczeństwo, kwalifikacja, przeciwwskazania, FAQ |

## Mapa obecnych URL-i treściowych

| Obecny URL | Stan obecny | Nowy URL | Decyzja |
| --- | --- | --- | --- |
| `/` | Strona główna, treść przestarzała, ale ważna SEO | `/` | **KEEP 200** - pełny rewrite |
| `/zabiegi/` | Główna lista zabiegów | `/zabiegi/` | **KEEP 200** - nowy układ kategorii |
| `/zabiegi/pilingi-lekarskie/` | Strona zabiegu | `/zabiegi/pilingi-lekarskie/` | **KEEP 200** - rewrite |
| `/zabiegi/kwas-hialuronowy/` | Strona zabiegu | `/zabiegi/kwas-hialuronowy/` | **KEEP 200** - rewrite |
| `/zabiegi/toksyna-botulinowa/` | Strona zabiegu | `/zabiegi/toksyna-botulinowa/` | **KEEP 200** - rewrite |
| `/zabiegi/mezoterapia/` | Strona zabiegu | `/zabiegi/mezoterapia/` | **KEEP 200** - rewrite |
| `/zabiegi/hydroskyapatyt-radiesse/` | Strona zabiegu, historyczny slug | `/zabiegi/hydroskyapatyt-radiesse/` | **KEEP 200** - zostawić slug mimo niedoskonałości |
| `/zabiegi/lifting-wolumetryczny/` | Strona zabiegu | `/zabiegi/lifting-wolumetryczny/` | **KEEP 200** - rewrite |
| `/zabiegi/modelowanie-ust/` | Strona zabiegu | `/zabiegi/modelowanie-ust/` | **KEEP 200** - rewrite |
| `/wskazania/` | Główna lista problemów | `/wskazania/` | **KEEP 200** - można zmienić label w menu na "Problemy" |
| `/wskazania/leczenie-tradziku/` | Strona problemowa | `/wskazania/leczenie-tradziku/` | **KEEP 200** - rewrite |
| `/wskazania/wypadanie-wlosow/` | Strona problemowa | `/wskazania/wypadanie-wlosow/` | **KEEP 200** - rewrite |
| `/wskazania/zamykanie-naczyn-krwionosnych/` | Strona problemowa | `/wskazania/zamykanie-naczyn-krwionosnych/` | **KEEP 200** - rewrite |
| `/wskazania/nadpotliwosc/` | Strona problemowa | `/wskazania/nadpotliwosc/` | **KEEP 200** - rewrite |
| `/wskazania/usuwanie-zmarszczek/` | Strona problemowa | `/wskazania/usuwanie-zmarszczek/` | **KEEP 200** - rewrite |
| `/wskazania/usuwanie-przebarwien/` | Strona problemowa | `/wskazania/usuwanie-przebarwien/` | **KEEP 200** - rewrite |
| `/wskazania/usuwanie-owlosienia/` | Strona problemowa | `/wskazania/usuwanie-owlosienia/` | **KEEP 200** - rewrite |
| `/wskazania/usuwanie-blizn/` | Strona problemowa | `/wskazania/usuwanie-blizn/` | **KEEP 200** - rewrite |
| `/wskazania/cienie-pod-oczami/` | Strona problemowa | `/wskazania/cienie-pod-oczami/` | **KEEP 200** - rewrite |
| `/wskazania/rewitalizacja-skory/` | Strona problemowa | `/wskazania/rewitalizacja-skory/` | **KEEP 200** - rewrite |
| `/o-gabinecie/` | Strona o gabinecie | `/o-gabinecie/` | **KEEP 200** - rozbudować o lekarzu i gabinecie |
| `/o-gabinecie/certyfikaty/` | Dziś praktycznie pusta / formularz | `/o-gabinecie/certyfikaty/` | **KEEP 200** - przygotować realną treść |
| `/o-gabinecie/galeria/` | Dziś praktycznie pusta / formularz | `/o-gabinecie/galeria/` | **KEEP 200** - przygotować realną treść |
| `/o-gabinecie/wirtualny-spacer/` | Dziś praktycznie pusta / formularz | `/o-gabinecie/wirtualny-spacer/` | **KEEP 200** - przygotować realną treść |
| `/o-gabinecie/bony-upominkowe-2/` | Dziś praktycznie pusta / formularz | `/o-gabinecie/` | **301** - scalenie do strony o gabinecie |
| `/kontakt/` | Kontakt + formularz | `/kontakt/` | **KEEP 200** - rewrite |
| `/klauzula-informacyjna-rodo/` | Strona formalna | `/klauzula-informacyjna-rodo/` | **KEEP 200** |
| `/standardy-ochrony-maloletnich/` | Strona formalna | `/standardy-ochrony-maloletnich/` | **KEEP 200** |
| `/nowosci/` | Dziś w praktyce pusty formularz; nie rozwijamy aktualności | `/` | **301** - brak sensownego odpowiednika contentowego |

## Techniczne URL-e SEO do zachowania lub przekierowania

| Obecny URL techniczny | Nowy URL | Decyzja |
| --- | --- | --- |
| `/robots.txt` | `/robots.txt` | **KEEP 200** - wskazać nowy `/sitemap.xml` |
| `/sitemap.xml` | `/sitemap.xml` | **KEEP 200** - nowa sitemap statyczna |
| `/sitemap.html` | `/sitemap.xml` | **301** |
| `/sitemap-misc.xml` | `/sitemap.xml` | **301** |
| `/sitemap-pt-page-2025-02.xml` | `/sitemap.xml` | **301** |
| `/sitemap-pt-page-2015-10.xml` | `/sitemap.xml` | **301** |
| `/sitemap-pt-page-2013-11.xml` | `/sitemap.xml` | **301** |
| `/sitemap-misc.html` | `/sitemap.xml` | **301** |
| `/sitemap-pt-page-2025-02.html` | `/sitemap.xml` | **301** |
| `/sitemap-pt-page-2015-10.html` | `/sitemap.xml` | **301** |
| `/sitemap-pt-page-2013-11.html` | `/sitemap.xml` | **301** |

## Zasady wdrożenia migracji

1. Nie zmieniać istniejących slugów na "ładniejsze", jeśli nie ma bardzo mocnego powodu biznesowego.
2. Ustawić przekierowania `301` zanim nowa wersja strony trafi na produkcję.
3. Po migracji sprawdzić ręcznie wszystkie URL-e z tabeli oraz sitemapę i robots.
4. Zachować spójną strukturę linkowania wewnętrznego do stron, które już mają historię w Google.
5. Jeśli któraś legacy page ma zniknąć, kierować ją do **najbliższego semantycznie** odpowiednika; homepage stosować tylko tam, gdzie brak lepszej opcji.
