import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetPets } from 'lib/hooks/use-pets';
import { Pet } from 'lib/types/pet';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { useRef } from 'react';

const PetsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.pets.index');
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending } = useGetPets({ page: currentPage, limit: 10 });

  const pets = data?.items || [];
  const pagination = data?.pagination;



  const columns: Column[] = [
    {
      key: 'id',
      label: t('columns.id'),
      width: '80px',
      sortable: true,
      sortKey: 'id',
    },
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true,
      sortKey: 'name',
    },
    {
      key: 'petType.name',
      label: t('columns.petType'),
      sortable: true,
      sortKey: 'petType.name',
      type: 'custom',
      renderCell: (item: any) => <Text>{item.petType?.name || '-'}</Text>,
    },
    {
      key: 'owner',
      label: t('columns.owner'),
      sortable: true,
      sortKey: 'owner',
      type: 'custom',
      renderCell: (item: any) => (
        <Text>
          {item.owner?.firstName} {item.owner?.lastName}
        </Text>
      ),
    },
    {
      key: 'createdAt',
      label: t('columns.createdAt'),
      sortable: true,
      sortKey: 'createdAt',
      type: 'custom',
      renderCell: (item: any) => (
        <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
      ),
    },
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'pets',
    translations: {
      view: {
        label: t('actions.view.label'),
        tooltip: t('actions.view.tooltip'),
      },
      edit: {
        label: t('actions.edit.label'),
        tooltip: t('actions.edit.tooltip'),
      },
      delete: {
        label: t('actions.delete.label'),
        tooltip: t('actions.delete.tooltip'),
      },
    },
    includeEdit: false,
    includeDelete: false,
  });

  const handleAction = (actionName: string, item: Pet) => {
    if (actionName === 'view') {
      router.push(`/pets/${item.id}/view`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

        {/* Pets table */}
        <PermissionGuard
          module="pets"
          action="getAll"
        >
          <TableComponent
            rows={pets}
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
    </>
  );
};

PetsPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/pets');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.pets.index',
        'layouts.private.header',
        'lib.hooks.pets',
        'components.shared.filters',
        'components.shared.loader',
        'components.shared.permission-guard',
        'components.shared.pagination',
        'components.shared.table',
        'general.common',
        'general.sidebar'
      ]),
    },
  };
};

export default PetsPage;
