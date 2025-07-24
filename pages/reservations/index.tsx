import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, Tag, Select } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetReservations } from 'lib/hooks/use-reservations';
import { useGetUsers, useGetCaregivers } from 'lib/hooks/use-users';
import { Reservation } from 'lib/types/reservation';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { pick } from 'lodash';
import { getReservationStatusConfig } from 'lib/helpers/utils';
import { FiltersFormData, FilterField } from '@interfaces/forms';
import Filters from 'components/shared/filters';

const ReservationsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.reservations.index');
  const tFilters = useTranslations('components.shared.filters');
  const tStatus = useTranslations('pages.reservations.index.status');
  const router = useRouter();
  const { reservations, pagination, currentPage, setCurrentPage, userId, setUserId, caregiverId, setCaregiverId, status, setStatus, isPending } =
    useGetReservations({ limit: 10 });

  // Estado para controlar el loading específico de los filtros
  const [isFiltersLoading, setIsFiltersLoading] = useState(false);

  // Obtener todos los usuarios para el filtro
  const { users } = useGetUsers({ limit: 1000 });

  // Obtener cuidadores para el filtro
  const { caregivers } = useGetCaregivers({ limit: 1000 });

  const filters: FilterField[] = [
    {
      name: 'userId',
      label: tFilters('user.label'),
      tooltip: tFilters('user.tooltip'),
      value: userId,
      component: Select,
      componentProps: {
        placeholder: tFilters('user.placeholder'),
        size: 'md',
        children: [
          <option key="all" value="">
            Todos los usuarios
          </option>,
          ...(users || []).map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          )),
        ],
      },
    },
    {
      name: 'caregiverId',
      label: tFilters('caregiver.label'),
      tooltip: tFilters('caregiver.tooltip'),
      value: caregiverId,
      component: Select,
      componentProps: {
        placeholder: tFilters('caregiver.placeholder'),
        size: 'md',
        children: [
          <option key="all" value="">
            Todos los cuidadores
          </option>,
          ...(caregivers || []).map((caregiver) => (
            <option key={caregiver.id} value={caregiver.id}>
              {caregiver.firstName} {caregiver.lastName}
            </option>
          )),
        ],
      },
    },
    {
      name: 'status',
      label: tFilters('status.label'),
      tooltip: tFilters('status.tooltip'),
      value: status,
      component: Select,
      componentProps: {
        placeholder: tFilters('status.placeholder'),
        size: 'md',
        children: [
          <option key="all" value="">
            Todos los estados
          </option>,
          <option key="pending" value="pending">
            {tStatus('pending')}
          </option>,
          <option key="waiting_acceptance" value="waiting_acceptance">
            {tStatus('waiting_acceptance')}
          </option>,
          <option key="confirmed" value="confirmed">
            {tStatus('confirmed')}
          </option>,
          <option key="started" value="started">
            {tStatus('started')}
          </option>,
          <option key="rejected" value="rejected">
            {tStatus('rejected')}
          </option>,
          <option key="finished" value="finished">
            {tStatus('finished')}
          </option>,
          <option key="cancelled_owner" value="cancelled_owner">
            {tStatus('cancelled_owner')}
          </option>,
          <option key="cancelled_caregiver" value="cancelled_caregiver">
            {tStatus('cancelled_caregiver')}
          </option>,
        ],
      },
    },
  ];

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

  const handleFiltersSubmit = async (filters: FiltersFormData) => {
    setIsFiltersLoading(true);
    try {
      const userIdValue = filters.userId as string;
      setUserId(userIdValue || '');
      const caregiverIdValue = filters.caregiverId as string;
      setCaregiverId(caregiverIdValue || '');
      const statusValue = filters.status as string;
      setStatus(statusValue || '');
      setCurrentPage(1);
    } finally {
      setIsFiltersLoading(false);
    }
  };

  const handleFiltersReset = () => {
    setUserId('');
    setCaregiverId('');
    setStatus('');
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
        <PermissionGuard
          module="reservations"
          action="getAll"
        >
          <Filters
            title={tFilters('title')}
            filters={filters}
            onSubmit={handleFiltersSubmit}
            onReset={handleFiltersReset}
            loading={isFiltersLoading}
          />
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
        'components.shared.filters',
        'general.common',
        'general.sidebar',
        'general.auth.logout',
      ]),
      permissions,
    },
  };
};

export default ReservationsPage;
