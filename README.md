# National Statistics — Republic of Nusantara

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/0xberuuu/national-stats-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/0xberuuu/national-stats-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site for the **fictional** Republic of Nusantara, built for the [make.fun bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

## What it is

A complete, working statistics site with an invented but internally consistent dataset — no placeholders, no lorem ipsum, no copied branding from any real statistics office.

- **Overview** — KPI cards (population, GDP, inflation, unemployment) plus population and growth/inflation charts
- **Population** — total population, age-group chart and table, CSV download
- **Economy** — GDP over time, GDP by sector (donut chart), trade table, CSV download
- **Labour** — unemployment and participation trends, employment by sector
- **Prices** — annual CPI, monthly inflation through 2025, CPI basket weights
- **Regions** — six provinces with a province filter, population chart and indicator table, CSV download
- **Methodology** — how the figures are made, release calendar, and the fictional-country notice

## Controls that actually work

- A **year selector** (2019–2025) that updates every KPI, chart and table on the site
- A **province filter** on the Regions page
- **Tabs** on the Economy page (GDP / Sectors / Trade)
- **CSV download** buttons on the data tables
- Hash routing, so every section is reachable by link (`#/population`, `#/economy`, …)

## Tech

Plain static files in `app/` — HTML, CSS and vanilla JavaScript, no build step, no external libraries. Charts are hand-drawn SVG. The site makes **no network requests**: every script, stylesheet and image is a local file. Open `app/index.html` in any browser.

## Run

```sh
node main.ts            # writes /output (or $MAKEFUN_OUTPUT_DIR) + dossier.json
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` via the vendored `vendor/makefun-frontend.ts` (unmodified).

## License

MIT — see [LICENSE](LICENSE).
