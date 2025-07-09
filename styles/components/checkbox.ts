import { ComponentStyleConfig } from '@chakra-ui/react';

export const Checkbox: ComponentStyleConfig = {
  defaultProps: {
    colorScheme: 'brand1.500',
    size: 'md'
  },
  variants: {
    square: {
      control: {
        borderRadius: '0'
      }
    }
  }
};
