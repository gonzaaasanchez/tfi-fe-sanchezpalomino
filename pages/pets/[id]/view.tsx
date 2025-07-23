import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  HStack,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetPet } from 'lib/hooks/use-pets';
import { Loader, PetDetail } from 'components/shared';

interface ViewPetPageProps {
  id: string;
}

const ViewPetPage: NextPageWithLayout<ViewPetPageProps> = ({ id }) => {
  const t = useTranslations('pages.pets.view');
  const router = useRouter();
  const { data: pet, isPending } = useGetPet({ id });

  const handleBack = () => {
    router.push('/pets');
  };

  if (isPending) {
    return <Loader fullHeight />;
  }

  if (!pet) {
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
                href="/pets"
                color="gray.500"
              >
                {t('breadcrumb.pets')}
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

          <PetDetail
            pet={pet}
            onBack={handleBack}
            backButtonText={t('actions.back')}
          />
      </VStack>
      </Container>
    </>
  );
};

ViewPetPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/pets');
  if (errors) {
    return errors;
  }
  return {
    props: {
      id: params?.id as string,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.pets.view',
        'layouts.private.header',
      ]),
    },
  };
};

export default ViewPetPage;
