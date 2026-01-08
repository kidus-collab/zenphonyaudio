"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorMessage = error ? decodeURIComponent(error) : null

  return (
    <p className="text-muted-foreground mb-6 leading-relaxed">
      {errorMessage
        ? errorMessage
        : "There was an issue with the authentication code. The link may have expired or is invalid."
      }
    </p>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      <Aurora />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Error Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <ZenphonyLogo className="h-10 w-auto" variant="light" />
        </div>

        <div className="rounded-3xl glass-strong border-glow p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-foreground mb-3">
            Authentication Error
          </h1>

          <Suspense fallback={
            <p className="text-muted-foreground mb-6 leading-relaxed">
              There was an issue with the authentication code. The link may have expired or is invalid.
            </p>
          }>
            <ErrorContent />
          </Suspense>

          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 mb-6">
            <p className="text-sm text-foreground">
              Please try signing in again or contact support if the problem persists.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full rounded-full border-border/30 text-foreground hover:bg-violet/10 hover:border-violet/30 bg-transparent"
              >
                Go to Sign In
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                className="w-full rounded-full bg-gradient-to-r from-violet to-purple text-white hover:opacity-90 font-bold glow-violet"
              >
                Create New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
