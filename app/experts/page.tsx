import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { ExpertGridClient } from "@/app/components/expert-grid-client"

export default function ExpertsPage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Experts</h1>
      </section>
      <ExpertGridClient />
      <Footer />
    </main>
  )
}
