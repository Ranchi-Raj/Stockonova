import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the shape of a User
interface User {
  $id: string;
  name: string;
  email: string;
  intros?: string[];
  expert : boolean;
  sebi : string;
  earning: number;
  // Add other user properties if needed
}

// interface Sebi {
//   $id: string;
//   name: string;
//   earnings: number;
  
//   // Add other sebi properties if needed
// }

// Default user (optional placeholder)
const defaultUser: User = {
  $id: "",
  name: "Aditya Raj",
  email: "",
  intros: ["empty"],
  expert: false,
  sebi : "",
  earning: 0
};

// -------------------- User Store --------------------

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // or sessionStorage
    }
  )
);

// -------------------- Sign-In Store --------------------

interface SignInState {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const useSignInStore = create<SignInState>()(
  persist(
    (set) => ({
      isSignedIn: false,
      signIn: () => set({ isSignedIn: true }),
      signOut: () => set({ isSignedIn: false }),
    }),
    {
      name: "signin-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useUserStore, useSignInStore };