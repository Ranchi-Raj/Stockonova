import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Mail, Phone, IdCard, DollarSign, Briefcase, Calendar } from 'lucide-react'
import DBService from '@/appwrite/db'

interface User {
  $id: string
  name: string
  email: string
  intros?: string[]
  expert: boolean
  sebi: {
    $id: string
    earnings: string
    sebiId: string
    specialization: string
    experience: string
    bio: string
  }
  phone?: string
}

export default function CheckUserModal() {
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [id, setId] = React.useState<string>('')
  const [loading, setLoading] = React.useState(false)

  const handleUser = async () => {
    if (!id.trim()) return
    
    setLoading(true)
    try {
      const data = await DBService.getUserbyId(id) as User
      console.log(data)
      setUser({
        $id: data.$id,
        name: data.name,
        email: data.email,
        expert: data.expert,
        intros: data.intros,
        sebi: data.sebi,
        phone: data.phone
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setId('')
    setUser(null)
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <User className="h-4 w-4" />
        Check User
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Check User Details
            </DialogTitle>
            <DialogDescription>
              Enter user ID to view their complete profile information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* User ID Input */}
            <div className="space-y-2">
              <Label htmlFor="user-id">User ID</Label>
              <div className="flex gap-2">
                <Input
                  id="user-id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="text"
                  placeholder="Enter User ID"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleUser()}
                />
                <Button 
                  onClick={handleUser} 
                  disabled={!id.trim() || loading}
                  className="gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
            </div>

            {/* User Details */}
            {user && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      User Profile
                    </span>
                    <Badge variant={user.expert ? "default" : "secondary"}>
                      {user.expert ? 'Expert' : 'User'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        Name
                      </p>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        Email
                      </p>
                      <p className="font-semibold text-sm break-all">{user.email}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        Phone
                      </p>
                      <p className="font-semibold">{user.phone || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        Sessions
                      </p>
                      <p className="font-semibold">{user.intros ? user.intros.length : 0} sessions</p>
                    </div>
                  </div>

                  {/* SEBI Information */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <IdCard className="h-4 w-4" />
                      SEBI Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground text-sm">SEBI ID</p>
                        <p className="font-semibold text-sm">{user.sebi.sebiId}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          Earnings
                        </p>
                        <p className="font-semibold">₹{user.sebi.earnings}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground flex items-center gap-1 text-sm">
                          <Briefcase className="h-3 w-3" />
                          Specialization
                        </p>
                        <p className="font-semibold text-sm">{user.sebi.specialization}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground text-sm">Experience</p>
                        <p className="font-semibold">{user.sebi.experience} years</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {user.sebi.bio && (
                      <div className="mt-3 space-y-1">
                        <p className="font-medium text-muted-foreground text-sm">Bio</p>
                        <p className="text-sm bg-muted/50 p-2 rounded-md">{user.sebi.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                    >
                      Check Another User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No User State */}
            {!user && id && !loading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No user found with this ID</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}