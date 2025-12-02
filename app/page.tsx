import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";
import { SocialProof } from "@/components/landing/social-proof";
import { LANDING_PAGE } from "@/lib/constants/landing";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LANDING_PAGE.STRUCTURED_DATA) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.4))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              {LANDING_PAGE.HERO.BADGE}
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {LANDING_PAGE.HERO.TITLE}
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up animation-delay-100">
              {LANDING_PAGE.HERO.SUBTITLE}
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
              {LANDING_PAGE.HERO.DESCRIPTION}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <SocialProof items={LANDING_PAGE.SOCIAL_PROOF} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {LANDING_PAGE.FEATURES.TITLE}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {LANDING_PAGE.FEATURES.SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LANDING_PAGE.FEATURES.ITEMS.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-violet-950 dark:via-purple-900 dark:to-pink-950 overflow-hidden">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {LANDING_PAGE.CTA_SECTION.TITLE}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {LANDING_PAGE.CTA_SECTION.DESCRIPTION}
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group">
                  {LANDING_PAGE.CTA_SECTION.BUTTON_TEXT}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            © 2025 Eternizale. Made with <Heart className="inline w-4 h-4 text-red-500 mx-1" /> for preserving precious moments.
          </p>
        </div>
      </footer>
    </main>
    </>
  );
}
