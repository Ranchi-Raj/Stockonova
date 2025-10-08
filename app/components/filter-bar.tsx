"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specializations } from "@/lib/data"

type Filters = {
  q: string
  specialization: string
  experience: string
  date: string
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Partial<Filters>) => void
}) {
  const expOptions = useMemo(() => ["Any", "0-3", "4-7", "8+"], [])
  const dateOptions = useMemo(() => ["Any", "Today", "This Week", "This Month"], [])

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 md:flex-row md:items-center">
      <Input
        placeholder="Search experts by name or SEBI ID"
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
        className="rounded-2xl"
      />
      <Select onValueChange={(v) => onChange({ specialization: v })} value={filters.specialization}>
        <SelectTrigger className="rounded-2xl">
          <SelectValue placeholder="Specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Any">Any</SelectItem>
          {specializations.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(v) => onChange({ experience: v })} value={filters.experience}>
        <SelectTrigger className="rounded-2xl">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          {expOptions.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(v) => onChange({ date: v })} value={filters.date}>
        <SelectTrigger className="rounded-2xl">
          <SelectValue placeholder="Session Date" />
        </SelectTrigger>
        <SelectContent>
          {dateOptions.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
