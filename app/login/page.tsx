import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Heart, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login | Eternizale",
  description: "Sign in to your Eternizale account or create a new one",
};

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-violet-600 group-hover:text-violet-700 transition-colors" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Eternizale
              </h1>
            </div>
          </Link>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            Create Eternal Digital Memories
          </p>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md">
          <AuthForm />
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
