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
  useColorModeValue,
} from '@chakra-ui/react';
import { emailPattern } from '@helpers/field-validators';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { AdminFormType } from 'lib/types/forms';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useCreateAdmin, useUpdateAdmin } from '@hooks/use-admins';
import { useGetRoles } from '@hooks/use-roles';
import React from 'react';

interface AdminFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: AdminFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
  id?: string; // Solo para edición
}

export const AdminForm: React.FC<AdminFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
  id,
}) => {
  const t = useTranslations('components.forms.admin');
  const te = useTranslations('general.form.errors');
  const { roles, isPending: isLoadingRoles } = useGetRoles();

  // Memoizar defaultValues para evitar re-renders innecesarios
  const memoizedDefaultValues = React.useMemo(
    () => ({
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      email: defaultValues?.email || '',
      password: defaultValues?.password || '',
      role: '',
    }),
    [defaultValues]
  );

  const methods = useForm<AdminFormType>({
    mode: 'all',
    defaultValues: memoizedDefaultValues,
  });

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
  } = methods;

  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin(id || '');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Establecer el rol cuando los roles se cargan en modo edición
  React.useEffect(() => {
    if (mode === 'edit' && roles && roles.length > 0 && defaultValues?.role) {
      // Filtrar roles no de sistema
      const nonSystemRoles = roles.filter((role) => !role.isSystem);
      const roleExists = nonSystemRoles.some((role) => role.id === defaultValues.role);
      
      if (roleExists) {
        setValue('role', defaultValues.role);
      }
    }
  }, [roles, mode, defaultValues?.role, setValue]);

  const onSubmit = async (data: AdminFormType) => {
    try {
      if (mode === 'edit') {
        // Para edición, solo enviar campos que han cambiado
        const updateData: Partial<AdminFormType> = {};

        if (data.firstName !== defaultValues?.firstName)
          updateData.firstName = data.firstName;
        if (data.lastName !== defaultValues?.lastName)
          updateData.lastName = data.lastName;
        if (data.email !== defaultValues?.email) updateData.email = data.email;
        if (data.role !== defaultValues?.role) updateData.role = data.role;
        // Solo enviar password si se proporciona una nueva contraseña
        if (data.password && data.password.trim() !== '') {
          updateData.password = data.password;
        }

        await updateAdminMutation.mutateAsync(updateData);
      } else {
        // Para creación
        await createAdminMutation.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          roleId: data.role,
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

  const isLoading =
    mode === 'edit'
      ? updateAdminMutation.isPending
      : createAdminMutation.isPending;

  // Memoizar las opciones del select para evitar re-renders
  const roleOptions = React.useMemo(
    () =>
      roles
        ?.filter((role) => !role.isSystem)
        .map((role) => (
          <option
            key={role.id}
            value={role.id}
          >
            {role.name}
          </option>
        )) || [],
    [roles]
  );

  // Memoizar el placeholder para evitar re-renders
  const rolePlaceholder = React.useMemo(
    () => (isLoadingRoles ? t('loading.roles') : t('placeholders.role')),
    [isLoadingRoles, t]
  );

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
          <Heading
            as="h3"
            color="brand1.700"
            size="h3"
            textAlign="center"
            mb={6}
          >
            {title}
          </Heading>
        )}

        <Box
          as="form"
          noValidate
          mt={10}
          onSubmit={handleSubmit(onSubmit)}
        >
          <VStack spacing={4}>
            {/* Name Fields */}
            <HStack
              spacing={4}
              w="full"
            >
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>{t('labels.firstName')}</FormLabel>
                <Input
                  placeholder={t('placeholders.firstName')}
                  {...register('firstName', {
                    required: te('required'),
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
                    required: te('required'),
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
                  pattern: emailPattern(te('email')),
                })}
              />
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            {/* Password - Solo mostrar en modo creación */}
            {mode === 'create' && (
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>{t('labels.password')}</FormLabel>
                <Input
                  type="password"
                  placeholder={t('placeholders.password')}
                  {...register('password', {
                    required: mode === 'create' ? te('required') : false,
                    minLength: {
                      value: 6,
                      message: t('validation.passwordMinLength'),
                    },
                  })}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
            )}

            {/* Role */}
            <FormControl isInvalid={!!errors.role}>
              <FormLabel>{t('labels.role')}</FormLabel>
              <Select
                placeholder={rolePlaceholder}
                {...register('role', {
                  required: te('requiredSelect'),
                })}
                isDisabled={isLoadingRoles}
              >
                {roleOptions}
              </Select>
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.role && errors.role.message}
              </FormErrorMessage>
            </FormControl>

            {/* Action Buttons */}
            <HStack
              spacing={4}
              w="full"
              justify="center"
              pt={4}
            >
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
                loadingText={
                  mode === 'edit'
                    ? t('loading.updating')
                    : t('loading.creating')
                }
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
