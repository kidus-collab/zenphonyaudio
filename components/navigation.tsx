"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide navigation on auth pages
  const hiddenRoutes = ['/login', '/signup', '/signup/success', '/forgot-password', '/reset-password']
  if (hiddenRoutes.includes(pathname)) {
    return null
  }

  const navItems = [
    { name: "Listen Buddy", href: "/products/listen-buddy" },
    { name: "Pricing", href: "/products/listen-buddy#pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          scrolled
            ? "py-2 bg-slate-950 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
            : "py-4 bg-transparent"
        }`}
        style={{ zIndex: 99999 }}
      >
        <div className="w-full px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between">
            {/* Logo - Left with margin */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity ml-2 lg:ml-4">
              <ZenphonyLogo className="h-11 sm:h-12 lg:h-14 w-auto" variant="light" />
            </Link>

            {/* Center Navigation - Compact Pill */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
              <div
                className={`flex items-center gap-0.5 lg:gap-1 px-2 lg:px-3 py-1.5
                bg-white/[0.06] backdrop-blur-xl
                border border-white/10
                rounded-full
                transition-all duration-300`}
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split('#')[0]))
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "text-violet-400"
                          : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      )}
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Side - User Avatar or Login */}
            <div className="hidden md:flex items-center gap-3 mr-2 lg:mr-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-semibold text-sm">
                      {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/70 text-sm font-medium">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Profile</span>
                      </Link>
                      <button
                        onClick={async () => {
                          try {
                            await signOut()
                            setUserMenuOpen(false)
                            // Use window.location for full page reload to clear all cached state
                            window.location.href = "/"
                          } catch (error) {
                            console.error('Sign out error:', error)
                            // Force redirect even on error
                            window.location.href = "/"
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="rounded-full text-white/70 hover:text-white hover:bg-white/10 font-medium px-5 py-2 text-sm transition-all duration-200"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2 text-sm shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30 transition-all duration-200 border-0"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split('#')[0]))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors duration-200 ${
                      isActive
                        ? "text-violet-400"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                    )}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold">
                        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {profile?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-white/50 text-xs truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-medium py-3"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await signOut()
                          setMobileMenuOpen(false)
                          // Use window.location for full page reload to clear all cached state
                          window.location.href = "/"
                        } catch (error) {
                          console.error('Sign out error:', error)
                          // Force redirect even on error
                          window.location.href = "/"
                        }
                      }}
                      className="w-full rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium py-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-medium py-3"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 transition-all duration-200"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
  )
}
