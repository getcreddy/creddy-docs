import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Problem } from "@/components/problem"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Quickstart } from "@/components/quickstart"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <div className="mx-auto max-w-5xl border-t border-border" />
        <Problem />
        <div className="mx-auto max-w-5xl border-t border-border" />
        <HowItWorks />
        <div className="mx-auto max-w-5xl border-t border-border" />
        <Features />
        <div className="mx-auto max-w-5xl border-t border-border" />
        <Quickstart />
      </main>
      <Footer />
    </div>
  )
}
