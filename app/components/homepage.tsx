"use client"

import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Tv, SquareDashedBottomCode, BookLock } from "lucide-react"

export default function HomePage() {
  return (
    <main>
      <NavBar />
      
      {/* Hero Section */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Connect with SEBI-Registered Experts. Learn. Consult. Grow.
              </h1>
              <p className="mt-4 text-pretty text-sm text-muted-foreground md:text-base">
                Attend verified sessions and gain personalized investment guidance from certified professionals.
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
                  src="/stock.jpeg"
                  alt="Stock market illustration"
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mx-auto mt-16 max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-8 shadow-md text-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex justify-center items-center mx-auto mb-6">
              <BookLock className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-medium mb-4">Book Introductory Session</h3>
            <p className="text-muted-foreground">
              Choose from our verified SEBI-registered experts and book an affordable introductory session to get started.
            </p>
          </div>
          
          <div className="rounded-2xl border bg-card p-8 shadow-md text-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex justify-center items-center mx-auto mb-6">
              <Tv className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-medium mb-4">Attend Live Session</h3>
            <p className="text-muted-foreground">
              Join the interactive live session to understand the expert&apos;s approach and validate if they&apos;re the right fit for you.
            </p>
          </div>
          
          <div className="rounded-2xl border bg-card p-8 shadow-md text-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex justify-center items-center mx-auto mb-6">
              <SquareDashedBottomCode className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-medium mb-4">Unlock 1:1 Consultation</h3>
            <p className="text-muted-foreground">
              After the introductory session, access premium one-on-one consultations for personalized, in-depth guidance.
            </p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of investors who are making informed decisions with guidance from SEBI-registered professionals.
          </p>
          <Link href="/experts">
            <Button size="lg" className="rounded-2xl">
              Find Your Expert Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}