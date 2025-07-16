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
import { PetTypeForm } from 'components/forms/pet-types';
import { useCustomToast } from '@hooks/use-custom-toast';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { NextSeo } from 'next-seo';
import { NextPageWithLayout } from 'pages/_app';

const CreatePetTypePage: NextPageWithLayout = () => {
  const t = useTranslations('pages.petTypes.create');
  const tForm = useTranslations('components.forms.petType');
  const router = useRouter();
  const { successToast } = useCustomToast();

  const handleSuccess = () => {
    successToast(tForm('responses.createSuccess'));
    router.push('/petTypes');
  };

  const handleCancel = () => {
    router.push('/petTypes');
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
                href="/petTypes"
                color="gray.500"
              >
                {t('breadcrumb.petTypes')}
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
          <PetTypeForm
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
  const errors: any = await handlePermission(
    ctx.req,
    ctx.res,
    '/petTypes/create'
  );
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.petTypes.create',
        'pages.petTypes.index',
        'layouts.private.header',
        'components.forms.petType',
        'general.form.errors',
        'general.common',
      ]),
    },
  };
};

export default CreatePetTypePage;
