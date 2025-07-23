import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { AuthService, ForgotPasswordRequest, ResetPasswordRequest } from '../services/auth';
import { useCustomToast } from './use-custom-toast';
import { useTranslations } from 'next-intl';

export const useLogout = () => {
  const { errorToast, successToast } = useCustomToast();
  const t = useTranslations('general.auth.logout');

  return useMutation({
    mutationFn: () => AuthService.logout(),
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

export const useForgotPassword = () => {
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.auth');

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => AuthService.forgotPassword(data),
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.forgotPasswordError');
      errorToast(message);
    },
  });
};

export const useResetPassword = () => {
  const { errorToast } = useCustomToast();
  const t = useTranslations('lib.hooks.auth');

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
    onError: (error: any) => {
      const message = error.response?.data?.message || t('responses.resetPasswordError');
      errorToast(message);
    },
  });
};
