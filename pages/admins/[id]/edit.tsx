import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { AdminForm } from 'components/forms/admin';
import { useCustomToast } from '@hooks/use-custom-toast';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { NextSeo } from 'next-seo';
import { useGetAdmin } from '@hooks/use-admins';
import { Loader } from 'components/shared';
import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';

interface EditAdminPageProps {
  id: string;
}

const EditAdminPage: NextPageWithLayout<EditAdminPageProps> = ({ id }) => {
  const t = useTranslations('pages.admins.edit');
  const tForm = useTranslations('components.forms.admin');
  const router = useRouter();
  const { successToast } = useCustomToast();

  const { admin, isPending: isLoadingAdmin } = useGetAdmin({
    id: id as string,
  });

  const handleSuccess = () => {
    successToast(tForm('responses.updateSuccess'));
    router.push('/admins');
  };

  const handleCancel = () => {
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
                {t('breadcrumb.edit')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <Heading
              as="h1"
              size="h1"
              color="brand1.700"
              mb={2}
            >
              {t('title')}
            </Heading>
            <Text
              color="gray.600"
              fontSize="lg"
            >
              {t('description')}
            </Text>
          </Box>

          {/* Form */}
          <AdminForm
            mode="edit"
            title={t('form.title')}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            defaultValues={{
              firstName: admin.firstName,
              lastName: admin.lastName,
              email: admin.email,
              password: '',
              role: admin.role?.id || '',
            }}
            id={id as string}
          />
        </VStack>
      </Container>
    </>
  );
};

EditAdminPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/admins/edit');
  if (errors) {
    return errors;
  }

  const id = params?.id as string;

  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'layouts.private.header',
        'pages.admins.edit',
        'pages.admins.index',
        'components.forms.admin',
        'general.form.errors',
        'general.common',
        'general.sidebar',
      ]),
    },
  };
};

export default EditAdminPage;
