# swapped-ui

De Swapped-designtaal als pakket: één bron voor het beeld van swapped-projects, isms, boekhouding en netwerk (docs/10 §6.2 in netwerk).

## Wat erin zit

- `resources/css/swapped.css` — `@theme` (font, `primary-*`-tokens), `@layer base` en alle recepten (`card`, `btn-primary`, `btn-ghost`, `input`, `label`, `chip`, `th/td`, `dropdown-*`, `drawer`, `rail`, `start-*`, `skelet`, `editor-*`, `chat-*`, `notitie-*`, `agenda-blok`, `mobile-*`, `manual`, …). Indigo is de standaard; een app met tenant-theming overschrijft de `--color-primary-*`-tokens.
- `src/Icons.php` — de lijniconen (Lucide-stijl, stroke 1.6) als PHP-array; `<x-swapped::icon name="…"/>`.
- `resources/js/dropdown.js`, `resources/js/aanwezigheid.js` — Alpine-modules zonder `import Alpine` (de app registreert ze: `Alpine.data('dropdown', dropdown)`).

## Aansluiten

Composer haalt het pakket uit de privé-repo `swappednl/swapped-ui`, zodat ook
servers en CI erbij kunnen (een path-repository naar `../swapped-ui` bestaat
alleen op een ontwikkelmachine en breekt elke deploy):

```json
"repositories": [{ "type": "vcs", "url": "https://github.com/swappednl/swapped-ui.git" }],
"require": { "swapped/ui": "@dev" }
```

Omdat de repo privé is, heeft elke machine die `composer install` draait een
GitHub-token nodig met leesrecht op deze repo:

- werkplek: `composer config --global --auth github-oauth.github.com <token>`
- webserver: hetzelfde commando als de deploy-gebruiker (schrijft
  `~/.composer/auth.json`)
- GitHub Actions: repo-secret `SWAPPED_UI_TOKEN`, gelezen via `COMPOSER_AUTH`
  op de `composer install`-stap

## Wijziging uitrollen

1. Wijzig hier, `CHANGELOG.md` bij, commit en `git push`.
2. In elke app: `composer update swapped/ui` — dat zet de nieuwe commit in
   `composer.lock`; committen en deployen.

Tijdens het schuiven aan een recept is het handig om de vendor-kopie even te
vervangen door een symlink naar deze map; `composer update swapped/ui` zet hem
daarna weer terug:

```bash
rm -rf vendor/swapped/ui && ln -s ../../../swapped-ui vendor/swapped/ui
```

npm: `npm install ../swapped-ui` (symlink) — dit is nog wél een lokaal pad, dus
een server die zelf `npm ci && npm run build` draait heeft deze map nodig.
In `resources/css/app.css`:

```css
@import 'tailwindcss';
@import '@swapped/ui/css';
```

In `resources/js/app.js`: `import dropdown from '@swapped/ui/js/dropdown'`.

## Regels

- Beeld (kleur, maat, component, shell, icoon) wijzigt **alleen hier**; één PR per designwijziging, semver-tag, regel in `CHANGELOG.md`, bump per app.
- Nooit `indigo-*` in een recept: schrijf `primary-*`.
- Meet een wijziging met `meet-computed-styles.js` (netwerk `docs/10-merge-onderzoek/`) op minstens twee apps.
