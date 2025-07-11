import { ComponentStyleConfig } from '@chakra-ui/react';

export const Card: ComponentStyleConfig = {
  defaultProps: {
    variant: 'default'
  },
  variants: {
    default: {
      container: {
        border: 'none !important',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: 'lg',
        bg: 'white'
      }
    },
    elevated: {
      container: {
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: 'lg',
        bg: 'white'
      }
    },
    subtle: {
      container: {
        border: 'none',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        borderRadius: 'lg',
        bg: 'white'
      }
    }
  }
}; 