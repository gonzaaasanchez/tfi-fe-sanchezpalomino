import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useForgotPassword, useResetPassword } from 'lib/hooks/use-auth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  mode?: 'change' | 'recover';
}

interface ChangePasswordFormData {
  email?: string;
  verificationCode: string;
  newPassword: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  mode = 'change',
}) => {
  const t = useTranslations('lib.shared.changePassword');
  const tRecover = useTranslations('lib.shared.recoverPassword');
  const te = useTranslations('general.form.errors');
  const toast = useToast();
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(email || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    mode: 'all',
    defaultValues: {
      email: email || '',
      verificationCode: '',
      newPassword: '',
    },
  });

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const handleSendCode = async (emailToUse?: string) => {
    const emailAddress = emailToUse || currentEmail;
    try {
      await forgotPasswordMutation.mutateAsync({ email: emailAddress });
      setIsCodeSent(true);
      setCurrentEmail(emailAddress);
      toast({
        title: t('responses.codeSent'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleResendCode = async () => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: currentEmail });
      toast({
        title: t('responses.codeResent'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEmailSubmit = async (data: ChangePasswordFormData) => {
    if (data.email) {
      await handleSendCode(data.email);
    }
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email: currentEmail,
        code: data.verificationCode,
        newPassword: data.newPassword,
      });
      
      toast({
        title: t('responses.passwordChanged'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form and close modal
      reset();
      setIsCodeSent(false);
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    reset();
    setIsCodeSent(false);
    onClose();
  };

  // Auto-send code when modal opens (only for change mode with email)
  React.useEffect(() => {
    if (isOpen && mode === 'change' && email && !isCodeSent) {
      handleSendCode();
    }
  }, [isOpen, email, mode]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader fontSize="lg" py={6}>
          {mode === 'recover' ? tRecover('title') : t('title')}
          <ModalCloseButton top={6} />
        </ModalHeader>
        <ModalBody pb={8} px={6}>
          <VStack spacing={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
              {mode === 'recover' ? tRecover('description') : t('description')}
            </Text>

            {mode === 'recover' && !isCodeSent ? (
              // Email input step for recovery mode
              <form onSubmit={handleSubmit(handleEmailSubmit)}>
                <VStack spacing={4} align="stretch">
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>{tRecover('labels.email')}</FormLabel>
                    <Input
                      placeholder={tRecover('placeholders.email')}
                      {...register('email', {
                        required: te('required'),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: te('email'),
                        },
                      })}
                    />
                    <FormErrorMessage>
                      <FormErrorIcon me={1} />
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand1"
                    isDisabled={!watch('email')}
                    isLoading={forgotPasswordMutation.isPending}
                  >
                    {tRecover('actions.sendCode')}
                  </Button>
                </VStack>
              </form>
            ) : (
              // Code and password input step
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} align="stretch">
                  {/* Code Field */}
                  <FormControl isInvalid={!!errors.verificationCode}>
                    <FormLabel>{t('labels.code')}</FormLabel>
                    <Input
                      placeholder={t('placeholders.code')}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      {...register('verificationCode', {
                        required: te('required'),
                        pattern: {
                          value: /^\d{6}$/,
                          message: t('validation.codePattern'),
                        },
                      })}
                    />
                    <FormErrorMessage>
                      <FormErrorIcon me={1} />
                      {errors.verificationCode && errors.verificationCode.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* New Password Field */}
                  <FormControl isInvalid={!!errors.newPassword}>
                    <FormLabel>{t('labels.newPassword')}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t('placeholders.newPassword')}
                      {...register('newPassword', {
                        required: te('required'),
                        minLength: {
                          value: 6,
                          message: t('validation.passwordMinLength'),
                        },
                          //   pattern: {
                          //     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          //     message: t('validation.passwordPattern'),
                          //   },
                      })}
                    />
                    <FormErrorMessage>
                      <FormErrorIcon me={1} />
                      {errors.newPassword && errors.newPassword.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Action Buttons */}
                  <HStack spacing={3} justify="center">
                    <Button
                      variant="outline"
                      onClick={handleResendCode}
                      isLoading={forgotPasswordMutation.isPending}
                      size="sm"
                    >
                      {t('actions.resendCode')}
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="brand1"
                      isDisabled={!isValid}
                      isLoading={resetPasswordMutation.isPending}
                    >
                      {t('actions.submit')}
                    </Button>
                  </HStack>
                </VStack>
              </form>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 