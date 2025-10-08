"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Expert } from "@/lib/data"
import { format } from "date-fns"

export function ExpertCard({ expert }: { expert: Expert }) {
  const sessionDate = new Date(expert.upcomingIntroSession.date)
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
          <Badge className="rounded-full bg-secondary text-secondary-foreground">{expert.specialization}</Badge>
          <span className="text-xs text-muted-foreground">{expert.experienceYears} yrs experience</span>
        </div>
        <div className="rounded-xl bg-secondary p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Next Intro Session</span>
            <span className="font-medium">
              {format(sessionDate, "EEE, MMM d")} • {format(sessionDate, "p")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Link href={`/experts/${expert.id}`} className="w-full">
          <Button className="w-full rounded-2xl">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
