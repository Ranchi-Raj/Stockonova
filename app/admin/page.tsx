"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Auth from "@/appwrite/auth"
import { NavBar } from "@/app/components/navbar"
import { Footer } from "@/app/components/footer"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DBService from "@/appwrite/db"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Request {
    id: string
    name: string
    email: string
    sebiId: string
    experience: number
    specialization: string
    bio: string
    status: boolean
    userId: string
}

interface Data {
    $id: string
    name: string
    email: string
    sebiId: string
    experience: number
    specialization: string
    bio: string
    status: boolean
    userId: string
}

interface User {
    id: string
    name: string
    email: string
    phone?: string
    expert: boolean
    intros? : string[]
}

interface UserData {
    $id: string
    name: string
    email: string
    phone?: string
    expert: boolean
    intros? : string[]
}

export default function AdminPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")
    const [activeTab, setActiveTab] = useState<"users" | "experts" | "requests">("requests")
    const [requests, setRequests] = useState<Request[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [experts, setExperts] = useState<User[]>([])
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
    const [showModal, setShowModal] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoginError("")

        if (username === "admin" && password === "admin") {
            setIsAuthenticated(true)
        } else {
            setLoginError("Invalid credentials. Use admin/admin")
        }
    }

    useEffect(() => {
        if (!isAuthenticated) return

        const checkAuth = async () => {
            try {
                const user = await Auth.getUser()
                if (!user) {
                    router.replace("/")
                }
            } catch (err) {
                console.log("Not logged in", err)
                router.replace("/")
            }
        }

        const fetchRequests = async () => {
            const data = await DBService.getRequests() as Data[];
            setRequests(data.map((req) => ({ id: req.$id, ...req })));
        }

        const fetchUsers = async () => {
            const data = await DBService.getAllUsers() as UserData[];
            const allUsers = data.map((user) => ({ 
                id: user.$id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone,
                expert: user.expert || false,
                intros: user.intros || []
            }));
            setUsers(allUsers.filter(user => !user.expert));
            setExperts(allUsers.filter(user => user.expert));
        }

        fetchRequests()
        fetchUsers()
        checkAuth()
    }, [isAuthenticated, router])

    const handleAction = async (id: string, userId: string, action: boolean) => {
        setRequests(prev =>
            prev.map(req =>
                req.id === id ? { ...req, status: action } : req
            )
        )
        setShowModal(false)

        // Sebi details needs to be added to the user's document
        const request = requests.find(req => req.id === id)

        const sebiData = {
            sebiId: request?.sebiId || "",
            experience: request?.experience || 0,
            specialization: request?.specialization || "",
            earnings: 0, 
            bio: request?.bio || "",
        }

        const updatedUser = await DBService.addSebiDetails({...sebiData, userId: userId});
        console.log("Sebi details updated", updatedUser);

        // Update user to expert
        const data = await DBService.updateUserToExpert(userId);
        console.log("User updated to expert", data);

        // Remove the request from the list
        await DBService.deleteRequest(id);
        setRequests(prev => prev.filter(req => req.id !== id))
        
        // Refresh users and experts lists
        const updatedUsers = await DBService.getAllUsers() as UserData[];
        const allUsers = updatedUsers.map((user) => ({ 
            id: user.$id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone,
            expert: user.expert || false 
        }));
        setUsers(allUsers.filter(user => !user.expert));
        setExperts(allUsers.filter(user => user.expert));
    }

    // Show login form if not authenticated
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-white text-2xl font-medium        ">A</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-gray-600 mt-2">Enter credentials to access admin panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full"
                                required
                            />
                        </div>

                        {loginError && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                {loginError}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            <i className="bi bi-box-arrow-in-right mr-2"></i>
                            Sign In
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">Demo Credentials</p>
                        <p>Username: <span className="font-mono">admin</span></p>
                        <p>Password: <span className="font-mono">admin</span></p>
                    </div>
                </div>
            </main>
        )
    }

    // Show admin dashboard if authenticated
    return (
        <main>
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <i className="bi bi-shield-check"></i>
                        <span>Admin Mode</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === "users" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("users")}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === "experts" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("experts")}
                    >
                        Experts ({experts.length})
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === "requests" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("requests")}
                    >
                        Requests ({requests.length})
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === "users" && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-3 text-left">Name</th>
                                    <th className="border p-3 text-left">Email</th>
                                    <th className="border p-3 text-left">Phone</th>
                                    {/* <th className="border p-3 text-left">Status</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border p-3">{user.name}</td>
                                        <td className="border p-3">{user.email}</td>
                                        <td className="border p-3">{user.phone}</td>
                                        {/* <td className="border p-3">
                                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                                User
                                            </span>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Experts Table */}
                {activeTab === "experts" && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-3 text-left">Name</th>
                                    <th className="border p-3 text-left">Email</th>
                                    <th className="border p-3 text-left">Phone</th>
                                    <th className="border p-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experts.map((expert) => (
                                    <tr key={expert.id}>
                                        <td className="border p-3">{expert.name}</td>
                                        <td className="border p-3">{expert.email}</td>
                                        <td className="border p-3">{expert.phone}</td>
                                        <td className="border p-3">
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                Expert
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Requests Table */}
                {activeTab === "requests" && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-3 text-left">Name</th>
                                    <th className="border p-3 text-left">Email</th>
                                    <th className="border p-3 text-left">SEBI ID</th>
                                    <th className="border p-3 text-left">Experience</th>
                                    <th className="border p-3 text-left">Specialization</th>
                                    <th className="border p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="border p-3">{request.name}</td>
                                        <td className="border p-3">{request.email}</td>
                                        <td className="border p-3">{request.sebiId}</td>
                                        <td className="border p-3">{request.experience} years</td>
                                        <td className="border p-3">{request.specialization}</td>
                                        <td className="border p-3">
                                            <Button
                                                onClick={() => {
                                                    setSelectedRequest(request)
                                                    setShowModal(true)
                                                }}
                                                size="sm"
                                            >
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">Expert Application</DialogTitle>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-4">
                            <div>
                                <strong>Name:</strong> {selectedRequest.name}
                            </div>
                            <div>
                                <strong>Email:</strong> {selectedRequest.email}
                            </div>
                            <div>
                                <strong>SEBI ID:</strong> {selectedRequest.sebiId}
                            </div>
                            <div>
                                <strong>Experience:</strong> {selectedRequest.experience} years
                            </div>
                            <div>
                                <strong>Specialization:</strong> {selectedRequest.specialization}
                            </div>
                            <div>
                                <strong>Bio:</strong>
                                <p className="mt-1 text-sm">{selectedRequest.bio}</p>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleAction(selectedRequest.id, selectedRequest.userId, false)}
                                >
                                    Disapprove
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-green-700 text-white"
                                    onClick={() => handleAction(selectedRequest.id, selectedRequest.userId, true)}
                                >
                                    Approve
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </main>
    )
}