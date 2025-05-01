export default function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="hover:text-zinc-400 transition-colors"
      >
        {children}
      </a>
    </li>
  );
}