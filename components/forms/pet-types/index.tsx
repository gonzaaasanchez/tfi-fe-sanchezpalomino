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
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useCreatePetType, useUpdatePetType } from '@hooks/use-pet-types';

interface PetTypeFormType {
  name: string;
}

interface PetTypeFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: PetTypeFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
  id?: string; // Solo para edición
}

export const PetTypeForm: React.FC<PetTypeFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
  id
}) => {
  const t = useTranslations('components.forms.petType');
  const te = useTranslations('general.form.errors');
  const methods = useForm<PetTypeFormType>({ 
    mode: 'all',
    defaultValues: defaultValues || {
      name: ''
    }
  });
  
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset
  } = methods;

  const createPetTypeMutation = useCreatePetType();
  const updatePetTypeMutation = useUpdatePetType(id || '');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const onSubmit = async (data: PetTypeFormType) => {
    try {
      if (mode === 'edit') {
        await updatePetTypeMutation.mutateAsync(data);
      } else {
        await createPetTypeMutation.mutateAsync(data);
      }
      onSuccess?.();
      if (mode === 'create') {
        reset();
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = mode === 'edit' ? updatePetTypeMutation.isPending : createPetTypeMutation.isPending;

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
            {/* Name */}
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('labels.name')}</FormLabel>
              <Input
                placeholder={t('placeholders.name')}
                {...register('name', {
                  required: te('required')
                })}
              />
              <FormErrorMessage>
                <FormErrorIcon me={1} />
                {errors.name && errors.name.message}
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