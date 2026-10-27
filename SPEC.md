
# Ubierak 🧥🩳 – specyfikacja

## 1. Cel
Jednoekranowa aplikacja webowa. Pobiera pogodę dla Twojej lokalizacji, łączy ją z Twoją tolerancją na zimno i ciepło i z humorem mówi, co założyć. Najważniejsza jest postać na środku ekranu: przy przesuwaniu suwaka ubiera się lub rozbiera i zmienia minę.

## 2. Decyzja architektoniczna: bez backendu
- **Open-Meteo** (pogoda + geocoding) nie wymaga klucza API i obsługuje CORS. Frontend woła je więc bezpośrednio.
- Backend w Node nie jest potrzebny: nie ma sekretów do ukrycia ani limitów, które wymagałyby proxy, ani danych do trzymania. Mniej kodu i darmowy hosting statyczny (GitHub Pages, Netlify, Vercel).
- Jeśli kiedyś dojdzie API z kluczem (np. generowanie porad przez LLM), dodamy cienką funkcję serverless. Poza zakresem v1.

## 3. Stack
- Vite + React 18 + TypeScript
- Czysty CSS (CSS variables), bez frameworka UI
- Postać jako inline SVG w komponencie React (warstwy ubrań włączane i wyłączane, animacje przez CSS transitions)
- Vitest do logiki doboru ubrań
- Brak zarządzania stanem poza `useState`/`useReducer`; preferencja zapisywana w `localStorage`

## 4. Zewnętrzne API
| Cel | Endpoint |
|---|---|
| Pogoda | `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,apparent_temperature,precipitation,rain,snowfall,weather_code,wind_speed_10m,uv_index,is_day&hourly=temperature_2m,precipitation_probability&forecast_hours=12&timezone=auto` |
| Wyszukiwanie miasta | `https://geocoding-api.open-meteo.com/v1/search?name=..&count=5&language=pl` |
| Nazwa miejsca z współrzędnych | `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=..&longitude=..&localityLanguage=pl` (darmowe, bez klucza, przeznaczone do użycia z klienta) |

Z prognozy godzinowej na 12 h liczymy min i max temperatury oraz max prawdopodobieństwo opadów, żeby podpowiedź obejmowała cały dzień, a nie tylko bieżącą chwilę („wieczorem weź bluzę”).

## 5. Przepływ użytkownika
1. Start: aplikacja prosi o lokalizację (`navigator.geolocation.getCurrentPosition`, timeout 10 s).
2. Zgoda: pobranie pogody i nazwy miejsca.
3. Odmowa, błąd lub timeout: pole „Wpisz miasto” z podpowiedziami z geocodingu (debounce 300 ms). Pole jest też zawsze dostępne pod linkiem „zmień miejsce”.
4. Suwak preferencji (domyślnie 0 lub ostatnia wartość z `localStorage`). Postać i porada aktualizują się na żywo, bez ponownego pobierania pogody.
5. Karta porady: lista ubrań, zabawny komentarz, ostrzeżenia (parasol, krem z filtrem, czapka).

## 6. Suwak preferencji
- Zakres `-5 … +5`, krok 1.
- Etykiety: `-5` „🥶 Wieczny zmarzluch”, `0` „😐 Normals”, `+5` „🔥 Chodzący piecyk”. Pośrednie wartości mają własne krótkie podpisy (np. `-3` „Babcia w październiku”, `+3` „Morsuję od 2019”).
- Znaczenie: każdy punkt to **2 °C przesunięcia odczuwalnej temperatury**. Zmarzluch na `-5` odczuwa 10 °C mniej niż wskazuje prognoza, piecyk na `+5` odczuwa 10 °C więcej.

## 7. Logika
### 7.1 Temperatura efektywna
```
efektywna = apparent_temperature + preferencja * 2
```
(`apparent_temperature` z Open-Meteo uwzględnia już wiatr i wilgotność.)

### 7.2 Strefy → strój bazowy
| Efektywna °C | Strefa | Strój |
|---|---|---|
| < -10 | Arktyka | kurtka puchowa, czapka, szalik, rękawiczki, sweter, kalesony, ciepłe buty |
| -10 … 0 | Mróz | zimowa kurtka, czapka, szalik, rękawiczki, sweter, długie spodnie, buty zimowe |
| 0 … 8 | Zimno | kurtka, czapka, sweter/bluza, długie spodnie, buty |
| 8 … 14 | Rześko | lekka kurtka, bluza, długie spodnie, sneakersy |
| 14 … 20 | Przyjemnie | koszulka z długim rękawem lub t-shirt + bluza na zapas, spodnie |
| 20 … 26 | Ciepło | t-shirt, szorty lub lekkie spodnie, sneakersy |
| > 26 | Patelnia | top/koszulka bez rękawów, szorty, klapki, czapka z daszkiem, okulary |

