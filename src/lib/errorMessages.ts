/**
 * Maps raw backend errors to safe user-facing messages.
 * Prevents leaking table names, constraint names, and RLS policy details.
 */
export function toUserMessage(error: unknown, fallback = "An unexpected error occurred. Please try again."): string {
  const msg = ((error as any)?.message ?? "").toString().toLowerCase();

  if (!msg) return fallback;

  if (msg.includes("row-level security") || msg.includes("rls") || msg.includes("permission denied"))
    return "You do not have permission to perform this action.";
  if (msg.includes("duplicate key") || msg.includes("unique constraint"))
    return "This record already exists.";
  if (msg.includes("foreign key") || msg.includes("violates foreign"))
    return "Invalid reference — related record not found.";
  if (msg.includes("check constraint") || msg.includes("violates check"))
    return "The submitted data is invalid.";
  if (msg.includes("not null") || msg.includes("null value"))
    return "A required field is missing.";
  if (msg.includes("invalid input syntax") || msg.includes("invalid_text_representation"))
    return "The submitted data has an invalid format.";
  if (msg.includes("network") || msg.includes("failed to fetch"))
    return "Network error. Check your connection and try again.";
  if (msg.includes("invalid login") || msg.includes("invalid credentials"))
    return "Invalid email or password.";
  if (msg.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (msg.includes("user already registered"))
    return "An account with this email already exists.";

  // Log full detail for debugging, but never surface it
  console.error("[App Error]", error);
  return fallback;
}
