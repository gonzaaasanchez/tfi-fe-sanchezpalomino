import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  Tag,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetUsers, useDeleteUser } from 'lib/hooks';
import { User } from 'lib/types/user';
import TableComponent, { Column, Action } from 'components/shared/table';
import { useRef } from 'react';

const UsersPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.users.index');
  const router = useRouter();
  const { users, pagination, search, setSearch, currentPage, setCurrentPage, isPending } = useGetUsers({ limit: 10 });
  
  // Estados para el modal de confirmación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Hook para eliminar usuario
  const deleteUserMutation = useDeleteUser();

  const columns: Column[] = [
    {
      key: 'id',
      label: t('columns.id'),
      width: '80px',
      align: 'center' as const,
      sortable: true,
      sortKey: 'id'
    },
    {
      key: 'firstName',
      label: t('columns.firstName'),
      sortable: true,
      sortKey: 'firstName'
    },
    {
      key: 'lastName',
      label: t('columns.lastName'),
      sortable: true,
      sortKey: 'lastName'
    },
    {
      key: 'email',
      label: t('columns.email'),
      sortable: true,
      sortKey: 'email'
    },
    {
      key: 'role.name',
      label: t('columns.role'),
      sortable: true,
      sortKey: 'role.name',
      type: 'custom',
      renderCell: (item: any) => (
        <Tag
          colorScheme={item.role?.name === 'admin' ? 'orange' : 'blue'}
          variant="subtle"
          px={3}
          py={1}
        >
          {item.role?.name || '-'}
        </Tag>
      )
    }
  ];

  const actions: Action[] = [
    {
      name: 'view',
      label: t('actions.view.label'),
      icon: <ViewIcon />,
      color: 'blue',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: t('actions.view.tooltip'),
      module: 'users',
      action: 'read'
    },
    {
      name: 'edit',
      label: t('actions.edit.label'),
      icon: <EditIcon />,
      color: 'orange',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: t('actions.edit.tooltip'),
      module: 'users',
      action: 'update'
    },
    {
      name: 'delete',
      label: t('actions.delete.label'),
      icon: <DeleteIcon />,
      color: 'red',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: t('actions.delete.tooltip'),
      module: 'users',
      action: 'delete'
    }
  ];

  const handleAction = (actionName: string, item: User) => {
    switch (actionName) {
      case 'view':
        router.push(`/users/${item.id}/view`);
        break;
      case 'edit':
        router.push(`/users/${item.id}/edit`);
        break;
      case 'delete':
        setUserToDelete(item);
        onOpen();
        break;
      default:
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || !userToDelete.id) return;
    
    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      onClose();
      setUserToDelete(null);
    } catch (error) {
      // El error ya se maneja en el hook useDeleteUser
    }
  };

  const handleDeleteCancel = () => {
    onClose();
    setUserToDelete(null);
  };

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />
      
      <VStack spacing={6} align="stretch" p={6}>
        <Box>
          <Heading size="lg" mb={2} color="gray.800">
            {t('title')}
          </Heading>
          <Text color="gray.800">
            {t('description')}
          </Text>
        </Box>

        {/* Create new user button */}
        <PermissionGuard module="users" action="create">
          <Box>
            <Button
              leftIcon={<AddIcon />}
              float="right"
              onClick={() => router.push('/users/create')}
            >
              {t('cta.createUser')}
            </Button>
          </Box>
        </PermissionGuard>

        {/* Users table */}
        <PermissionGuard module="users" action="getAll">
          <TableComponent
            rows={users || []}
            columns={columns}
            actions={actions}
            loading={isPending}
            emptyText={t('emptyText')}
            shadow={true}
            onAction={handleAction}
            onChangePage={handlePageChange}
            metadata={pagination}
          />
        </PermissionGuard>
      </VStack>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleDeleteCancel}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('deleteDialog.title')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('deleteDialog.message', {
                firstName: userToDelete?.firstName || '',
                lastName: userToDelete?.lastName || ''
              })}
              <br />
              <br />
              {t('deleteDialog.warning')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleDeleteCancel}>
                {t('deleteDialog.cancel')}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteUserMutation.isPending}
                loadingText={t('deleteDialog.loading')}
              >
                {t('deleteDialog.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/users');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.users.index',
        'layouts.private.header',
        'components.shared.permission-guard',
        'general.common'
      ])
    }
  };
};

export default UsersPage; 