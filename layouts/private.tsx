import { Box, useDisclosure, useBreakpointValue } from '@chakra-ui/react';
import { Layout as PrivateLayoutProps } from '@interfaces/layout';
import { Header } from 'components/layout/header';
import Sidebar from 'components/layout/sidebar';

export function PrivateLayout({ children }: PrivateLayoutProps) {
  // Determinar si el sidebar debe estar abierto por defecto basado en el tamaño de pantalla
  const defaultIsOpen = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle, onClose } = useDisclosure({ defaultIsOpen });

  return (
    <Box>
      <Header
        onToggleSidebar={onToggle}
        isSidebarOpen={isOpen}
      />
      <Box display="flex">
        <Sidebar
          isOpen={isOpen}
          onClose={onClose}
        />
        <Box
          ml={{ base: 0, lg: '280px' }}
          w="100%"
          transition="margin-left 0.3s ease-in-out"
        >
          <Box p={4}>
            <Box w="100%">{children}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
