import { Box, Container, Flex, VStack } from '@chakra-ui/react';
import { PublicLayout as PublicLayoutProps } from '@interfaces/layout';

export function PublicLayout({
  bg = 'brand1.500',
  bgImage = 'adaptive-icon.png',
  children
}: PublicLayoutProps) {
  return (
    <>
      <VStack bg={bg} h="100dvh" spacing={0}>
        <Flex
          bg={bg}
          flex="1"
          alignItems="center"
          justifyContent="center"
          w="full"
        >
          <Container
            bgImage={{
              lg: `url("/images/${bgImage}")`
            }}
            bgPosition="5.7625rem center"
            bgRepeat="no-repeat"
            bgSize={{
              base: '30.5rem'
            }}
          >
            <Flex
              alignItems="center"
              justifyContent={{
                base: 'center',
                lg: 'end'
              }}
              px={{
                base: 4,
                lg: 20
              }}
              py={4}
              minH={{ base: 'auto', lg: '100vh' }}
            >
              <Box
                bg="white"
                borderRadius="sm"
                p={{
                  base: 4,
                  sm: 12
                }}
                textAlign="center"
                w={{ base: 'full', sm: '33.3125rem' }}
              >
                <Box mt={{ lg: 8 }}>{children}</Box>
              </Box>
            </Flex>
          </Container>
        </Flex>
      </VStack>
    </>
  );
}
