import React, { useState, useEffect } from 'react';
import { Box, Text, Badge } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import Table, { Column, Action, PaginationMetadata } from './table';

// Simple example data
const sampleData = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Admin',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@example.com',
    role: 'User',
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    role: 'Manager',
    createdAt: '2024-01-12T11:00:00Z'
  }
];

  // Simplified column configuration
const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    width: '60px',
    align: 'center'
  },
  {
    key: 'name',
    label: 'Nombre',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'role',
    label: 'Rol',
    type: 'custom',
    renderCell: (item) => (
      <Badge
        colorScheme={item.role === 'Admin' ? 'red' : item.role === 'superAdmin' ? 'orange' : 'blue'}
        variant="subtle"
        fontSize="xs"
        size="xs"
      >
        {item.role}
      </Badge>
    )
  }
];

  // Simple action with permission validation
const actions: Action[] = [
  {
    name: 'view',
    label: 'Ver detalles',
    icon: <ViewIcon />,
    color: 'blue',
    variant: 'ghost',
    tooltip: 'Ver información detallada',
    module: 'users',
    action: 'read'
  }
];

  // Pagination metadata
const metadata: PaginationMetadata = {
  page: 1,
  pageCount: 1,
  pageSize: 10,
  total: 3
};

const TableExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 segundos de carga simulada

    return () => clearTimeout(timer);
  }, []);

  const handleAction = (actionName: string, item: any) => {
    console.log(`Acción ${actionName} ejecutada para:`, item);
  };

  return (
    <Table
      rows={sampleData}
      columns={columns}
      actions={actions}
      loading={isLoading}
      emptyText="No hay datos disponibles"
      title="Listado de Operadores"
      metadata={metadata}
      shadow={true}
      showEmpty={true}
      onAction={handleAction}
    />
  );
};

export default TableExample; 