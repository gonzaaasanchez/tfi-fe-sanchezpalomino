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
  VStack
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
import { useGetPetCharacteristic } from 'lib/hooks';
import { PetCharacteristicFormType } from 'lib/types/forms';
import { LottieLoader } from 'components/shared';

interface EditPetCharacteristicPageProps {
  id: string;
}

const EditPetCharacteristicPage: NextPageWithLayout<EditPetCharacteristicPageProps> = ({ id }) => {
  const t = useTranslations('pages.petCharacteristics.edit');
  const tCommon = useTranslations('general.common');
  const tForm = useTranslations('components.forms.petCharacteristic');
  const router = useRouter();
  const { successToast } = useCustomToast();
  const { petCharacteristic, isPending } = useGetPetCharacteristic({ id });

  const handleSuccess = () => {
    successToast(tForm('responses.updateSuccess'));
    router.push('/petCharacteristics');
  };

  const handleCancel = () => {
    router.push('/petCharacteristics');
  };

  if (isPending) {
    return <LottieLoader type="loading" size="lg" height="50vh" />;
  }

  if (!petCharacteristic) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>{tCommon('notFound')}</Text>
      </Container>
    );
  }

  const defaultValues: PetCharacteristicFormType = {
    name: petCharacteristic.name
  };

  return (
    <>
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
              <BreadcrumbLink href="/petCharacteristics" color="gray.500">
                {t('breadcrumb.petCharacteristics')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="brand1.700" fontWeight="medium">
                {t('breadcrumb.edit')}
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
          <PetCharacteristicForm
            mode="edit"
            title={t('title')}
            defaultValues={defaultValues}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            id={id}
          />
        </VStack>
      </Container>
    </>
  );
};

EditPetCharacteristicPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/petCharacteristics/edit');
  if (errors) {
    return errors;
  }
  
  const id = params?.id as string;
  
  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.petCharacteristics.edit',
        'pages.petCharacteristics.index',
        'layouts.private.header',
        'components.forms.petCharacteristic',
        'general.form.errors',
        'general.common',
        'general.sidebar'
      ])
    }
  };
};

export default EditPetCharacteristicPage; 