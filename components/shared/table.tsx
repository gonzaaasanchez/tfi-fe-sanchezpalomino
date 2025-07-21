import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  TableContainer,
  Badge,
  Center,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Pagination from './pagination';
import { usePermissions } from '@hooks/use-permissions';
import { useTranslations } from 'next-intl';
import Loader from './loader';
import { PaginationMetadata } from '../../lib/types/response';

// Data types
export interface Column {
  key: string;
  label: React.ReactNode;
  type?: 'date' | 'custom' | 'text' | 'badge';
  dateFormat?: string;
  sortable?: boolean;
  sortDirection?: 'ASC' | 'DESC';
  sortKey?: string;
  className?: string;
  renderCell?: (item: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Action {
  name: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  variant?: 'ghost' | 'solid' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  isDisabled?: (item: any) => boolean;
  tooltip?: string;
  action?: string; // For permissions
  module?: string; // Module for permission validation
  visible?: (item: any) => boolean; // To show/hide actions
  loading?: (item: any) => boolean; // To show loading for specific actions
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
  title?: string;
  rowClassFn?: (item: any) => string;
  onAction?: (actionName: string, item: any) => void;
  onChangePage?: (page: number) => void;
  onSort?: (key: string, direction: 'ASC' | 'DESC') => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

const TableComponent: React.FC<TableProps> = ({
  rows,
  columns,
  actions = [],
  loading = false,
  emptyText = 'No hay datos disponibles',
  metadata,
  shadow = false,
  showEmpty = true,
  title,
  rowClassFn,
  onAction,
  onChangePage,
  onSort,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}) => {
  const t = useTranslations('components.shared.pagination');
  const tTable = useTranslations('components.shared.table');
  // Ensure rows is always an array
  const safeRows = Array.isArray(rows) ? rows : [];
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const { hasPermission, isSuperAdmin } = usePermissions();

  // Sorting
  const handleSort = (column: Column) => {
    if (!column.sortable || !onSort) return;
    const currentDirection = column.sortDirection;
    const newDirection = currentDirection === 'ASC' ? 'DESC' : 'ASC';
    onSort(column.sortKey || column.key, newDirection);
  };

  // Flexible cell rendering
  const renderCell = (item: any, column: Column) => {
    if (column.type === 'custom' && column.renderCell) {
      return column.renderCell(item);
    }
    if (column.type === 'date') {
      const value = item[column.key];
      if (!value) return '-';
      try {
        const date = new Date(value);
        const formatString = column.dateFormat || 'dd/MM/yyyy HH:mm';
        return format(date, formatString);
      } catch {
        return value;
      }
    }
    if (column.type === 'badge') {
      const value = item[column.key];
      return (
        <Badge
          colorScheme={value ? 'green' : 'red'}
          variant="subtle"
          borderRadius="full"
          px={2}
        >
          {value ? tTable('active') : tTable('inactive')}
        </Badge>
      );
    }
    return item[column.key] || '-';
  };

  // Row actions with permission validation
  const showAction = (action: Action, item: any): boolean => {
    // Check if action should be visible based on custom logic
    if (action.visible && !action.visible(item)) {
      return false;
    }

    // Super admin can see all actions
    if (isSuperAdmin()) {
      return true;
    }

    // If no module or action specified, show by default
    if (!action.module || !action.action) {
      return true;
    }

    // Check permissions
    return hasPermission(action.module, action.action);
  };

  const showLoading = (action: Action, item: any): boolean => {
    return action.loading ? action.loading(item) : false;
  };

  // Conditional row classes
  const getRowClass = (item: any): string => {
    return rowClassFn ? rowClassFn(item) : '';
  };

  // Loading and empty states
  const renderEmptyState = () => (
    <Center py={12}>
      <Text
        color="gray.500"
        fontSize="sm"
      >
        {emptyText}
      </Text>
    </Center>
  );
  const renderLoadingState = () => (
    <Center py={12}>
      <Loader size="lg" />
    </Center>
  );

  // Pagination
  const renderPagination = () => {
    if (!metadata || !onChangePage) return null;

    return (
      <Pagination
        metadata={metadata}
        pageSizeOptions={pageSizeOptions}
        onPageChange={onChangePage}
        onPageSizeChange={onPageSizeChange}
      />
    );
  };

  // Table rendering
  const tableContent = (
    <TableContainer p={4}>
      <Table
        variant="base"
        size="md"
      >
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                cursor={column.sortable ? 'pointer' : 'default'}
                onClick={() => handleSort(column)}
                textAlign={column.align || 'left'}
                w={column.width}
                className={column.className}
              >
                <Flex
                  align="center"
                  justify={column.align || 'flex-start'}
                >
                  {column.label}
                  {column.sortable && column.sortDirection && (
                    <Box
                      ml={2}
                      as="span"
                    >
                      {column.sortDirection === 'ASC' ? (
                        <ChevronUpIcon
                          boxSize={4}
                          color="brand1.700"
                        />
                      ) : (
                        <ChevronDownIcon
                          boxSize={4}
                          color="brand1.700"
                        />
                      )}
                    </Box>
                  )}
                </Flex>
              </Th>
            ))}
            {actions.length > 0 && (
              <Th
                textAlign="center"
                w="120px"
              >
                {tTable('actions')}
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {safeRows.map((row, index) => (
            <Tr
              key={index}
              _hover={{ bg: hoverBg }}
              className={getRowClass(row)}
              borderBottom={
                index === safeRows.length - 1 ? 'none' : '1px solid'
              }
              borderColor={
                index === safeRows.length - 1 ? 'transparent' : borderColor
              }
            >
              {columns.map((column) => (
                <Td
                  key={column.key}
                  textAlign={column.align || 'left'}
                  className={column.className}
                >
                  {renderCell(row, column)}
                </Td>
              ))}
              {actions.length > 0 && (
                <Td
                  textAlign="center"
                  minW="150px"
                >
                  <HStack
                    spacing={1}
                    justify="center"
                  >
                    {actions.map((action, idx) => {
                      const isDisabled = action.isDisabled
                        ? action.isDisabled(row)
                        : false;
                      const isVisible = showAction(action, row);
                      const isLoading = showLoading(action, row);
                      if (!isVisible) return null;
                      return (
                        <Tooltip
                          key={`${action.name}-${idx}`}
                          label={action.tooltip || action.label}
                          isDisabled={isDisabled}
                        >
                          <Box>
                            {isLoading ? (
                              <Loader size="sm" />
                            ) : (
                              <IconButton
                                size={action.size || 'sm'}
                                icon={action.icon as React.ReactElement}
                                aria-label={action.label}
                                colorScheme={action.color || 'gray'}
                                variant={action.variant || 'ghost'}
                                isDisabled={isDisabled}
                                onClick={() => onAction?.(action.name, row)}
                              />
                            )}
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </HStack>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius={shadow ? 'lg' : 'none'}
      overflow="hidden"
      boxShadow={shadow ? '0px 16px 40px 0px rgba(1, 38, 54, 0.08)' : 'none'}
      className="app-base-table"
    >
      {loading ? (
        renderLoadingState()
      ) : safeRows.length === 0 && showEmpty ? (
        renderEmptyState()
      ) : (
        <>
          {title && (
            <Box p={4}>
              <Text
                fontSize="md"
                fontWeight="bold"
              >
                {title}
              </Text>
            </Box>
          )}
          {tableContent}
          {renderPagination()}
        </>
      )}
    </Box>
  );
};

export default TableComponent;
