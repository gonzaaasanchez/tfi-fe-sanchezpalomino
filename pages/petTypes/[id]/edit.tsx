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
import { PetTypeForm } from 'components/forms/pet-types';
import { useCustomToast } from '@hooks/use-custom-toast';
import { handlePermission } from '@helpers/middlewares';
import { PrivateLayout } from 'layouts';
import { useGetPetType } from '@hooks/use-pet-types';
import { LottieLoader } from 'components/shared';

interface EditPetTypePageProps {
  id: string;
}

const EditPetTypePage: NextPageWithLayout<EditPetTypePageProps> = ({ id }) => {
  const t = useTranslations('pages.petTypes.edit');
  const tForm = useTranslations('components.forms.petType');
  const router = useRouter();
  const { successToast } = useCustomToast();
  const { petType, isPending } = useGetPetType({ id });

  const handleSuccess = () => {
    successToast(tForm('responses.updateSuccess'));
    router.push('/petTypes');
  };

  const handleCancel = () => {
    router.push('/petTypes');
  };

  if (isPending) {
    return <LottieLoader type="loading" size="lg" height="50vh" />;
  }

  if (!petType) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>{t('notFound')}</Text>
      </Container>
    );
  }

  const defaultValues = {
    name: petType.name,
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
              <BreadcrumbLink href="/petTypes" color="gray.500">
                {t('breadcrumb.petTypes')}
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
          <PetTypeForm
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

EditPetTypePage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const id = params?.id as string;
  const errors: any = await handlePermission(ctx.req, ctx.res, '/petTypes/edit');
  if (errors) {
    return errors;
  }
  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.petTypes.edit',
        'pages.petTypes.index',
        'layouts.private.header',
        'components.forms.petType',
        'general.form.errors',
        'general.common',
        'general.sidebar'
      ])
    }
  };
};

export default EditPetTypePage;
