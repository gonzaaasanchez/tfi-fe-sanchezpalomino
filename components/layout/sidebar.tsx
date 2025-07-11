import React, { ReactNode } from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  IconProps,
  useDisclosure,
  SlideFade
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { sidebarModules, SidebarModule } from '../../lib/config/sidebar-modules';
import { usePermissions } from '@hooks/use-permissions';

interface Module {
  name: string;
  path: string;
  icon?: React.ComponentType<IconProps> | ReactNode;
}

interface SidebarProps {
  modules?: Module[]; // Make optional to maintain compatibility
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ modules, isOpen = true, onClose }) => {
  const router = useRouter();
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  // Filter modules based on permissions
  const filteredModules = sidebarModules.filter((module: SidebarModule) => {
    // If no module/action defined, always show
    if (!module.module || !module.action) return true;
    
    // Super admin can see everything
    if (isSuperAdmin()) return true;
    
    // Check specific permissions
    return hasPermission(module.module, module.action);
  });

  const handleModuleClick = (path: string) => {
    router.push(path);
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={20}
          display={{ base: 'block', lg: 'none' }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <Box
        bg="brand1.700"
        color="white"
        w={{ base: '280px', lg: '280px' }}
        h="100vh"
        position="fixed"
        left={{ base: 'auto', lg: 0 }}
        right={{ base: 0, lg: 'auto' }}
        top={0}
        overflowY="auto"
        zIndex={25}
        transform={{
          base: isOpen ? 'translateX(0)' : 'translateX(100%)',
          lg: 'translateX(0)'
        }}
        transition="transform 0.3s ease-in-out"
        boxShadow={{
          base: isOpen ? '2xl' : 'none',
          lg: 'none'
        }}
      >
        <VStack spacing={0} align="stretch">
          {/* Navigation Modules */}
          <VStack spacing={1} align="stretch" p={4} mt={{ base: "4rem", lg: "4.57rem" }}>
            {filteredModules.map((module: SidebarModule) => {
              const isActive = router.pathname === module.path;
              const IconComponent = module.icon;

              return (
                <Flex
                  key={module.path}
                  align="center"
                  p={3}
                  borderRadius="md"
                  cursor="pointer"
                  bg={isActive ? "white" : 'transparent'}
                  color={isActive ? "brand1.700" : "white"}
                  _hover={{
                    bg: isActive ? "white" : "brand1.600",
                    color: isActive ? "brand1.700" : "white"
                  }}
                  onClick={() => handleModuleClick(module.path)}
                  transition="all 0.2s"
                >
                  {IconComponent && (
                    <Icon as={IconComponent} mr={3} boxSize={5} />
                  )}
                  <Text fontSize="sm" fontWeight="medium">
                    {module.name}
                  </Text>
                </Flex>
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </>
  );
};

export default Sidebar; 