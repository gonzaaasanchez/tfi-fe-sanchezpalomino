import { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  defaultProps: {
    variant: 'primary',
    size: 'sm',
  },
  variants: {
    primary: {
      bg: 'brand1.700',
      color: 'white',
      _hover: {
        bg: 'brand1.800',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      },
      _active: {
        bg: 'brand1.900',
        transform: 'translateY(0)'
      },
      _focus: {
        boxShadow: '0 0 0 3px var(--chakra-colors-brand1-600)'
      },
      _disabled: {
        _hover: {
          bg: 'brand1.500 !important',
          transform: 'translateY(-1px) !important',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15) !important'
        }
      }
    },
    secondary: {
      bg: 'gray.100',
      color: 'gray.800',
      border: '1px solid',
      borderColor: 'gray.200',
      _hover: {
        bg: 'gray.200',
        borderColor: 'gray.300'
      },
      _active: {
        bg: 'gray.300'
      }
    },
    outline: {
      bg: 'transparent',
      color: 'brand1.700',
      border: '1px solid',
      borderColor: 'brand1.700',
      _hover: {
        bg: 'brand1.50',
        borderColor: 'brand1.800'
      },
      _active: {
        bg: 'brand1.100'
      }
    },
    ghost: {
      bg: 'transparent',
      color: 'brand1.700',
      _hover: {
        bg: 'brand1.50'
      },
      _active: {
        bg: 'brand1.100'
      }
    }
  },
  sizes: {
    sm: {
      px: 3,
      py: 2,
      fontSize: 'sm'
    },
    md: {
      px: 4,
      py: 2,
      fontSize: 'md'
    },
    lg: {
      px: 6,
      py: 3,
      fontSize: 'lg'
    }
  }
}; 