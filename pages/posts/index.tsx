import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack, Tag, Input } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetPosts } from 'lib/hooks';
import { Post } from 'lib/types/post';
import TableComponent, { Column, Action } from 'components/shared/table';
import { createStandardTableActions } from 'lib/helpers/table-utils';
import { FiltersFormData, FilterField } from '@interfaces/forms';
import Filters from 'components/shared/filters';

const PostsPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.posts.index');
  const tFilters = useTranslations('components.shared.filters');
  const router = useRouter();
  const { posts, pagination, setCurrentPage, search, setSearch, isPending } =
    useGetPosts({ limit: 10 });

  // Estado para controlar el loading específico de los filtros
  const [isFiltersLoading, setIsFiltersLoading] = useState(false);

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
      key: 'author',
      label: t('columns.author'),
      sortable: true,
      sortKey: 'author',
      type: 'custom',
      renderCell: (item: any) => (
        <Text>
          {item.author?.firstName} {item.author?.lastName}
        </Text>
      ),
    },
    {
      key: 'title',
      label: t('columns.title'),
      sortable: true,
      sortKey: 'title',
    },
    {
      key: 'createdAt',
      label: t('columns.createdAt'),
      sortable: true,
      sortKey: 'createdAt',
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm',
    },
    {
      key: 'commentsCount',
      label: t('columns.commentsCount'),
      sortable: true,
      sortKey: 'commentsCount',
      type: 'custom',
      renderCell: (item: any) => (
        <Tag
          colorScheme="blue"
          variant="subtle"
          px={3}
          py={1}
        >
          {item.commentsCount || 0}
        </Tag>
      ),
    },
    {
      key: 'likesCount',
      label: t('columns.likesCount'),
      sortable: true,
      sortKey: 'likesCount',
      type: 'custom',
      renderCell: (item: any) => (
        <Tag
          colorScheme="green"
          variant="subtle"
          px={3}
          py={1}
        >
          {item.likesCount || 0}
        </Tag>
      ),
    },
  ];

  const actions: Action[] = createStandardTableActions({
    module: 'posts',
    translations: {
      view: { label: t('actions.view.label'), tooltip: t('actions.view.tooltip') },
      edit: { label: t('actions.edit.label'), tooltip: t('actions.edit.tooltip') },
      delete: { label: t('actions.delete.label'), tooltip: t('actions.delete.tooltip') }
    },
    includeView: true,
    includeEdit: false,
    includeDelete: false
  });

  const handleAction = (actionName: string, item: Post) => {
    switch (actionName) {
      case 'view':
        router.push(`/posts/${item.id}/view`);
        break;
      default:
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

        <Filters
          title={tFilters('title')}
          filters={filters}
          onSubmit={handleFiltersSubmit}
          onReset={handleFiltersReset}
          loading={isFiltersLoading}
        />

        {/* Posts table */}
        <PermissionGuard
          module="posts"
          action="getAll"
        >
          <TableComponent
            rows={posts || []}
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

PostsPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/posts');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.posts.index',
        'layouts.private.header',
        'lib.hooks.posts',
        'components.shared.filters',
        'components.shared.loader',
        'components.shared.permission-guard',
        'components.shared.pagination',
        'components.shared.table',
        'general.common',
        'general.sidebar',
        'general.auth.logout',
      ]),
    },
  };
};

export default PostsPage;
