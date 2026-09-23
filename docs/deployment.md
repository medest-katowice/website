# Deployment strony Medest

Stan dokumentacji: 23 września 2026 r.

Ten dokument jest aktualnym źródłem informacji o publikowaniu strony. Produkcja działa na Cloudflare Pages. Repozytorium kodu pozostaje na GitHubie.

## Aktualna architektura

| Element | Konfiguracja |
| --- | --- |
| Generator | Hugo `0.160.1` extended |
| Repozytorium | `https://github.com/medest-katowice/website` |
| Branch produkcyjny | `main` |
| Hosting produkcyjny | Cloudflare Pages, projekt `medest` |
| Adres projektu | `https://medest.pages.dev/` |
| Domena produkcyjna | `https://medest.pl/` oraz `https://www.medest.pl/` |
| Build command | `hugo --gc --minify` |
| Build output directory | `public` |
| Zmienna builda | `HUGO_VERSION=0.160.1` |

Cloudflare Pages jest połączone z GitHubem. Push do `main` uruchamia automatyczny build i publikację nowej wersji. Branch oraz pull requesty mogą otrzymywać osobne preview deployments.

## Canonical host i redirecty SEO

Publicznym adresem kanonicznym jest `https://medest.pl/` bez prefiksu `www`. Hugo generuje ten host w tagach `rel="canonical"`, Open Graph oraz sitemapie.

Redirecty ścieżek po migracji są zapisane w [`static/_redirects`](../static/_redirects). Cloudflare Pages kopiuje ten plik do wyniku buildu i stosuje zdefiniowane w nim redirecty HTTP 301, między innymi dla dawnych adresów WordPressa oraz starych adresów zabiegów.

Redirect hosta wymaga osobnej reguły Cloudflare, ponieważ `_redirects` obsługuje ścieżki, ale nie redirecty między domenami. W **Cloudflare Dashboard → Rules → Redirect Rules** powinna istnieć reguła:

| Pole | Wartość |
| --- | --- |
| Request URL | `https://www.medest.pl/*` |
| Target URL | `https://medest.pl/${1}` |
| Status code | `301` |
| Query string | Preserve |

Po zmianie sprawdź, że każdy z tych wariantów kończy się jednym adresem kanonicznym:

```text
http://medest.pl/       → https://medest.pl/
http://www.medest.pl/   → https://medest.pl/
https://www.medest.pl/  → https://medest.pl/
https://medest.pl/      → 200 OK
```

Nie należy dodawać `/tags/` ani `/categories/` do sitemap — są wyłączone w konfiguracji Hugo jako nieużywane taksonomie.

## Jak opublikować zmianę

1. Wprowadź zmianę w repozytorium.
2. Uruchom lokalny build:

   ```sh
   hugo --gc --minify
   ```

3. Sprawdź wynik lokalnie, np. przez `hugo server`.
4. Zacommituj zmianę i wypchnij ją do `main`:

   ```sh
   git add .
   git commit -m "Opis zmiany"
   git push origin main
   ```

5. W Cloudflare Dashboard przejdź do **Workers & Pages → medest → Deployments** i sprawdź status buildu.
6. Po udanym wdrożeniu sprawdź `https://medest.pl/` oraz najważniejsze podstrony.

Nie ma potrzeby ręcznego przesyłania plików do hostingu.

## DNS i domena

Domena jest zarejestrowana w nazwa.pl, natomiast autorytatywny DNS obsługuje Cloudflare.

Nameservery Cloudflare:

- `ashley.ns.cloudflare.com`
- `brad.ns.cloudflare.com`

Rekordy strony:

- `medest.pl` → CNAME `medest.pages.dev`, proxy Cloudflare włączone;
- `www.medest.pl` → CNAME `medest.pages.dev`, proxy Cloudflare włączone.

Przy zmianach strony wolno modyfikować rekordy webowe, ale nie należy zmieniać rekordów pocztowych:

- `MX medest.pl` → `mail.medest.pl`;
- `mail`, `pop`, `smtp` oraz `autoconfig` pozostają **DNS only**;
- SPF, DKIM i DMARC pozostają **DNS only**.

Stary hosting CyberFolks powinien pozostać aktywny do czasu zakończenia migracji skrzynki pocztowej.

## Formularz kontaktowy

Formularz nie jest obsługiwany przez Hugo ani Cloudflare Pages. Wysyła dane do Formspark przez endpoint skonfigurowany w [`hugo.toml`](../hugo.toml):

`https://submit-form.com/FrhSOP6GQ`

Adres odbiorcy powiadomień ustawia się w panelu Formspark, nie w kodzie strony. Obecnym odbiorcą docelowym jest `kontakt@medest.pl`; zaproszony adres musi jeszcze potwierdzić wiadomość od Formspark.

## GitHub Pages — konfiguracja historyczna

Plik [`.github/workflows/hugo-pages.yml`](../.github/workflows/hugo-pages.yml) opisuje starszy deployment przez GitHub Pages. Nie jest on obecnie źródłem ruchu dla `medest.pl`; produkcję obsługuje Cloudflare Pages.

Workflow pozostaje w repozytorium jako zapas/historyczna konfiguracja i może nadal uruchamiać się po pushu do `main`. Nie należy traktować adresu `medest-katowice.github.io/website/` jako adresu produkcyjnego. Po upewnieniu się, że Cloudflare Pages działa stabilnie, workflow można wyłączyć w GitHub Actions.

## Rollback

Najbezpieczniejszy rollback wykonuje się przez przywrócenie poprzedniej wersji w Git i wypchnięcie zmiany do `main`:

```sh
git revert <hash-commitu>
git push origin main
```

Cloudflare Pages zbuduje wtedy poprzednią wersję ponownie. Nie zmieniaj DNS podczas zwykłego rollbacku aplikacji.

## Najczęstsze problemy

- **Build nie przechodzi:** sprawdź log buildu w Cloudflare Pages oraz wersję Hugo `0.160.1`.
- **Domena pokazuje starą stronę:** sprawdź, czy rekordy `medest.pl` i `www` wskazują na `medest.pages.dev`, a następnie uwzględnij cache DNS.
- **Nie dochodzą formularze:** sprawdź potwierdzenie adresu `kontakt@medest.pl` w Formspark; nie szukaj konfiguracji odbiorcy w Hugo.
- **Nie działa poczta:** nie włączaj proxy Cloudflare dla `mail`, `pop`, `smtp` ani rekordów MX/TXT.
