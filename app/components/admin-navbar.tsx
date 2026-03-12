"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"
import Image from "next/image"
import React from "react"

export function AdminNavBar({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) {
  
  const handleLogout = async () =>{
    try{
      localStorage.setItem("adminAuth", JSON.stringify({
        status: false,
      })
      )
      toast.success("Logged out successfully");
      setIsAuthenticated(false);
    }
    catch(err){
      console.log("Logout error", err);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative rounded-xl h-14 w-14 p-0 m-0">
            <Image
              src="/logo_stocknova.png"
              alt="Logo"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <span className="text-pretty text-xl font-semibold tracking-tight">Stocknova</span>
        </Link>
        
      <Button onClick={handleLogout}>Logout</Button>
      </nav>

      {/* Mobile Menu */}
    </header>
  )
}