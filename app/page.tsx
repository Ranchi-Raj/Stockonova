import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExpertGridClient } from "@/app/components/expert-grid-client"
import Image from "next/image"

export default function HomePage() {
  return (
    <main>
      <NavBar />
      {/* Hero */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Connect with SEBI-Registered Experts. Learn. Consult. Grow.
              </h1>
              <p className="mt-4 text-pretty text-sm text-muted-foreground md:text-base">
                Attend verified sessions and gain personalized investment guidance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/experts">
                  <Button className="rounded-2xl" size="lg">
                    Explore Experts
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="secondary" className="rounded-2xl" size="lg">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-56 w-full max-w-md rounded-2xl border bg-secondary shadow-md md:h-72">
                <Image
                  width={480}
                  height={320}
                  src="/fintech-illustration.jpg"
                  alt="Fintech illustration"
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Listing Grid + Filters */}
      <ExpertGridClient />

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto mt-16 max-w-7xl px-4">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <div className="h-10 w-10 rounded-xl bg-primary/10"></div>
            <h3 className="mt-3 font-medium">Book Introductory Session</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a verified expert and reserve an affordable intro session.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <div className="h-10 w-10 rounded-xl bg-primary/10"></div>
            <h3 className="mt-3 font-medium">Attend Live Session</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Join the live session to validate fit and learn the approach.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <div className="h-10 w-10 rounded-xl bg-primary/10"></div>
            <h3 className="mt-3 font-medium">Unlock 1:1 Consultation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              After the intro, access premium 1:1 calendar slots for deeper guidance.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
