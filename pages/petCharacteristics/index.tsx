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
import { useGetPetCharacteristics, useDeletePetCharacteristic } from 'lib/hooks';
import { PetCharacteristic } from 'lib/types/petCharacteristic';

const PetCharacteristicsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.petCharacteristics.index');
  const router = useRouter();
  
  // Hooks para obtener y eliminar pet characteristics
  const { petCharacteristics, pagination, search, setSearch, currentPage, setCurrentPage, isPending } = useGetPetCharacteristics({ limit: 10 });
  const deletePetCharacteristicMutation = useDeletePetCharacteristic();
  
  // Estados para el modal de confirmación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [petCharacteristicToDelete, setPetCharacteristicToDelete] = useState<PetCharacteristic | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

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
    module: 'petCharacteristics',
    translations: {
      view: { label: t('actions.view.label'), tooltip: t('actions.view.tooltip') },
      edit: { label: t('actions.edit.label'), tooltip: t('actions.edit.tooltip') },
      delete: { label: t('actions.delete.label'), tooltip: t('actions.delete.tooltip') }
    }
  });

  const handleAction = (actionName: string, item: PetCharacteristic) => {
    switch (actionName) {
      case 'view':
        router.push(`/petCharacteristics/${item.id}/view`);
        break;
      case 'edit':
        router.push(`/petCharacteristics/${item.id}/edit`);
        break;
      case 'delete':
        setPetCharacteristicToDelete(item);
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
    if (!petCharacteristicToDelete || !petCharacteristicToDelete.id) return;
    
    try {
      await deletePetCharacteristicMutation.mutateAsync(petCharacteristicToDelete.id);
      onClose();
      setPetCharacteristicToDelete(null);
    } catch (error) {
      // El error ya se maneja en el hook useDeletePetCharacteristic
    }
  };

  const handleDeleteCancel = () => {
    onClose();
    setPetCharacteristicToDelete(null);
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

        {/* Create new pet characteristic button */}
        <PermissionGuard module="petCharacteristics" action="create">
          <Box>
            <Button
              leftIcon={<AddIcon />}
              float="right"
              onClick={() => router.push('/petCharacteristics/create')}
            >
              {t('cta.createPetCharacteristic')}
            </Button>
          </Box>
        </PermissionGuard>

        {/* Pet characteristics table */}
        <PermissionGuard module="petCharacteristics" action="getAll">
          <TableComponent
            rows={petCharacteristics || []}
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
                name: petCharacteristicToDelete?.name || ''
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
                isLoading={deletePetCharacteristicMutation.isPending}
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

PetCharacteristicsPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/petCharacteristics');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.petCharacteristics.index',
        'layouts.private.header',
        'components.shared.permission-guard',
        'components.shared.pagination',
        'components.shared.table',
        'general.common'
      ])
    }
  };
};

export default PetCharacteristicsPage; 