# Dokumentace (CZ) – Přehled, backend ukázka a jednoduchý frontend

Tento projekt obsahuje:
- Aplikaci s obrazovkou profilu (stručná architektura popsána v komentářích přímo v kódu).
- Ukázkový backend (`/backend`) s jednoduchým „přepínáním stránek“.
- Velmi jednoduchý frontend (`/backend/public`) sloužící k interakci s tímto backendem.

## 1) Jak přemýšlet nad architekturou (stručně)

- Stránka (page-level) drží stav a orchestrace UI (např. co je vybráno v sidebaru, jaký je režim editoru).
- Dílčí komponenty jsou co nejmenší, UI-only, dostávají data a callbacky přes `props`.
- Flow dat: stav je nahoře, akce (onChange, onClick…) zespodu volají callbacky, které mění stav nahoře.

Podrobné komentáře viz soubor:
- `frontend/src/pages/ProfilePage.jsx` (kde je popsán stav, datové toky a integrační body s backendem).

## 2) Ukázkový backend – přepínání stránek

Backend je záměrně malý a samostatný, aby šel spustit separátně.

Struktura:
