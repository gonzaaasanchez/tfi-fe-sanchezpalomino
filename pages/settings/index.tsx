import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, Tag } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetConfigs } from 'lib/hooks';
import { Config } from 'lib/types/config';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { useConfigDisplayName } from 'lib/helpers/config-utils';

const SettingsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.settings.index');
  const router = useRouter();
  const { configs, isPending } = useGetConfigs();
  const getConfigDisplayName = useConfigDisplayName();

  const columns: Column[] = [
    {
      key: 'key',
      label: t('columns.key'),
      sortable: true,
      sortKey: 'key',
      type: 'custom',
      renderCell: (item: Config) => (
        <Text fontWeight="medium">
          {getConfigDisplayName(item.key)}
        </Text>
      ),
    },
    {
      key: 'value',
      label: t('columns.value'),
      type: 'custom',
      renderCell: (item: Config) => {
        const value = item.value;
        switch (item.type) {
          case 'number':
            return <Text>{value}</Text>;
          case 'boolean':
            return (
              <Tag
                colorScheme={value ? 'green' : 'red'}
                variant="subtle"
                size="sm"
              >
                {value ? 'Sí' : 'No'}
              </Tag>
            );
          case 'object':
            return (
              <Text
                fontSize="sm"
                color="gray.600"
                fontFamily="mono"
              >
                {JSON.stringify(value).substring(0, 50)}
                {JSON.stringify(value).length > 50 ? '...' : ''}
              </Text>
            );
          default:
            return <Text>{String(value)}</Text>;
        }
      },
    },
    {
      key: 'type',
      label: t('columns.type'),
      type: 'custom',
      renderCell: (item: Config) => (
        <Tag
          colorScheme="blue"
          variant="subtle"
          size="sm"
        >
          {item.type}
        </Tag>
      ),
    },
    {
      key: 'updatedAt',
      label: t('columns.updatedAt'),
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm',
      sortable: true,
      sortKey: 'updatedAt',
    },
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'settings',
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
    includeDelete: false, 
    includeView: false,
    // customDisabledRules: {
    //   edit: (item: Config) => item.isSystem,
    // },
  });

  const handleAction = (actionName: string, item: Config) => {
    switch (actionName) {
      case 'edit':
        router.push(`/settings/${item.key}/edit`);
        break;
      default:
        break;
    }
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
          module="settings"
          action="getAll"
        >
          <TableComponent
            rows={configs || []}
            columns={columns}
            actions={actions}
            loading={isPending}
            emptyText={t('emptyText')}
            shadow={true}
            onAction={handleAction}
          />
        </PermissionGuard>
      </VStack>
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/settings');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.settings.index',
        'layouts.private.header',
        'lib.hooks.configs',
        'components.shared.permission-guard',
        'components.shared.table',
        'general.common',
        'general.configKeys',
        'general.sidebar',
      ]),
    },
  };
};

export default SettingsPage;
