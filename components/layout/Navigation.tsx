import Link from "next/link";

const links = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "Landlords", href: "/landlords" },
  { name: "Tenants", href: "/tenants" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  return (
    <nav className="desktop-navigation" aria-label="Main navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="navigation-link"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}