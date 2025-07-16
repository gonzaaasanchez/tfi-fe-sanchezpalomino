import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { emailPattern } from '@helpers/field-validators';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { UserFormType } from 'lib/types/forms';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useCreateUser, useUpdateUser } from '@hooks/use-users';
import { SYSTEM_ROLES } from 'lib/constants/roles';

interface UserFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: UserFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
  id?: string; // Solo para edición
}

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
  id
}) => {
  const t = useTranslations('components.forms.user');
  const te = useTranslations('general.form.errors');
  const methods = useForm<UserFormType>({ 
    mode: 'all',
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: mode === 'create' ? '' : undefined
    }
  });
  
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset
  } = methods;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(id || '');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const onSubmit = async (data: UserFormType) => {
    try {
      if (mode === 'edit') {
        // Para edición, solo enviar campos que han cambiado (sin password ni rol)
        const updateData: any = {};
        if (data.firstName !== defaultValues?.firstName) updateData.firstName = data.firstName;
        if (data.lastName !== defaultValues?.lastName) updateData.lastName = data.lastName;
        if (data.email !== defaultValues?.email) updateData.email = data.email;
        if (data.phoneNumber !== defaultValues?.phoneNumber) updateData.phoneNumber = data.phoneNumber;

        await updateUserMutation.mutateAsync(updateData);
      } else {
        // Para creación - Asignar automáticamente el rol "user" del sistema
        await createUserMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password!, // Requerido para creación
          role: SYSTEM_ROLES.USER // TODO: Obtener este ID dinámicamente del sistema
        });
      }

      onSuccess?.();
      if (mode === 'create') {
        reset();
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = mode === 'edit' ? updateUserMutation.isPending : createUserMutation.isPending;

  return (
    <FormProvider {...methods}>
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
        shadow="sm"
      >
        {title && (
          <Heading as="h3" color="brand1.700" size="h3" textAlign="center" mb={6}>
            {title}
          </Heading>
        )}
        
        <Box as="form" noValidate mt={10} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            {/* Name Fields */}
            <HStack spacing={4} w="full">
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>{t('labels.firstName')}</FormLabel>
                <Input
                  placeholder={t('placeholders.firstName')}
                  {...register('firstName', {
                    required: te('required')
                  })}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>{t('labels.lastName')}</FormLabel>
                <Input
                  placeholder={t('placeholders.lastName')}
                  {...register('lastName', {
                    required: te('required')
                  })}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            {/* Email */}
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>{t('labels.email')}</FormLabel>
              <Input
                placeholder={t('placeholders.email')}
                {...register('email', {
                  required: te('required'),
                  pattern: emailPattern(te('email'))
                })}
              />
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            {/* Password - Solo visible en modo creación */}
            {mode === 'create' && (
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>{t('labels.password')}</FormLabel>
                <Input
                  type="password"
                  placeholder={t('placeholders.password')}
                  {...register('password', {
                    required: te('required'),
                    minLength: {
                      value: 6,
                      message: t('validation.passwordMinLength')
                    }
                  })}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
            )}

            {/* Phone Number */}
            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>{t('labels.phoneNumber')}</FormLabel>
              <Input
                placeholder={t('placeholders.phoneNumber')}
                {...register('phoneNumber')}
              />
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>

            {/* Action Buttons */}
            <HStack spacing={4} w="full" justify="center" pt={4}>
              <Button
                variant="outline"
                onClick={onCancel}
                isDisabled={isLoading}
              >
                {t('cta.cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
                loadingText={mode === 'edit' ? t('loading.updating') : t('loading.creating')}
              >
                {mode === 'edit' ? t('cta.update') : t('cta.create')}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </FormProvider>
  );
}; 