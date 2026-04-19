// components/Icons.tsx
// Ícones SVG customizados para o Bazar Absoluto — substituem os emojis.
// Uso: <IconHome size={20} />  — cor é controlada via CSS (color/fill currentColor).

import React from 'react'

type IconProps = {
  size?: number
  stroke?: number
  className?: string
  style?: React.CSSProperties
}

const Svg = ({
  children,
  size = 22,
  stroke = 1.8,
  fill = 'none',
  className,
  style,
}: IconProps & { children: React.ReactNode; fill?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'block', flexShrink: 0, ...style }}
  >
    {children}
  </svg>
)

/* Navegação / primários */
export const IconHome = (p: IconProps) => (
  <Svg {...p}><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z"/></Svg>
)
export const IconHomeFill = (p: IconProps) => (
  <Svg {...p} fill="currentColor"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" stroke="none"/></Svg>
)
export const IconBriefcase = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></Svg>
)
export const IconNews = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="4" width="15" height="16" rx="1.5"/><path d="M18 8h3v10a2 2 0 0 1-2 2h-1"/><path d="M7 8h7M7 12h7M7 16h4"/></Svg>
)
export const IconUser = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></Svg>
)
export const IconPlus = (p: IconProps) => (
  <Svg {...p}><path d="M12 5v14M5 12h14"/></Svg>
)
export const IconTool = (p: IconProps) => (
  <Svg {...p}><path d="M14.7 6.3a4 4 0 0 0 5 5l-9.9 9.9a2.8 2.8 0 1 1-4-4l9-9Z"/><path d="M14.7 6.3l4 4"/></Svg>
)

/* Interações */
export const IconHeart = (p: IconProps) => (
  <Svg {...p}><path d="M12 20s-7-4.3-9.3-9.2C1 7 3.5 3.5 7 3.5c2 0 3.8 1.2 5 3 1.2-1.8 3-3 5-3 3.5 0 6 3.5 4.3 7.3C19 15.7 12 20 12 20Z"/></Svg>
)
export const IconHeartFill = (p: IconProps) => (
  <Svg {...p} fill="currentColor"><path d="M12 20s-7-4.3-9.3-9.2C1 7 3.5 3.5 7 3.5c2 0 3.8 1.2 5 3 1.2-1.8 3-3 5-3 3.5 0 6 3.5 4.3 7.3C19 15.7 12 20 12 20Z"/></Svg>
)
export const IconComment = (p: IconProps) => (
  <Svg {...p}><path d="M21 12a8 8 0 0 1-11.8 7L4 20.5l1.3-4.6A8 8 0 1 1 21 12Z"/></Svg>
)
export const IconShare = (p: IconProps) => (
  <Svg {...p}><path d="M12 3v13"/><path d="M7 8l5-5 5 5"/><path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5"/></Svg>
)
export const IconBookmark = (p: IconProps) => (
  <Svg {...p}><path d="M6 3h12v18l-6-4-6 4V3Z"/></Svg>
)
export const IconSend = (p: IconProps) => (
  <Svg {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7Z"/></Svg>
)

/* UI */
export const IconBell = (p: IconProps) => (
  <Svg {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></Svg>
)
export const IconSearch = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Svg>
)
export const IconMore = (p: IconProps) => (
  <Svg {...p}><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/></Svg>
)
export const IconMoreV = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/></Svg>
)
export const IconClose = (p: IconProps) => (
  <Svg {...p}><path d="M6 6l12 12M18 6L6 18"/></Svg>
)
export const IconMoon = (p: IconProps) => (
  <Svg {...p}><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z"/></Svg>
)
export const IconSun = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></Svg>
)
export const IconSettings = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></Svg>
)
export const IconCamera = (p: IconProps) => (
  <Svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11Z"/><circle cx="12" cy="13" r="4"/></Svg>
)
export const IconVideo = (p: IconProps) => (
  <Svg {...p}><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8Z"/></Svg>
)
export const IconImage = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.8"/><path d="M21 16l-5-5L5 21"/></Svg>
)
export const IconPin = (p: IconProps) => (
  <Svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Svg>
)
export const IconGlobe = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Svg>
)
export const IconLock = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Svg>
)
export const IconStar = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l2.9 6 6.6 1-4.8 4.6 1.2 6.5L12 18l-5.9 3.1 1.2-6.5L2.5 10l6.6-1L12 3Z"/></Svg>
)
export const IconStarFill = (p: IconProps) => (
  <Svg {...p} fill="currentColor"><path d="M12 3l2.9 6 6.6 1-4.8 4.6 1.2 6.5L12 18l-5.9 3.1 1.2-6.5L2.5 10l6.6-1L12 3Z"/></Svg>
)
export const IconFlag = (p: IconProps) => (
  <Svg {...p}><path d="M4 21V4"/><path d="M4 4h13l-2 4 2 4H4"/></Svg>
)
export const IconLink = (p: IconProps) => (
  <Svg {...p}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></Svg>
)
export const IconDollar = (p: IconProps) => (
  <Svg {...p}><path d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Svg>
)
export const IconClock = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Svg>
)
export const IconBuilding = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/></Svg>
)
export const IconCheck = (p: IconProps) => (
  <Svg {...p}><path d="M4 12l5 5L20 6"/></Svg>
)
export const IconChevron = (p: IconProps) => (
  <Svg {...p}><path d="M9 6l6 6-6 6"/></Svg>
)
export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Svg>
)
export const IconMenu = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Svg>
)
