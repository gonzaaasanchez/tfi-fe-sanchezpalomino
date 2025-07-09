import { ComponentStyleConfig } from '@chakra-ui/react';

export const NumberInput: ComponentStyleConfig = {
  defaultProps: {
    variant: 'default'
  },
  variants: {
    default: {
      field: {
        backgroundColor: 'white',
        borderColor: 'gray.200',
        borderRadius: 'xs',
        borderWidth: '1px',
        color: 'black',
        fontSize: 'sm',
        lineHeight: 'lg',
        padding: '0.625rem', // 10px,
        _invalid: {
          borderColor: 'red.500'
        },
        '&::placeholder': {
          color: 'gray.400',
          opacity: 1
        }
      }
    }
  }
};
