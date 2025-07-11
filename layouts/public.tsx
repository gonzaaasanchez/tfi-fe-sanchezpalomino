import { Box, Flex, Image } from '@chakra-ui/react';
import { PublicLayout as PublicLayoutProps } from '@interfaces/layout';

export function PublicLayout({
  bg = 'brand1.500',
  bgImage = 'adaptive-icon.png',
  children
}: PublicLayoutProps) {
  return (
    <Box minH="100vh" bg={bg}>
      <Flex
        minH="100vh"
        alignItems="center"
        justifyContent="center"
        w="full"
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 6, lg: 16 }}
        px={{ base: 4, sm: 6, lg: 0 }}
      >
        {/* Imagen visible, nunca de fondo */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={{ base: 4, lg: 0 }}
          mr={{ base: 0, lg: 8 }}
          pl={{ base: 0, lg: 24 }}
          flexShrink={0}
        >
          <Image
            src={`/images/${bgImage}`}
            alt="Gato login"
            maxW={{ base: '220px', sm: '300px', lg: '380px' }}
            w="100%"
            h="auto"
            objectFit="contain"
          />
        </Box>
        <Box
          bg="white"
          borderRadius={{ base: 'md', sm: 'lg' }}
          p={{ base: 8, md: 12 }}
          textAlign="center"
          w="full"
          maxW={{ base: '90vw', md: '33.3125rem' }}
          boxShadow={{ base: 'lg', md: 'xl' }}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
}
