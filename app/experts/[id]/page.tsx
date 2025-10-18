"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/app/components/booking-modal"
import { format } from "date-fns"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import DBService from "@/appwrite/db"
import HomePageSkeleton from "@/app/components/skeleton"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/store/counterStore"
import { useAuth } from "@/hooks/useAuth"
import { SessionInterface } from "@/interfaces/interface"

interface Expert {
  $id: string
  name: string
  email: string
  phone: string
  expert: boolean
  sebiId: string
  specialization: string
  experience: number
  bio: string
  photoUrl?: string
  intros?: string[]
  expertiseAreas?: string[]
  oneOnOneSlots?: string[]
}
interface Sebi{
  $id: string
  sebiId: string
  verified: boolean
  bio : string
  earning : number
  experience : number
  specialization : string
}

interface User{
  $id: string
  name: string
  email: string
  phone: string
  sebi : Sebi
  expert: boolean
}

export default function ExpertProfile({ params }: { params: { id: string } }) {
  // const params = use(param)
  const router = useRouter()
  const [expert, setExpert] = useState<Expert | null>(null)
  const [loading, setLoading] = useState(true)
  const user = useUserStore((state) => state.user)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [sessions, setSessions] = useState<SessionInterface[]>([])
  useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expert data
        const expertData = await DBService.getUserbyId(params.id) as User
        const sessions = await DBService.getSessionsBySebiId(expertData.sebi.$id) as SessionInterface[]
        const modifiedSessions = sessions.map((session) => ({
          ...session,
          registered: session.users.includes(user!.$id)
        }))
        setSessions(modifiedSessions)
        if(user?.intros?.includes(params.id)){
          setSubscribed(true)
        }
        console.log(expertData)
        console.log(params.id)
        if (!expertData || !expertData.expert) {
          notFound()
        }

        // Transform the data to match expected format
        const transformedExpert: Expert = {
          $id: expertData.$id,
          name: expertData.name,
          email: expertData.email,
          phone: expertData.phone,
          expert: expertData.expert,
          sebiId: expertData.sebi.sebiId,
          specialization: expertData.sebi.specialization,
          experience: expertData.sebi.experience,
          bio: expertData.sebi.bio,
          // photoUrl: expertData.sebi.photoUrl,
          // intros: expertData.intros || [],
          // expertiseAreas: expertData.expertiseAreas || [expertData.specialization],
          // oneOnOneSlots: expertData.oneOnOneSlots || []
        }

        setExpert(transformedExpert)
      } catch (error) {
        console.error("Error fetching data:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [params.id, router,user])

  if (loading) {
    return (
      <main>
        <NavBar />
        <HomePageSkeleton/>
        <Footer />
      </main>
    )
  }

  if (!expert) return notFound()

  // Mock upcoming intro session data (you can replace this with actual data from your DB)
  const upcomingIntroSession = {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    durationMins: 30,
    fee: 199
  }

  const introDate = new Date(upcomingIntroSession.date)
  const bookIntro = async () => {
    try {
      // Call your booking API or function here
      await DBService.addIntroInUser({
        id : user!.$id,
        expertId : expert.$id,
        // sebiId : expert.sebi.$id,
        intros : user?.intros || []
      })

      // TODO : Send email to user with meeting link

      // On success:
      setSubscribed(true)
      toast.success("Intro session booked successfully!")
    }
    catch( error) {
      console.error("Error booking intro session:", error)
      toast.error("Failed to book intro session. Please try again.")
      return
    }
  }

  const bookOneOnOne = async (sessionId: string, userId: string) => {
    try {
      // Call your booking API or function here
      const resp = await DBService.addUserToSession({
        sessionId,
        userId
      })

      console.log("Booked 1:1 session response:", resp, "For user",user)
      setSessions((prev) => {
        return prev.map((session) => {
          if (session.$id === sessionId) {
            return {
              ...session,
              registered: true
            }
          }
          return session
        })
      })
      // TODO : Send email to user with meeting link
      toast.success("1:1 session booked successfully!")
    }
    catch( error) {
      console.error("Error booking 1:1 session:", error)
      toast.error("Failed to book 1:1 session. Please try again.")
      return
    } 
  }
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Image
            src={expert.photoUrl || "/placeholder.svg?height=96&width=96&query=expert%20photo"}
            alt={`Photo of ${expert.name}`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{expert.name}</h1>
            <p className="text-sm text-muted-foreground">
              SEBI Reg. ID: {expert.sebiId}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Overview */}
          <Card className="rounded-2xl p-6 md:col-span-2">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-muted-foreground">{expert.bio}</p>
            <div className="mt-4">
              <h3 className="text-sm font-medium">Expertise Areas</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {
                  <div>
                  <li><span>Area of expertise : {expert.specialization}</span></li>
                  <li><span>Experience : {expert.experience} years</span></li>
                  </div>
                }
              </ul>
            </div>
          </Card>

          {/* Introductory Session */}
          {
            !subscribed ? 
         
          <Card className="rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Introductory Session</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {format(introDate, "EEE, MMM d")} • {format(introDate, "p")} • {upcomingIntroSession.durationMins}{" "}
              mins
            </p>
            <div className="mt-3 text-sm">
              Fee: <span className="font-medium">₹{upcomingIntroSession.fee}</span>
            </div>
            <div className="mt-4">
              <BookingModal
                name={user?.name}
                amount={199}
                title="Book Introductory Session"
                bookIntro={bookIntro}
                description="Confirm your ₹199 intro session. You will receive an email with the meeting link."
                trigger={<Button className="w-full rounded-2xl">Book Introductory Session</Button>}
              />
            </div>
          </Card>
          : 
          <Card className="rounded-2xl p-6 flex items-center justify-center">
            <h2 className="text-lg font-semibold text-center">You are subscribed to this expert&apos;s Introductory Session</h2>
          </Card>
           }
        </div>

        {/* 1:1 Personalized Session (mock unlock flow) */}
        <div className="mt-6 grid gap-8 md:grid-cols-3">
        {/* 1:1 Personalized Session Card */}
        <Card className="rounded-2xl p-6 md:col-span-2 shadow-sm border border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              1:1 Personalized Session
            </h2>
          </div>

    {/* Locked UI hint */}
    {!subscribed && (
      <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
        🔒 Unlock after attending Intro Session.
      </div>
    )}

    {/* Session List */}
    {subscribed && (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions && sessions.length > 0 ? (
          sessions.map((slot, index) => {
            const d = new Date(slot.date);
            return (
              <BookingModal
                amount={slot.fee}
                name={user?.name}
                // phone={user?.phone}
                key={index}
                title="Book 1:1 Session"
                description={`Confirm your 1:1 slot on ${format(d, "EEE, MMM d")} at ${format(
                  d,
                  "p"
                )}.`}
                trigger={
                  <Button
                    variant="outline"
                    className="rounded-2xl w-full h-full p-5 flex flex-col items-start justify-between text-left border bg-card hover:bg-white hover:shadow-lg transition-all"
                    disabled={slot.registered}
                  >
                    <div>
                      <div className="font-semibold text-lg text-primary mb-2">
                        {slot.title}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <i className="bi bi-calendar text-muted-foreground"></i>
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">
                            {format(d, "MMM d, yyyy")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <i className="bi bi-clock text-muted-foreground"></i>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">
                            {format(d, "h:mm a")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <i className="bi bi-clock-history text-muted-foreground"></i>
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <span className="font-medium">
                            {slot.duration} min
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <i className="bi bi-currency-rupee text-muted-foreground"></i>
                          <span className="text-muted-foreground">Fee:</span>
                          <span className="font-semibold text-foreground">
                            ₹{slot.fee}
                          </span>
                        </div>
                        <div>
                          {
                            slot.registered &&
                            <span className="text-sm font-medium text-green-600">✅ Already booked</span>
                            
                          }
                        </div>
                      </div>
                    </div>
                  </Button>
                }
                onConfirmText="Book Slot"
                bookIntro={() => bookOneOnOne(slot.$id,user!.$id)}
              />
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground col-span-full text-center py-8 border rounded-xl bg-muted/20">
            No available slots at the moment.
          </p>
        )}
      </div>
    )}
  </Card>

  {/* Reviews Card */}
  <Card className="rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        ⭐ Reviews coming soon. Attend an intro session to unlock 1:1s and share your experience.
      </p>
    </div>
    <div className="mt-6 flex justify-center text-muted-foreground text-5xl opacity-30">
      <i className="bi bi-chat-left-quote"></i>
    </div>
  </Card>
        </div>

      </section>
      <Footer />
    </main>
  )
}