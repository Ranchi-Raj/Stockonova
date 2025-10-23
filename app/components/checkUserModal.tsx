import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import DBService from '@/appwrite/db';
interface User{
    $id: string;
    name: string;
    email: string;
    intros?: string[];
    expert : boolean;
    sebi : {
        $id: string
        earnings : string
        sebiId : string
        specialization : string
        experience : string
        bio : string
    };
    phone? : string;
}
export default function CheckUserModal() {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState<User | null>(null);
    const [id, setId] = React.useState<string>('');

    const handleUser = async () => {
        const data = await DBService.getUserbyId(id) as User;
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
    }
  return (
    <div>
    <Button onClick={() => setOpen(true)}>Check User</Button>
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Check User</Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check User</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            <Input 
            value={id} onChange={(e) => setId(e.target.value)}
            type="text" placeholder="User ID" className="w-full mb-4 mt-2 p-2 border border-gray-300 rounded"/>
            <div className='flex flex-col justify-center items-center'>
                {
                    user ? (
                        <div className='space-y-2'>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>SEBI ID:</strong> {user.sebi.sebiId}</p>
                            <p><strong>Expert:</strong> {user.expert ? 'Yes' : 'No'}</p>
                            <p><strong>Intros:</strong> {user.intros ? user.intros.length : 0}</p>
                            <p><strong>Earnings:</strong> ₹{user.sebi.earnings}</p>
                            <p><strong>Phone:</strong> {user.phone ? user.phone : 'N/A'}</p>
                        </div>
                    ) : (
                        <p>No user data available.</p>
                    )
                }
                <Button onClick={handleUser}>Check</Button> 
            </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
    </div>
  )
}