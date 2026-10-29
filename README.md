<div align="center">

# Ubierak 🧥🩳

**Weather + your temperament = the perfect outfit.**

A playful single-page web app that checks the weather where you are, adjusts it to how easily you get cold (or hot),
and tells you — with a bit of humor — what to wear. A cartoon character in the middle of the screen dresses and
undresses live as you move the slider.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)
![No backend](https://img.shields.io/badge/backend-none-lightgrey)
![No API keys](https://img.shields.io/badge/API_keys-none-brightgreen)

</div>

> [!NOTE]
> The app's interface and jokes are in **Polish** ("ubierak" is a pun on *ubierać się* — "to get dressed").
> The full design spec (also in Polish) lives in [SPEC.md](SPEC.md).

---

## ✨ Features

- 📍 **Automatic location** via the browser's Geolocation API, with a city search fallback (autocomplete, debounced).
- 🌡️ **Whole-day advice, not just right now** — looks at the next 12 hours of forecast (min/max temperature, chance of rain).
- 🎚️ **Personal cold/heat tolerance slider** from *"Eternal freezer"* 🥶 to *"Walking furnace"* 🔥. Your setting is remembered in `localStorage`.
- 🧍 **Animated SVG character** that puts on and takes off clothing layers and changes facial expression depending on how comfortable it is.
- ☔ **Weather-aware extras** — umbrella or raincoat (when it's too windy for an umbrella), snow boots, sunglasses and sunscreen for high UV, and a spare layer when the temperature swings during the day.
- 🌙 **Weather backdrop** — sun or moon, clouds, rain drops and snowflakes, all in CSS.
- 😄 **Funny, stable quips** — each combination of zone and preference gets its own line that doesn't flicker on re-render.
- 📱 **Responsive** down to 375 px wide.

## 🧠 How it works

### Effective temperature

Open-Meteo's *apparent temperature* already accounts for wind and humidity. Ubierak shifts it by your personal preference:

```
effective = apparent_temperature + preference × 2 °C      (preference ∈ −5 … +5)
```

So a "freezer" at `−5` feels 10 °C colder than forecast, and a "furnace" at `+5` feels 10 °C warmer.

### Temperature zones → base outfit

| Effective °C | Zone | Base outfit |
|---|---|---|
| < −10 | 🧊 Arctic | puffer jacket, beanie, scarf, gloves, sweater, thermals, warm boots |
| −10 … 0 | ❄️ Frost | winter jacket, beanie, scarf, gloves, sweater, long pants, winter boots |
| 0 … 8 | 🥶 Cold | jacket, beanie, sweater/hoodie, long pants, shoes |
| 8 … 14 | 🍂 Brisk | light jacket, hoodie, long pants, sneakers |
| 14 … 20 | 🌤️ Pleasant | long sleeve or t-shirt + spare hoodie, pants |
| 20 … 26 | ☀️ Warm | t-shirt, shorts or light pants, sneakers |
| > 26 | 🔥 Scorcher | tank top, shorts, flip-flops, cap, sunglasses |

### Weather modifiers (independent of the slider)

| Condition | What changes |
|---|---|
| Rain now or > 50 % chance within 12 h | umbrella — or a raincoat if wind > 30 km/h |
| Snow | ankle boots (and a reminder to build a snowman) |
| UV index ≥ 6 | sunglasses + sunscreen |
| Min/max spread > 8 °C over 12 h | "take a layer for later" |
| Night | moon instead of sun in the backdrop |

### Character mood

Comfort is measured relative to a neutral 18 °C (`comfort = effective − 18`):

| Comfort | Mood |
|---|---|
| < −15 | 😱 terrified, icicle under the nose, shivering |
| −15 … −6 | 😖 grimacing, teeth chattering |
| −6 … 6 | 😄 happy |
| 6 … 12 | 😅 slightly sweaty |
| > 12 | 🥵 tongue out, red cheeks, heat haze |

All of this logic lives in pure functions in [`src/logic/outfit.ts`](src/logic/outfit.ts) and is covered by unit tests.

## 🏗️ Architecture

Ubierak is **frontend-only** — there is no backend, by design:

- All APIs it uses are free, keyless and CORS-enabled, so the browser calls them directly.
- No secrets to hide, no rate limits requiring a proxy, no data to store.
- The result is less code and free static hosting (GitHub Pages, Netlify, Vercel, …).

### External APIs

| Purpose | Service |
|---|---|
| Current weather + 12 h hourly forecast | [Open-Meteo Forecast API](https://open-meteo.com/en/docs) |
| City search | [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) |
| Place name from coordinates | [BigDataCloud Reverse Geocoding (client-side)](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) |

### Tech stack

- **React 19** + **TypeScript**, bundled with **Vite**
- Plain CSS with CSS variables — no UI framework
- Character drawn as inline SVG, animated with CSS transitions
- **Vitest** for the outfit logic, **oxlint** for linting
- State via React hooks only; preference persisted in `localStorage`

### Project structure

```
src/
├── main.tsx, App.tsx, styles.css
├── api/
│   ├── weather.ts            # Open-Meteo fetch + types
│   └── geocoding.ts          # city search + reverse geocoding
├── hooks/
│   ├── useGeolocation.ts
│   └── useWeather.ts
├── logic/
│   ├── outfit.ts             # zones, modifiers, mood (pure functions)
│   ├── outfit.test.ts
│   ├── quips.ts              # the funny lines
│   └── types.ts
└── components/
    ├── Character.tsx         # the SVG character
    ├── Layer.tsx             # animated clothing layer
    ├── WeatherBackdrop.tsx
    ├── PreferenceSlider.tsx
    ├── LocationPicker.tsx
    └── AdviceCard.tsx
```

## 🚀 Getting started

**Requirements:** Node.js 20.19+ (or 22.12+) and npm.

```bash
git clone https://github.com/hubertkubiak/ubierak.git
cd ubierak
npm install
npm run dev
```

Then open the URL printed by Vite (by default <http://localhost:5173>) and allow location access — or just type a city.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm test` | Run the outfit logic unit tests (Vitest) |
| `npm run lint` | Lint the code with oxlint |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

## 📦 Deployment

`npm run build` produces a fully static site in `dist/` that can be hosted anywhere.

> [!TIP]
> When deploying to GitHub Pages under `https://<user>.github.io/ubierak/`, set `base: '/ubierak/'` in
> [`vite.config.ts`](vite.config.ts) so asset paths resolve correctly.

## 🗺️ Out of scope (for now)

User accounts, a backend, multi-day forecasts, languages other than Polish, and PWA/offline support.
If an API requiring a key is ever added (e.g. LLM-generated advice), a thin serverless function will be introduced for it.

## 🙏 Credits

- Weather and geocoding data by [Open-Meteo](https://open-meteo.com/) (CC BY 4.0)
- Reverse geocoding by [BigDataCloud](https://www.bigdatacloud.com/)
