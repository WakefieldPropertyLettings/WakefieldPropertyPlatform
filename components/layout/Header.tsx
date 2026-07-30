"use client";

import { usePathname } from "next/navigation";


export default function Header() {
  const pathname = usePathname();

  // Navbar appears only on the homepage
  if (pathname !== "/") {
    return null;
  }

  return ;
}