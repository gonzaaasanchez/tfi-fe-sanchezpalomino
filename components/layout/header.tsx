import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  Image,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { FaSignOutAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useLogout } from 'lib/hooks/use-auth';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { data: session } = useSession();
  const t = useTranslations('layouts.private.header');
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const bgColor = 'brand1.700';

  const getUserFullName = () => {
    const { firstName, lastName } = session?.user || {};
    return `${firstName} ${lastName}`.trim() || '';
  };

  return (
    <Box
      bg={bgColor}
      px={6}
      py={4}
      position="sticky"
      top={0}
      zIndex={999}
      width="100%"
    >
      <Flex
        justify="space-between"
        align="center"
      >
        {/* Logo - Siempre visible */}
        <Box
          display="flex"
          alignItems="center"
        >
          <Image
            src="/images/adaptive-icon.png"
            alt="Logo"
            height="40px"
            width="auto"
            objectFit="contain"
          />
        </Box>

        {/* Controles de usuario a la derecha */}
        <Flex
          align="center"
          gap={2}
        >
          {/* Botón hamburguesa - Solo visible en mobile */}
          <IconButton
            aria-label={t('toggleSidebar')}
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
            display={{ base: 'flex', lg: 'none' }}
            onClick={onToggleSidebar}
            _hover={{ bg: 'brand1.600' }}
            _active={{ bg: 'brand1.600' }}
          />

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<ChevronDownIcon />}
              display="flex"
              alignItems="center"
              color="white"
              _hover={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
            >
              <Avatar
                size="sm"
                name={getUserFullName()}
                bg="brand1.500"
                color="white"
                fontWeight="bold"
              />
            </MenuButton>
            <MenuList minW="140px">
              <MenuItem
                onClick={() => logout()}
                color="gray.900"
                justifyContent="center"
                icon={<Icon as={FaSignOutAlt} color="brand1.600" boxSize={4} />}
                isDisabled={isLoggingOut}
              >
                {isLoggingOut ? t('signingOut') : t('signOut')}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};
