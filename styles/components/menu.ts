import { ComponentStyleConfig } from '@chakra-ui/react';

export const Menu: ComponentStyleConfig = {
  baseStyle: {
    list: {
      bg: 'white',
      border: '1px solid',
      borderColor: 'gray.300',
      borderRadius: 'xs',
      boxShadow: 'none'
    },
    item: {
      bg: 'white',
      fontSize: 'xs',
      _hover: {
        background: 'gray.100'
      }
    }
  }
};
