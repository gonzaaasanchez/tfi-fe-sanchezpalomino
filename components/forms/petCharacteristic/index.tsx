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
import { PetCharacteristicFormType } from 'lib/types/forms';
import { FormErrorIcon } from 'components/icons/src/form-error-icon';
import { useCreatePetCharacteristic, useUpdatePetCharacteristic } from '@hooks/use-pet-characteristics';

interface PetCharacteristicFormProps {
  mode: 'create' | 'edit';
  title?: string;
  defaultValues?: PetCharacteristicFormType;
  onSuccess?: () => void;
  onCancel?: () => void;
  id?: string; // Solo para edición
}

export const PetCharacteristicForm: React.FC<PetCharacteristicFormProps> = ({
  mode,
  title,
  defaultValues,
  onSuccess,
  onCancel,
  id
}) => {
  const t = useTranslations('components.forms.petCharacteristic');
  const te = useTranslations('general.form.errors');
  const methods = useForm<PetCharacteristicFormType>({ 
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

  const createPetCharacteristicMutation = useCreatePetCharacteristic();
  const updatePetCharacteristicMutation = useUpdatePetCharacteristic(id || '');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const onSubmit = async (data: PetCharacteristicFormType) => {
    try {
      if (mode === 'edit') {
        // Para edición, solo enviar campos que han cambiado
        const updateData: any = {};
        if (data.name !== defaultValues?.name) updateData.name = data.name;

        await updatePetCharacteristicMutation.mutateAsync(updateData);
      } else {
        // Para creación
        await createPetCharacteristicMutation.mutateAsync({
          name: data.name
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

  const isLoading = mode === 'edit' ? updatePetCharacteristicMutation.isPending : createPetCharacteristicMutation.isPending;

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
            {/* Name Field */}
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