// hooks/useAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Auth from '@/appwrite/auth';
import { useSignInStore } from '@/store/counterStore';
import { useUserStore } from '@/store/counterStore';
import DBService from '@/appwrite/db';

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
// Custom hook to check authentication status and redirect if not authenticated
export function useAuth(redirectUrl = "/") {
  const router = useRouter();
  const setSignIn = useSignInStore((state) => state.signIn);
  const setUser = useUserStore((state) => state.setUser);
  // const Zuser = useUserStore((state) => state.user);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await Auth.getUser();
        const userData = await DBService.getUserByEmail(user?.email || "") as User;
        // console.log("User data fetched at useAuth():", userData);
        const sebiData = await DBService.getSebiById(userData.sebi || "") as {earnings: number};
        if (!user) {
          router.replace(redirectUrl);
        } else {

          setSignIn();
          setUser({
            name: userData.name,
            email: userData.email,
            $id: userData.$id,
            intros: userData.intros || [],
            expert: userData.expert,
            sebi : userData.sebi,
            earning : sebiData?.earnings || 0
          } as User);

          console.log("Auth checked and User is logged in", user);
          // console.log("User data set in store:", Zuser);
        }
      } catch (err) {
        console.log("Not logged in", err);
        router.replace(redirectUrl);
      }
    };
    checkAuth();
  }, [router, setSignIn, redirectUrl,setUser]);
} 