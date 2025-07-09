import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { useGetRoles } from 'lib/hooks';
import TableComponent, { Column, Action } from 'components/shared/table';
import { Role } from 'lib/types/role';

const Roles: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { roles, search, setSearch } = useGetRoles({ limit: 10 });

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      align: 'center' as const,
      sortable: true,
      sortKey: 'id'
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      sortKey: 'name'
    },
    {
      key: 'description',
      label: 'Descripción',
      sortable: true,
      sortKey: 'description'
    }
  ];

  const actions: Action[] = [
    {
      name: 'view',
      label: 'Ver',
      icon: <ViewIcon />,
      color: 'blue',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Ver detalles del rol'
    },
    {
      name: 'edit',
      label: 'Editar',
      icon: <EditIcon />,
      color: 'orange',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Editar rol'
    },
    {
      name: 'delete',
      label: 'Eliminar',
      icon: <DeleteIcon />,
      color: 'red',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Eliminar rol'
    }
  ];

  const handleAction = (actionName: string, item: Role) => {
    switch (actionName) {
      case 'view':
        console.log('Ver rol:', item);
        // Aquí iría la navegación a la página de detalles
        break;
      case 'edit':
        console.log('Editar rol:', item);
        // Aquí iría la navegación a la página de edición
        break;
      case 'delete':
        console.log('Eliminar rol:', item);
        // Aquí iría la confirmación de eliminación
        break;
      default:
        break;
    }
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar ordenamiento
  const handleSort = (key: string, direction: 'ASC' | 'DESC') => {
    // Aquí iría la lógica de ordenamiento
  };

  return (
    <>
      <NextSeo
        title="Roles"
        description="Gestión de roles y permisos del sistema"
      />
      <VStack spacing={6} align="stretch" p={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Roles
          </Heading>
          <Text color="gray.600">
            Administra los roles y permisos de los usuarios
          </Text>
        </Box>

        <TableComponent
          rows={roles || []}
          columns={columns}
          actions={actions}
          loading={false}
          emptyText="No hay roles disponibles"
          shadow={true}
          onAction={handleAction}
          onChangePage={handlePageChange}
          onSort={handleSort}
        />
      </VStack>
    </>
  );
};

Roles.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export default Roles; 