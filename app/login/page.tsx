import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-8 rounded-2xl border bg-card p-6 shadow-md md:grid-cols-2">
          <div className="hidden md:block">
            <div className="rounded-2xl border bg-secondary p-6">
              <Image
                src="/stocknova-illustration.jpg"
                alt="Stocknova"
                width={480}
                height={320}
                className="h-auto w-full rounded-xl"
              />
              <h2 className="mt-4 text-lg font-semibold">Stocknova</h2>
              <p className="text-sm text-muted-foreground">Trusted, verified SEBI experts.</p>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Login</h1>
            <form className="mt-6 space-y-4">
              <Input className="rounded-2xl" placeholder="Email" type="email" />
              <Input className="rounded-2xl" placeholder="Password" type="password" />
              <Input className="rounded-2xl" placeholder="OTP (optional)" type="text" />
              <Button className="w-full rounded-2xl">Login</Button>
            </form>
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Forgot Password?
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/signup">
                Become an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
