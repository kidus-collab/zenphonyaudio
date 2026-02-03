"use client"

import { useState, useEffect, useRef, lazy, Suspense } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Building, Briefcase, Camera, LogOut, Loader2, Check, Crown, ExternalLink, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { SubscriptionDetailsCard } from "@/components/profile/subscription-details-card"
import Link from "next/link"
import Image from "next/image"

const ProfileCharts = lazy(() =>
  import("@/components/profile/profile-charts").then((m) => ({ default: m.ProfileCharts }))
)

const planDetails = {
  free: { name: "Free", color: "cyan", minutes: 5 },
  basic: { name: "Basic", color: "emerald", minutes: 30 },
  pro: { name: "Pro", color: "violet", minutes: 120 },
  max: { name: "Max", color: "amber", minutes: 350 },
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut, updateProfile } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)



  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Populate form with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setPhone(profile.phone || "")
      setCompany(profile.company || "")
      setJobTitle(profile.job_title || "")
      setAvatarUrl(profile.avatar_url || null)
    }
  }, [profile])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)

    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl })
      setAvatarUrl(publicUrl)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      company,
      job_title: jobTitle,
    })

    setSaving(false)

    if (!error) {
      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Use window.location for full page reload to clear all cached state
      window.location.href = "/"
    } catch (error) {
      console.error('Sign out error:', error)
      // Force redirect even on error
      window.location.href = "/"
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  const currentPlan = profile?.subscription_plan || "free"
  const plan = planDetails[currentPlan as keyof typeof planDetails]
  const minutesUsed = profile?.listening_minutes_used || 0
  const minutesLimit = profile?.listening_minutes_limit || 5
  const isUnlimited = minutesLimit === -1

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ColorBends Animated Background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      <div className="relative z-10">

        <main className="pt-32 pb-24 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Your Profile
              </h1>
              <p className="text-white/50">
                Manage your account settings and subscription
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                <Check className="w-5 h-5" />
                Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-violet-500/10 rounded-3xl blur-xl" />
                  <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-8">
                    {/* Avatar & Name */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="relative">
                        {avatarUrl ? (
                          <div className="w-20 h-20 rounded-2xl overflow-hidden">
                            <Image
                              src={avatarUrl}
                              alt="Profile"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-bold">
                            {(profile?.full_name || user.email?.split('@')[0] || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-50"
                        >
                          {uploadingAvatar ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-1">
                          {profile?.full_name || user.email?.split('@')[0] || "Set your name"}
                        </h2>
                        <p className="text-white/50 text-sm">{user.email}</p>
                        <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-${plan.color}-500/20 text-${plan.color}-400`}>
                          <Crown className="w-3 h-3" />
                          {plan.name}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="rounded-xl border-white/20 text-white/70 hover:text-white hover:bg-white/10 bg-transparent"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              disabled={!isEditing}
                              className="pl-11 h-12 rounded-xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 disabled:opacity-60"
                              placeholder="Your name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                            Phone
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              disabled={!isEditing}
                              className="pl-11 h-12 rounded-xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 disabled:opacity-60"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                            Company
                          </label>
                          <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              disabled={!isEditing}
                              className="pl-11 h-12 rounded-xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 disabled:opacity-60"
                              placeholder="Company name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                            Job Title
                          </label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              disabled={!isEditing}
                              className="pl-11 h-12 rounded-xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 disabled:opacity-60"
                              placeholder="Audio Engineer"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input
                            value={user.email || ""}
                            disabled
                            className="pl-11 h-12 rounded-xl bg-white/[0.05] border-white/10 text-white/50 disabled:opacity-60"
                          />
                        </div>
                        <p className="text-white/30 text-xs mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Subscription Details Card */}
                <SubscriptionDetailsCard
                  currentPlan={currentPlan}
                  subscriptionStatus={profile?.subscription_status || "active"}
                  minutesUsed={minutesUsed}
                  minutesLimit={minutesLimit}
                  isUnlimited={isUnlimited}
                />

                {/* Open Plugin Link */}
                <Link href="/plugin" className="block">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-violet-500/10 rounded-3xl blur-xl group-hover:bg-violet-500/20 transition-all" />
                    <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 group-hover:border-violet-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                          <Headphones className="w-5 h-5 text-violet-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">Listen Buddy Plugin</h3>
                          <p className="text-white/40 text-xs">Open and connect your DAW plugin</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-violet-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="relative">
                    <div className="absolute -inset-2 bg-violet-500/10 rounded-3xl blur-xl" />
                    <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                    </div>
                  </div>
                }
              >
                <ProfileCharts currentPlan={currentPlan} minutesLimit={minutesLimit} />
              </Suspense>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
