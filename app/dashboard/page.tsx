"use client"

import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import { ExpertGridClient } from "@/app/components/expert-grid-client"
import Image from "next/image"
import Auth from "@/appwrite/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUserStore } from "@/store/counterStore"
import SkeletonPage from "@/app/components/skeleton"
import { useSignInStore } from "@/store/counterStore"
import DBService from "@/appwrite/db"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"
import { Tv, SquareDashedBottomCode, BookLock } from "lucide-react"

// Expert Registration Dialog Component
function ExpertRegistrationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    sebiId: "",
    bio: "",
    experience: "",
    phone: "",
    specialization: "",
  })

  const specializations = [
    { value: "A", label: "Equity Research" },
    { value: "B", label: "Portfolio Management" },
    { value: "C", label: "Derivatives Trading" },
    { value: "D", label: "Mutual Funds" },
    { value: "E", label: "Financial Planning" },
    { value: "F", label: "Risk Management" },
    { value: "G", label: "Compliance & Regulations" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Handle form submission here
    console.log("Expert registration data:", formData)
    const account = await DBService.getUserByEmail(useUserStore.getState().user?.email || "");
    if(!account){
      toast.error("User not found. Please try again.");
      return;
    }
    const data = await DBService.addRequest({
      name: useUserStore.getState().user?.name || "",
      email: useUserStore.getState().user?.email || "",
      sebiId: formData.sebiId,
      experience: parseInt(formData.experience, 10),
      specialization: formData.specialization,
      bio: formData.bio,
      userId : (account as { $id?: string }).$id || "" ,
      phone : formData.phone
    })

    console.log("Request submitted:", data)
    toast.success("Request submitted successfully")
    onOpenChange(false)
    // Reset form
    setFormData({
      sebiId: "",
      bio: "",
      experience: "",
      specialization: "",
      phone: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Become a SEBI Registered Expert</DialogTitle>
          <DialogDescription>
            Fill in your details to register as a SEBI expert. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SEBI ID */}
          <div className="space-y-2">
            <Label htmlFor="sebiId">SEBI Registration ID</Label>
            <Input
              id="sebiId"
              placeholder="Enter your SEBI registration ID"
              value={formData.sebiId}
              onChange={(e) => handleInputChange("sebiId", e.target.value)}
              required
            />
          </div>
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              placeholder="Enter years of experience"
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              min="1"
              required
            />
          </div>

          {/* Specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select
              value={formData.specialization}
              onValueChange={(value) => handleInputChange("specialization", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label} ({spec.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your professional background, expertise, and approach..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Register as Expert
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Main HomePage Component
export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true)
  const setSignIn = useSignInStore((state) => state.signIn);
  const setSignOut = useSignInStore((state) => state.signOut);
  const [expert, setExpert] = useState<boolean>(false);
  const [showExpertDialog, setShowExpertDialog] = useState<boolean>(false);

  // Call useAuth hook at the top level of the component
  useAuth();

  const redirectToExpertPanel = () => {
    router.push("/expertPanel")
  }

  useEffect(() => {

    const opens = async () => {
      try {
        const user = await Auth.getUser();

        if (!user) {
          setSignOut();
          router.replace("/");
          return;
        }

        setSignIn();

        // Check if user is expert
        const account = await DBService.getUserByEmail(user.email);

        // Ensure account is typed correctly
        if (account && (account as { expert?: boolean }).expert) {
          setExpert(true);
          return;
        }

        if (await DBService.doesUserExists(user.email)) {
          console.log("User already exists");
        } else {
          try {
            await DBService.addUser({
              email: user?.email || "No Email",
              name: user?.name || "No Name",
              phone: user?.phone || "No Phone",
            });
            console.log("User created in DB");
          } catch (err) {
            console.log("Error creating user in DB", err);
          }
        }

        setSignIn();
      } catch (err) {
        console.log("Not logged in", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    opens();
  }, [])

  if (loading) {
    return <SkeletonPage />
  }

  return (
    <main>
      <NavBar />
      
      {/* Expert Registration Dialog */}
      <ExpertRegistrationDialog 
        open={showExpertDialog}
        onOpenChange={setShowExpertDialog}
      />

      {/* Hero */}
      <div className="flex justify-end mt-4 mr-4">
        {expert ? (
          <Button onClick={redirectToExpertPanel}>
            Go to Expert Dashboard
          </Button>
        ) : (
          <Button 
            className="rounded-2xl"
            onClick={() => setShowExpertDialog(true)}
          >
            Become an SEBI Expert
          </Button>
        )}
      </div>

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
                  src="/stock.jpeg"
                  alt="Fintech illustration"
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Listing Grid + Filters */}
      {/* <ExpertGridClient /> */}

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto mt-16 max-w-7xl px-4">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex justify-center items-center"><BookLock className="h-6 w-6"/></div>
            <h3 className="mt-3 font-medium">Book Introductory Session</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a verified expert and reserve an affordable intro session.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex justify-center items-center"><Tv className="h-6 w-6"/></div>
            <h3 className="mt-3 font-medium">Attend Live Session</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Join the live session to validate fit and learn the approach.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex justify-center items-center"><SquareDashedBottomCode className="h-7 w-7"/></div>
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