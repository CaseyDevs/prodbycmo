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
    
    // Check if the user is an admin & redirect if not
    useEffect(() => {
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

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // Handle beat deletion
    async function handleDelete(beatId: string) {
        try {
            const response = await fetch(`/api/songs`, {
                method: "DELETE",
                body: JSON.stringify({ id: beatId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete beat");
            }
            setBeats(beats.filter((beat) => beat.id !== beatId));
        } catch (error) {
            console.error("Error deleting beat:", error);
        }
    }

    function handleUpload() {
        redirect("/upload");
    }

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
                <h1 className="text-4xl font-bold m-4">Dashboard</h1>
                <p className="text-lg">Welcome Admin!</p>
                <button className="bg-blue-500 text-white rounded-lg p-2 m-2 hover:bg-blue-600 transition-colors" onClick={handleUpload}>Upload +</button>
                <h3 className="text-lg">Your beats: </h3>
                {beats && beats.length > 0 ? beats.map((beat) => (
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
                                <button className="text-red-500 rounded-lg p-1 text-sm hover:cursor-pointer" onClick={() => handleDelete(beat.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <div>No beats found...</div>}
            </div>
        </>
    )
}