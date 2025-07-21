import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { logout } from '../services/admin';
import { useCustomToast } from './use-custom-toast';
import { useTranslations } from 'next-intl';

export const useLogout = () => {
  const { errorToast, successToast } = useCustomToast();
  const t = useTranslations('general.auth.logout');

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      successToast(t('success'));
      signOut({ callbackUrl: '/auth/login' });
    },
    onError: (error: any) => {
      // Log the error but still sign out locally
      console.error('Logout error:', error);
      const message = error.response?.data?.message || t('error');
      errorToast(message);

      // Force local sign out even if backend fails
      signOut({ callbackUrl: '/auth/login' });
    },
  });
};
