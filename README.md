# swapped-ui

De Swapped-designtaal als pakket: één bron voor het beeld van swapped-projects, isms, boekhouding en netwerk (docs/10 §6.2 in netwerk).

## Wat erin zit

- `resources/css/swapped.css` — `@theme` (font, `primary-*`-tokens), `@layer base` en alle recepten (`card`, `btn-primary`, `btn-ghost`, `input`, `label`, `chip`, `th/td`, `dropdown-*`, `drawer`, `rail`, `start-*`, `skelet`, `editor-*`, `chat-*`, `notitie-*`, `agenda-blok`, `mobile-*`, `manual`, …). Indigo is de standaard; een app met tenant-theming overschrijft de `--color-primary-*`-tokens.
- `src/Icons.php` — de lijniconen (Lucide-stijl, stroke 1.6) als PHP-array; `<x-swapped::icon name="…"/>`.
- `resources/js/dropdown.js`, `resources/js/aanwezigheid.js` — Alpine-modules zonder `import Alpine` (de app registreert ze: `Alpine.data('dropdown', dropdown)`).

## Aansluiten

Composer (lokaal via een path-repository met symlink, later via de GitHub-org `swappednl`):

```json
"repositories": [{ "type": "path", "url": "../swapped-ui", "options": { "symlink": true } }],
"require": { "swapped/ui": "@dev" }
```

npm: `npm install ../swapped-ui` (symlink). In `resources/css/app.css`:

```css
@import 'tailwindcss';
@import '@swapped/ui/css';
```

In `resources/js/app.js`: `import dropdown from '@swapped/ui/js/dropdown'`.

## Regels

- Beeld (kleur, maat, component, shell, icoon) wijzigt **alleen hier**; één PR per designwijziging, semver-tag, regel in `CHANGELOG.md`, bump per app.
- Nooit `indigo-*` in een recept: schrijf `primary-*`.
- Meet een wijziging met `meet-computed-styles.js` (netwerk `docs/10-merge-onderzoek/`) op minstens twee apps.
