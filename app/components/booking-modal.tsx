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
import { toast } from "react-hot-toast"
export function BookingModal({
  trigger,
  title,
  description,
  onConfirmText = "Confirm Booking",
}: {
  trigger: React.ReactNode
  title: string
  description: string
  onConfirmText?: string
}) {
  const [open, setOpen] = useState(false)
  
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
          <Button
            className="rounded-2xl"
            onClick={() => {
              toast.success("Booking Confirmed! Check your email for details.")
              setOpen(false)
            }}
          >
            {onConfirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
