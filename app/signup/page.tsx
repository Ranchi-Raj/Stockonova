"use client"
import React, { useState } from "react"
import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Auth from "@/appwrite/auth"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useSignInStore } from "@/store/counterStore"
interface SignUpDetails {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  // sebiRegNumber?: string
}
export default function SignUp() {

  const [details, setDetails] = useState<SignUpDetails>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    // sebiRegNumber: "",
  });
  const router = useRouter();
  const setSignIn = useSignInStore((state) => state.signIn);

  const signUpWithGoogle = () => {
    // Handle Google sign-up logic here
    console.log("Sign up with Google clicked");
    Auth.signInWithGoogle();
    setSignIn();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    if(details.password !== details.confirmPassword){
      toast.error("Passwords do not match");
      return;
    }
    console.log("Form submitted");
    const data = await Auth.signup({
      email: details.email,
      password: details.password,
      name: details.firstName + " " + details.lastName,
      phone: details.phoneNumber,
    });

    console.log(data);
    setSignIn();
    toast.success("Account created successfully");
    router.replace("/dashboard");

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
              <h2 className="mt-4 text-lg font-semibold">Join Stocknova Experts</h2>
              <p className="text-sm text-muted-foreground">Become a trusted, verified SEBI expert.</p>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-center">Sign Up</h1>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input className="rounded-2xl" placeholder="First Name" type="text" value={details.firstName} onChange={(e) => setDetails({ ...details, firstName: e.target.value })} />
                <Input className="rounded-2xl" placeholder="Last Name" type="text" value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })} />
              </div>
              <Input className="rounded-2xl" placeholder="Email" type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
              <Input className="rounded-2xl" placeholder="Phone Number" type="tel" value={details.phoneNumber} onChange={(e) => setDetails({ ...details, phoneNumber: e.target.value })} />
              <Input className="rounded-2xl" placeholder="Password" type="password" value={details.password} onChange={(e) => setDetails({ ...details, password: e.target.value })} />
              <Input className={`rounded-2xl border-2 ${details.confirmPassword === details.password ? "border-green-500" : "border-red-500"}`} placeholder="Confirm Password" type="password" value={details.confirmPassword} onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })} />
              {/* <Input className="rounded-2xl" placeholder="SEBI Registration Number" type="text" /> */}
              <Button className="w-full rounded-2xl" type="submit">Create Account</Button>
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

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link className="text-foreground hover:underline" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}