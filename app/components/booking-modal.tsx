"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { useToast } from "@/hooks/use-toast"
import Razorpay from "./razorpay"
import DBService from "@/appwrite/db"

export function BookingModal({
  sebiId,
  trigger,
  title,
  description,
  onConfirmText = "Confirm Booking",
  bookIntro,
  name,
  phone,
  amount 
}: {
  sebiId : string,
  trigger: React.ReactNode
  title: string
  description: string
  onConfirmText?: string
  bookIntro : () => Promise<void>,
  name? : string,
  phone? : string,
  amount? : number
}) {
  const [open, setOpen] = useState(false)
  
  const handleBooking = async () => {
    await bookIntro()
    // toast.success("Booking Confirmed! Check your email for details.")
    setOpen(false)
    console.log("Booking confirmed")
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {/* <Button
            className="rounded-2xl"
            onClick={handleBooking}
          >
            {onConfirmText}
          </Button> */}
          <Razorpay amount={amount} name={name} phone={phone} buttonText={onConfirmText} handleOrder={async () => {
            await handleBooking()
            if(amount && amount > 0 && sebiId){
              await DBService.updateEarnings(sebiId, amount)
            }
          }} />

        </div>
      </DialogContent>
    </Dialog>
  )
}