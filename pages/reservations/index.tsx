import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, Tag } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetReservations } from 'lib/hooks/use-reservations';
import { Reservation } from 'lib/types/reservation';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { pick } from 'lodash';
import { getReservationStatusConfig } from 'lib/helpers/utils';

const ReservationsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.reservations.index');
  const router = useRouter();
  const { reservations, pagination, currentPage, setCurrentPage, isPending } =
    useGetReservations({ limit: 10 });

  const columns: Column[] = [
    {
      key: 'user',
      label: t('columns.user'),
      type: 'custom',
      renderCell: (item: Reservation) => (
        <Text>
          {item.user.firstName} {item.user.lastName}
        </Text>
      ),
    },
    {
      key: 'caregiver',
      label: t('columns.caregiver'),
      type: 'custom',
      renderCell: (item: Reservation) => (
        <Text>
          {item.caregiver.firstName} {item.caregiver.lastName}
        </Text>
      ),
    },
    {
      key: 'createdAt',
      label: t('columns.createdAt'),
      type: 'custom',
      renderCell: (item: Reservation) => (
        <Text>
          {item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString()
            : '-'
          }
        </Text>
      ),
    },
    {
      key: 'startDate',
      label: t('columns.startDate'),
      type: 'custom',
      renderCell: (item: Reservation) => (
        <Text>{new Date(item.startDate).toLocaleDateString()}</Text>
      ),
    },
    {
      key: 'endDate',
      label: t('columns.endDate'),
      type: 'custom',
      renderCell: (item: Reservation) => (
        <Text>{new Date(item.endDate).toLocaleDateString()}</Text>
      ),
    },
    {
      key: 'status',
      label: t('columns.status'),
      type: 'custom',
      renderCell: (item: Reservation) => {
        const statusConfig = getReservationStatusConfig(item.status, (key) =>
          t(`status.${key}`)
        );

        return (
          <Tag
            colorScheme={statusConfig.color}
            variant="solid"
            size="sm"
            px={3}
            py={1}
            fontWeight="medium"
          >
            {statusConfig.label}
          </Tag>
        );
      },
    },
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'reservations',
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

  const handleAction = (actionName: string, item: Reservation) => {
    if (actionName === 'view') {
      router.push(`/reservations/${item.id}/view`);
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
        <PermissionGuard
          module="reservations"
          action="getAll"
        >
          <TableComponent
            rows={reservations || []}
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

ReservationsPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const permissions = await handlePermission(ctx.req, ctx.res, 'reservations');
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.reservations.index',
        'layouts.private.header',
        'components.shared.permission-guard',
        'components.shared.pagination',
        'components.shared.table',
        'general.common',
      ]),
      permissions,
    },
  };
};

export default ReservationsPage;
