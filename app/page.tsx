"use client"

import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {toast} from "react-hot-toast"
import Auth from "@/appwrite/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSignInStore } from "@/store/counterStore"
import HomePageSkeleton from "./components/skeleton"
import DBService from "@/appwrite/db"

  export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const setSignIn = useSignInStore((state) => state.signIn);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() =>{
      const checkUser = async ()=>{
        try{
          const user = await Auth.getUser();
          console.log(user);
          if(user){
            setSignIn();
            router.replace("/dashboard");
             setLoading(false);
          }
        }
        catch(err){
          console.log("Not logged in",err);
        }
        
      }

      checkUser();
    },[])
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      // Handle login logic here
      try{
        const data = await Auth.login({email, password});
        // const user = await Auth.getUser();
        console.log(data)
        router.replace("/dashboard");

        toast.success("Logged in successfully");
        // Just setting in the store that user is signed in
        // setSignIn();
     
        // Setting the data to zustand store will be handled in dashboard page after redirect
       
      }
      catch(err){
        console.log("Login error", err);
        toast.error("Unable to login. Please try again.");
      }
      
    }

    const signUpWithGoogle = async () => {
      // Handle Google sign-up logic here
      console.log("Sign up with Google clicked");
       Auth.signInWithGoogle();
      // setSignIn();
     

      }
      // Setting the data to zustand store will be handled in dashboard page after redirect
    

    if(loading){
      return <HomePageSkeleton/>
    }
    return (
      <main>
        <NavBar />
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid items-center gap-8 rounded-2xl border bg-card p-6 shadow-md md:grid-cols-2">
            <div className="hidden md:block">
              <div className="rounded-2xl border bg-secondary p-6">
                <Image
                  src="/stock.jpeg"
                  alt="Stocknova"
                  width={480}
                  height={320}
                  className="h-auto w-full rounded-xl"
                />
                <h2 className="mt-4 text-lg font-semibold">Stocknova</h2>
                <p className="text-sm text-muted-foreground">Trusted, verified SEBI experts.</p>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-center">Login</h1>
              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <Input className="rounded-2xl" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Input className="rounded-2xl" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {/* <Input className="rounded-2xl" placeholder="OTP (optional)" type="text" /> */}
                <Button className="w-full rounded-2xl" type="submit">Login</Button>
              </form>
                {/* OR Separator */}
                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-muted"></div>
                  <span className="mx-4 text-sm text-muted-foreground">OR</span>
                  <div className="flex-grow border-t border-muted"></div>
                </div>
    
                {/* Sign up with Google */}
                <Button variant="outline" className="w-full rounded-2xl" onClick={signUpWithGoogle}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
                <div className="text-sm mt-2 text-center">
                  <span className="text-muted-foreground">Don&apos;t have an account?{" "}</span>
                  <Link href="/signup">
                    Sign up
                  </Link>
                </div>
              <div className="mt-4 flex items-center justify-end text-sm">
                <Link className="text-muted-foreground hover:text-foreground" href="#">
                  Forgot Password?
                </Link>
                {/* <Link className="text-muted-foreground hover:text-foreground" href="/signup">
                  Become an Expert
                </Link> */}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }
  

