import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const titleCase = (str: string) =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getImagePath = (name: string, type: 'hero' | 'troop' | 'spell'): string => {
  const formattedName = name.toLowerCase().replace(/\./g, '').replace(/ /g, '_');
  
  const folders: Record<typeof type, string> = {
    hero: 'heroes',
    troop: 'troops',
    spell: 'troops', // Spells are in the troops folder according to the manifest
  };

  // Special case for hero altars
  if (type === 'hero') {
    return `/images/${folders.hero}/${formattedName}_altar.png`;
  }
  
  return `/images/${folders[type]}/${formattedName}.png`;
};
