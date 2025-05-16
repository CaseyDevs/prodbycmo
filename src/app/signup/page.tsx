"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import NavBar from "../components/NavBar/NavBar"
import Link from "next/link"


export default function SignupPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget as HTMLFormElement; // Cast to HTMLFormElement
        const formData = new FormData(form)

        // Post the form data to the API
        const res = await fetch("/api/signup", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.error || "An error occurred");
        }
    }

    return (
        <>
        <NavBar />
        <form 
            className="flex flex-col items-center my-20 mx-auto w-2xl p-5"
            onSubmit={handleSignup}
        >
            <h1 className="text-4xl font-bold mb-6">Signup</h1>
            <input
                type="email"
                placeholder="Enter you email"
                name="email"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
            />
            <input
                type="password"
                placeholder="Enter your Password"
                name="password"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
            />
            <button 
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-800 transition-colors w-full"
                type="submit"
            >
                Signup
            </button>

            {error && <p className="mt-4 text-red-600">{error}</p>}

            <p className="mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                    Return to Login
                </Link>
            </p>
        </form>
        </>
    )
}