### 7.3 Modyfikatory pogodowe (niezależne od suwaka)
- Opad deszczu teraz lub > 50 % w ciągu 12 h → parasol; przy wietrze > 30 km/h zamiast niego kurtka przeciwdeszczowa („parasol odleci”).
- Śnieg → buty za kostkę, komentarz o bałwanie.
- UV ≥ 6 → okulary + krem z filtrem.
- Rozrzut min/max w ciągu 12 h > 8 °C → „weź warstwę na później”.
- Noc (`is_day = 0`) → postać ma w tle księżyc zamiast słońca.

### 7.4 Mina postaci
Mina zależy od tego, jak bardzo pogoda „pasuje” danej osobie. Liczymy `komfort = efektywna - 18` (18 °C to neutralny punkt komfortu):
| komfort | Mina |
|---|---|
| < -15 | 😱 przerażona, sopel pod nosem, drżenie (animacja shake) |
| -15 … -6 | 😖 skrzywiona, zęby szczękają |
| -6 … 6 | 😄 zadowolona |
| 6 … 12 | 😅 lekko spocona, kropla potu |
| > 12 | 🥵 wywalony język, czerwone policzki, falowanie powietrza |

Gdy pada, a postać nie ma parasola (silny wiatr), dostaje mokrą grzywkę i krople na twarzy.

### 7.5 Teksty
- Każda strefa i mina ma 3–5 zabawnych tekstów po polsku. Losujemy jeden, stały dla danej kombinacji (seed = strefa + preferencja), żeby tekst nie migał przy każdym renderze.
- Przykłady: „Załóż wszystko, co masz. Potem jeszcze sweter babci.”, „Szorty? Odważnie. Szanuję.”, „Dziś nawet pingwiny zostają w domu.”

## 8. Postać (SVG)
- Jeden komponent `<Character outfit={...} mood={...} />`, viewBox ok. 200×400.
- Warstwy, rysowane w kolejności od spodu: ciało → bielizna/kalesony → spodnie lub szorty → t-shirt/top → sweter/bluza → kurtka → szalik → czapka → rękawiczki → buty → akcesoria (parasol, okulary, czapka z daszkiem) → twarz (mina).
- Każda warstwa to `<g>` z `opacity` i `transform` sterowanymi CSS transition (ok. 300 ms). Ubranie „zjeżdża” z góry przy zakładaniu i „spada” przy zdejmowaniu.
- Tło zależne od pogody: słońce lub księżyc, chmury, krople deszczu, płatki śniegu (proste animacje CSS).
- Styl płaski, kolorowy, grube kontury, bez zewnętrznych assetów.

## 9. Układ ekranu
- Desktop: lewa kolumna z lokalizacją i pogodą (ikona, temp., odczuwalna, wiatr, opady) oraz suwakiem. Środek: postać. Prawa kolumna: karta porady.
- Mobile (< 768 px): jedna kolumna w kolejności lokalizacja → postać → suwak (przyklejony nad postacią) → porada.
- Stany: ładowanie (postać zerka zza chmury), błąd API („Chmury zjadły internet”, przycisk Ponów), brak lokalizacji (formularz miasta).

## 10. Struktura plików
```
ubierak/
  SPEC.md
  index.html
  package.json, vite.config.ts, tsconfig.json
  src/
    main.tsx, App.tsx, styles.css
    api/weather.ts        # fetch Open-Meteo, typy
    api/geocoding.ts      # search + reverse
    hooks/useGeolocation.ts
    hooks/useWeather.ts
    logic/outfit.ts       # strefy, modyfikatory, mina (czyste funkcje)
    logic/outfit.test.ts
    logic/quips.ts        # zabawne teksty
    components/Character.tsx
    components/WeatherBackdrop.tsx
    components/PreferenceSlider.tsx
    components/LocationPicker.tsx
    components/AdviceCard.tsx
```

## 11. Poza zakresem v1
Konta użytkowników, backend, prognoza na kolejne dni, i18n poza polskim, PWA.

## 12. Kryteria akceptacji
- Po zgodzie na lokalizację w ciągu ok. 2 s widać pogodę i ubraną postać.
- Bez zgody da się wpisać miasto i dostać wynik.
- Przesuwanie suwaka płynnie zmienia ubrania i minę, bez zapytań sieciowych.
- Porada uwzględnia deszcz, UV i wahania temperatury.
- Testy `logic/outfit.ts` przechodzą (granice stref, modyfikatory, mina).
- Działa na szerokości 375 px.

