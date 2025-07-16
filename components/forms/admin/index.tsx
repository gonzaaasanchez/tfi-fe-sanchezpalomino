import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { emailPattern } from '@helpers/field-validators';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { AdminFormType } from 'lib/types/forms';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useCreateAdmin } from '@hooks/use-admins';

interface AdminFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: AdminFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
  updateMutation?: any;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
  updateMutation
}) => {
  const t = useTranslations('components.forms.admin');
  const te = useTranslations('general.form.errors');
  const methods = useForm<AdminFormType>({ 
    mode: 'all',
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'admin'
    }
  });
  
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset
  } = methods;

  const createAdminMutation = useCreateAdmin();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const onSubmit = async (data: AdminFormType) => {
    try {
      if (mode === 'edit' && updateMutation) {
        // Para edición, solo enviar campos que han cambiado
        const updateData: any = {};
        if (data.firstName !== defaultValues?.firstName) updateData.firstName = data.firstName;
        if (data.lastName !== defaultValues?.lastName) updateData.lastName = data.lastName;
        if (data.email !== defaultValues?.email) updateData.email = data.email;
        if (data.password) updateData.password = data.password; // Solo si se proporciona nueva contraseña
        if (data.role !== defaultValues?.role) updateData.roleId = data.role;

        await updateMutation.mutateAsync(updateData);
      } else {
        // Para creación
        await createAdminMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: data.role
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

            {/* Password */}
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

            {/* Role */}
            <FormControl isInvalid={!!errors.role}>
              <FormLabel>{t('labels.role')}</FormLabel>
              <Select
                placeholder={t('placeholders.role')}
                {...register('role', {
                  required: te('requiredSelect')
                })}
              >
                <option value="admin">Administrador</option>
              </Select>
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.role && errors.role.message}
              </FormErrorMessage>
            </FormControl>

            {/* Action Buttons */}
            <HStack spacing={4} w="full" justify="center" pt={4}>
              <Button
                variant="outline"
                onClick={onCancel}
                isDisabled={createAdminMutation.isPending || (updateMutation?.isPending)}
              >
                {t('cta.cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={createAdminMutation.isPending || (updateMutation?.isPending)}
                isDisabled={!isValid || createAdminMutation.isPending || (updateMutation?.isPending)}
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
