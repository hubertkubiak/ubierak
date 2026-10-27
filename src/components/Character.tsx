import type { Mood, Outer, Outfit } from '../logic/types'
import { Layer } from './Layer'

const SKIN: Record<Mood, string> = {
  terrified: '#bcd9f2',
  freezing: '#ecd3c8',
  happy: '#f5c8a0',
  sweaty: '#f7bc92',
  melting: '#ff9f80',
}

const OUTER_COLORS: Record<Exclude<Outer, 'none'>, string> = {
  light: '#f4d35e',
  jacket: '#2a9d8f',
  winter: '#264653',
  puffer: '#ef476f',
  raincoat: '#ffd60a',
}

const INK = '#2b2d42'

interface Props {
  outfit: Outfit
  mood: Mood
  wet: boolean
}

function Sleeves({ color, width, short = false }: { color: string; width: number; short?: boolean }) {
  const end = short ? [66, 152, 134, 152] : [55, 206, 145, 206]
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round">
      <line x1={76} y1={124} x2={end[0]} y2={end[1]} />
      <line x1={124} y1={124} x2={end[2]} y2={end[3]} />
    </g>
  )
}

function Face({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'terrified':
      return (
        <g key={mood} className="face">
          <circle cx={87} cy={67} r={8} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={113} cy={67} r={8} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={87} cy={68} r={2.5} fill={INK} />
          <circle cx={113} cy={68} r={2.5} fill={INK} />
          <path d="M80 55 L94 58 M120 55 L106 58" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <ellipse cx={100} cy={89} rx={7} ry={9} fill={INK} />
          <polygon points="96,79 104,79 100,96" fill="#e0f7ff" stroke="#7ec8e3" strokeWidth={1.5} />
        </g>
      )
    case 'freezing':
      return (
        <g key={mood} className="face">
          <path d="M81 63 L93 68 L81 72 M119 63 L107 68 L119 72" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={78} cy={81} r={6} fill="#8ecae6" opacity={0.7} />
          <circle cx={122} cy={81} r={6} fill="#8ecae6" opacity={0.7} />
          <g className="chatter">
            <rect x={87} y={83} width={26} height={10} rx={3} fill="#fff" stroke={INK} strokeWidth={2} />
            <path d="M93.5 83 V93 M100 83 V93 M106.5 83 V93 M87 88 H113" stroke={INK} strokeWidth={1.5} />
          </g>
        </g>
      )
    case 'happy':
      return (
        <g key={mood} className="face">
          <path d="M81 70 Q87 61 93 70 M107 70 Q113 61 119 70" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <circle cx={79} cy={81} r={6} fill="#ff8fab" opacity={0.6} />
          <circle cx={121} cy={81} r={6} fill="#ff8fab" opacity={0.6} />
          <path d="M86 83 Q100 99 114 83 Z" fill={INK} />
          <path d="M92 89 Q100 95 108 89" fill="none" stroke="#ff6b6b" strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'sweaty':
      return (
        <g key={mood} className="face">
          <circle cx={87} cy={68} r={3.5} fill={INK} />
          <circle cx={113} cy={68} r={3.5} fill={INK} />
          <path d="M86 87 Q93 82 100 87 Q107 92 114 87" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path className="drip" d="M128 46 Q122 56 128 60 Q134 56 128 46 Z" fill="#48cae4" stroke="#0096c7" strokeWidth={1} />
        </g>
      )
    case 'melting':
      return (
        <g key={mood} className="face">
          <path d="M81 69 Q87 74 93 69 M107 69 Q113 74 119 69" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M80 65 H94 M106 65 H120" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <circle cx={78} cy={80} r={7} fill="#e63946" opacity={0.55} />
          <circle cx={122} cy={80} r={7} fill="#e63946" opacity={0.55} />
          <path d="M87 82 Q100 80 113 82 Q110 94 100 94 Q90 94 87 82 Z" fill={INK} />
          <path className="tongue" d="M94 88 Q94 104 100 104 Q106 104 106 88 Z" fill="#ff6b81" stroke="#c9184a" strokeWidth={1.5} />
          <path className="drip" d="M130 44 Q124 54 130 58 Q136 54 130 44 Z" fill="#48cae4" />
          <path className="drip drip-late" d="M70 50 Q65 58 70 61 Q75 58 70 50 Z" fill="#48cae4" />
          <g className="heat" fill="none" stroke="#ff7b00" strokeWidth={2.5} strokeLinecap="round" opacity={0.7}>
            <path d="M78 14 q5 -6 0 -12 q-5 -6 0 -12" />
            <path d="M100 8 q5 -6 0 -12 q-5 -6 0 -12" />
            <path d="M122 14 q5 -6 0 -12 q-5 -6 0 -12" />
          </g>
        </g>
      )
  }
}

export function Character({ outfit: o, mood, wet }: Props) {
  const skin = SKIN[mood]
  const shake = mood === 'terrified' ? 'shake-hard' : mood === 'freezing' ? 'shake' : ''
  const outerColor = o.outer === 'none' ? '#000' : OUTER_COLORS[o.outer]
  const puffer = o.outer === 'puffer'

  return (
    <svg className="character" viewBox="-30 -70 260 440" role="img" aria-label="Postać ubrana według pogody">
      <g className={shake} stroke={INK} strokeLinejoin="round">
        {/* Hood of the raincoat sits behind the head */}
        <Layer on={o.outer === 'raincoat'}>
          <circle cx={100} cy={66} r={44} fill={OUTER_COLORS.raincoat} strokeWidth={3} />
        </Layer>

        {/* Body */}
        <g className="skin" fill={skin} strokeWidth={3}>
          <g stroke={INK} strokeWidth={19} strokeLinecap="round">
            <line x1={76} y1={124} x2={54} y2={212} />
            <line x1={124} y1={124} x2={146} y2={212} />
          </g>
          <g stroke={skin} strokeWidth={13} strokeLinecap="round">
            <line x1={76} y1={124} x2={54} y2={212} />
            <line x1={124} y1={124} x2={146} y2={212} />
          </g>
          <circle cx={52} cy={220} r={9} />
          <circle cx={148} cy={220} r={9} />
          <rect x={74} y={218} width={24} height={132} rx={10} />
          <rect x={102} y={218} width={24} height={132} rx={10} />
          <ellipse cx={82} cy={352} rx={15} ry={7} />
          <ellipse cx={118} cy={352} rx={15} ry={7} />
          <rect x={91} y={96} width={18} height={22} />
          <rect x={70} y={112} width={60} height={114} rx={14} />
          <rect x={72} y={214} width={56} height={30} rx={8} fill="#fff" />
          <circle cx={100} cy={68} r={34} />
        </g>

        {/* Legwear */}
        <Layer on={o.legwear === 'thermal'}>
          <rect x={73} y={330} width={26} height={16} rx={4} fill="#d62828" strokeWidth={2.5} />
          <rect x={101} y={330} width={26} height={16} rx={4} fill="#d62828" strokeWidth={2.5} />
          <path d="M70 212 H130 V334 H102 V250 H98 V334 H70 Z" fill="#4a4e69" strokeWidth={3} />
        </Layer>
        <Layer on={o.legwear === 'pants'}>
          <path d="M70 212 H130 V346 H102 V250 H98 V346 H70 Z" fill="#3b6fb6" strokeWidth={3} />
          <path d="M84 250 V340 M116 250 V340" stroke="#2c5490" strokeWidth={1.5} strokeDasharray="4 4" />
        </Layer>
        <Layer on={o.legwear === 'shorts'}>
          <path d="M70 212 H130 V276 H102 V246 H98 V276 H70 Z" fill="#d9a441" strokeWidth={3} />
          <path d="M80 224 h10 M110 224 h10" strokeWidth={2} />
        </Layer>

        {/* Footwear */}
        <Layer on={o.feet === 'flipflops'}>
          <ellipse cx={82} cy={359} rx={17} ry={4} fill="#ffbe0b" strokeWidth={2.5} />
          <ellipse cx={118} cy={359} rx={17} ry={4} fill="#ffbe0b" strokeWidth={2.5} />
          <path d="M76 350 L82 356 L88 350 M112 350 L118 356 L124 350" fill="none" stroke="#fb5607" strokeWidth={3} />
        </Layer>
        <Layer on={o.feet === 'sneakers'}>
          <rect x={64} y={342} width={36} height={18} rx={9} fill="#fff" strokeWidth={3} />
          <rect x={100} y={342} width={36} height={18} rx={9} fill="#fff" strokeWidth={3} />
          <path d="M66 354 H98 M102 354 H134" stroke="#ff006e" strokeWidth={3} />
        </Layer>
        <Layer on={o.feet === 'shoes'}>
          <rect x={64} y={340} width={36} height={20} rx={9} fill="#6f4518" strokeWidth={3} />
          <rect x={100} y={340} width={36} height={20} rx={9} fill="#6f4518" strokeWidth={3} />
          <path d="M66 356 H98 M102 356 H134" stroke="#3d2610" strokeWidth={3} />
        </Layer>
        <Layer on={o.feet === 'boots'}>
          <path d="M71 300 H99 V360 H62 Q62 344 71 340 Z" fill="#5e3a1d" strokeWidth={3} />
          <path d="M101 300 H129 V340 Q138 344 138 360 H101 Z" fill="#5e3a1d" strokeWidth={3} />
          <rect x={68} y={294} width={34} height={12} rx={6} fill="#fff1d6" strokeWidth={2.5} />
          <rect x={98} y={294} width={34} height={12} rx={6} fill="#fff1d6" strokeWidth={2.5} />
        </Layer>

        {/* Tops */}
        <Layer on={o.top === 'tanktop'}>
          <path d="M76 114 H86 Q100 132 114 114 H124 Q130 118 130 128 V226 H70 V128 Q70 118 76 114 Z" fill="#ff6b6b" strokeWidth={3} />
        </Layer>
        <Layer on={o.top === 'tshirt'}>
          <Sleeves color={INK} width={25} short />
          <Sleeves color="#4ecdc4" width={20} short />
          <rect x={70} y={112} width={60} height={116} rx={14} fill="#4ecdc4" strokeWidth={3} />
          <path d="M88 113 Q100 124 112 113" fill="none" strokeWidth={2.5} />
          <text x={100} y={168} fontSize={22} textAnchor="middle" stroke="none" fill="#fff">☀</text>
        </Layer>
        <Layer on={o.top === 'longsleeve'}>
          <Sleeves color={INK} width={24} />
          <Sleeves color="#9b5de5" width={19} />
          <rect x={70} y={112} width={60} height={116} rx={14} fill="#9b5de5" strokeWidth={3} />
          <path d="M72 150 H128 M72 175 H128 M72 200 H128" stroke="#b983ff" strokeWidth={6} />
        </Layer>

        {/* Spare hoodie tied around the waist */}
        <Layer on={o.spareLayer && o.outer === 'none' && o.mid === 'none'}>
          <path d="M100 222 L88 262 M100 222 L112 262" stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d="M100 222 L88 262 M100 222 L112 262" stroke="#8d99ae" strokeWidth={9} strokeLinecap="round" />
          <rect x={64} y={210} width={72} height={16} rx={8} fill="#8d99ae" strokeWidth={3} />
          <circle cx={100} cy={220} r={7} fill="#7a8599" strokeWidth={2.5} />
        </Layer>

        {/* Mid layers */}
        <Layer on={o.mid === 'hoodie'}>
          <ellipse cx={100} cy={112} rx={26} ry={10} fill="#6c757d" strokeWidth={3} />
          <Sleeves color={INK} width={27} />
          <Sleeves color="#8d99ae" width={22} />
          <rect x={67} y={110} width={66} height={122} rx={16} fill="#8d99ae" strokeWidth={3} />
          <rect x={82} y={186} width={36} height={22} rx={6} fill="#7a8599" strokeWidth={2.5} />
          <path d="M93 116 V140 M107 116 V140" strokeWidth={2} />
        </Layer>
        <Layer on={o.mid === 'sweater'}>
          <Sleeves color={INK} width={27} />
          <Sleeves color="#e07a5f" width={22} />
          <rect x={67} y={110} width={66} height={122} rx={16} fill="#e07a5f" strokeWidth={3} />
          <path d="M70 150 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8" fill="none" stroke="#fff" strokeWidth={4} />
          <path d="M70 172 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8" fill="none" stroke="#f2cc8f" strokeWidth={4} />
          <rect x={86} y={104} width={28} height={12} rx={5} fill="#c8553d" strokeWidth={2.5} />
        </Layer>

        {/* Outer layers: one shape, different colours */}
        <Layer on={o.outer !== 'none'}>
          <Sleeves color={INK} width={puffer ? 37 : 31} />
          <Sleeves color={outerColor} width={puffer ? 32 : 26} />
          <rect x={puffer ? 56 : 63} y={106} width={puffer ? 88 : 74} height={130} rx={puffer ? 26 : 18} fill={outerColor} strokeWidth={3} />
          <path d="M100 112 V236" strokeWidth={2.5} />
          {puffer && <path d="M58 140 H142 M58 168 H142 M58 196 H142 M58 222 H142" strokeWidth={2} opacity={0.6} />}
          {o.outer === 'jacket' && (
            <path d="M72 192 h18 v14 h-18 Z M110 192 h18 v14 h-18 Z" fill="#21867a" strokeWidth={2} />
          )}
          {o.outer === 'winter' && (
            <g fill="#f8f9fa" strokeWidth={2}>
              <circle cx={78} cy={110} r={8} />
              <circle cx={90} cy={104} r={8} />
              <circle cx={110} cy={104} r={8} />
              <circle cx={122} cy={110} r={8} />
            </g>
          )}
          {o.outer === 'raincoat' && (
            <g fill={INK}>
              <circle cx={108} cy={140} r={3} />
              <circle cx={108} cy={170} r={3} />
              <circle cx={108} cy={200} r={3} />
            </g>
          )}
          {o.outer === 'light' && <path d="M66 214 H134" strokeWidth={5} stroke="#ee964b" />}
        </Layer>

        <Layer on={o.scarf}>
          <rect x={104} y={110} width={14} height={54} rx={5} fill="#d62828" strokeWidth={3} />
          <path d="M106 150 H116 M106 158 H116" stroke="#fff" strokeWidth={3} />
          <rect x={80} y={98} width={40} height={18} rx={8} fill="#d62828" strokeWidth={3} />
          <path d="M90 99 V115 M100 99 V115 M110 99 V115" stroke="#fff" strokeWidth={3} />
        </Layer>

        <Layer on={o.gloves}>
          <circle cx={52} cy={221} r={12} fill="#3a86ff" strokeWidth={3} />
          <circle cx={148} cy={221} r={12} fill="#3a86ff" strokeWidth={3} />
          <ellipse cx={62} cy={214} rx={5} ry={7} fill="#3a86ff" strokeWidth={2.5} />
          <ellipse cx={138} cy={214} rx={5} ry={7} fill="#3a86ff" strokeWidth={2.5} />
        </Layer>

        {/* Face and hair */}
        <path d="M100 76 q-3 4 0 6" fill="none" strokeWidth={2} strokeLinecap="round" />
        <Face mood={mood} />
        <path
          className={wet ? 'hair hair-wet' : 'hair'}
          d="M66 64 Q68 30 100 32 Q132 30 134 64 Q124 48 112 50 Q104 42 96 48 Q82 44 66 64 Z"
          fill="#6b3e26"
          strokeWidth={3}
        />
        {wet && (
          <g className="wet-drops" fill="#48cae4" stroke="#0096c7" strokeWidth={1}>
            <path d="M72 64 Q68 72 72 75 Q76 72 72 64 Z" />
            <path d="M130 62 Q126 70 130 73 Q134 70 130 62 Z" />
            <path d="M100 34 Q96 42 100 45 Q104 42 100 34 Z" />
          </g>
        )}

        {/* Headwear */}
        <Layer on={o.head === 'beanie'}>
          <path d="M64 60 Q64 26 100 26 Q136 26 136 60 Z" fill="#3a86ff" strokeWidth={3} />
          <rect x={61} y={52} width={78} height={14} rx={7} fill="#265fc4" strokeWidth={3} />
          <circle cx={100} cy={22} r={10} fill="#fff" strokeWidth={3} />
        </Layer>
        <Layer on={o.head === 'cap'}>
          <path d="M67 56 Q68 28 100 28 Q132 28 133 56 Z" fill="#ff006e" strokeWidth={3} />
          <ellipse cx={100} cy={57} rx={44} ry={7} fill="#c9005a" strokeWidth={3} />
          <circle cx={100} cy={28} r={4} fill="#ff006e" strokeWidth={2} />
        </Layer>

        <Layer on={o.sunglasses}>
          <rect x={76} y={60} width={22} height={14} rx={6} fill={INK} />
          <rect x={102} y={60} width={22} height={14} rx={6} fill={INK} />
          <path d="M98 65 H102 M76 64 L67 61 M124 64 L133 61" strokeWidth={2.5} />
          <path d="M80 63 l6 0" stroke="#fff" strokeWidth={2} opacity={0.7} />
        </Layer>

        <Layer on={o.umbrella}>
          <path d="M148 222 V-26" strokeWidth={3.5} fill="none" />
          <path d="M148 222 q0 10 -8 10 q-6 0 -6 -6" fill="none" strokeWidth={3.5} strokeLinecap="round" />
          <path
            d="M74 -2 Q80 -60 148 -62 Q216 -60 222 -2 Q209 -12 197 -2 Q185 -12 173 -2 Q160 -12 148 -2 Q136 -12 123 -2 Q111 -12 99 -2 Q87 -12 74 -2 Z"
            fill="#e63946"
            strokeWidth={3}
          />
          <path d="M148 -62 Q124 -40 123 -2 M148 -62 Q172 -40 173 -2" fill="none" strokeWidth={2} />
        </Layer>
      </g>
    </svg>
  )
}
