"use client";

import Link from "next/link";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


function getRoleFromLocalStorage() {
    if (typeof window === "undefined") return null
    return localStorage.getItem("role");
}

export default function NavBar() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const role = getRoleFromLocalStorage();
            setRole(role);
            console.log("Current role:", role); // Debug line
        }, 1000);
        setRole(getRoleFromLocalStorage());
        return () => clearInterval(interval);
    }, [])

    const items = [
        ...(role ? [{ href: "/signout", label: "Sign Out" }] : [{ href: "/login", label: "Login" }]),
        { href: "/beats", label: "Beats" },
        { href: "/contact", label: "Contact" },
    ];

    if (role === "ADMIN") {
        items.push({ href: "/upload", label: "Upload" });
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
                {items.map((items, index) => (
                    <li key={index}>
                        <Link href={items.href} className="hover:text-zinc-400 transition-colors">
                            {items.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}