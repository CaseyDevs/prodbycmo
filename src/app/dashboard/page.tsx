"use client";

import NavBar from "../components/NavBar/NavBar"
import { useEffect, useState } from "react";
import { Beat } from "@/lib/types/beat";
import { checkRole } from "@/utils/checkRole";
import { redirect } from "next/navigation";

export default function DashboardPage() {
    const [beats, setBeats] = useState<Beat[]>([]);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);


    useEffect(() => {
        // Check if the user is an admin & redirect if not
        async function verify() {
            const role = await checkRole();
            if (role !== "ADMIN") {
                redirect("/");
            } else {
                setChecked(true);
            }
        }
        verify();
    }, []);

    if (!checked) {
        return null;
    }

    // Fetch beats from the API 
    useEffect(() => {
        async function fetchBeats() {
            try {
                const response = await fetch("/api/songs");
                if (!response.ok) {
                    throw new Error("Failed to fetch beats");
                }
                const data = await response.json();
                setBeats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching beats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBeats();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
                <h1 className="text-4xl font-bold m-4">Dashboard</h1>
                <p className="text-lg">Welcome Admin!</p>
                <h3 className="text-lg">Your beats: </h3>
                {beats.map((beat) => (
                    <div key={beat.id} className="flex flex-row gap-4 bg-white shadow-md rounded-lg p-4 m-2 w-full max-w-xl">
                        <img src={beat.coverImg} alt="Cover Img" className="h-20 w-20" />
                        <div className="flex flex-col">
                            <h2 className="text-xl font-semibold">{beat.title}</h2>
                            <div className="flex flex-row gap-4">
                                <p className="text-gray-600">Genre: {beat.genre}</p>
                                <p className="text-gray-600">BPM: {beat.bpm}</p>
                                <p className="text-gray-600">Key: {beat.key}</p>
                            </div>
                            <div>
                                <button className="text-red-500 rounded-lg p-1 text-sm hover:cursor-pointer">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}