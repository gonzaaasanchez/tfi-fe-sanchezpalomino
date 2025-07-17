import { ReactNode } from 'react';
import { PaginationMetadata } from './response';

// Basic types for table component
export interface Column {
  key: string;
  label: ReactNode;
  type?: 'date' | 'custom' | 'text' | 'badge';
  dateFormat?: string;
  sortable?: boolean;
  sortDirection?: 'ASC' | 'DESC';
  sortKey?: string;
  className?: string;
  renderCell?: (item: any) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Action {
  name: string;
  label: string;
  icon?: ReactNode;
  color?: string;
  variant?: 'ghost' | 'solid' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  isDisabled?: (item: any) => boolean;
  tooltip?: string;
}

export interface TableProps {
  rows: any[];
  columns: Column[];
  actions?: Action[];
  loading?: boolean;
  emptyText?: string;
  metadata?: PaginationMetadata;
  module?: string;
  shadow?: boolean;
  showEmpty?: boolean;
  rowClassFn?: (item: any) => string;
  onAction?: (actionName: string, item: any) => void;
  onChangePage?: (page: number) => void;
  onSort?: (key: string, direction: 'ASC' | 'DESC') => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

// Extended types for specific cases
export interface SortableColumn extends Column {
  sortable: true;
  sortKey: string;
}

export interface DateColumn extends Column {
  type: 'date';
  dateFormat: string;
}

export interface CustomColumn extends Column {
  type: 'custom';
  renderCell: (item: any) => ReactNode;
}

export interface BadgeColumn extends Column {
  type: 'badge';
}

// Types for specific actions
export interface EditAction extends Action {
  name: 'edit';
  color: 'blue' | 'orange';
}

export interface DeleteAction extends Action {
  name: 'delete';
  color: 'red';
}

export interface ViewAction extends Action {
  name: 'view';
  color: 'blue' | 'green';
}

// Type for user data (example)
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager';
  status: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Type for user table configuration
export interface UserTableConfig {
  columns: Column[];
  actions: Action[];
  defaultSort?: {
    key: string;
    direction: 'ASC' | 'DESC';
  };
  defaultPageSize?: number;
} 