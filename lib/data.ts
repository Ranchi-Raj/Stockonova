export type Session = {
  id: string
  type: "intro" | "one-on-one"
  date: string // ISO
  durationMins: number
  fee: number
  status?: "scheduled" | "completed" | "cancelled"
}

export type Expert = {
  id: string
  name: string
  sebiId: string
  specialization: string
  experienceYears: number
  photoUrl?: string
  bio: string
  expertiseAreas?: string[]
  upcomingIntroSession?: Session
  oneOnOneSlots?: string[] // ISO date strings
}

export const specializations = [
  "Equity",
  "Derivatives",
  "Mutual Funds",
  "Technical Analysis",
  "Fundamental Analysis",
  "Options Strategies",
] as const

export const experts: Expert[] = [
  {
    id: "e1",
    name: "Ananya Sharma",
    sebiId: "INH000123456",
    specialization: "Equity",
    experienceYears: 8,
    photoUrl: "/placeholder-user.jpg",
    bio: "SEBI-registered investment advisor focused on long-term equity wealth creation with a disciplined, research-driven approach.",
    expertiseAreas: ["Large Cap", "Value Investing", "Portfolio Allocation"],
    upcomingIntroSession: {
      id: "s-intro-1",
      type: "intro",
      date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      durationMins: 45,
      fee: 199,
      status: "scheduled",
    },
    oneOnOneSlots: [
      new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    ],
  },
  {
    id: "e2",
    name: "Rohit Verma",
    sebiId: "INH000234567",
    specialization: "Technical Analysis",
    experienceYears: 6,
    photoUrl: "/placeholder-user.jpg",
    bio: "Price-action and risk-first trading specialist helping retail traders structure robust trading plans and journaling habits.",
    expertiseAreas: ["Swing Trading", "Price Action", "Risk Management"],
    upcomingIntroSession: {
      id: "s-intro-2",
      type: "intro",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      durationMins: 30,
      fee: 199,
      status: "scheduled",
    },
    oneOnOneSlots: [
      new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
      new Date(Date.now() + 1000 * 60 * 60 * 144).toISOString(),
    ],
  },
  {
    id: "e3",
    name: "Neha Gupta",
    sebiId: "INH000345678",
    specialization: "Mutual Funds",
    experienceYears: 10,
    photoUrl: "/placeholder-user.jpg",
    bio: "Goal-based mutual fund planning to align SIPs and asset allocation with life milestones and risk appetite.",
    expertiseAreas: ["SIPs", "Asset Allocation", "Debt Funds"],
    upcomingIntroSession: {
      id: "s-intro-3",
      type: "intro",
      date: new Date(Date.now() + 1000 * 60 * 60 * 60).toISOString(),
      durationMins: 45,
      fee: 199,
      status: "scheduled",
    },
    oneOnOneSlots: [
      new Date(Date.now() + 1000 * 60 * 60 * 84).toISOString(),
      new Date(Date.now() + 1000 * 60 * 60 * 108).toISOString(),
    ],
  },
]

export function getExpertById(id: string) {
  return experts.find((e) => e.id === id)
}
