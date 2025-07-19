import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { InfoIcon } from '@chakra-ui/icons';
import { FilterField, FiltersFormData, FiltersProps } from '../../lib/types/forms';
import { useTranslations } from 'next-intl';

const Filters: React.FC<FiltersProps> = ({
  title,
  filters,
  onSubmit,
  onReset,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FiltersFormData>({
    defaultValues: filters.reduce((acc: FiltersFormData, filter: FilterField) => {
      if (filter.value !== undefined) {
        acc[filter.name] = filter.value;
      }
      return acc;
    }, {} as FiltersFormData),
  });

  const t = useTranslations('components.shared.filters');

  const handleFormSubmit = (data: FiltersFormData) => {
    // Filtrar valores nulos, undefined y strings vacíos
    const cleanFilters = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as FiltersFormData);

    onSubmit(cleanFilters);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  const renderFilterField = (filter: FilterField) => {
    const Component = filter.component;
    const componentProps = filter.componentProps || {};

    return (
      <FormControl key={filter.name} pb={0}>
        <FormLabel
          display="flex"
          alignItems="center"
          gap={2}
          fontSize="sm"
          fontWeight="medium"
          color="gray.700"
        >
          {filter.label}
          {filter.tooltip && (
            <Tooltip
              label={filter.tooltip}
              placement="top"
              hasArrow
              bg="gray.800"
              color="white"
            >
              <Icon
                as={InfoIcon}
                boxSize={3}
                color="gray.400"
                cursor="help"
              />
            </Tooltip>
          )}
        </FormLabel>
        <Controller
          name={filter.name}
          control={control}
          render={({ field }) => (
            <Component
              {...field}
              {...componentProps}
              value={field.value || ''}
              onChange={(value: any) => field.onChange(value)}
            />
          )}
        />
      </FormControl>
    );
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      shadow="sm"
    >
      <VStack spacing={6} align="stretch">
        {title && (
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="brand1.700"
          >
            {title}
          </Text>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} align="stretch">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={4}
              w="full"
            >
              {filters.map(renderFilterField)}
            </SimpleGrid>
            <HStack spacing={3} justify="flex-end">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                size="sm"
              >
                {t('reset')}
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting || loading}
                size="sm"
              >
                {t('apply')}
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Filters;
