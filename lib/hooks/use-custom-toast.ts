import { useToast } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  const successToast = (description: string, title: string = '') => {
    toast({
      title,
      description,
      status: 'success',
      duration: 7000,
      isClosable: true
    });
  };

  const errorToast = (description: string, title: string = '') => {
    toast({
      title,
      description,
      status: 'error',
      duration: 7000,
      isClosable: true
    });
  };

  return { successToast, errorToast };
};

export { useCustomToast };
