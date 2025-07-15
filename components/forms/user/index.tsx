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
import { UserFormType } from 'lib/types/forms';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useCreateUser } from '@hooks/use-users';

interface UserFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: UserFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
  updateMutation?: any;
}

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
  updateMutation
}) => {
  const t = useTranslations('components.forms.user');
  const te = useTranslations('general.form.errors');
  const methods = useForm<UserFormType>({ 
    mode: 'all',
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user'
    }
  });
  
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset
  } = methods;

  const createUserMutation = useCreateUser();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const onSubmit = async (data: UserFormType) => {
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
        await createUserMutation.mutateAsync({
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
                <FormLabel>Nombre</FormLabel>
                <Input
                  placeholder="Ingrese el nombre"
                  {...register('firstName', {
                    required: 'El nombre es requerido'
                  })}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Apellido</FormLabel>
                <Input
                  placeholder="Ingrese el apellido"
                  {...register('lastName', {
                    required: 'El apellido es requerido'
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
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Ingrese el email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: emailPattern('Email inválido')
                })}
              />
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            {/* Password */}
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="Ingrese la contraseña"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
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
              <FormLabel>Rol</FormLabel>
              <Select
                placeholder="Seleccione el rol"
                {...register('role', {
                  required: 'El rol es requerido'
                })}
              >
                <option value="user">Usuario</option>
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
                isDisabled={createUserMutation.isPending || (updateMutation?.isPending)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={createUserMutation.isPending || (updateMutation?.isPending)}
                isDisabled={!isValid || createUserMutation.isPending || (updateMutation?.isPending)}
                loadingText={mode === 'edit' ? 'Actualizando...' : 'Creando...'}
              >
                {mode === 'edit' ? 'Actualizar Usuario' : 'Crear Usuario'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </FormProvider>
  );
}; 