import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * OAuth Callback Route Handler
 * This route exchanges the auth code for a session
 * Required for Supabase SSR authentication flow
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        logger.error("Failed to exchange code for session", error);
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      logger.info("Successfully exchanged code for session");

      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(`${origin}/dashboard`);
    } catch (error) {
      logger.error("Unexpected error during code exchange", error);
      return NextResponse.redirect(`${origin}/login?error=unexpected`);
    }
  }

  // If no code, redirect to login
  logger.warn("Auth callback called without code");
  return NextResponse.redirect(`${origin}/login`);
}
