"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import NavBar from "../components/NavBar/NavBar"
import Link from "next/link"
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [captcha, setCaptcha] = useState<string | null>(null);

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget as HTMLFormElement; // Cast to HTMLFormElement
        const formData = new FormData(form)

        if (!captcha) {
            setError("Please complete the reCAPTCHA.");
            return;
        }
        
        formData.append("g-recaptcha-response", captcha);

        // Post the form data to the API
        const res = await fetch("/api/login", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("role", data.role)
            router.push("/");
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
            onSubmit={handleLogin}
        >
            <h1 className="text-4xl font-bold mb-6">Login</h1>
            <input
                type="email"
                placeholder="Email"
                name="email"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
            />
            <input
                type="password"
                placeholder="Password"
                name="password"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
            />
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={setCaptcha}
            />
            <button 
                className="bg-orange-500 text-white p-2 rounded hover:bg-orange-800 transition-colors w-full"
                type="submit"
            >
                Login
            </button>

            {error && <p className="mt-4 text-red-600">{error}</p>}

            <p className="mt-4">
                {"Don't have an account?  "}
                <Link href="/signup" className="text-blue-500 hover:underline">
                    Register here
                </Link>
            </p>
        </form>
        </>
    )
}