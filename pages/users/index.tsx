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
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
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
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { useRef } from 'react';
import { FiltersFormData, FilterField } from '@interfaces/forms';
import Filters from 'components/shared/filters';

const UsersPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.users.index');
  const tFilters = useTranslations('components.shared.filters');
  const router = useRouter();
  const {
    users,
    pagination,
    setCurrentPage,
    search,
    setSearch,
    isPending,
  } = useGetUsers({ limit: 10 });

  // Estado para controlar el loading específico de los filtros
  const [isFiltersLoading, setIsFiltersLoading] = useState(false);

  // Estados para el modal de confirmación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Hook para eliminar usuario
  const deleteUserMutation = useDeleteUser();

  const filters: FilterField[] = [
    {
      name: 'search',
      label: tFilters('search.label'),
      tooltip: tFilters('search.tooltip'),
      value: search,
      component: Input,
      componentProps: {
        placeholder: tFilters('search.placeholder'),
        size: 'md',
      },
    },
  ];

  const columns: Column[] = [
    {
      key: 'id',
      label: t('columns.id'),
      width: '80px',
      sortable: true,
      sortKey: 'id',
    },
    {
      key: 'firstName',
      label: t('columns.firstName'),
      sortable: true,
      sortKey: 'firstName',
    },
    {
      key: 'lastName',
      label: t('columns.lastName'),
      sortable: true,
      sortKey: 'lastName',
    },
    {
      key: 'email',
      label: t('columns.email'),
      sortable: true,
      sortKey: 'email',
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
      ),
    },
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'users',
    translations: {
      view: { label: t('actions.view.label'), tooltip: t('actions.view.tooltip') },
      edit: { label: t('actions.edit.label'), tooltip: t('actions.edit.tooltip') },
      delete: { label: t('actions.delete.label'), tooltip: t('actions.delete.tooltip') }
    }
  });

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

  const handleFiltersSubmit = async (filters: FiltersFormData) => {
    setIsFiltersLoading(true);
    try {
      const searchValue = filters.search as string;
      setSearch(searchValue || '');
      setCurrentPage(1);
    } finally {
      setIsFiltersLoading(false);
    }
  };

  const handleFiltersReset = () => {
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />

      <VStack
        spacing={6}
        align="stretch"
        p={6}
      >
        <Box>
          <Heading
            size="lg"
            mb={2}
            color="gray.800"
          >
            {t('title')}
          </Heading>
          <Text color="gray.800">{t('description')}</Text>
        </Box>

        {/* Create new user button */}
        <PermissionGuard
          module="users"
          action="create"
        >
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

        <Filters
          title={tFilters('title')}
          filters={filters}
          onSubmit={handleFiltersSubmit}
          onReset={handleFiltersReset}
          loading={isFiltersLoading}
        />

        {/* Users table */}
        <PermissionGuard
          module="users"
          action="getAll"
        >
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
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            >
              {t('deleteDialog.title')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('deleteDialog.message', {
                firstName: userToDelete?.firstName || '',
                lastName: userToDelete?.lastName || '',
              })}
              <br />
              <br />
              {t('deleteDialog.warning')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={handleDeleteCancel}
              >
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
        'lib.hooks.users',
        'components.shared.filters',
        'components.shared.loader',
        'components.shared.permission-guard',
        'components.shared.pagination',
        'components.shared.table',
        'general.common',
        'general.sidebar',
      ]),
    },
  };
};

export default UsersPage;
