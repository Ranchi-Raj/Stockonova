"use client";

import { Skeleton } from "@/components/ui/skeleton";
// import { NavBar } from "@/app/components/navbar";  
import { Footer } from "@/app/components/footer";

export default function HomePageSkeleton() {
  return (
    <main>
      {/* <NavBar /> */}

      {/* Hero Section Skeleton */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-md bg-secondary" />
              <Skeleton className="h-4 w-1/2 rounded-md bg-secondary" />
              <div className="flex gap-3 mt-6 ">
                <Skeleton className="h-10 w-36 rounded-2xl bg-secondary" />
                <Skeleton className="h-10 w-36 rounded-2xl bg-secondary" />
              </div>
            </div>

            <div className="flex justify-center">
              <Skeleton className="h-56 w-full max-w-md rounded-2xl md:h-72 bg-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* Expert Grid Skeleton */}
      <section className="mx-auto mt-10 max-w-7xl px-4">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-4 shadow-md space-y-3"
            >
              <Skeleton className="h-40 w-full rounded-xl bg-secondary" />
              <Skeleton className="h-5 w-2/3 bg-secondary"/>
              <Skeleton className="h-4 w-1/2 bg-secondary" />
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Skeleton */}
      {/* <section id="how-it-works" className="mx-auto mt-16 max-w-7xl px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-6 shadow-md space-y-3"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section> */}

      <Footer />
    </main>
  );
}
