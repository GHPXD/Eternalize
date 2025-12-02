"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

interface AuthResponse {
  success: boolean;
  error?: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  // Validate input
  if (!data.email || !data.password || !data.name) {
    return { success: false, error: "All fields are required" };
  }

  if (data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      logger.error("Signup failed", error);
      return { success: false, error: error.message };
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create user" };
    }

    logger.info("User signed up successfully", { userId: authData.user.id });
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    logger.error("Unexpected error during signup", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input
  if (!data.email || !data.password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      logger.error("Login failed", error);
      return { success: false, error: "Invalid email or password" };
    }

    logger.info("User logged in successfully", { email: data.email });
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    logger.error("Unexpected error during login", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function loginWithGoogle(): Promise<{ url: string | null; error?: string }> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      logger.error("Google OAuth failed", error);
      return { url: null, error: error.message };
    }

    return { url: data.url };
  } catch (error) {
    logger.error("Unexpected error during Google OAuth", error);
    return { url: null, error: "Failed to initialize Google sign-in" };
  }
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error("Logout failed", error);
      throw error;
    }

    logger.info("User logged out successfully");
  } catch (error) {
    logger.error("Unexpected error during logout", error);
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
