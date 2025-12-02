import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Sparkles, Zap, Shield, Infinity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PRICING_PLANS } from "@/lib/constants/pricing";

export const metadata = {
  title: "Planos e Preços | Eternizale",
  description: "Escolha o plano perfeito para criar e compartilhar suas memórias eternas. Pagamento único, sem assinatura.",
};

// Map icon names to components
const ICON_MAP = {
  Sparkles,
  Zap,
  Infinity,
} as const;

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      {/* Header */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Heart className="w-6 h-6 text-violet-600 group-hover:text-violet-700 transition-colors" />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Eternizale
              </span>
            </Link>
            {!user && (
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
            )}
            {user && (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Pagamento Único · Sem Assinatura
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Planos Simples e Transparentes
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Comece grátis e publique quando estiver pronto. Pagamento único, sem mensalidades.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PRICING_PLANS.map((plan) => {
              const Icon = ICON_MAP[plan.icon as keyof typeof ICON_MAP];
              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    plan.highlighted
                      ? "border-2 border-violet-500 shadow-2xl shadow-violet-500/20 scale-105"
                      : "border-2 hover:border-violet-300 dark:hover:border-violet-700"
                  } transition-all`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${plan.iconColor}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    {plan.subtitle && (
                      <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold mt-1">
                        {plan.subtitle}
                      </p>
                    )}
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold mt-2">
                          {plan.period}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Link href={user ? "/checkout" : plan.href} className="w-full">
                      <Button
                        className={`w-full ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg"
                            : ""
                        }`}
                        variant={plan.highlighted ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ / Trust Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-12 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Sem Mensalidade</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Feito com Amor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            © 2025 Eternizale. Feito com <Heart className="inline w-4 h-4 text-red-500 mx-1" /> para preservar momentos preciosos.
          </p>
        </div>
      </footer>
    </main>
  );
}
