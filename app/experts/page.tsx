"use client"

import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { ExpertGridClient } from "@/app/components/expert-grid-client"
import { useAuth } from "@/hooks/useAuth"
import { useUserStore } from "@/store/counterStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import DBService from "@/appwrite/db"
import { SessionInterface } from "@/interfaces/interface"
export default function ExpertsPage() {
  const [open, setOpen] = useState(false);
  useAuth();
  const user = useUserStore((state) => state.user);
  console.log("Zustand User",user);
  const [sessions, setSessions] = useState<SessionInterface[]>([]);

  const fetchSessions = async () => {
      const toKeep: string[] = [];
      if(user && user.$id){
        console.log("Fetching sessions for user:", user.$id);
        // Fetch booked sessions for the expert
        const sessions = await DBService.getUserRegisteredSessions(user.$id) as string[];
        const sessionsData = await Promise.all(sessions.map(async(session)  => {
          const sessionDetails = await DBService.getSessionById(session) as SessionInterface;
            if(sessionDetails.date && new Date(sessionDetails.date) >= new Date()){
              toKeep.push(session);
              return sessionDetails;
            }
            else
            {
              return null;
            }
        }));
        console.log("Sessions to keep:", toKeep);
        console.log("Sessions to remove:",sessions.filter(session => !toKeep.includes(session)));
        await DBService.updateUserUpcomingSessions(user.$id, toKeep);
        setSessions(sessionsData.filter(session => session !== null) as SessionInterface[]);
        console.log("Fetched sessions:", sessionsData );
        setLoading(false);
      }
    };

  const dialogHandler = (isOpen: boolean) => {
    setOpen(isOpen);
    if(isOpen)
    fetchSessions();
  }

  const [loading, setLoading] = useState(false);
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Experts</h1>

    {
      user && !user.expert &&
        <Dialog open={open} onOpenChange={dialogHandler}>
          <DialogTrigger asChild>
            <Button>Upcoming Booked Sessions</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upcoming Booked Sessions</DialogTitle>
            </DialogHeader>
            <DialogDescription>

            {
              loading ? (
                <p>Loading...</p>
              ) : (
              sessions.map((sessionId) => (
                <div key={sessionId.$id} className="p-4 border-b bg-secondary rounded-xl">
                  {/* <p>Session ID: {sessionId.$id}</p> */}
                  <p><span className="font-semibold">Title</span> : {sessionId.title}</p>
                  <p><span className="font-semibold">Date</span> : {sessionId.date.slice(0, 10).split('-').reverse().join('-')}</p>
                  <p><span className="font-semibold">Time</span>  : {sessionId.time}</p>
                </div>
              )))
            }
            </DialogDescription>
          </DialogContent>
        </Dialog>
    }
        </div>
      </section>
      <ExpertGridClient />
      <Footer />
    </main>
  )
}
