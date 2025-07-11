import { PaginationMetadata } from '../types/table';

// Pagination utilities
export const createPaginationMetadata = (
  page: number,
  pageSize: number,
  total: number
): PaginationMetadata => ({
  page,
  pageSize,
  pageCount: Math.ceil(total / pageSize),
  total
});

export const getPageInfo = (metadata: PaginationMetadata) => {
  const startItem = (metadata.page - 1) * metadata.pageSize + 1;
  const endItem = Math.min(metadata.page * metadata.pageSize, metadata.total);
  
  return {
    startItem,
    endItem,
    total: metadata.total,
    hasNextPage: metadata.page < metadata.pageCount,
    hasPrevPage: metadata.page > 1
  };
};

// Sorting utilities
export const getSortDirection = (currentKey: string, currentDirection: 'ASC' | 'DESC', newKey: string): 'ASC' | 'DESC' => {
  if (currentKey === newKey) {
    return currentDirection === 'ASC' ? 'DESC' : 'ASC';
  }
  return 'ASC';
};

// Filter utilities
export const filterRows = (rows: any[], filters: Record<string, any>) => {
  return rows.filter(row => {
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
export const searchRows = (rows: any[], searchTerm: string, searchFields: string[]) => {
  if (!searchTerm) return rows;
  
  const term = searchTerm.toLowerCase();
  return rows.filter(row => {
    return searchFields.some(field => {
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
      config.customRules.forEach(rule => {
        if (rule.condition(item)) {
          classes.push(rule.className);
        }
      });
    }
    
    return classes.join(' ');
  };
}; 