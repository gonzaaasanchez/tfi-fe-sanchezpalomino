import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { useGetRoles } from 'lib/hooks';
import TableComponent, { Column, Action } from 'components/shared/table';
import { Role } from 'lib/types/role';

const Roles: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { roles, search, setSearch, isPending } = useGetRoles({ limit: 10 });

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
      tooltip: 'Ver detalles del rol',
      module: 'roles',
      action: 'read'
    },
    {
      name: 'edit',
      label: 'Editar',
      icon: <EditIcon />,
      color: 'orange',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Editar rol',
      module: 'roles',
      action: 'update'
    },
    {
      name: 'delete',
      label: 'Eliminar',
      icon: <DeleteIcon />,
      color: 'red',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Eliminar rol',
      module: 'roles',
      action: 'delete'
    }
  ];

  const handleAction = (actionName: string, item: Role) => {
    switch (actionName) {
      case 'view':
        console.log('Ver rol:', item);
        // Here would go navigation to details page
        break;
      case 'edit':
        console.log('Editar rol:', item);
        // Here would go navigation to edit page
        break;
      case 'delete':
        console.log('Eliminar rol:', item);
        // Here would go delete confirmation
        break;
      default:
        break;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sorting
  const handleSort = (key: string, direction: 'ASC' | 'DESC') => {
    // Here would go sorting logic
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
          loading={isPending}
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

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.roles',
        'layouts.private.header'
      ])
    }
  };
};

export default Roles; 