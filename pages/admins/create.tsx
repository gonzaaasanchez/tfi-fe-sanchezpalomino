import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Text,
  VStack
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
import { NextPageWithLayout } from 'pages/_app';

const CreateAdminPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.admins.create');
  const tForm = useTranslations('components.forms.admin');
  const router = useRouter();
  const { successToast } = useCustomToast();

  const handleSuccess = () => {
    successToast(tForm('responses.createSuccess'));
    router.push('/admins');
  };

  const handleCancel = () => {
    router.push('/admins');
  };

  return (
    <PrivateLayout>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />

      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" color="gray.500">
                {t('breadcrumb.home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admins" color="gray.500">
                {t('breadcrumb.admins')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="brand1.700" fontWeight="medium">
                {t('breadcrumb.create')}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <Text color="gray.600" fontSize="lg">
              {t('description')}
            </Text>
          </Box>

          {/* Form */}
          <AdminForm
            mode="create"
            title={t('title')}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </VStack>
      </Container>
    </PrivateLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/admins/create');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'layouts.private.header',
        'pages.admins.create',
        'pages.admins.index',
        'components.forms.admin',
        'general.form.errors',
        'general.common'
      ])
    }
  };
};

export default CreateAdminPage; 