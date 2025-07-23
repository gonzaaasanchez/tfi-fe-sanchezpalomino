import { useTranslations } from 'next-intl';

export const useSidebarTranslations = () => {
  const t = useTranslations('general.sidebar');
  
  return {
    getModuleName: (moduleKey: string): string => {
      return t(moduleKey, { fallback: moduleKey });
    }
  };
}; 