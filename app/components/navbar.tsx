"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSignInStore } from "@/store/counterStore"
import { useState } from "react"
import Auth from "@/appwrite/auth"
import { useUserStore } from "@/store/counterStore"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experts", label: "Experts" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
]

const signInLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/experts", label: "Experts" },
]

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isSignedIn = useSignInStore((state) => state.isSignedIn)
  const pathname = usePathname()
  const router = useRouter();
  const currentLinks = isSignedIn ? signInLinks : links
  const clearUser = useUserStore((state) => state.clearUser);
  const signOut = useSignInStore((state) => state.signOut);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () =>{
    try{
      await Auth.logout();
      useSignInStore.getState().signOut();
      clearUser();
      signOut();
      toast.success("Logged out successfully");
      router.replace("/");
    }
    catch(err){
      console.log("Logout error", err);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary"></div>
          <span className="text-pretty text-xl font-semibold tracking-tight">Stocknova</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {currentLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                pathname === l.href && "text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          {
            isSignedIn &&
            <Button size="sm" onClick={handleLogout}>
            Log Out
          </Button>
          }
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex flex-col items-center justify-center space-y-1 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "block h-0.5 w-6 bg-foreground transition-transform",
              isMenuOpen && "translate-y-1.5 rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-foreground transition-opacity",
              isMenuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-6 bg-foreground transition-transform",
              isMenuOpen && "-translate-y-1.5 -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute left-0 right-0 top-full border-b bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col space-y-4">
            {currentLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors",
                  pathname === l.href && "text-foreground font-semibold"
                )}
                onClick={closeMenu}
              >
                {l.label}
              </Link>
            ))}
            {
              isSignedIn &&
              <Button size="sm" className="w-full mt-2" onClick={handleLogout}>
              Log Out
            </Button>
            }
          </div>
        </div>
      </div>
    </header>
  )
}