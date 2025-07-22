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
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ChevronRightIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetPetType } from '@hooks/use-pet-types';
import { Loader } from 'components/shared';

interface ViewPetTypePageProps {
  id: string;
}

const ViewPetTypePage: NextPageWithLayout<ViewPetTypePageProps> = ({ id }) => {
  const t = useTranslations('pages.petTypes.view');
  const router = useRouter();
  const { petType, isPending } = useGetPetType({ id });

  const handleEdit = () => {
    router.push(`/petTypes/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/petTypes');
  };

  if (isPending) {
    return <Loader fullHeight />;
  }

  if (!petType) {
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
                <Text color="gray.600">{t('description')}</Text>
              </Box>
              <HStack spacing={3}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="outline"
                  onClick={handleBack}
                >
                  {t('actions.back')}
                </Button>
                <Button
                  leftIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  {t('actions.edit')}
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* Pet Type Details */}
          <Card>
            <CardBody>
              <VStack
                spacing={6}
                align="stretch"
              >
                <Heading
                  size="sm"
                  color="brand1.700"
                >
                  {t('sections.petTypeInfo')}
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
                  <Text color="gray.600">{petType.id}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.name')}:
                  </Text>
                  <Text color="gray.600">{petType.name}</Text>
                </HStack>
              </VStack>

              <Divider />

              {/* Timestamps */}
              <VStack
                spacing={4}
                align="stretch"
              >
                {petType.createdAt && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.createdAt')}:
                    </Text>
                    <Text color="gray.600">
                      {new Date(petType.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </HStack>
                )}

                {petType.updatedAt && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.updatedAt')}:
                    </Text>
                    <Text color="gray.600">
                      {new Date(petType.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
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
      </VStack>
      </Container>
    </>
  );
};

ViewPetTypePage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(
    ctx.req,
    ctx.res,
    '/petTypes/view'
  );
  if (errors) {
    return errors;
  }

  const id = params?.id as string;

  return {
    props: {
      id,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.petTypes.view',
        'pages.petTypes.index',
        'layouts.private.header',
        'components.forms.petType',
        'general.form.errors',
        'general.common',
      ]),
    },
  };
};

export default ViewPetTypePage;
