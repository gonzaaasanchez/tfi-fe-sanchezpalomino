import { ReactElement, useState } from 'react';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronRightIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { handlePermission } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { useGetPost } from 'lib/hooks';
import { Loader } from 'components/shared';
import { getImageUrl } from 'lib/helpers/utils';

interface ViewPostPageProps {
  id: string;
}

const ViewPostPage: NextPageWithLayout<ViewPostPageProps> = ({ id }) => {
  const t = useTranslations('pages.posts.view');
  const router = useRouter();
  const { post, isPending } = useGetPost({ id });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = () => {
    router.push(`/posts/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/posts');
  };

  if (isPending) {
    return <Loader fullHeight />;
  }

  if (!post) {
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
                href="/posts"
                color="gray.500"
              >
                {t('breadcrumb.posts')}
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

          {/* Tabs */}
          <Tabs
            variant="enclosed"
            colorScheme="brand1"
            borderColor="brand1.300"
          >
            <TabList>
              <Tab
                bg="brand1.200"
                color="brand1.700"
                fontSize="sm"
                _selected={{
                  bg: 'brand1.600',
                  color: 'white',
                }}
                _hover={{ bg: 'brand1.300' }}
              >
                {t('tabs.information')}
              </Tab>
            </TabList>

            <TabPanels>
              {/* Information Tab */}
              <TabPanel>
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
                        {t('sections.postInfo')}
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
                          <Text color="gray.600">{post.id}</Text>
                        </HStack>

                        <HStack justify="space-between">
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            {t('fields.title')}:
                          </Text>
                          <Text color="gray.600">{post.title}</Text>
                        </HStack>

                        <HStack justify="space-between">
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            {t('fields.description')}:
                          </Text>
                          <Text color="gray.600">{post.description}</Text>
                        </HStack>

                        <HStack justify="space-between">
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            {t('fields.author')}:
                          </Text>
                          <Text color="gray.600">
                            {post.author?.firstName} {post.author?.lastName}
                          </Text>
                        </HStack>

                        <HStack justify="space-between">
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            {t('fields.commentsCount')}:
                          </Text>
                          <Tag
                            colorScheme="blue"
                            variant="subtle"
                            px={3}
                            py={1}
                          >
                            {post.commentsCount || 0}
                          </Tag>
                        </HStack>

                        <HStack justify="space-between">
                          <Text
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            {t('fields.likesCount')}:
                          </Text>
                          <Tag
                            colorScheme="green"
                            variant="subtle"
                            px={3}
                            py={1}
                          >
                            {post.likesCount || 0}
                          </Tag>
                        </HStack>
                      </VStack>

                      {/* Image */}
                      {post.image && (
                        <>
                          <Divider />
                          <Box>
                            <Text
                              fontWeight="semibold"
                              color="gray.700"
                              mb={2}
                            >
                              {t('fields.image')}:
                            </Text>
                            <Box
                              as="img"
                              src={getImageUrl(post.image)}
                              alt={post.title}
                              borderRadius="md"
                              maxH="200px"
                              objectFit="cover"
                              crossOrigin="anonymous"
                              cursor="pointer"
                              transition="transform 0.2s"
                              _hover={{ transform: 'scale(1.02)' }}
                              onClick={onOpen}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = "/images/icon.png";
                              }}
                            />
                          </Box>
                        </>
                      )}

                      <Divider />

                      {/* Timestamps */}
                      <VStack
                        spacing={4}
                        align="stretch"
                      >
                        {post.createdAt && (
                          <HStack justify="space-between">
                            <Text
                              fontWeight="semibold"
                              color="gray.700"
                            >
                              {t('fields.createdAt')}:
                            </Text>
                            <Text color="gray.600">
                              {new Date(post.createdAt).toLocaleDateString(
                                'es-ES',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </Text>
                          </HStack>
                        )}

                        {post.updatedAt && (
                          <HStack justify="space-between">
                            <Text
                              fontWeight="semibold"
                              color="gray.700"
                            >
                              {t('fields.updatedAt')}:
                            </Text>
                            <Text color="gray.600">
                              {new Date(post.updatedAt).toLocaleDateString(
                                'es-ES',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          maxW="100vw"
          maxH="100vh"
          m={0}
        >
          <ModalCloseButton
            color="white"
            bg="blackAlpha.500"
            borderRadius="full"
            size="lg"
            zIndex={9999}
            _hover={{ bg: 'blackAlpha.700' }}
          />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={0}
            onClick={onClose}
          >
            <Box
              as="img"
              src={getImageUrl(post.image)}
              alt={post.title}
              maxW="90vw"
              maxH="90vh"
              objectFit="contain"
              crossOrigin="anonymous"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = "/images/icon.png";
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ViewPostPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  params,
  ...ctx
}) => {
  const errors: any = await handlePermission(ctx.req, ctx.res, '/posts');
  if (errors) {
    return errors;
  }
  return {
    props: {
      id: params?.id as string,
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.posts.view',
        'layouts.private.header',
        'lib.hooks.posts',
        'general.common',
        'general.sidebar',
        'general.auth.logout',
      ]),
    },
  };
};

export default ViewPostPage; 