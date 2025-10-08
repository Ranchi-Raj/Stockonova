import Image from "next/image"
import { notFound } from "next/navigation"
import { getExpertById } from "@/lib/data"
import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/app/components/booking-modal"
import { format } from "date-fns"

export default function ExpertProfile({ params }: { params: { id: string } }) {
  const expert = getExpertById(params.id)
  if (!expert) return notFound()

  const introDate = new Date(expert.upcomingIntroSession.date)

  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Image
            src={expert.photoUrl || "/placeholder.svg?height=96&width=96&query=expert%20photo"}
            alt={`Photo of ${expert.name}`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{expert.name}</h1>
            <p className="text-sm text-muted-foreground">
              SEBI Reg. ID: {expert.sebiId} • {expert.specialization} • {expert.experienceYears} yrs
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Overview */}
          <Card className="rounded-2xl p-6 md:col-span-2">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-muted-foreground">{expert.bio}</p>
            <div className="mt-4">
              <h3 className="text-sm font-medium">Expertise Areas</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {expert.expertiseAreas.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Introductory Session */}
          <Card className="rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Introductory Session</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {format(introDate, "EEE, MMM d")} • {format(introDate, "p")} • {expert.upcomingIntroSession.durationMins}{" "}
              mins
            </p>
            <div className="mt-3 text-sm">
              Fee: <span className="font-medium">₹{expert.upcomingIntroSession.fee}</span>
            </div>
            <div className="mt-4">
              <BookingModal
                title="Book Introductory Session"
                description="Confirm your ₹199 intro session. You will receive an email with the meeting link."
                trigger={<Button className="w-full rounded-2xl">Book Introductory Session</Button>}
              />
            </div>
          </Card>
        </div>

        {/* 1:1 Personalized Session (mock unlock flow) */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl p-6 md:col-span-2">
            <h2 className="text-lg font-semibold">1:1 Personalized Session</h2>
            {/* Mock: initially locked UI hint */}
            <div className="mt-2 rounded-xl border bg-secondary p-4 text-sm">Unlock after attending Intro Session.</div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {expert.oneOnOneSlots.map((slot) => {
                const d = new Date(slot)
                return (
                  <BookingModal
                    key={slot}
                    title="Book 1:1 Session"
                    description={`Confirm your 1:1 slot on ${format(d, "EEE, MMM d")} at ${format(d, "p")}.`}
                    trigger={
                      <Button variant="secondary" className="rounded-2xl">
                        {format(d, "MMM d, p")}
                      </Button>
                    }
                    onConfirmText="Book Slot"
                  />
                )
              })}
            </div>
          </Card>
          <Card className="rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Reviews coming soon. Attend an intro to unlock 1:1 and leave a review.
            </p>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  )
}
