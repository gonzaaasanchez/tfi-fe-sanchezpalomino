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
  email: string;
}

interface ChangePasswordFormData {
  verificationCode: string;
  newPassword: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const t = useTranslations('lib.shared.changePassword');
  const te = useTranslations('general.form.errors');
  const toast = useToast();
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    mode: 'all',
    defaultValues: {
      verificationCode: '',
      newPassword: '',
    },
  });

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const handleSendCode = async () => {
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setIsCodeSent(true);
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
      await forgotPasswordMutation.mutateAsync({ email });
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

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email,
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

  // Auto-send code when modal opens
  React.useEffect(() => {
    if (isOpen && email && !isCodeSent) {
      handleSendCode();
    }
  }, [isOpen, email]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader fontSize="lg" py={6}>
          {t('title')}
          <ModalCloseButton top={6} />
        </ModalHeader>
        <ModalBody pb={8} px={6}>
          <VStack spacing={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
              {t('description')}
            </Text>

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
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 