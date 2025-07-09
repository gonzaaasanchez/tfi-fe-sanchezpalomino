import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, HStack, IconButton, Tooltip, Button, Tag } from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePrivateRoute } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { PermissionGuard } from 'components/shared/permission-guard';
import { usePermissions } from '@hooks/use-permissions';
import { useGetAdmins } from 'lib/hooks';
import TableComponent, { Column, Action } from 'components/shared/table';
import { Admin } from 'lib/types/user';

const AdminPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.admin.index');
  const { user, canCreate, canRead, canUpdate, canDelete, isSuperAdmin } = usePermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const { admins, search, setSearch } = useGetAdmins({ limit: 10 });

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
      key: 'firstName',
      label: 'Nombre',
      sortable: true,
      sortKey: 'firstName'
    },
    {
      key: 'lastName',
      label: 'Apellido',
      sortable: true,
      sortKey: 'lastName'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      sortKey: 'email'
    },
    {
      key: 'role.name',
      label: 'Rol',
      sortable: true,
      sortKey: 'role.name',
      type: 'custom',
      renderCell: (item: any) => (
        <Tag colorScheme={item.role?.name === 'superadmin' ? 'orange' : 'blue'} variant="subtle" px={3} py={1}>
          {item.role?.name || '-'}
        </Tag>
      )
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
      tooltip: 'Ver detalles del administrador'
    },
    {
      name: 'edit',
      label: 'Editar',
      icon: <EditIcon />,
      color: 'orange',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Editar administrador'
    },
    {
      name: 'delete',
      label: 'Eliminar',
      icon: <DeleteIcon />,
      color: 'red',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Eliminar administrador'
    }
  ];

  const handleAction = (actionName: string, item: Admin) => {
    switch (actionName) {
      case 'view':
        console.log('View administrator:', item);
        // Here would go the navigation to the details page
        break;
      case 'edit':
        console.log('Edit administrator:', item);
        // Here would go the navigation to the edit page
        break;
      case 'delete':
        console.log('Delete administrator:', item);
        // Here would go the deletion confirmation
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
    // Here would go the sorting logic
  };

  return (
    <>
      <NextSeo
        title="Administradores"
        description="Gestión de administradores"
      />
      
      <VStack spacing={6} align="stretch" p={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Administradores
          </Heading>
          <Text color="gray.600">
            Administra los administradores del sistema
          </Text>
        </Box>



        {/* Create new administrator button */}
        <PermissionGuard module="admins" action="create">
          <Box>
            <Button leftIcon={<AddIcon />} colorScheme="brand1" size="xs" float="right">
              Crear Nuevo Administrador
            </Button>
          </Box>
        </PermissionGuard>

        {/* Administrators table */}
        <PermissionGuard module="admins" action="read">
          <TableComponent
            rows={admins || []}
            columns={columns}
            actions={actions}
            loading={false}
            emptyText="No hay administradores disponibles"
            shadow={true}
            onAction={handleAction}
            onChangePage={handlePageChange}
            onSort={handleSort}
          />
        </PermissionGuard>

        {/* Insufficient permissions messages */}
        {!canRead('admins') && (
          <Box p={4} bg="yellow.50" border="1px" borderColor="yellow.200" rounded="md">
            <Text color="yellow.800">
              No tienes permisos para ver la lista de administradores
            </Text>
          </Box>
        )}
      </VStack>
    </>
  );
};

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePrivateRoute(ctx.req, ctx.res, '/admin');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.admin.index'
      ])
    }
  };
}

export default AdminPage;