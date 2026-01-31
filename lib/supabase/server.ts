import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("Invalid Supabase URL format")
    .refine(
      (url) => url.includes("supabase.co"),
      "URL must be a valid Supabase URL",
    ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "Supabase anon key is required")
    .regex(/^eyJ/, "Invalid Supabase anon key format"),
});

const resolvedSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;
const resolvedSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY;

export async function getSupabaseServer() {
  // Use safeParse to avoid throwing build-time errors if variables are missing
  const envResult = supabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: resolvedSupabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: resolvedSupabaseAnonKey,
  });

  if (!envResult.success) {
    console.warn(
      "⚠️ Supabase environment variables are missing or invalid. This is expected during build time if secrets are not provided.",
    );
    // Return a dummy client or throw only when called at runtime
    if (process.env.NODE_ENV === "production" && !resolvedSupabaseUrl) {
      // If we are actually running in production and missing URLs, we might want to know,
      // but during Next.js build (static generation), we should fail gracefully.
    }
  }

  const url = resolvedSupabaseUrl || "https://placeholder.supabase.co";
  const key = resolvedSupabaseAnonKey || "eyJplaceholder";

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>,
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

export { createServerClient };

// Alias for createClient (same as getSupabaseServer)
export const createClient = getSupabaseServer;
