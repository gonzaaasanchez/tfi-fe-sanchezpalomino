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
import { UserForm } from 'components/forms/user';
import { useCustomToast } from '@hooks/use-custom-toast';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { NextSeo } from 'next-seo';
import { NextPageWithLayout } from 'pages/_app';

const CreateUserPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.users.create');
  const tForm = useTranslations('components.forms.user');
  const router = useRouter();
  const { successToast } = useCustomToast();

  const handleSuccess = () => {
    successToast(tForm('responses.createSuccess'));
    router.push('/users');
  };

  const handleCancel = () => {
    router.push('/users');
  };

  return (
    <PrivateLayout>
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
                {t('breadcrumb.create')}
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
          <UserForm
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
  const errors: any = await handlePermission(ctx.req, ctx.res, '/users/create');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.users.create',
        'pages.users.index',
        'layouts.private.header',
        'components.forms.user',
        'general.form.errors',
        'general.common',
      ]),
    },
  };
};

export default CreateUserPage;
