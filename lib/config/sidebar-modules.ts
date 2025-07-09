import {
  ViewIcon,
  SettingsIcon,
  InfoIcon,
  ChatIcon,
  CalendarIcon,
  StarIcon,
  CheckCircleIcon,
  HamburgerIcon,
  AtSignIcon,
  LockIcon
} from '@chakra-ui/icons';

export interface SidebarModule {
  name: string;
  path: string;
  icon?: React.ComponentType<any>;
  module?: string;
  action?: string;
}

export const sidebarModules: SidebarModule[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: ViewIcon
  },
  {
    name: 'Admins',
    path: '/admin',
    icon: AtSignIcon,
    module: 'admins',
    action: 'read'
  },
  {
    name: 'Roles',
    path: '/roles',
    icon: LockIcon,
    module: 'roles',
    action: 'read'
  },
  {
    name: 'Usuarios',
    path: '/users',
    icon: HamburgerIcon,
    module: 'users',
    action: 'read'
  },
  {
    name: 'Mascotas',
    path: '/pets',
    icon: StarIcon,
    module: 'pets',
    action: 'read'
  },
  {
    name: 'Reservas',
    path: '/reservations',
    icon: CalendarIcon,
    module: 'reservations',
    action: 'read'
  },
  {
    name: 'Reseñas',
    path: '/reviews',
    icon: ChatIcon,
    module: 'reviews',
    action: 'read'
  },
  {
    name: 'Logs',
    path: '/logs',
    icon: InfoIcon,
    module: 'logs',
    action: 'read'
  }
]; 