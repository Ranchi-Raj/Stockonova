export interface SessionInterface {
  $id: string
  title: string
  date: string
  time: string
  duration: number
  fee: number
  status: 'scheduled' | 'completed' | 'cancelled'
  createdAt: string
  registered? : boolean
  users : string[]
  // sessions : string[]
}

export interface User {
  $id: string;
  name: string;
  email: string;
  intros?: string[];
  expert : boolean;
  sebi : string;
  earning: number;
  // Add other user properties if needed
}

