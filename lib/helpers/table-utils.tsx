import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import React from 'react';
import { Action } from '../types/table';
import { PaginationMetadata } from '../types/response';

export const getPageInfo = (metadata: PaginationMetadata) => {
  const startItem = (metadata.page - 1) * metadata.limit + 1;
  const endItem = Math.min(metadata.page * metadata.limit, metadata.total);

  return {
    startItem,
    endItem,
    total: metadata.total,
    hasNextPage: metadata.page < metadata.totalPages,
    hasPrevPage: metadata.page > 1,
  };
};

// Sorting utilities
export const getSortDirection = (
  currentKey: string,
  currentDirection: 'ASC' | 'DESC',
  newKey: string
): 'ASC' | 'DESC' => {
  if (currentKey === newKey) {
    return currentDirection === 'ASC' ? 'DESC' : 'ASC';
  }
  return 'ASC';
};

// Filter utilities
export const filterRows = (rows: any[], filters: Record<string, any>) => {
  return rows.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      const rowValue = row[key];
      if (typeof value === 'string') {
        return rowValue?.toLowerCase().includes(value.toLowerCase());
      }

      return rowValue === value;
    });
  });
};

// Search utilities
export const searchRows = (
  rows: any[],
  searchTerm: string,
  searchFields: string[]
) => {
  if (!searchTerm) return rows;

  const term = searchTerm.toLowerCase();
  return rows.filter((row) => {
    return searchFields.some((field) => {
      const value = row[field];
      return value?.toString().toLowerCase().includes(term);
    });
  });
};

// Conditional styles utilities
export const createRowClassFn = (config: {
  adminClass?: string;
  inactiveClass?: string;
  customRules?: Array<{ condition: (item: any) => boolean; className: string }>;
}) => {
  return (item: any): string => {
    const classes: string[] = [];

    if (config.adminClass && item.role === 'Admin') {
      classes.push(config.adminClass);
    }

    if (config.inactiveClass && item.status === false) {
      classes.push(config.inactiveClass);
    }

    if (config.customRules) {
      config.customRules.forEach((rule) => {
        if (rule.condition(item)) {
          classes.push(rule.className);
        }
      });
    }

    return classes.join(' ');
  };
};

// Table actions utilities
export interface StandardActionConfig {
  module: string;
  translations: {
    view: { label: string; tooltip: string };
    edit: { label: string; tooltip: string };
    delete: { label: string; tooltip: string };
  };
  includeView?: boolean;
  includeEdit?: boolean;
  includeDelete?: boolean;
  customDisabledRules?: {
    delete?: (item: any) => boolean;
    edit?: (item: any) => boolean;
    view?: (item: any) => boolean;
  };
}

export const createStandardTableActions = (
  config: StandardActionConfig
): Action[] => {
  const actions: Action[] = [];

  if (config.includeView !== false) {
    actions.push({
      name: 'view',
      label: config.translations.view.label,
      icon: <ViewIcon />,
      color: 'blue',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: config.translations.view.tooltip,
      isDisabled: config.customDisabledRules?.view,
    });
  }

  if (config.includeEdit !== false) {
    actions.push({
      name: 'edit',
      label: config.translations.edit.label,
      icon: <EditIcon />,
      color: 'orange',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: config.translations.edit.tooltip,
      isDisabled: config.customDisabledRules?.edit,
    });
  }

  if (config.includeDelete !== false) {
    actions.push({
      name: 'delete',
      label: config.translations.delete.label,
      icon: <DeleteIcon />,
      color: 'red',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: config.translations.delete.tooltip,
      isDisabled: config.customDisabledRules?.delete,
    });
  }

  return actions;
};
