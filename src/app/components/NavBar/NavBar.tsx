import Link from "next/link";

export default function NavBar() {

    const items = [
        { href: "/", label: "Dashboard" },
        { href: "/beats", label: "Beats" },
        { href: "/contact", label: "Contact" },
        { href: "/upload", label: "Upload" },
    ];

    return (
        <nav className="flex items-center justify-between p-4 bg-black-100 text-white">
            <div className="text-lg font-bold">ProdByCmo</div>
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