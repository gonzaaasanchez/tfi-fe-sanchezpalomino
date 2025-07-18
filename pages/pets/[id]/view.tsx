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
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetPet } from 'lib/hooks/use-pets';
import { Loader } from 'components/shared';

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
              </HStack>
            </HStack>
          </Box>

          {/* Pet Details */}
          <Box
            bg="white"
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={6}
            shadow="sm"
          >
            <VStack
              spacing={6}
              align="stretch"
            >
              <Heading
                size="sm"
                color="brand1.700"
              >
                {t('sections.petInfo')}
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
                  <Text color="gray.600">{pet.id}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.name')}:
                  </Text>
                  <Text color="gray.600">{pet.name}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.petType')}:
                  </Text>
                  <Text color="gray.600">{pet.petType?.name || '-'}</Text>
                </HStack>

                {pet.comment && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.comment')}:
                    </Text>
                    <Text color="gray.600">{pet.comment}</Text>
                  </HStack>
                )}

                <HStack justify="space-between">
                  <Text
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {t('fields.owner')}:
                  </Text>
                  <Text color="gray.600">
                    {pet.owner?.firstName} {pet.owner?.lastName}
                  </Text>
                </HStack>

                {pet.characteristics && pet.characteristics.length > 0 && (
                  <Box>
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                      mb={2}
                    >
                      {t('fields.characteristics')}:
                    </Text>
                    <VStack
                      align="start"
                      spacing={1}
                    >
                      {pet.characteristics.map((char, index) => (
                        <Text
                          key={index}
                          color="gray.600"
                        >
                          • {char.name}: {char.value}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                )}
              </VStack>

              <Divider />

              {/* Timestamps */}
              <VStack
                spacing={4}
                align="stretch"
              >
                {pet.createdAt && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.createdAt')}:
                    </Text>
                    <Text color="gray.600">
                      {new Date(pet.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </HStack>
                )}

                {pet.updatedAt && (
                  <HStack justify="space-between">
                    <Text
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      {t('fields.updatedAt')}:
                    </Text>
                    <Text color="gray.600">
                      {new Date(pet.updatedAt).toLocaleDateString('es-ES', {
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
          </Box>
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
