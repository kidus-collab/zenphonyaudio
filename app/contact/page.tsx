"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ColorBends - Full page animated background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      <div className="relative z-10">
        <Navigation />

        <main className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
                <MessageCircle className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-300 font-medium">Get in Touch</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Contact{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  Us
                </span>
              </h1>

              <p className="text-lg text-white/60 max-w-xl mx-auto">
                Have questions about our audio tools? We'd love to hear from you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-3xl p-8 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6">Send us a message</h2>
                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Subject</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all">
                        <option value="" className="bg-slate-900">Select a topic</option>
                        <option value="sales" className="bg-slate-900">Sales Inquiry</option>
                        <option value="support" className="bg-slate-900">Technical Support</option>
                        <option value="partnership" className="bg-slate-900">Partnership</option>
                        <option value="other" className="bg-slate-900">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>
                    <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold py-6 transition-all duration-200">
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 order-1 lg:order-2">
                {/* Email */}
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                      <p className="text-white/50 text-sm mb-2">We'll respond within 24 hours</p>
                      <a href="mailto:hello@zenphony.audio" className="text-violet-400 hover:text-violet-300 transition-colors">
                        hello@zenphony.audio
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                      <p className="text-white/50 text-sm mb-2">Mon-Fri from 9am to 6pm PST</p>
                      <a href="tel:+15551234567" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Visit Us</h3>
                      <p className="text-white/50 text-sm mb-2">Our headquarters</p>
                      <p className="text-purple-400">
                        123 Audio Lane<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
