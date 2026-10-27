import type { Mood, Zone } from './types'

export const ZONE_NAMES: Record<Zone, string> = {
  arctic: 'Arktyka',
  frost: 'Mróz',
  cold: 'Zimno',
  brisk: 'Rześko',
  pleasant: 'Przyjemnie',
  warm: 'Ciepło',
  hot: 'Patelnia',
}

const ZONE_QUIPS: Record<Zone, string[]> = {
  arctic: [
    'Załóż wszystko, co masz. Potem jeszcze sweter babci.',
    'Dziś nawet pingwiny zostają w domu.',
    'Na zewnątrz jest tak zimno, że myśli zamarzają w połowie zda…',
    'Wyglądasz jak kapusta? I bardzo dobrze. Kapusta nie marznie.',
  ],
  frost: [
    'Czapka obowiązkowa. Fryzura i tak by tego nie przeżyła.',
    'Idealna pogoda na herbatę z termosu i narzekanie.',
    'Szalik owinięty trzy razy. Cztery, jeśli jesteś zmarzluchem.',
    'Oddech robi parę. Udawaj smoka, nikt nie patrzy.',
  ],
  cold: [
    'Sweter, kurtka, godność. W tej kolejności.',
    'Nie jest tragicznie, ale palce u stóp i tak będą protestować.',
    'Pogoda pod tytułem: "a może jednak zostanę w domu?".',
  ],
  brisk: [
    'Bluza pod kurtkę i jesteś niezniszczalny. Prawie.',
    'Klasyczna pogoda "rano zimno, w południe też zimno, ale inaczej".',
    'Rześko! Słowo, którego używają ludzie, którzy lubią zimno.',
  ],
  pleasant: [
    'Długi rękaw i spokój ducha. Bluza na zapas dla świętego spokoju.',
    'Pogoda idealna. Podejrzanie idealna.',
    'Ani zimno, ani ciepło. Szwajcaria wśród temperatur.',
  ],
  warm: [
    'Szorty? Odważnie. Szanuję.',
    'T-shirt i uśmiech. Reszta jest zbędna.',
    'Idealna pogoda na lody. Każda pogoda jest idealna na lody, ale dziś szczególnie.',
  ],
  hot: [
    'Im mniej, tym lepiej. W granicach prawa.',
    'Klapki, czapka, zero ambicji. Szukaj cienia.',
    'Asfalt się topi. Ty nie musisz, pij wodę.',
    'Dziś możesz smażyć jajka na masce samochodu. Nie rób tego.',
  ],
}

const MOOD_QUIPS: Record<Mood, string[]> = {
  terrified: [
    'Twoje ciało pyta, dlaczego mu to robisz.',
    'Sopel pod nosem to nowy trend. Podobno.',
    'Rozważ hibernację.',
  ],
  freezing: [
    'Zęby szczękają w rytmie disco.',
    'Brrr. Tak, to jest cała recenzja.',
    'Ręce do kieszeni i szybkim krokiem.',
  ],
  happy: [
    'Dla ciebie to pogoda w sam raz. Ciesz się!',
    'Komfort termiczny: 10/10, polecam.',
    'Wychodzisz i po prostu jest dobrze. Rzadkie uczucie.',
  ],
  sweaty: [
    'Lekka kropelka na czole. Nic, czego dezodorant nie ogarnie.',
    'Zaczyna się robić parno. Woda w plecaku!',
    'Odrobinę za ciepło, ale da się żyć.',
  ],
  melting: [
    'Topisz się jak lód w lipcu.',
    'Język na brodzie, a to dopiero początek dnia.',
    'Twoje wewnętrzne pingwiny składają wypowiedzenie.',
  ],
}

/** Stable pick: the same seed always gives the same quip, so text doesn't flicker on re-render. */
function pick(list: string[], seed: string): string {
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return list[h % list.length]
}

export function zoneQuip(zone: Zone, preference: number): string {
  return pick(ZONE_QUIPS[zone], `${zone}:${preference}`)
}

export function moodQuip(mood: Mood, preference: number): string {
  return pick(MOOD_QUIPS[mood], `${mood}:${preference}`)
}

export const PREFERENCE_LABELS: Record<number, string> = {
  [-5]: '🥶 Wieczny zmarzluch',
  [-4]: '🧣 Szalik od września',
  [-3]: '👵 Babcia w październiku',
  [-2]: '🧦 Dwie pary skarpet',
  [-1]: '☕ Lubię ciepłą herbatę',
  0: '😐 Normals',
  1: '🩳 Krótki rękaw do listopada',
  2: '🍦 Lody w marcu',
  3: '🏊 Morsuję od 2019',
  4: '🐻‍❄️ Niedźwiedź polarny',
  5: '🔥 Chodzący piecyk',
}
