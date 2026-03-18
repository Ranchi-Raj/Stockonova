"use client";

import Image from "next/image";
import { NavBar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/app/components/booking-modal";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import DBService from "@/appwrite/db";
import HomePageSkeleton from "@/app/components/skeleton";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/counterStore";
import { useAuth } from "@/hooks/useAuth";
import { SessionInterface } from "@/interfaces/interface";
import axios from "axios";
import { useParams } from "next/navigation";
import Auth from "@/appwrite/auth";

interface Expert {
  $id: string;
  name: string;
  email: string;
  phone: string;
  expert: boolean;
  sebi: string;
  sebiId: string;
  specialization: string;
  experience: number;
  bio: string;
  photoUrl?: string;
  intros?: string[];
  expertiseAreas?: string[];
  oneOnOneSlots?: string[];
  intro: { $id: string; title: string; date: string; time: string };
  gmeet?: string | undefined;
  refreshToken?: string;
}
interface Sebi {
  $id: string;
  sebiId: string;
  verified: boolean;
  bio: string;
  earning: number;
  experience: number;
  specialization: string;
}

interface User {
  $id: string;
  name: string;
  email: string;
  phone: string;
  sebi: Sebi;
  expert: boolean;
  refreshToken?: string;
  image?: string;
}

const specializations = [
    { value: "A", label: "Equity Research" },
    { value: "B", label: "Portfolio Management" },
    { value: "C", label: "Derivatives Trading" },
    { value: "D", label: "Mutual Funds" },
    { value: "E", label: "Financial Planning" },
    { value: "F", label: "Risk Management" },
    { value: "G", label: "Compliance & Regulations" },
  ];

export default function ExpertProfile() {
  useAuth();
  const param = useParams() as { id: string };
  
  const params = param;
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SessionInterface[]>([]);
  // const [beingDisplayed,setBeingDisplayed] = useState<boolean>(false);
  console.log("User before being Displayed",user);
  const beingDisplayed = sessions.some((slot) => {
  const d = new Date(slot.date);
  const [hours, minutes] = slot.time.split(":").map(Number);
  d.setHours(hours, minutes, 0, 0);
  const isPastSlot = d < new Date();
  const userRegistered = slot.users.length === 0 || slot.users.includes(user!.$id);
  return slot.tag === "oneToOne" && userRegistered && !isPastSlot;
});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expert data
        console.log("Fetching data for expert with id:", params.id);

        const expertData = (await DBService.getUserbyId(params.id)) as User;
        console.log("Fetched expert data:", expertData);
        const sessions = (await DBService.getSessionsBySebiId(
          expertData.sebi.$id
        )) as SessionInterface[];
        const modifiedSessions = sessions.map((session) => ({
          ...session,
          registered: session.users.includes(user!.$id),
        }));
        console.log("Modified Sessions with registration status:", modifiedSessions);
        setSessions(modifiedSessions);
      
        const userAuth = await Auth.getUser();  
        const userData = await DBService.getUserByEmail(userAuth?.email || "") as {
          $id: string;
          intros: string[];
        };
        console.log("Authenticated user data:", userAuth);
        console.log("Fetched user data:", userData);
        if (userData.intros?.includes(params.id)) {
          setSubscribed(true);
        }
        console.log(expertData);
        const sebi = (await DBService.getSebiById(expertData.sebi.$id)) as {
          intro: string;
        };

        const introData = JSON.parse(sebi.intro);

        // console.log("Intro Data:", introData);
        const session = (await DBService.getSessionById(introData.$id)) as {
          gmeet: string | undefined;
        };

        console.log("Session Data:", session);
        setExpert(
          (prev) =>
            ({
              ...prev,
              gmeet: session.gmeet,
              refreshToken: expertData.refreshToken,
            } as Expert)
        );

        const intro = (await DBService.getSebiById(expertData.sebi.$id)) as {
          intro: string;
        };

        // Transform the data to match expected format
        const transformedExpert: Expert = {
          $id: expertData.$id,
          name: expertData.name,
          email: expertData.email,
          phone: expertData.phone,
          expert: expertData.expert,
          sebi: expertData.sebi.$id,
          sebiId: expertData.sebi.sebiId,
          specialization: expertData.sebi.specialization,
          experience: expertData.sebi.experience,
          bio: expertData.sebi.bio,
          intro: JSON.parse(intro.intro),
          gmeet: session.gmeet,
          refreshToken: expertData.refreshToken,
          photoUrl: expertData.image || "/pic.png",
          // intros: expertData.intros || [],
          // expertiseAreas: expertData.expertiseAreas || [expertData.specialization],
          // oneOnOneSlots: expertData.oneOnOneSlots || []
        };

        setExpert(transformedExpert);

          setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
    };
  }
    fetchData();
    return () => {
      console.log("Main user",user);
    }
  }, []);

  if (loading) {
    return (
      <main>
        <NavBar />
        <HomePageSkeleton />
        <Footer />
      </main>
    );
  }

  if (!expert) return ;

  // Mock upcoming intro session data (you can replace this with actual data from your DB)
  const upcomingIntroSession = {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    durationMins: 30,
    fee: 199,
  };

  // const introDate = new Date(upcomingIntroSession.date)
  const bookIntro = async () => {
    try {
      // Call your booking API or function here

      console.log("Booking intro session for user:", expert.refreshToken);

      await axios.post(
        `/api/add-to-meet?token=${encodeURIComponent(
          expert.refreshToken || ""
        )}`,
        {
          eventId: expert.gmeet,
          email: user?.email,
        }
      );
      
      await DBService.addIntroUserToSave(expert.sebi, user!.$id);
      await DBService.addUserToSession({
        sessionId: expert.intro.$id,
        userId: user!.$id,
      });
      await DBService.addIntroInUser({
        id: user!.$id,
        expertId: params.id,
        sebiId: expert.sebi,
        intros: user?.intros || [],
      });

      await DBService.addRegisteredSessionToUser(user!.$id, expert.intro.$id);
      // TODO : Send email to user with meeting link

      await axios.post("/api/send-email", {
        to: user!.email,
        subject: "Introductory Session Booked Successfully",
        text: `Dear ${
          user!.name
        },\n\nYou have successfully booked an introductory session on "${
          expert.intro.title
        }" scheduled for ${format(
          new Date(expert.intro.date),
          "EEE, MMM d"
        )} at ${
          expert.intro.time
        } Hours.\n\nThank you for choosing our platform!\n\nBest regards,\nStockonova Team`,
      });

      // On success:
      setSubscribed(true);
      toast.success("Intro session booked successfully!");
    } catch (error) {
      console.error("Error booking intro session:", error);
      toast.error("Failed to book intro session. Please try again.");
      return;
    }
  };

  const bookOneOnOne = async (
    sessionId: string,
    userId: string,
    time: string,
    date: string,
    title: string,
    gmeet: string | undefined
  ) => {
    try {
      // Call your booking API or function here
      const resp = await DBService.addUserToSession({
        sessionId,
        userId,
      });

      console.log("Booked 1:1 session response:", resp, "For user", user);
      setSessions((prev) => {
        return prev.map((session) => {
          if (session.$id === sessionId) {
            return {
              ...session,
              users: [...session.users, userId],
            };
          }
          return session;
        });
      });
      // Add the session to user's registered sessions

      await DBService.addRegisteredSessionToUser(user!.$id, sessionId);

      await axios.post(
        `/api/add-to-meet?token=${encodeURIComponent(
          expert?.refreshToken || ""
        )}`,
        {
          eventId: gmeet,
          email: user?.email,
        }
      );
      // TODO : Send email to user with meeting link
      await axios.post("/api/send-email", {
        to: user!.email,
        subject: "1:1 Session Booked Successfully",
        text: `Dear ${
          user!.name
        },\n\nYou have successfully booked a 1:1 personalized session scheduled on ${
          date.split("T")[0]
        } at ${time} Hours for the topic "${title}". We look forward to your participation. \n\nThank you for choosing our platform!\n\nBest regards,\nStockonova Team`,
      });

      toast.success("1:1 session booked successfully!");
    } catch (error) {
      console.error("Error booking 1:1 session:", error);
      toast.error("Failed to book 1:1 session. Please try again.");
      return;
    }
  };
  return (
    <main>
      <NavBar />
      {/* <Button onClick={bookIntro}>Book</Button> */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Image
            src={expert.photoUrl || "/pic.png"}
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
                    <li>
                      <span>Area of expertise : {specializations.find((s) => s.value === expert.specialization)?.label}</span>
                    </li>
                    <li>
                      <span>Experience : {expert.experience} years</span>
                    </li>
                  </div>
                }
              </ul>
            </div>
          </Card>

          {/* Introductory Session */}
          {!subscribed ? (
            <Card className="rounded-2xl p-6">
              <h2 className="text-lg font-semibold">
                {expert.intro.title
                  ? "Introductory Session on " + expert.intro.title
                  : "No Introductory Session has been Scheduled for the time being."}
              </h2>
              {expert.intro.title && (
                <div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(new Date(expert.intro.date), "EEE, MMM d")} •{" "}
                    {expert.intro.time} Hours
                    {/* • {upcomingIntroSession.durationMins}{" "} mins */}
                    <div className="mt-3 text-sm">
                      Fee:{" "}
                      <span className="font-medium">
                        ₹{upcomingIntroSession.fee}
                      </span>
                    </div>
                  </p>
                  <div className="mt-4">
                    <BookingModal
                      sebiId={expert.sebi}
                      name={user?.name}
                      amount={199}
                      title="Book Introductory Session"
                      bookIntro={bookIntro}
                      description={`Confirm your ₹199 intro session. You will receive an email with the meeting link.`}
                      trigger={
                        <Button className="w-full rounded-2xl">
                          Book Introductory Session
                        </Button>
                      }
                    />
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="rounded-2xl p-6 flex items-center justify-center">
              <h2 className="text-lg font-semibold text-center">
                You are subscribed to this expert&apos;s Introductory Session
              </h2>
            </Card>
          )}
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

                    // combine date + time
                    const [hours, minutes] = slot.time.split(":").map(Number);
                    d.setHours(hours, minutes, 0, 0);

                    const isPastSlot = d < new Date();

                    const userRegistered =
                      slot.users.length === 0 || slot.users.includes(user!.$id);

                    // skip rendering if not eligible
                    if (
                      slot.tag !== "oneToOne" ||
                      !userRegistered ||
                      isPastSlot
                    ) {
                      return null;
                    }

                    // setBeingDisplayed(true);

                    return (
                      <BookingModal
                        key={index}
                        sebiId={expert.sebi}
                        amount={slot.fee}
                        name={user?.name}
                        title="Book 1:1 Session"
                        description={`Confirm your 1:1 slot on ${format(
                          d,
                          "EEE, MMM d"
                        )} at ${slot.time}.`}
                        trigger={
                          <Button
                            variant="outline"
                            className="rounded-2xl w-full h-full p-5 flex flex-col items-start justify-between text-left border bg-card hover:bg-white hover:shadow-lg transition-all"
                            disabled={slot.users.includes(user!.$id)}
                          >
                            <div>
                              <div className="font-semibold text-lg text-primary mb-2">
                                {slot.title}
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <i className="bi bi-calendar text-muted-foreground"></i>
                                  <span className="text-muted-foreground">
                                    Date:
                                  </span>
                                  <span className="font-medium">
                                    {format(d, "MMM d, yyyy")}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <i className="bi bi-clock text-muted-foreground"></i>
                                  <span className="text-muted-foreground">
                                    Time:
                                  </span>
                                  <span className="font-medium">
                                    {slot.time}
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
                                  <span className="text-muted-foreground">
                                    Fee:
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    ₹{slot.fee}
                                  </span>
                                </div>

                                {slot.users.includes(user!.$id) && (
                                  <span className="text-sm font-medium text-green-600">
                                    ✅ Already booked
                                  </span>
                                )}
                              </div>
                            </div>
                          </Button>
                        }
                        onConfirmText="Book Slot"
                        bookIntro={() =>
                          bookOneOnOne(
                            slot.$id,
                            user!.$id,
                            slot.time,
                            slot.date,
                            slot.title,
                            slot?.gmeet
                          )
                        }
                      />
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground col-span-full text-center py-8 border rounded-xl bg-muted/20">
                    No available slots at the moment.
                  </p>
                )}

                {
                  !beingDisplayed && (
                    <p className="text-sm text-muted-foreground col-span-full text-center py-8 border rounded-xl bg-muted/20">
                      No available slots at the moment.
                    </p>
                  )
                }
              </div>
            )}
          </Card>

          {/* Reviews Card */}
          <Card className="rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                ⭐ Reviews coming soon. Attend an intro session to unlock 1:1s
                and share your experience.
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
  );
}
