import { ComponentStyleConfig } from '@chakra-ui/react';

export const Select: ComponentStyleConfig = {
  baseStyle: {
    field: {
      bg: 'white',
      border: '1px solid',
      borderColor: 'gray.200',
      borderRadius: 'md',
      fontSize: 'sm',
      _placeholder: {
        color: 'gray.400',
        fontSize: 'sm',
      },
      _hover: {
        borderColor: 'brand1.600',
      },
      _focus: {
        borderColor: 'brand1.600 !important',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand1-600) !important',
      },
      _invalid: {
        borderColor: 'red.500',
        boxShadow: '0 0 0 1px var(--chakra-colors-red-500)',
      },
    },
    icon: {
      color: 'gray.400',
      fontSize: 'sm',
    },
  },
  variants: {
    filled: {
      field: {
        bg: 'gray.50',
        _hover: {
          bg: 'gray.100',
        },
        _focus: {
          bg: 'white',
        },
      },
    },
  },
  defaultProps: {
    variant: 'outline',
  },
};
