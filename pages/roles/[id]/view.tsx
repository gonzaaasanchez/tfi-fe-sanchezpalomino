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
  Badge,
  Divider,
  Card,
  CardBody,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { ChevronRightIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetRole, useGetEntityLogs } from 'lib/hooks';
import { Loader, AuditPage } from 'components/shared';

interface ViewRolePageProps {
  id: string;
}

const ViewRolePage: NextPageWithLayout<ViewRolePageProps> = ({ id }) => {
  const t = useTranslations('pages.roles.view');
  const tGeneral = useTranslations('general');
  const router = useRouter();
  const { role, isPending } = useGetRole({ id });
  const { data: logsData, isPending: isLogsPending } = useGetEntityLogs(
    'Role',
    id
  );

  const handleEdit = () => {
    router.push(`/roles/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/roles');
  };

  if (isPending) {
    return <Loader fullHeight />;
  }

  if (!role) {
    return (
      <Container
        maxW="container.lg"
        py={8}
      >
        <Text>{t('notFound')}</Text>
      </Container>
    );
  }

  const renderPermissionBadge = (hasPermission: boolean) => (
    <Badge
      colorScheme={hasPermission ? 'green' : 'gray'}
      variant="subtle"
      px={2}
      py={1}
      fontSize="12px"
    >
      {hasPermission
        ? tGeneral('permissions.status.allowed')
        : tGeneral('permissions.status.denied')}
    </Badge>
  );



  const renderModuleCard = (moduleName: string, permissions: any) => {
    const permissionKeys = Object.keys(permissions);

    return (
      <Card
        key={moduleName}
        size="sm"
        variant="outline"
      >
        <CardBody p={4}>
          <VStack
            spacing={3}
            align="stretch"
          >
            <Heading
              size="sm"
              color="brand1.700"
            >
              {tGeneral(`permissions.modules.${moduleName}`)}
            </Heading>
            <VStack
              spacing={2}
              align="stretch"
            >
              {permissionKeys.map((permission) => (
                <HStack
                  key={permission}
                  justify="space-between"
                  fontSize="sm"
                >
                  <Text color="gray.600">
                    {tGeneral(`permissions.actions.${permission}`)}
                  </Text>
                  {renderPermissionBadge(permissions[permission])}
                </HStack>
              ))}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

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
                href="/roles"
                color="gray.500"
              >
                {t('breadcrumb.roles')}
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
                {!role.isSystem && (
                  <Button
                    leftIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    {t('actions.edit')}
                  </Button>
                )}
              </HStack>
            </HStack>
          </Box>

          {/* Role Information Card */}
          <Card variant="outline">
            <CardBody p={4}>
              <VStack
                spacing={4}
                align="stretch"
              >
                <Heading
                  size="sm"
                  color="brand1.700"
                >
                  {t('sections.roleInfo')}
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
                    <Text color="gray.600">{role.id}</Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.name')}:
                    </Text>
                    <Text color="gray.600">{role.name}</Text>
                  </HStack>

                  {role.description && (
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.description')}:
                      </Text>
                      <Text color="gray.600">{role.description}</Text>
                    </HStack>
                  )}

                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.type')}:
                    </Text>
                    <Tag
                      colorScheme={role.isSystem ? 'orange' : 'blue'}
                      variant="subtle"
                      size="sm"
                      px={2}
                      py={1}
                    >
                      {role.isSystem
                        ? t('fields.systemRole')
                        : t('fields.customRole')}
                    </Tag>
                  </HStack>
                </VStack>

                <Divider />

                {/* Timestamps */}
                <VStack
                  spacing={4}
                  align="stretch"
                >
                  {role.createdAt && (
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.createdAt')}:
                      </Text>
                      <Text color="gray.600">
                        {new Date(role.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </HStack>
                  )}

                  {role.updatedAt && (
                    <HStack justify="space-between">
                      <Text
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        {t('fields.updatedAt')}:
                      </Text>
                      <Text color="gray.600">
                        {new Date(role.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Permissions Card */}
          <Card variant="outline">
            <CardBody p={4}>
              <VStack
                spacing={4}
                align="stretch"
              >
                <Heading
                  size="sm"
                  color="brand1.700"
                >
                  {t('sections.permissions')}
                </Heading>

                <Grid
                  templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                  gap={4}
                >
                  {Object.entries(role.permissions).map(
                    ([moduleName, permissions]) => (
                      <GridItem key={moduleName}>
                        {renderModuleCard(moduleName, permissions)}
                      </GridItem>
                    )
                  )}
                </Grid>
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

ViewRolePage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/roles/view');
  if (errors) {
    return errors;
  }

  const id = params?.id as string;

  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.roles.view',
        'pages.roles.index',
        'layouts.private.header',
        'general.common',
        'general.permissions',
        'general.audit',
      ]),
    },
  };
};

export default ViewRolePage;
