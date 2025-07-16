import React from 'react';
import { Spinner, Center, Container } from '@chakra-ui/react';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  fullHeight?: boolean;
  containerProps?: any;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'xl', 
  color = 'brand1.500',
  fullHeight = false,
  containerProps = {}
}) => {
  const spinner = (
    <Spinner size={size} color={color} />
  );

  if (fullHeight) {
    return (
      <Container maxW="container.lg" height="100vh" py={8} {...containerProps}>
        <Center>
          {spinner}
        </Center>
      </Container>
    );
  }

  return (
    <Center>
      {spinner}
    </Center>
  );
};

export default Loader; 