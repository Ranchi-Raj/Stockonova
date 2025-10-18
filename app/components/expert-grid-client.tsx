"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import DBService from "@/appwrite/db"
import HomePageSkeleton from "./skeleton"

interface Expert {
  $id: string
  name: string
  phone: string
  email: string
  expert: boolean
  intros?: string[]
  // sebi: string
  specialization?: string
  experience?: number
  photoUrl?: string
  sebiId : string
}

type Filters = {
  q: string
  specialization: string
  experience: string
  date: string
}

interface Sebi{
  $id: string
  sebiId: string
  verified: boolean
  bio : boolean
  earning : number
  experience : number
  specialization : string
}

interface User{
  $id: string
  name: string
  email: string
  phone: string
  sebi : Sebi
  expert: boolean
}



function matchesExperience(expYears: number, expFilter: string) {
  if (expFilter === "Any") return true
  if (expFilter === "0-3") return expYears <= 3
  if (expFilter === "4-7") return expYears >= 4 && expYears <= 7
  if (expFilter === "8+") return expYears >= 8
  return true
}

function FilterBar({ filters, onChange }: { filters: Filters; onChange: (filters: Partial<Filters>) => void }) {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search by name or SEBI ID..."
        className="rounded-lg border p-2"
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
      />
      <select
        className="rounded-lg border p-2"
        value={filters.specialization}
        onChange={(e) => onChange({ specialization: e.target.value })}
      >
        <option value="Any">Any Specialization</option>
        <option value="A">Equity Research</option>
        <option value="B">Portfolio Management</option>
        <option value="C">Derivatives Trading</option>
        <option value="D">Mutual Funds</option>
        <option value="E">Financial Planning</option>
        <option value="F">Risk Management</option>
        <option value="G">Compliance & Regulations</option>
      </select>
      <select
        className="rounded-lg border p-1"
        value={filters.experience}
        onChange={(e) => onChange({ experience: e.target.value })}
      >
        <option value="Any">Any Experience</option>
        <option value="0-3">0-3 years</option>
        <option value="4-7">4-7 years</option>
        <option value="8+">8+ years</option>
      </select>
    </div>
  )
}

function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={expert.photoUrl || "/placeholder.svg?height=80&width=80&query=expert%20photo"}
          alt={`Photo of ${expert.name}`}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-base font-semibold">{expert.name}</h3>
          <p className="text-xs text-muted-foreground">SEBI Reg. ID: {expert.sebiId}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-secondary text-secondary-foreground">
            {expert.specialization || "General"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {expert.experience || 0} yrs experience
          </span>
        </div>
        {expert.intros && expert.intros.length > 0 && (
          <div className="rounded-xl bg-secondary p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Upcoming Sessions</span>
              <span className="font-medium">{expert.intros.length}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Link href={`/experts/${expert.$id}`} className="w-full">
          <Button className="w-full rounded-2xl">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function ExpertGridClient() {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    specialization: "Any",
    experience: "Any",
    date: "Any",
  })
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await DBService.getAllUsers() as User[];

        console.log("Fetched experts:", data);
        const expertUsers = data
          .filter(user => user.expert === true)
          .map(user => ({
            $id: user.$id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            expert: user.expert,
            // intros: user.intros || [],
            // sebi: user.sebi || user.sebiId || "N/A",
            sebiId: user.sebi.sebiId || "N/A",
            specialization: user.sebi.specialization || "N/A",
            experience: user.sebi.experience ? user.sebi.experience : 0,
            // photoUrl: user.photoUrl, 
          }));
        setExperts(expertUsers);
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExperts();
  }, [])

  const filtered: Expert[] = useMemo(() => {
    const q = filters.q.toLowerCase().trim()
    return experts.filter((e) => {
      const matchesQ = !q || 
        e.name.toLowerCase().includes(q) || 
        e.sebiId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      const matchesSpec = filters.specialization === "Any" || e.specialization === filters.specialization
      const matchesExp = matchesExperience(e.experience || 0, filters.experience)
      return matchesQ && matchesSpec && matchesExp
    })
  }, [filters, experts])

  if (loading) {
    return (
        <HomePageSkeleton/>
    )
  }

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">
      <FilterBar filters={filters} onChange={(next) => setFilters((f) => ({ ...f, ...next }))} />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((expert) => (
          <ExpertCard key={expert.$id} expert={expert} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No experts found matching your criteria.</p>
        </div>
      )}
    </section>
  )
}