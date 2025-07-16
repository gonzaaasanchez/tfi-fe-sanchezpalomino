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
    path: '/admins',
    icon: AtSignIcon,
    module: 'admins',
    action: 'getAll'
  },
  {
    name: 'Roles',
    path: '/roles',
    icon: LockIcon,
    module: 'roles',
    action: 'getAll'
  },
  {
    name: 'Usuarios',
    path: '/users',
    icon: HamburgerIcon,
    module: 'users',
    action: 'getAll'
  },
  {
    name: 'Mascotas',
    path: '/pets',
    icon: StarIcon,
    module: 'pets',
    action: 'getAll'
  },
  {
    name: 'Tipos de mascota',
    path: '/petTypes',
    icon: CheckCircleIcon,
    module: 'petTypes',
    action: 'getAll'
  },
  {
    name: 'Reservas',
    path: '/reservations',
    icon: CalendarIcon,
    module: 'reservations',
    action: 'getAll'
  },
  {
    name: 'Reseñas',
    path: '/reviews',
    icon: ChatIcon,
    module: 'reviews',
    action: 'getAll'
  },
  {
    name: 'Logs',
    path: '/logs',
    icon: InfoIcon,
    module: 'logs',
    action: 'getAll'
  }
]; 