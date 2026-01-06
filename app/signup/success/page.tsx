"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"

export default function SignupSuccessPage() {
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

      {/* Success Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <ZenphonyLogo className="h-10 w-auto" variant="light" />
        </div>

        <div className="rounded-3xl glass-strong border-glow p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-foreground mb-3">
            Check your email!
          </h1>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We've sent a confirmation link to your email address. Please check your inbox and click the link to activate your account.
          </p>

          <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-foreground font-medium mb-1">
                  Didn't receive the email?
                </p>
                <p className="text-xs text-muted-foreground">
                  Check your spam folder or try signing up again.
                </p>
              </div>
            </div>
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
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
