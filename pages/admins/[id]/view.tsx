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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import { useGetEntityLogs, useGetAdminSessions } from 'lib/hooks';
import { usePermissions } from 'lib/hooks/use-permissions';
import { PermissionGuard } from 'components/shared/permission-guard';
import { LottieLoader, AuditPage, SessionAuditPage } from 'components/shared';
import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';

interface ViewAdminPageProps {
  id: string;
}

const ViewAdminPage: NextPageWithLayout<ViewAdminPageProps> = ({ id }) => {
  const t = useTranslations('pages.admins.view');
  const router = useRouter();
  const [sessionsPage, setSessionsPage] = useState(1);
  const { canRead, isSuperAdmin } = usePermissions();

  const { admin, isPending: isLoadingAdmin } = useGetAdmin({
    id: id as string,
  });

  const { data: logsData, isPending: isLogsPending } = useGetEntityLogs(
    'Admin',
    id
  );

  const { data: sessionsData, isPending: isSessionsPending } =
    useGetAdminSessions(id, sessionsPage, 10);

  const canViewSessionAudit = isSuperAdmin() || canRead('audit');
  const canViewChangesLogs = isSuperAdmin() || canRead('logs');

  const handleEdit = () => {
    router.push(`/admins/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/admins');
  };

  const handleSessionsPageChange = (page: number) => {
    setSessionsPage(page);
  };

  if (isLoadingAdmin) {
    return <LottieLoader type="loading" size="lg" height="50vh" />;
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

          {/* Tabs */}
          <Tabs
            variant="enclosed"
            colorScheme="brand1"
            borderColor="brand1.300"
          >
            <TabList>
              <Tab
                bg="brand1.200"
                color="brand1.700"
                fontSize="sm"
                _selected={{
                  bg: 'brand1.600',
                  color: 'white',
                }}
                _hover={{ bg: 'brand1.300' }}
              >
                {t('tabs.information')}
              </Tab>
              {canViewChangesLogs && (
                <Tab
                  bg="brand1.200"
                  color="brand1.700"
                  fontSize="sm"
                  _selected={{
                    bg: 'brand1.600',
                    color: 'white',
                  }}
                  _hover={{ bg: 'brand1.300' }}
                >
                  {t('tabs.audit')}
                </Tab>
              )}
              {canViewSessionAudit && (
                <Tab
                  bg="brand1.200"
                  color="brand1.700"
                  fontSize="sm"
                  _selected={{
                    bg: 'brand1.600',
                    color: 'white',
                  }}
                  _hover={{ bg: 'brand1.300' }}
                >
                  {t('tabs.sessionAudit')}
                </Tab>
              )}
            </TabList>

            <TabPanels>
              {/* Information Tab */}
              <TabPanel>
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
                                admin.role?.name === 'superadmin'
                                  ? 'orange'
                                  : 'blue'
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
              </TabPanel>

              {/* Audit Tab */}
              {canViewChangesLogs && (
                <TabPanel>
                  <AuditPage
                    logs={logsData?.data || []}
                    subtitle={t('audit.description')}
                    t={t}
                    isLoading={isLogsPending}
                    emptyText={t('audit.noChanges')}
                  />
                </TabPanel>
              )}

              {/* Session Audit Tab */}
              {canViewSessionAudit && (
                <TabPanel>
                  <SessionAuditPage
                    sessions={sessionsData?.items || []}
                    subtitle={t('sessionAudit.description')}
                    isLoading={isSessionsPending}
                    emptyText={t('sessionAudit.noSessions')}
                    pagination={sessionsData?.pagination}
                    onChangePage={handleSessionsPageChange}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
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
        'components.shared.pagination',
        'components.shared.table',
        'components.shared.sessionAudit',
        'general.common',
        'general.sidebar',
        'general.audit',
        'sessionAudit',
      ]),
    },
  };
};

export default ViewAdminPage;
