import { useTranslations } from 'next-intl';

export const getConfigDisplayName = (key: string, t: any): string => {
  // Try to get the localized name first
  const localizedName = t(key, { fallback: null });
  
  // If localized name exists, return it
  if (localizedName && localizedName !== key) {
    return localizedName;
  }
  
  // Fallback: convert key to a more readable format
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useConfigDisplayName = () => {
  const t = useTranslations('general.configKeys');
  
  return (key: string): string => {
    return getConfigDisplayName(key, t);
  };
}; 