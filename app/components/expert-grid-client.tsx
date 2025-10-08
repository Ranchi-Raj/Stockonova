"use client"

import { useMemo, useState } from "react"
import { type Expert, experts } from "@/lib/data"
import { FilterBar } from "./filter-bar"
import { ExpertCard } from "./expert-card"

type Filters = {
  q: string
  specialization: string
  experience: string
  date: string
}

function matchesExperience(expYears: number, expFilter: string) {
  if (expFilter === "Any") return true
  if (expFilter === "0-3") return expYears <= 3
  if (expFilter === "4-7") return expYears >= 4 && expYears <= 7
  if (expFilter === "8+") return expYears >= 8
  return true
}

function matchesDate(d: Date, dateFilter: string) {
  if (dateFilter === "Any") return true
  const now = new Date()
  if (dateFilter === "Today") {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }
  if (dateFilter === "This Week") {
    const diffDays = (d.getTime() - now.getTime()) / (1000 * 3600 * 24)
    return diffDays >= 0 && diffDays <= 7
  }
  if (dateFilter === "This Month") {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }
  return true
}

export function ExpertGridClient() {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    specialization: "Any",
    experience: "Any",
    date: "Any",
  })

  const filtered: Expert[] = useMemo(() => {
    const q = filters.q.toLowerCase().trim()
    return experts.filter((e) => {
      const matchesQ = !q || e.name.toLowerCase().includes(q) || e.sebiId.toLowerCase().includes(q)
      const matchesSpec = filters.specialization === "Any" || e.specialization === filters.specialization
      const matchesExp = matchesExperience(e.experienceYears, filters.experience)
      const matchesIntroDate = matchesDate(new Date(e.upcomingIntroSession.date), filters.date)
      return matchesQ && matchesSpec && matchesExp && matchesIntroDate
    })
  }, [filters])

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">
      <FilterBar filters={filters} onChange={(next) => setFilters((f) => ({ ...f, ...next }))} />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <ExpertCard key={e.id} expert={e} />
        ))}
      </div>
    </section>
  )
}
