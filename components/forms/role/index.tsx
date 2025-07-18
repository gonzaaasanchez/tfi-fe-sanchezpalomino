import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import {
  useCreateRole,
  useUpdateRole,
  useGetPermissionsTemplate,
} from '@hooks/use-roles';
import { RoleFormType } from 'lib/types/forms';
import { Module, Permission } from 'lib/types/role';

interface RoleFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: RoleFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
}) => {
  const t = useTranslations('components.forms.role');
  const tGeneral = useTranslations('general');

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole(defaultValues?.id || '');
  const { permissionsTemplate, isPending: isTemplateLoading } =
    useGetPermissionsTemplate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const methods = useForm<RoleFormType>({
    mode: 'all',
    defaultValues: defaultValues || {
      name: '',
      description: '',
      permissions: {},
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
    setValue,
  } = methods;

  // Actualizar permisos cuando el template se carga en modo create
  useEffect(() => {
    if (mode === 'create' && permissionsTemplate && !isTemplateLoading) {
      Object.entries(permissionsTemplate).forEach(
        ([moduleName, modulePermissions]) => {
          Object.entries(modulePermissions).forEach(([action, value]) => {
            setValue(`permissions.${moduleName}.${action}`, value);
          });
        }
      );
    }
  }, [mode, permissionsTemplate, isTemplateLoading, setValue]);

  // Función para convertir permisos de booleanos a arrays de strings
  const convertPermissionsToServiceFormat = (
    permissions: RoleFormType['permissions']
  ) => {
    const servicePermissions: any = {};

    Object.keys(permissions).forEach((module) => {
      const modulePermissions = permissions[module as keyof typeof permissions];
      servicePermissions[module] = {};

      Object.keys(modulePermissions).forEach((action) => {
        servicePermissions[module][action] =
          modulePermissions[action as keyof typeof modulePermissions];
      });
    });

    return servicePermissions;
  };

  const onSubmit = async (data: RoleFormType) => {
    try {
      const serviceData = {
        name: data.name,
        description: data.description,
        permissions: convertPermissionsToServiceFormat(data.permissions),
      };

      if (mode === 'edit') {
        await updateRoleMutation.mutateAsync(serviceData);
      } else {
        await createRoleMutation.mutateAsync(serviceData);
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
      ? updateRoleMutation.isPending
      : createRoleMutation.isPending;

  const renderModulePermissions = (
    moduleName: Module,
    modulePermissions: Permission
  ) => {
    const actions = Object.keys(modulePermissions);

    return (
      <Card
        key={moduleName}
        size="sm"
        variant="outline"
      >
        <CardBody p={4}>
          <VStack
            spacing={3}
            align="stretch"
          >
            <Heading
              size="sm"
              color="brand1.700"
            >
              {tGeneral(`permissions.modules.${moduleName}`)}
            </Heading>
            <VStack
              spacing={2}
              align="stretch"
            >
              {actions.map((action) => (
                <HStack
                  key={action}
                  justify="space-between"
                  fontSize="sm"
                >
                  <Text color="gray.600">
                    {tGeneral(`permissions.actions.${action}`)}
                  </Text>
                  <Controller
                    name={`permissions.${moduleName}.${action}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={field.onChange}
                        colorScheme="brand1"
                        size="lg"
                      />
                    )}
                  />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
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
          <VStack spacing={6}>
            {/* Basic Information */}
            <VStack
              spacing={4}
              align="stretch"
              w="full"
            >
              <Heading
                size="sm"
                color="brand1.700"
              >
                {t('sections.basicInfo')}
              </Heading>

              {/* Name */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>{t('labels.name')}</FormLabel>
                <Input
                  placeholder={t('placeholders.name')}
                  {...register('name', {
                    required: t('required'),
                  })}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              {/* Description */}
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>{t('labels.description')}</FormLabel>
                <Textarea
                  placeholder={t('placeholders.description')}
                  {...register('description')}
                  rows={3}
                />
                <FormErrorMessage>
                  <FormErrorIcon me={1} />
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>

            <Divider />

            {/* Permissions */}
            <VStack
              spacing={4}
              align="stretch"
              w="full"
            >
              <Heading
                size="sm"
                color="brand1.700"
              >
                {t('sections.permissions')}
              </Heading>

              {mode === 'create' && isTemplateLoading ? (
                <Text
                  color="gray.500"
                  textAlign="center"
                >
                  Cargando permisos...
                </Text>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={4}
                >
                  {Object.entries(
                    mode === 'create'
                      ? permissionsTemplate || {}
                      : defaultValues?.permissions || {}
                  ).map(([moduleName, modulePermissions]) =>
                    renderModulePermissions(moduleName, modulePermissions)
                  )}
                </SimpleGrid>
              )}
            </VStack>

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
                isDisabled={
                  !isValid ||
                  isLoading ||
                  (mode === 'create' && isTemplateLoading)
                }
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
