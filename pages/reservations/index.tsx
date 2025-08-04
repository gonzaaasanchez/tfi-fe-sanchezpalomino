import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Heading,
  Text,
  VStack,
  Tag,
  Select,
  Button,
  HStack,
} from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetReservations } from 'lib/hooks/use-reservations';
import { useGetUsers, useGetCaregivers } from 'lib/hooks/use-users';
import { useReservationStatus } from 'lib/hooks/use-reservation-status';
import { Reservation } from 'lib/types/reservation';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { pick } from 'lodash';
import {
  getReservationStatusConfig,
  generateHTMLReport,
  generateTableRows,
  completeHTMLReport,
  downloadHTMLReport,
  ReportColumn,
  ReportFilter,
} from 'lib/helpers/utils';
import { FiltersFormData, FilterField } from '@interfaces/forms';
import Filters from 'components/shared/filters';
import { DownloadIcon } from '@chakra-ui/icons';

const ReservationsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.reservations.index');
  const tFilters = useTranslations('components.shared.filters');
  const tStatus = useTranslations('pages.reservations.index.status');
  const { getStatusOptions } = useReservationStatus();
  const router = useRouter();
  const {
    reservations,
    pagination,
    setCurrentPage,
    userId,
    setUserId,
    caregiverId,
    setCaregiverId,
    status,
    setStatus,
    isPending,
    getAllReservationsForExport,
    search,
  } = useGetReservations({ limit: 10 });

  // Estado para controlar el loading específico de los filtros
  const [isFiltersLoading, setIsFiltersLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Obtener todos los usuarios para el filtro
  const { users } = useGetUsers({ limit: 1000 });

  // Obtener cuidadores para el filtro
  const { caregivers } = useGetCaregivers({ limit: 1000 });

  // Función para generar y descargar el reporte
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Obtener todas las reservas para el reporte (sin paginación)
      const reservationsForExport = await getAllReservationsForExport();

      if (reservationsForExport.length === 0) {
        alert(t('export.noReservations'));
        return;
      }

      // Preparar filtros
      const filters: ReportFilter[] = [];

      if (userId) {
        const user = users?.find((u) => u.id === userId);
        filters.push({
          label: t('export.filterLabels.user'),
          value: user ? `${user.firstName} ${user.lastName}` : userId,
        });
      }
      if (caregiverId) {
        const caregiver = caregivers?.find((c) => c.id === caregiverId);
        filters.push({
          label: t('export.filterLabels.caregiver'),
          value: caregiver
            ? `${caregiver.firstName} ${caregiver.lastName}`
            : caregiverId,
        });
      }
      if (status) {
        const statusLabel = tStatus(status);
        filters.push({
          label: t('export.filterLabels.status'),
          value: statusLabel,
        });
      }

      // Definir columnas del reporte
      const reportColumns: ReportColumn[] = [
        { key: 'id', label: t('export.columns.id') },
        {
          key: 'user',
          label: t('export.columns.user'),
          render: (value, item) =>
            `${item.user.firstName} ${item.user.lastName}`,
        },
        {
          key: 'caregiver',
          label: t('export.columns.caregiver'),
          render: (value, item) =>
            `${item.caregiver.firstName} ${item.caregiver.lastName}`,
        },
        { key: 'startDate', label: t('export.columns.startDate') },
        { key: 'endDate', label: t('export.columns.endDate') },
        { key: 'status', label: t('export.columns.status') },
        {
          key: 'commission',
          label: t('export.columns.commission'),  
          render: (value, item) => `$${item.commission || '0.00'}`,
        },
        { key: 'createdAt', label: t('export.columns.createdAt') },
      ];

      // Generar reporte HTML con TODOS los datos
      const htmlHeader = generateHTMLReport({
        title: t('export.reportTitle'),
        columns: reportColumns,
        filters,
        totalRecords: reservationsForExport.length, // Usar el total real de registros
        statusConfig: {
          getStatusConfig: getReservationStatusConfig,
          statusKey: 'status',
        },
      });

      // Generar filas de la tabla con TODOS los datos
      const tableRows = generateTableRows(
        reservationsForExport,
        reportColumns,
        {
          getStatusConfig: getReservationStatusConfig,
          statusKey: 'status',
          t: (key) => t(`status.${key}`),
        }
      );

      // Completar el reporte
      const htmlContent = completeHTMLReport(tableRows);
      const fullHTML = htmlHeader + htmlContent;

      // Descargar el reporte
      const filename = `PAWPALS-reporte-reservas-${
        new Date().toISOString().split('T')[0]
      }.html`;
      downloadHTMLReport(fullHTML, filename);
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
          <option
            key="all"
            value=""
          >
            {t('filters.allUsers')}
          </option>,
          ...(users || []).map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
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
          <option
            key="all"
            value=""
          >
            {t('filters.allCaregivers')}
          </option>,
          ...(caregivers || []).map((caregiver) => (
            <option
              key={caregiver.id}
              value={caregiver.id}
            >
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
          <option
            key="all"
            value=""
          >
            {t('filters.allStatuses')}
          </option>,
          ...getStatusOptions().map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )),
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
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
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
    {
      key: 'commission',
      label: t('columns.commission'),
      type: 'custom',
      renderCell: (item: Reservation) => (
        <Text>
          ${item.commission || '0.00'}
        </Text>
      ),
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

          <Box
            display="flex"
            justifyContent="end"
            mb={0}
          >
            <Button
              colorScheme="blue"
              leftIcon={<DownloadIcon />}
              onClick={generatePDF}
              isLoading={isGeneratingPDF}
              size="sm"
              me={2}
            >
              {t('actions.downloadPDF.label')}
            </Button>
          </Box>

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
