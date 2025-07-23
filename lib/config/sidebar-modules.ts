import { LockIcon, SettingsIcon } from '@chakra-ui/icons';
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
    name: 'dashboard',
    path: '/dashboard',
    icon: FaChartBar,
    module: 'dashboard',
  },
  {
    name: 'admins',
    path: '/admins',
    icon: FaUserShield,
    module: 'admins',
    action: 'getAll',
  },
  {
    name: 'roles',
    path: '/roles',
    icon: LockIcon,
    module: 'roles',
    action: 'getAll',
  },
  {
    name: 'users',
    path: '/users',
    icon: FaUsers,
    module: 'users',
    action: 'getAll',
  },
  {
    name: 'petTypes',
    path: '/petTypes',
    icon: FaPaw,
    module: 'petTypes',
    action: 'getAll',
  },
  {
    name: 'petCharacteristics',
    path: '/petCharacteristics',
    icon: FaPaw,
    module: 'petCharacteristics',
    action: 'getAll',
  },
  {
    name: 'pets',
    path: '/pets',
    icon: FaPaw,
    module: 'pets',
    action: 'getAll',
  },
  {
    name: 'reservations',
    path: '/reservations',
    icon: FaCalendarCheck,
    module: 'reservations',
    action: 'getAll',
  },
  {
    name: 'settings',
    path: '/settings',
    icon: SettingsIcon,
    module: 'settings',
    action: 'getAll',
  },
  // {
  //   name: 'Reseñas',
  //   path: '/reviews',
  //   icon: ChatIcon,
  //   module: 'reviews',
  //   action: 'getAll',
  // },
  // {
  //   name: 'Logs',
  //   path: '/logs',
  //   icon: FaFileAlt,
  //   module: 'logs',
  //   action: 'getAll',
  // },
];
