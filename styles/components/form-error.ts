import { ComponentStyleConfig } from '@chakra-ui/react';

export const FormError: ComponentStyleConfig = {
  baseStyle: {
    text: {
      color: 'red.500',
      maxW: 'calc(100% - 40px)',
      fontSize: 'xxs',
      fontWeight: 'bold',
      lineHeight: 'xxs',
      marginTop: 2,
      position: 'absolute',
      textAlign: 'left'
    }
  }
};
