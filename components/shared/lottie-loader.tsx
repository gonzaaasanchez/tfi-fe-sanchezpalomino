import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import successCat from '../../public/lotie/success-cat.json';
import errorCat from '../../public/lotie/404-cat.json';

interface LottieLoaderProps extends BoxProps {
  type?: 'loading' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({ 
  type = 'loading', 
  size = 'md',
  ...props 
}) => {
  const getLottieFile = () => {
    switch (type) {
      case 'success':
        return successCat;
      case 'error':
        return errorCat;
      default:
        return successCat; // Usar el gato como loading por ahora
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return '100px';
      case 'lg':
        return '300px';
      default:
        return '200px';
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      {...props}
    >
      <Lottie
        animationData={getLottieFile()}
        style={{
          width: getSize(),
          height: getSize(),
        }}
        loop={true}
        autoplay={true}
      />
    </Box>
  );
}; 