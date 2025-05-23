"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkRole } from "@/utils/checkRole";

export default function NavBar() {
    const [role, setRole] = useState<string | null>(null);

    // Check the role from local storage every second
    useEffect(() => {
        async function fetchRole() {
            const role = await checkRole();
            setRole(role);  // Update the role state
        }
        fetchRole();
    }, [])

    const items = [
        // Add the "Sign Out" link if the user is logged in, otherwise add the "Login" link
        ...(role ? [{ href: "/", label: "Sign Out" }] : [{ href: "/login", label: "Login" }]),
        { href: "/beats", label: "Beats" },
        { href: "/contact", label: "Contact" },
    ];

    if (role === "ADMIN") {
        items.push({ href: "/upload", label: "Upload" });
    }

    // Call signout API when the user clicks the "Sign Out" link
    const handleSignout = async () => {
        const response = await fetch("/api/signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            setRole(null);
            window.location.reload();  // Reload the page to reflect the sign-out
            console.log("Sign out successful");
        } else {
            console.error("Sign out failed");
        }
    }

    return (
        <nav className="flex items-center justify-between p-6 bg-black-100 text-white">
            <Link href="/">
                <Image
                    src="https://59yoapebrc.ufs.sh/f/V2i90s9zI34c7rGqrTBSg1l5YEsUm0ftbFd9Gn6ucq42MhPI"
                    alt="Logo"
                    width={144}
                    height={60}
                />
            </Link>
            <ul className="flex space-x-4">
                {role ? (
                    <>
                        <li>
                            <button
                                onClick={handleSignout}
                                className="hover:text-zinc-400 transition-colors bg-transparent border-none cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link href="/login" className="hover:text-zinc-400 transition-colors">
                            Login
                        </Link>
                    </li>
                )}
                <li>
                    <Link href="/beats" className="hover:text-zinc-400 transition-colors">
                        Beats
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className="hover:text-zinc-400 transition-colors">
                        Contact
                    </Link>
                </li>
                {role === "ADMIN" && (
                    <li>
                        <Link href="/upload" className="hover:text-zinc-400 transition-colors">
                            Upload
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}