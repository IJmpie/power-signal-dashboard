
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  // Ensure proper spacing and prevent Euro symbol display issues
  return `€${value.toFixed(2)}`;
}

export function formatDateToTime(date: Date): string {
  return date.toLocaleTimeString('nl-NL', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam' // Explicitly set timezone to Amsterdam for proper DST handling
  });
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam' // Explicitly set timezone to Amsterdam for proper DST handling
  });
}
