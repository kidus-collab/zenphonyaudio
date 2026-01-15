import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Syne, Bebas_Neue, Orbitron, Montserrat, Inter } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { PageTransition } from "@/components/page-transition"
import { AuthProvider } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import "./globals.css"

const sakana = localFont({
  src: [
    {
      path: "../public/fonts/Sakana.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sakana",
  display: "swap",
})

const grandover = localFont({
  src: [
    {
      path: "../public/fonts/Grandover.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-grandover",
  display: "swap",
})

const alphacorsa = localFont({
  src: [
    {
      path: "../public/fonts/Alphacorsa-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-alphacorsa",
  display: "swap",
})

const milker = localFont({
  src: [
    {
      path: "../public/fonts/Milker.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-milker",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Zenphony Audio - AI-Powered Audio Platform",
  description:
    "Transform audio with AI. Create lifelike voices, enhance audio quality, and produce professional sound with Zenphony's AI-powered audio tools.",
  generator: "v0.app",
  icons: {
    icon: "/zenphony-icon.svg",
    shortcut: "/zenphony-icon.svg",
    apple: "/zenphony-icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${syne.variable} ${bebasNeue.variable} ${orbitron.variable} ${sakana.variable} ${grandover.variable} ${alphacorsa.variable} ${milker.variable} ${montserrat.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navigation />
          <PageTransition>{children}</PageTransition>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
