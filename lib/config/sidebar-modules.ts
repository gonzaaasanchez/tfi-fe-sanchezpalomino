import { LockIcon } from '@chakra-ui/icons';
import {
  FaUsers,
  FaPaw,
  FaChartBar,
  FaUserShield,
  FaCalendarCheck,
  FaFileAlt,
} from 'react-icons/fa';

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
    icon: FaChartBar,
  },
  {
    name: 'Admins',
    path: '/admins',
    icon: FaUserShield,
    module: 'admins',
    action: 'getAll',
  },
  {
    name: 'Roles',
    path: '/roles',
    icon: LockIcon,
    module: 'roles',
    action: 'getAll',
  },
  {
    name: 'Usuarios',
    path: '/users',
    icon: FaUsers,
    module: 'users',
    action: 'getAll',
  },
  {
    name: 'Tipos de mascota',
    path: '/petTypes',
    icon: FaPaw,
    module: 'petTypes',
    action: 'getAll',
  },
  {
    name: 'Características de mascotas',
    path: '/petCharacteristics',
    icon: FaPaw,
    module: 'petCharacteristics',
    action: 'getAll',
  },
  {
    name: 'Mascotas',
    path: '/pets',
    icon: FaPaw,
    module: 'pets',
    action: 'getAll',
  },
  {
    name: 'Reservas',
    path: '/reservations',
    icon: FaCalendarCheck,
    module: 'reservations',
    action: 'getAll',
  },
  // {
  //   name: 'Reseñas',
  //   path: '/reviews',
  //   icon: ChatIcon,
  //   module: 'reviews',
  //   action: 'getAll',
  // },
  {
    name: 'Logs',
    path: '/logs',
    icon: FaFileAlt,
    module: 'logs',
    action: 'getAll',
  },
];
