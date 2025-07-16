import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack} from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { useGetRoles } from 'lib/hooks';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { Role } from 'lib/types/role';
import { useTranslations } from 'next-intl';

const Roles: NextPageWithLayout = () => {
  const t = useTranslations('pages.roles');
  const [currentPage, setCurrentPage] = useState(1);
  const { roles, isPending } = useGetRoles({ limit: 10 });

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
      key: 'description',
      label: t('columns.description'),
      sortable: true,
      sortKey: 'description'
    }
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'roles',
    translations: {
      view: { label: t('actions.view'), tooltip: t('tooltips.view') },
      edit: { label: t('actions.edit'), tooltip: t('tooltips.edit') },
      delete: { label: t('actions.delete'), tooltip: t('tooltips.delete') }
    }
  });

  const handleAction = (actionName: string, item: Role) => {
    switch (actionName) {
      case 'view':
        console.log(t('console.view'), item);
        // Here would go navigation to details page
        break;
      case 'edit':
        console.log(t('console.edit'), item);
        // Here would go navigation to edit page
        break;
      case 'delete':
        console.log(t('console.delete'), item);
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
        title={t('meta.title')}
        description={t('meta.description')}
      />
      <VStack spacing={6} align="stretch" p={6}>
        <Box>
          <Heading size="lg" mb={2}>
            {t('title')}
          </Heading>
          <Text color="gray.600">
            {t('description')}
          </Text>
        </Box>

        <TableComponent
          rows={roles || []}
          columns={columns}
          actions={actions}
          loading={isPending}
          emptyText={t('empty')}
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
        'layouts.private.header',
        'components.shared.pagination',
        'components.shared.table',
        'general.common'
      ])
    }
  };
};

export default Roles; 