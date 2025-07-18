import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { ChevronRightIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetUser } from 'lib/hooks';
import { Loader } from 'components/shared';

interface ViewUserPageProps {
  id: string;
}

const ViewUserPage: NextPageWithLayout<ViewUserPageProps> = ({ id }) => {
  const t = useTranslations('pages.users.view');
  const router = useRouter();
  const { user, isPending } = useGetUser({ id });

  const handleEdit = () => {
    router.push(`/users/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/users');
  };

  if (isPending) {
    return <Loader fullHeight />;
  }

  if (!user) {
    return (
      <Container
        maxW="container.lg"
        py={8}
      >
        <Text>{t('notFound')}</Text>
      </Container>
    );
  }

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />

      <Container
        maxW="container.lg"
        py={8}
      >
        <VStack
          spacing={6}
          align="stretch"
        >
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                color="gray.500"
              >
                {t('breadcrumb.home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/users"
                color="gray.500"
              >
                {t('breadcrumb.users')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                color="brand1.700"
                fontWeight="medium"
              >
                {t('breadcrumb.view')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <HStack
              justify="space-between"
              align="flex-start"
            >
              <Box>
                <Heading
                  size="lg"
                  mb={2}
                  color="gray.800"
                >
                  {t('title')}
                </Heading>
                <Text color="gray.600">{t('description')}</Text>
              </Box>
              <HStack spacing={3}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="outline"
                  onClick={handleBack}
                >
                  {t('actions.back')}
                </Button>
                <Button
                  leftIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  {t('actions.edit')}
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* User Details */}
          <Box
            bg="white"
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
            shadow="sm"
          >
            <VStack
              spacing={6}
              align="stretch"
            >
              <Heading
                size="sm"
                color="brand1.700"
              >
                {t('sections.userInfo')}
              </Heading>

              <VStack
                spacing={4}
                align="stretch"
              >
                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.id')}:
                  </Text>
                  <Text color="gray.600">{user.id}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.firstName')}:
                  </Text>
                  <Text color="gray.600">{user.firstName}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.lastName')}:
                  </Text>
                  <Text color="gray.600">{user.lastName}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.email')}:
                  </Text>
                  <Text color="gray.600">{user.email}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.role')}:
                  </Text>
                  <Tag
                    colorScheme={
                      user.role?.name === 'admin' ? 'orange' : 'blue'
                    }
                    variant="subtle"
                    px={3}
                    py={1}
                  >
                    {user.role?.name || '-'}
                  </Tag>
                </HStack>

                {user.phoneNumber && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.phoneNumber')}:
                    </Text>
                    <Text color="gray.600">{user.phoneNumber}</Text>
                  </HStack>
                )}
              </VStack>

              <Divider />

              {/* Timestamps */}
              <VStack
                spacing={4}
                align="stretch"
              >
                {user.createdAt && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.createdAt')}:
                    </Text>
                    <Text color="gray.600">
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </HStack>
                )}

                {user.updatedAt && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.updatedAt')}:
                    </Text>
                    <Text color="gray.600">
                      {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
};

ViewUserPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/users/view');
  if (errors) {
    return errors;
  }

  const id = params?.id as string;

  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.users.view',
        'pages.users.index',
        'layouts.private.header',
        'components.forms.user',
        'general.form.errors',
        'general.common',
      ]),
    },
  };
};

export default ViewUserPage;
