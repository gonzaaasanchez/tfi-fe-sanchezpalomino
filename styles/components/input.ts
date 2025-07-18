import { ComponentStyleConfig } from '@chakra-ui/react';

export const Input: ComponentStyleConfig = {
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
  },
  variants: {
    outline: {
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
    },
    filled: {
      field: {
        bg: 'gray.50',
        border: '1px solid',
        borderColor: 'gray.200',
        borderRadius: 'md',
        fontSize: 'sm',
        _placeholder: {
          color: 'gray.400',
          fontSize: 'sm',
        },
        _hover: {
          bg: 'gray.100',
          borderColor: 'brand1.600',
        },
        _focus: {
          bg: 'white',
          borderColor: 'brand1.600 !important',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand1-600) !important',
        },
        _invalid: {
          borderColor: 'red.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-red-500)',
        },
      },
    },
  },
  defaultProps: {
    variant: 'outline',
  },
};
