import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
    const items = [
        { href: "/login", label: "Login" },
        { href: "/beats", label: "Beats" },
        { href: "/contact", label: "Contact" },
        { href: "/upload", label: "Upload" },
    ];

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