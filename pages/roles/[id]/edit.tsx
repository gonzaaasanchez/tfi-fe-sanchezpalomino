import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { RoleForm } from 'components/forms/role';
import { useCustomToast } from '@hooks/use-custom-toast';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { useGetRole } from '@hooks/use-roles';
import { Loader } from 'components/shared';

interface EditRolePageProps {
  id: string;
}

const EditRolePage: NextPageWithLayout<EditRolePageProps> = ({ id }) => {
  const t = useTranslations('pages.roles.edit');
  const tForm = useTranslations('components.forms.role');
  const router = useRouter();
  const { successToast } = useCustomToast();
  const { role, isPending } = useGetRole({ id });

  const handleSuccess = () => {
    successToast(tForm('responses.updateSuccess'));
    router.push('/roles');
  };

  const handleCancel = () => {
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
        <Text>Rol no encontrado</Text>
      </Container>
    );
  }

  // No permitir editar roles del sistema
  if (role.isSystem) {
    router.push('/roles');
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
                {t('breadcrumb.edit')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <Text
              color="gray.600"
              fontSize="lg"
            >
              {t('description')}
            </Text>
          </Box>

          {/* Form */}
          <RoleForm
            mode="edit"
            title={t('title')}
            defaultValues={{
              id: role.id,
              name: role.name,
              description: role.description,
              permissions: role.permissions,
            }}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </VStack>
      </Container>
    </>
  );
};

EditRolePage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const id = params?.id as string;

  const errors: any = await handlePermission(ctx.req, ctx.res, '/roles/edit');
  if (errors) {
    return errors;
  }

  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.roles.create',
        'pages.roles.edit',
        'components.forms.role',
        'layouts.private.header',
        'general.common',
        'general.permissions',
      ]),
    },
  };
};

export default EditRolePage;
