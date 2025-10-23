"use client"

import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/store/counterStore'
import { useRouter } from 'next/navigation'
import { NavBar } from '../components/navbar'
import { Footer } from '../components/footer'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Plus, Video, User, Shield, TrendingUp, IndianRupee} from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import DBService from '@/appwrite/db'
import { SessionInterface as Session } from '@/interfaces/interface'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ExpertPanel() {
  useAuth();

  const user = useUserStore((state) => state.user)
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [showNewSessionForm, setShowNewSessionForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [intro, setIntro] = useState<{
    $id : string,
    title : string,
    time : string,
    date : string
  }>({
    $id : '',
    title: 'Hello',
    time: '',
    date: ''
  })

  // New session form state
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    fee: 0,
    status: 'scheduled'

  })
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [registeredUsers, setRegisteredUsers] = useState<number>(-1)

  // Call useAuth hook for authentication
  // console.log("User in ExpertPanel:", user)
  
  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions()
    // Set up interval to check for expired sessions
    const interval = setInterval(checkExpiredSessions, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [user])
  
  const fetchSessions = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      console.log("User", user)
      console.log("Fetching sessions for SEBI ID:", user?.sebi)
      const sessions = await DBService.getSessionsBySebiId(user?.sebi || "")
      const passed = await DBService.getPastSessionsBySebiId(user?.sebi || "")
      console.log("Fetched sessions:", sessions)
      const mockSessions: Session[] = [
      ]
      const res = await DBService.getSebiById(user?.sebi || "") as {
        intro : string
      };

      setIntro(res.intro ? JSON.parse(res.intro) : {
        $id : '',
        title : 'None',
        date : '',
        time : '',
      });

      const sessId = JSON.parse(res.intro || '{"$id":""}').$id;

      console.log("Introductory session:", sessId);
      const s = await DBService.getSessionById(sessId) as {
        users : string[]
      };

      console.log("Session for intro:", s); 
      setRegisteredUsers(s.users ? s.users.length : 0);

      setSessions(Array.isArray(sessions) && sessions.length > 0 ? sessions : mockSessions)
      setPastSessions(Array.isArray(passed) ? passed.length > 0 ? passed : [] : [])
      
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }


  const checkExpiredSessions = async () => {
  const now = new Date()
  const expiredSessions = sessions.filter(session => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`)
    return sessionDateTime < now && session.status === 'scheduled'
  })

  if (expiredSessions.length > 0) {
    await removeExpiredSessions(expiredSessions)
  }
}

  const removeExpiredSessions = async (expiredSessions: Session[]) => {
    try {
      
      // Update state after all deletions are complete
      setSessions(prev => prev.filter(session => 
        !expiredSessions.some(expired => expired.$id === session.$id)
      ))
      
      toast.success(`${expiredSessions.length} expired sessions removed`)
    } catch (error) {
      console.error('Error removing expired sessions:', error)
      toast.error('Failed to remove expired sessions')
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {

    e.preventDefault()
    try {
      console.log("Creating session with data:", newSession, "for user:", user)
      setLoading(true)
      // Replace with actual API call
      const sessionScheduled = await DBService.scheduleSession({
        title : newSession.title,
        date : newSession.date,
        time : newSession.time,
        duration : newSession.duration,
        fee : newSession.fee,
        expertId : user?.$id || "",
        sebiID : user?.sebi || ""
      })

      console.log("Session scheduled:", sessionScheduled)
      const session: Session = {
        $id: Date.now().toString(),
        ...newSession,
        // studentName: 'New Student', // This would come from the student email lookup
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        users : []
      }
      
      setSessions(prev => [session, ...prev])
      setNewSession({
        title: '',
        date: '',
        time: '',
        duration: 60,
        fee: 0,
        status: 'scheduled'
      })
      setShowNewSessionForm(false)
      toast.success('Session scheduled successfully!')
    } catch (error) {
      console.error('Error creating session:', error)
      toast.error('Failed to schedule session')
    } finally {
      setLoading(false)
    }
  }

  // const cancelSession = async (sessionId: string) => {
  //   try {
  //     // Replace with actual API call
  //     await DBService.deleteSession(sessionId,user?.sebi || "")
  //     setSessions(prev => prev.filter(session => session.$id !== sessionId))
  //     toast.success('Session cancelled successfully')
  //   } catch (error) {
  //     console.error('Error cancelling session:', error)
  //     toast.error('Failed to cancel session')
  //   }
  // }

  const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // If user is not an expert, redirect to home
  if (!user?.expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You must be an expert to access this panel.</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  const scheduledSession = sessions.filter(s => s.status === 'scheduled')
  const scheduledSessions = scheduledSession.filter(s => s.tag !== 'introductory')
//   const completedSessions = sessions.filter(s => s.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4 md:gap-0">
            {/* Expert Info - Left Side */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      SEBI Certified
                    </span>
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Earnings Card - Right Side */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg min-w-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold">Total Earnings</h3>
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-md font-bold mb-2">{formatCurrency(user.earning)}</div>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Session Management</h2>
            <p className="text-gray-600 mt-1">Manage your scheduled sessions and earnings</p>
          </div>
          <Dialog open={showNewSessionForm} onOpenChange={setShowNewSessionForm}>
            <DialogTrigger asChild>
              <Button className=" text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="h-5 w-5" />
                Schedule New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {/* <Calendar className="h-5 w-5 text-blue-600" /> */}
                  Schedule New Session
                </DialogTitle>
                <DialogDescription>
                  Create a new session by filling in the details below.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., React Fundamentals Tutorial"
                    value={newSession.title}
                    onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSession.time}
                      onChange={(e) => setNewSession(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="30"
                      step="30"
                      value={newSession.duration}
                      onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fee" className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      Fee (₹)
                    </Label>
                    <Input
                      id="fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSession.fee}
                      onChange={(e) => setNewSession(prev => ({ ...prev, fee: parseFloat(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowNewSessionForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1  text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Session'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div className='bg-primary p-4 rounded-md'>
            <div className='my-2'>
            <p className='text-white/80 mb-2 text-sm'>Introductory Session</p>
            <h3 className='text-white font-bold text-center'>{intro.title || "None"}</h3>
            <p className='text-white/80 text-sm'>{intro.date || ""} {intro.date ? "at" : ""} {intro.time || ""}</p>
            </div>
            <div className='flex gap-2 justify-center'>
              <Button className='bg-red-500 hover:bg-red-600' onClick={async () => {
                await DBService.endIntroSession(user.sebi);
                await DBService.markSessionAsComplete(intro.$id,user.sebi);
                setRegisteredUsers(0);


                toast.success("Introductory session ended");
                setIntro({
                  $id : '',
                  title : 'None',
                  date : '',
                  time : '',
                })
              }}>
                End
              </Button>
              <IntroductorySessionDialog
                sebi={user.sebi}
                sebiId={user.sebi}
                setIntro={setIntro}
              />
            </div>
            <div className='text-white/80 text-sm mt-2 text-center'>Registrations : {registeredUsers} </div>
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Sessions ({scheduledSessions.length})</h3>
          </div>
          
          {scheduledSessions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h4>
                <p className="text-gray-600">Schedule your first session to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {scheduledSessions.map((session) => (
                <Card key={session.$id}>
                  <CardContent className="px-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{session.title}</h4>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Scheduled
                          </Badge>
                          <Badge>
                            {session.tag}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(session.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration} mins)
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4" />
                            {formatCurrency(session.fee)}
                          </div>
                          <RegistrationDialog 
                              session={session} 
                              trigger={
                                <Button className='mx-auto'>
                                  {session.users?.length || 0} Registrations - View
                                </Button>
                              }
                            />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                      <Button className='mx-auto' onClick={async () => {
                        await DBService.markSessionAsComplete(session.$id,user.sebi);
                        setSessions((prev) => prev.filter((s) => s.$id !== session.$id));
                        setPastSessions((prev) => [session, ...prev]);
                        toast.success("Session marked as complete");
                      }}>
                        Mark Complete
                      </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

      {/* Past Sessions */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Past Sessions ({pastSessions.length})</h3>
        </div>
        
        {pastSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No past sessions</h4>
              <p className="text-gray-600">Completed sessions will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time & Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pastSessions.map((session) => {
                  const participantCount = session.users?.length || 0;
                  const earnings = session.fee * participantCount;
                  
                  return (
                    <tr key={session.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><Badge>{session.tag}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(session.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {session.time} ({session.duration} mins)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatCurrency(session.fee)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{participantCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(earnings)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RegistrationDialog 
                          session={session} 
                          trigger={
                            <Button size="sm">
                              View Registrations
                            </Button>
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  )
}
interface RegistrationDialogProps {
  session: Session
  trigger: React.ReactNode
}

function RegistrationDialog({ session, trigger }: RegistrationDialogProps) {
  interface UserInterface {
    $id: string;
    name: string;
    email: string;
  }

  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchUsers = async () => {
    if (!session.users || session.users.length === 0) {
      setUsers([])
      return
    }

    setLoading(true)
    try {
      const userPromises = session.users.map(async (userId) => {
        const userData = await DBService.getUserbyId(userId) as UserInterface
        return userData
      })
      
      const usersData = await Promise.all(userPromises)
      setUsers(usersData.filter(user => user !== null))
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen)
    
    if (isOpen) {
      // Fetch users only when dialog opens
      await fetchUsers()
    } else {
      // Optional: Clear users when dialog closes to refresh on next open
      // setUsers([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registered Users</DialogTitle>
          <DialogDescription>
            {users.length || 0} users have registered for this session
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-80 w-full rounded-md border p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-20 space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user, index) => (
                <div 
                  key={user.$id} 
                  className="flex gap-3 items-center p-3 rounded-lg border bg-card hover:shadow-lg transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 flex justify-center items-center flex-col">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="bi bi-people text-xl text-muted-foreground"></i>
              </div>
              <p className="text-muted-foreground">No registrations yet</p>
              {/* <p className="text-sm text-muted-foreground mt-1">
                Be the first to register for this session!
              </p> */}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function IntroductorySessionDialog({ sebi, sebiId , setIntro}: {sebi : string, sebiId?: string , setIntro: React.Dispatch<React.SetStateAction<{$id : string, title : string, time : string, date : string}>>}) {
  console.log("Sebi ID in IntroductorySessionDialog:", sebiId);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);

  const addIntroductorySession = async () => {
    try {
      // Validate inputs
      if (!title || !date || !time) {
        toast.error("Please fill in all fields");
        return;
      }
      if (!sebiId) {
        toast.error("SEBI ID is missing");
        return;
      }
      // Call the DBService to create the introductory session
      const data = await DBService.scheduleSession({
        title,
        date,
        time,
        // duration: 0, 
        fee: 199,
        expertId: sebi,
        sebiID: sebiId,
        tag : "introductory"
      }) as { $id: string };

      console.log("Introductory session created with ID:", data);
      await DBService.addIntroSession(sebiId, JSON.stringify({$id : data.$id, title, date, time }));

      toast.success("Introductory session created successfully");
      setIntro({ $id : data.$id, title, date, time });
      // Clear the form
      setTitle('');
      setDate('');
      setTime('');
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error creating introductory session:", error);
      toast.error("Failed to create introductory session");
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-500 hover:bg-green-600'>
                New
              </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            {/* <Calendar className="h-5 w-5 text-blue-600" /> */}
            Introductory Session
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-4">
          <div className='flex items-center justify-between gap-4'>
            <Label className="w-1/4 text-sm font-medium text-right">Title :</Label>
            <Input placeholder="Title" type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className='flex items-center justify-between gap-4'>
            <Label className="w-1/4 text-sm font-medium  text-right">Date :</Label>
            <Input placeholder="Date" type='date' value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className='flex items-center justify-between gap-4'>
            <Label className="w-1/4 text-sm font-medium text-right">Time :</Label> 
            <Input placeholder="Time" type='time' value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          </DialogDescription>

        <Button className='mx-auto' onClick={addIntroductorySession}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  )
}