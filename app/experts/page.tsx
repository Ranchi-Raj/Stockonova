"use client"

import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { ExpertGridClient } from "@/app/components/expert-grid-client"
import { useAuth } from "@/hooks/useAuth"
import { useUserStore } from "@/store/counterStore"
export default function ExpertsPage() {
  useAuth();
  const user = useUserStore((state) => state.user);
  console.log("Zustand User",user);
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
