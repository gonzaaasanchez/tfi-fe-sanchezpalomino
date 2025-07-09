import React, { ReactNode } from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  IconProps
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
  modules?: Module[]; // Hacer opcional para mantener compatibilidad
  logo?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ modules, logo }) => {
  const router = useRouter();
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  // Filtrar módulos basado en permisos
  const filteredModules = sidebarModules.filter((module: SidebarModule) => {
    // Si no tiene módulo/acción definidos, siempre mostrar
    if (!module.module || !module.action) return true;
    
    // Super admin puede ver todo
    if (isSuperAdmin()) return true;
    
    // Verificar permisos específicos
    return hasPermission(module.module, module.action);
  });

  const handleModuleClick = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      bg="brand1.700"
      color="white"
      w="280px"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
      zIndex={10}
    >
      <VStack spacing={0} align="stretch">
        {/* Logo */}
        <Box p={6} borderBottom="1px" borderColor="gray.700">
          {logo}
        </Box>

        {/* Navigation Modules */}
        <VStack spacing={1} align="stretch" p={4}>
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
                  bg: isActive ? "white" : "brand1.700",
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
  );
};

export default Sidebar; 