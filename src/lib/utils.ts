import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSafetyColor(score: number): string {
  if (score >= 85) return 'hsl(160, 84%, 39%)'; // safety-good
  if (score >= 70) return 'hsl(38, 92%, 50%)';  // safety-moderate
  if (score >= 50) return 'hsl(25, 95%, 53%)';  // safety-poor
  return 'hsl(0, 84%, 60%)';                     // safety-critical
}
