import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { NextSeo } from 'next-seo';
import { useGetAdmin } from '@hooks/use-admins';
import { useGetEntityLogs } from 'lib/hooks';
import { PermissionGuard } from 'components/shared/permission-guard';
import { Loader, AuditPage } from 'components/shared';
import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';

interface ViewAdminPageProps {
  id: string;
}

const ViewAdminPage: NextPageWithLayout<ViewAdminPageProps> = ({ id }) => {
  const t = useTranslations('pages.admins.view');
  const router = useRouter();

  const { admin, isPending: isLoadingAdmin } = useGetAdmin({
    id: id as string,
  });

  const { data: logsData, isPending: isLogsPending } = useGetEntityLogs(
    'Admin',
    id
  );

  const handleEdit = () => {
    router.push(`/admins/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admins');
  };

  if (isLoadingAdmin) {
    return <Loader fullHeight />;
  }

  // Si no se encontró el admin, redirigir
  if (!admin) {
    router.push('/admins');
    return null;
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
                href="/admins"
                color="gray.500"
              >
                {t('breadcrumb.admins')}
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
                <Text
                  color="gray.600"
                  fontSize="sm"
                >
                  {t('description')}
                </Text>
              </Box>
              <HStack spacing={3}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="outline"
                  onClick={handleBack}
                >
                  {t('actions.back')}
                </Button>
                <PermissionGuard
                  module="admins"
                  action="update"
                >
                  <Button
                    leftIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    {t('actions.edit')}
                  </Button>
                </PermissionGuard>
              </HStack>
            </HStack>
          </Box>

          {/* Admin Details Card */}
          <Card>
            <CardBody>
              <VStack
                spacing={6}
                align="stretch"
              >
                {/* Basic Information */}
                <Box>
                  <Heading
                    size="sm"
                    color="brand1.700"
                    mb={4}
                  >
                    {t('sections.basicInfo')}
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
                      <Text color="gray.600">{admin.id}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.firstName')}:
                      </Text>
                      <Text color="gray.600">{admin.firstName}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.lastName')}:
                      </Text>
                      <Text color="gray.600">{admin.lastName}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.email')}:
                      </Text>
                      <Text color="gray.600">{admin.email}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.role')}:
                      </Text>
                      <Badge
                        colorScheme={
                          admin.role?.name === 'superadmin' ? 'orange' : 'blue'
                        }
                        variant="subtle"
                        px={3}
                        py={1}
                      >
                        {admin.role?.name || '-'}
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                {/* Additional Information */}
                <Box>
                  <VStack
                    spacing={4}
                    align="stretch"
                  >
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.createdAt')}:
                      </Text>
                      <Text color="gray.600">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString(
                              'es-ES'
                            )
                          : '-'}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.updatedAt')}:
                      </Text>
                      <Text color="gray.600">
                        {admin.updatedAt
                          ? new Date(admin.updatedAt).toLocaleDateString(
                              'es-ES'
                            )
                          : '-'}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Audit Card */}
          <AuditPage
            logs={logsData?.data || []}
            subtitle={t('audit.description')}
            t={t}
            isLoading={isLogsPending}
            emptyText={t('audit.noChanges')}
          />
        </VStack>
      </Container>
    </>
  );
};

ViewAdminPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/admins/view');
  if (errors) {
    return errors;
  }

  const id = params?.id as string;

  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'layouts.private.header',
        'pages.admins.view',
        'pages.admins.index',
        'components.shared.permission-guard',
        'general.common',
        'general.audit',
      ]),
    },
  };
};

export default ViewAdminPage;
