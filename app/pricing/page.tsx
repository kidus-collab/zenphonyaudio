import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "Perfect for individuals getting started",
    features: [
      "5 hours of processing/month",
      "Listen Buddy Plugin",
      "Audio Enhancer",
      "Basic support",
      "Export in MP3, WAV",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For professional creators",
    features: [
      "25 hours of processing/month",
      "All Starter features",
      "VoiceGen access",
      "DubMaster access",
      "Priority support",
      "HD exports",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and businesses",
    features: [
      "Unlimited processing",
      "All Pro features",
      "Custom voice models",
      "Dedicated support",
      "SLA guarantee",
      "White-label options",
      "Custom integrations",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ColorBends />
      <div className="relative z-10">
        <Navigation />

        {/* Hero */}
        <section className="pt-40 pb-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-white/80">Simple, transparent pricing</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              CHOOSE YOUR
              <br />
              <span className="text-gradient-violet">PLAN</span>
            </h1>
            <p className="text-xl text-white/60 max-w-xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-10 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                    plan.popular ? "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" : "glass"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-xs font-bold text-violet-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-1">{plan.name}</h3>
                    <p className={plan.popular ? "text-white/70" : "text-white/60"}>{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-white/70">/mo</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-white/20" : "bg-violet-600/30"}`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={plan.popular ? "" : "text-white/80"}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup">
                    <Button
                      className={`w-full rounded-full font-bold py-6 ${
                        plan.popular
                          ? "bg-white text-violet-600 hover:bg-white/90"
                          : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500"
                      }`}
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Guarantees */}
            <div className="mt-16 text-center">
              <p className="text-white/60 mb-4">All plans include:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 rounded-full glass text-white/80">30-day money-back guarantee</span>
                <span className="px-4 py-2 rounded-full glass text-white/80">Cancel anytime</span>
                <span className="px-4 py-2 rounded-full glass text-white/80">No credit card for trial</span>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
