import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { useRef } from 'react';
import { useGetPetTypes, useDeletePetType } from 'lib/hooks';
import { PetType } from 'lib/types/petType';



const PetTypesPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.petTypes.index');
  const router = useRouter();
  
  // Hooks para obtener y eliminar pet types
  const { petTypes, pagination, search, setSearch, currentPage, setCurrentPage, isPending } = useGetPetTypes({ limit: 10 });
  const deletePetTypeMutation = useDeletePetType();
  
  // Estados para el modal de confirmación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [petTypeToDelete, setPetTypeToDelete] = useState<PetType | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const columns: Column[] = [
    {
      key: 'id',
      label: t('columns.id'),
      width: '80px',
      sortable: true,
      sortKey: 'id'
    },
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true,
      sortKey: 'name'
    },
    {
      key: 'createdAt',
      label: t('columns.createdAt'),
      sortable: true,
      sortKey: 'createdAt',
      type: 'custom',
      renderCell: (item: any) => (
        <Text fontSize="sm" color="gray.600">
          {new Date(item.createdAt).toLocaleDateString('es-ES')}
        </Text>
      )
    }
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'petTypes',
    translations: {
      view: { label: t('actions.view.label'), tooltip: t('actions.view.tooltip') },
      edit: { label: t('actions.edit.label'), tooltip: t('actions.edit.tooltip') },
      delete: { label: t('actions.delete.label'), tooltip: t('actions.delete.tooltip') }
    }
  });

  const handleAction = (actionName: string, item: PetType) => {
    switch (actionName) {
      case 'view':
        router.push(`/petTypes/${item.id}/view`);
        break;
      case 'edit':
        router.push(`/petTypes/${item.id}/edit`);
        break;
      case 'delete':
        setPetTypeToDelete(item);
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
    if (!petTypeToDelete || !petTypeToDelete.id) return;
    
    try {
      await deletePetTypeMutation.mutateAsync(petTypeToDelete.id);
      onClose();
      setPetTypeToDelete(null);
    } catch (error) {
      // El error ya se maneja en el hook useDeletePetType
    }
  };

  const handleDeleteCancel = () => {
    onClose();
    setPetTypeToDelete(null);
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

        {/* Create new pet type button */}
        <PermissionGuard module="petTypes" action="create">
          <Box>
            <Button
              leftIcon={<AddIcon />}
              float="right"
              onClick={() => router.push('/petTypes/create')}
            >
              {t('cta.createPetType')}
            </Button>
          </Box>
        </PermissionGuard>

        {/* Pet types table */}
        <PermissionGuard module="petTypes" action="getAll">
          <TableComponent
            rows={petTypes || []}
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
                name: petTypeToDelete?.name || ''
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
                isLoading={deletePetTypeMutation.isPending}
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

PetTypesPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/petTypes');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.petTypes.index',
        'layouts.private.header',
        'lib.hooks.petTypes',
        'components.shared.filters',
        'components.shared.loader',
        'components.shared.permission-guard',
        'components.shared.pagination',
        'components.shared.table',
        'general.common',
        'general.sidebar'
      ])
    }
  };
};

export default PetTypesPage; 