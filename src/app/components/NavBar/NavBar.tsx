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
            localStorage.removeItem("role");  // Remove the role from local storage
            setRole(null);
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
                {items.map((item, index) => (
                    <li key={index}>
                        <Link href={item.href} className="hover:text-zinc-400 transition-colors" {...item.label === "Sign Out" ? { onClick: handleSignout } : {}}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}