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
import { PetCharacteristicForm } from 'components/forms/petCharacteristic';
import { useCustomToast } from '@hooks/use-custom-toast';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { NextSeo } from 'next-seo';
import { NextPageWithLayout } from 'pages/_app';

const CreatePetCharacteristicPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.petCharacteristics.create');
  const tForm = useTranslations('components.forms.petCharacteristic');
  const router = useRouter();
  const { successToast } = useCustomToast();

  const handleSuccess = () => {
    successToast(tForm('responses.createSuccess'));
    router.push('/petCharacteristics');
  };

  const handleCancel = () => {
    router.push('/petCharacteristics');
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
                href="/petCharacteristics"
                color="gray.500"
              >
                {t('breadcrumb.petCharacteristics')}
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
          <PetCharacteristicForm
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
    '/petCharacteristics/create'
  );
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.petCharacteristics.create',
        'pages.petCharacteristics.index',
        'layouts.private.header',
        'components.forms.petCharacteristic',
        'general.form.errors',
        'general.common',
        'general.sidebar',
      ]),
    },
  };
};

export default CreatePetCharacteristicPage;
