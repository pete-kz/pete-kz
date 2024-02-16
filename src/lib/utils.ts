import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAge(age: string, i18_years: string, i18_months: string) {
  // Parse the given date string to a Date object
  const birthDate = new Date(age)
  
  // Get today's date
  const today = new Date()
  
  // Calculate the difference in years
  let years = today.getFullYear() - birthDate.getFullYear()
  
  // Calculate the difference in months
  let months = today.getMonth() - birthDate.getMonth()
  
  // If the current month is before the birth month or
  // if it's the same month but the current day is before the birth day,
  // then subtract a year from the age and adjust the months
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--
    months += 12 // Adjust months
  }
  
  // Adjust months if day of birth is greater than current day
  if (today.getDate() < birthDate.getDate()) {
    months--
  }
  
  // Ensure months is non-negative
  if (months < 0) {
    months += 12
  }
  
  // Return the formatted age string
  return `${years} ${i18_years}${Number(months) > 0 ? `, ${months} ${i18_months}`: ''}`
}
