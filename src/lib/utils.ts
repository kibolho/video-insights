import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null) {
  let initials = ""
  if(!name) return initials
  for (let i = 0; i < name.length - 2; i++){
    if (name[i] == ' ')
      initials+= name[i + 1].toUpperCase()
    if(i==0){
      initials+= name[i].toUpperCase()
    }
  }
  return initials
}