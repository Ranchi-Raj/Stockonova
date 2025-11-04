"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User, Settings } from 'lucide-react'
import DBService from '@/appwrite/db'
import toast from 'react-hot-toast'

interface Expert {
  $id: string
  name: string
  email: string
  max: number
  min: number
  sebi: string
}

export default function SetThreshold() {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string>('')
  const [expert, setExpert] = useState<Expert | null>(null)
  const [maxThreshold, setMaxThreshold] = useState<number>(0)
  const [minThreshold, setMinThreshold] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleCheck = async () => {
    if (!id.trim()) return
    
    setLoading(true)
    try {
      const res = await DBService.getUserbyId(id) as {
        $id: string
        name: string
        email: string
        sebi: {
          $id: string
          max: number
          min: number
        }
      }
      
      const expertData = {
        $id: res.$id,
        name: res.name,
        email: res.email,
        max: res.sebi.max,
        min: res.sebi.min,
        sebi: res.sebi.$id
      }
      
      setExpert(expertData)
      setMaxThreshold(expertData.max)
      setMinThreshold(expertData.min)
    } catch (err) {
      console.error('Error fetching expert:', err)
      setExpert(null)
    } finally {
      setLoading(false)
    }
  }

  const setThreshold = async () => {
    if (!expert) return
    
    setUpdating(true)
    try {
      await DBService.updateThreshold(expert.sebi, minThreshold, maxThreshold)
      // Update local state to reflect changes
      setExpert({
        ...expert,
        max: maxThreshold,
        min: minThreshold
      })
      toast.success('Threshold updated successfully!')
      setOpen(false)
    } catch (err) {
      console.error('Error updating threshold:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleReset = () => {
    setId('')
    setExpert(null)
    setMaxThreshold(0)
    setMinThreshold(0)
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Settings className="h-4 w-4" />
        Set Threshold
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {/* <Settings className="h-5 w-5" /> */}
              Set Expert Threshold
            </DialogTitle>
            <DialogDescription>
              Enter expert ID to view and update their session thresholds
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Expert ID Input */}
            <div className="space-y-2">
              <Label htmlFor="expert-id">Expert ID</Label>
              <div className="flex gap-2">
                <Input
                  id="expert-id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="text"
                  placeholder="Enter Expert ID"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                />
                <Button 
                  onClick={handleCheck} 
                  disabled={!id.trim() || loading}
                  className="gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
                </Button>
              </div>
            </div>

            {/* Expert Details */}
            {expert && (
              <Card>
                <CardHeader >
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Expert Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">Name</p>
                      <p className="font-semibold">{expert.name}</p>
                    </div>
                    {/* <div className="space-y-1">
                      <p className="font-medium text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </p>
                      <p className="font-semibold text-sm">{expert.email}</p>
                    </div> */}
                  </div>

                  {/* Current Thresholds */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">Current Min</p>
                      <p className="font-semibold text-blue-600">{expert.min}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">Current Max</p>
                      <p className="font-semibold text-blue-600">{expert.max}</p>
                    </div>
                  </div>

                  {/* Threshold Inputs */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-threshold">Min Threshold</Label>
                      <Input
                        id="min-threshold"
                        type="number"
                        value={minThreshold}
                        onChange={(e) => setMinThreshold(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-threshold">Max Threshold</Label>
                      <Input
                        id="max-threshold"
                        type="number"
                        value={maxThreshold}
                        onChange={(e) => setMaxThreshold(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={setThreshold} 
                      disabled={updating}
                      className="flex-1 gap-2"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                      {updating ? 'Updating...' : 'Update Threshold'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      disabled={updating}
                    >
                      Reset
                    </Button>
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