import { ReactElement, useState, useEffect } from 'react';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ChevronRightIcon, EditIcon, ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetUser, useGetUserSessions } from 'lib/hooks';
import { useGetUserPets } from 'lib/hooks/use-pets';
import { usePermissions } from 'lib/hooks/use-permissions';
import { useCustomToast } from 'lib/hooks/use-custom-toast';
import { Loader, SessionAuditPage, PetDetail } from 'components/shared';
import TableComponent, { Column, Action } from 'components/shared/table';
import { Pet } from 'lib/types/pet';

interface ViewUserPageProps {
  id: string;
}

const ViewUserPage: NextPageWithLayout<ViewUserPageProps> = ({ id }) => {
  const t = useTranslations('pages.users.view');
  const tPets = useTranslations('pages.pets.view');
  const router = useRouter();
  const [sessionsPage, setSessionsPage] = useState(1);
  const [petsPage, setPetsPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const { canRead, isSuperAdmin } = usePermissions();

  const { user, isPending } = useGetUser({ id });
  const { data: sessionsData, isPending: isSessionsPending } =
    useGetUserSessions(id, sessionsPage, 10);
  const { data: petsData, isPending: isPetsPending, error: petsError } = useGetUserPets(id, petsPage, 10);
  const { errorToast } = useCustomToast();

  const canViewSessionAudit = isSuperAdmin() || canRead('audit');

  const pets = petsData?.items || [];
  const petsPagination = petsData?.pagination;

  const petsColumns: Column[] = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      sortable: true,
      sortKey: 'id',
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      sortKey: 'name',
    },
    {
      key: 'petType.name',
      label: 'Tipo',
      sortable: true,
      sortKey: 'petType.name',
      type: 'custom',
      renderCell: (item: any) => <Text>{item.petType?.name || '-'}</Text>,
    },
    {
      key: 'createdAt',
      label: 'Fecha de creación',
      sortable: true,
      sortKey: 'createdAt',
      type: 'custom',
      renderCell: (item: any) => (
        <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
      ),
    },
  ];

  const petsActions: Action[] = [
    {
      name: 'view',
      label: 'Ver',
      icon: <ViewIcon />,
      color: 'blue',
      variant: 'ghost' as const,
      size: 'sm' as const,
      tooltip: 'Ver detalles de la mascota',
    },
  ];

  const handleEdit = () => {
    router.push(`/users/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/users');
  };

  const handleSessionsPageChange = (page: number) => {
    setSessionsPage(page);
  };

  const handlePetsPageChange = (page: number) => {
    setPetsPage(page);
  };

  const handleBackFromPet = () => {
    setSelectedPet(null);
  };

  const handlePetAction = (actionName: string, item: Pet) => {
    if (actionName === 'view') {
      setSelectedPet(item);
    }
  };

  // Handle pets error
  useEffect(() => {
    if (petsError) {
      const message = (petsError as any)?.response?.data?.message || 'Error al obtener las mascotas del usuario';
      errorToast(message);
    }
  }, [petsError, errorToast]);

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

          {/* Tabs */}
          <Tabs
            variant="enclosed"
            colorScheme="brand1"
            borderColor="brand1.300"
            index={activeTab}
            onChange={setActiveTab}
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
                Mascotas
              </Tab>
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
                            {new Date(user.createdAt).toLocaleDateString(
                              'es-ES',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
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
                            {new Date(user.updatedAt).toLocaleDateString(
                              'es-ES',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

              {/* Pets Tab */}
              <TabPanel>
                {selectedPet ? (
                  <PetDetail
                    pet={selectedPet}
                    onBack={handleBackFromPet}
                    backButtonText={tPets('actions.backToPets')}
                  />
                ) : (
                  <TableComponent
                    rows={pets}
                    columns={petsColumns}
                    actions={petsActions}
                    loading={isPetsPending}
                    emptyText={t('noPets')}
                    shadow={true}
                    onAction={handlePetAction}
                    onChangePage={handlePetsPageChange}
                    metadata={petsPagination}
                  />
                )}
              </TabPanel>

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
        'pages.pets.view',
        'layouts.private.header',
        'components.forms.user',
        'general.form.errors',
        'general.common',
        'general.sidebar',
        'components.shared.pagination',
        'components.shared.table',
        'components.shared.sessionAudit',
        'sessionAudit',
        'lib.hooks.pets',
      ]),
    },
  };
};

export default ViewUserPage;
