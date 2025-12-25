// Utility function for className merging
// Note: clsx and tailwind-merge not needed for React Native
export type ClassValue = string | undefined | null | false;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}
