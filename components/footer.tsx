"use client"

import Link from "next/link"
import { ZenphonyLogo } from "./zenphony-logo"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Listen Buddy", href: "/products/listen-buddy" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <ZenphonyLogo className="h-8 w-auto" variant="light" />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Zenphony Audio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
