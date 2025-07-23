import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Tag,
  Avatar,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetReservation } from 'lib/hooks';
import { useGetReservationReviews } from 'lib/hooks/use-reviews';
import { format } from 'date-fns';
import Loader from 'components/shared/loader';
import { getReservationStatusConfig } from 'lib/helpers/utils';

const ReservationViewPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.reservations.view');
  const tIndex = useTranslations('pages.reservations.index');
  const router = useRouter();
  const { id } = router.query;
  const { reservation, isPending } = useGetReservation({ id: id as string });
  const { data: reviewsData, isPending: isReviewsPending } =
    useGetReservationReviews({
      reservationId: id as string,
      enabled: reservation?.status === 'finished',
    });

  if (isPending) {
    return <Loader size="lg" />;
  }

  if (!reservation) {
    return (
      <VStack
        spacing={6}
        align="stretch"
        p={6}
      >
        <Text color="red.500">{t('notFound')}</Text>
      </VStack>
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
                href="/reservations"
                color="gray.500"
              >
                {t('breadcrumb.reservations')}
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
              align="center"
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
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="outline"
                onClick={() => router.push('/reservations')}
              >
                {t('actions.back')}
              </Button>
            </HStack>
          </Box>
          <PermissionGuard
            module="reservations"
            action="read"
          >
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={6}
            >
              {/* Información de la Reserva */}
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
                      {t('sections.reservationInfo')}
                    </Heading>
                    {/* ID y Estado */}
                    <HStack justify="space-between">
                      <Text fontWeight="semibold">{t('fields.id')}:</Text>
                      <Text>{reservation.id}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold">{t('fields.status')}:</Text>
                      {(() => {
                        const statusConfig = getReservationStatusConfig(
                          reservation.status,
                          (key) => tIndex(`status.${key}`)
                        );
                        return (
                          <Tag
                            colorScheme={statusConfig.color}
                            variant="solid"
                            size="sm"
                            px={3}
                            py={1}
                            fontWeight="medium"
                          >
                            {statusConfig.label}
                          </Tag>
                        );
                      })()}
                    </HStack>

                    <Divider />

                    {/* Ubicación de Cuidado */}
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.600"
                        mb={2}
                      >
                        {t('sections.careLocation')}
                      </Text>
                      <VStack
                        align="stretch"
                        spacing={2}
                      >
                        <HStack justify="space-between">
                          <Text fontWeight="medium">{t('fields.place')}:</Text>
                          <Text>
                            {tIndex(
                              `careLocationLabels.${reservation.careLocation}`
                            )}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontWeight="medium">
                            {t('fields.address')}:
                          </Text>
                          <Text>
                            {reservation.address.fullAddress}
                            {(reservation.address.floor ||
                              reservation.address.apartment) &&
                              `, (${
                                reservation.address.floor
                                  ? `${t('floor')} ${reservation.address.floor}`
                                  : ''
                              }${
                                reservation.address.floor &&
                                reservation.address.apartment
                                  ? ', '
                                  : ''
                              }${
                                reservation.address.apartment
                                  ? `${t('apartment')} ${
                                      reservation.address.apartment
                                    }`
                                  : ''
                              })`}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Fechas */}
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.600"
                        mb={2}
                      >
                        {t('sections.dates')}
                      </Text>
                      <VStack
                        align="stretch"
                        spacing={2}
                      >
                        <HStack justify="space-between">
                          <Text fontWeight="medium">{t('fields.start')}:</Text>
                          <Text>
                            {format(
                              new Date(reservation.startDate),
                              'dd/MM/yyyy'
                            )}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontWeight="medium">{t('fields.end')}:</Text>
                          <Text>
                            {format(
                              new Date(reservation.endDate),
                              'dd/MM/yyyy'
                            )}
                          </Text>
                        </HStack>
                        {reservation.visitsCount && (
                          <HStack justify="space-between">
                            <Text fontWeight="medium">
                              {t('fields.visits')}:
                            </Text>
                            <Text>{reservation.visitsCount}</Text>
                          </HStack>
                        )}
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Mascotas */}
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.600"
                        mb={2}
                      >
                        {t('sections.pets')}
                      </Text>
                      <VStack
                        align="stretch"
                        spacing={1}
                      >
                        {reservation.pets.map((pet, index) => (
                          <Text key={pet.id}>
                            {pet.name} ({pet.petType.name})
                            {index < reservation.pets.length - 1 ? ',' : ''}
                          </Text>
                        ))}
                      </VStack>
                    </Box>

                    {/* Reviews - Solo mostrar si el estado es 'finished' */}
                    {reservation.status === 'finished' && (
                      <>
                        <Divider />
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color="gray.600"
                            mb={2}
                          >
                            {t('sections.reviews')}
                          </Text>
                          <VStack
                            align="stretch"
                            spacing={3}
                          >
                            {/* Review del Usuario */}
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                mb={1}
                              >
                                {reservation.user.firstName}{' '}
                                {reservation.user.lastName}
                              </Text>
                              {reviewsData?.reviews.owner ? (
                                <VStack
                                  align="stretch"
                                  spacing={1}
                                  p={2}
                                  bg="gray.50"
                                  borderRadius="md"
                                >
                                  <HStack justify="space-between">
                                    <Text fontSize="smaller">
                                      {'⭐'.repeat(
                                        reviewsData.reviews.owner.rating
                                      )}
                                    </Text>
                                  </HStack>
                                  {reviewsData.reviews.owner.comment && (
                                    <Text fontSize="sm">
                                      {reviewsData.reviews.owner.comment}
                                    </Text>
                                  )}
                                </VStack>
                              ) : (
                                <Text
                                  fontSize="sm"
                                  color="gray.500"
                                >
                                  {t('reviews.noUserReview')}
                                </Text>
                              )}
                            </Box>

                            {/* Review del Cuidador */}
                            <Box>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                mb={1}
                              >
                                {reservation.caregiver.firstName}{' '}
                                {reservation.caregiver.lastName}
                              </Text>
                              {reviewsData?.reviews.caregiver ? (
                                <VStack
                                  align="stretch"
                                  spacing={1}
                                  p={2}
                                  bg="gray.50"
                                  borderRadius="md"
                                >
                                  <HStack justify="space-between">
                                    <Text fontSize="smaller">
                                      {'⭐'.repeat(
                                        reviewsData.reviews.caregiver.rating
                                      )}
                                    </Text>
                                  </HStack>
                                  {reviewsData.reviews.caregiver.comment && (
                                    <Text fontSize="sm">
                                      {reviewsData.reviews.caregiver.comment}
                                    </Text>
                                  )}
                                </VStack>
                              ) : (
                                <Text
                                  fontSize="sm"
                                  color="gray.500"
                                >
                                  {t('reviews.noCaregiverReview')}
                                </Text>
                              )}
                            </Box>
                          </VStack>
                        </Box>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>
              {/* Primera Card Derecha - Usuarios */}
              <VStack
                spacing={6}
                width="100%"
                height="100%"
              >
                <Card width="100%">
                  <CardBody>
                    <VStack
                      spacing={6}
                      align="stretch"
                    >
                      <Heading
                        size="sm"
                        color="brand1.700"
                      >
                        {t('sections.users')}
                      </Heading>
                      <Box>
                        <Text
                          fontWeight="bold"
                          mb={2}
                        >
                          {t('fields.user')}:
                        </Text>
                        <HStack>
                          <Avatar
                            size="sm"
                            src={reservation.user.avatar}
                            name={`${reservation.user.firstName} ${reservation.user.lastName}`}
                          />
                          <VStack
                            align="start"
                            spacing={0}
                          >
                            <Text fontWeight="medium">
                              {reservation.user.firstName}{' '}
                              {reservation.user.lastName}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.600"
                            >
                              {reservation.user.email}
                            </Text>
                            {reservation.user.phoneNumber && (
                              <Text
                                fontSize="sm"
                                color="gray.600"
                              >
                                {reservation.user.phoneNumber}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </Box>
                      <Divider />
                      <Box>
                        <Text
                          fontWeight="bold"
                          mb={2}
                        >
                          {t('fields.caregiver')}:
                        </Text>
                        <HStack>
                          <Avatar
                            size="sm"
                            src={reservation.caregiver.avatar}
                            name={`${reservation.caregiver.firstName} ${reservation.caregiver.lastName}`}
                          />
                          <VStack
                            align="start"
                            spacing={0}
                          >
                            <Text fontWeight="medium">
                              {reservation.caregiver.firstName}{' '}
                              {reservation.caregiver.lastName}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.600"
                            >
                              {reservation.caregiver.email}
                            </Text>
                            {reservation.caregiver.phoneNumber && (
                              <Text
                                fontSize="sm"
                                color="gray.600"
                              >
                                {reservation.caregiver.phoneNumber}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
                {/* Segunda Card Derecha - Monto */}
                <Card width="100%">
                  <CardBody>
                    <Heading
                      size="sm"
                      color="brand1.700"
                      mb={4}
                    >
                      {t('sections.pricing')}
                    </Heading>
                    <VStack
                      align="stretch"
                      spacing={3}
                    >
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{t('fields.totalPrice')}:</Text>
                        <Text>{reservation.totalPrice}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{t('fields.commission')}:</Text>
                        <Text>{reservation.commission}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{t('fields.totalOwner')}:</Text>
                        <Text>{reservation.totalOwner}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">
                          {t('fields.totalCaregiver')}:
                        </Text>
                        <Text>{reservation.totalCaregiver}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
                {/* Tercera Card Derecha - Estado/Timestamps */}
                <Card width="100%">
                  <CardBody>
                    <VStack
                      spacing={6}
                      align="stretch"
                    >
                      <HStack>
                        <Text fontWeight="bold">{t('fields.createdAt')}:</Text>
                        <Text>
                          {format(
                            new Date(reservation.createdAt!),
                            'dd/MM/yyyy HH:mm'
                          )}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="bold">{t('fields.updatedAt')}:</Text>
                        <Text>
                          {format(
                            new Date(reservation.updatedAt!),
                            'dd/MM/yyyy HH:mm'
                          )}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </SimpleGrid>
          </PermissionGuard>
        </VStack>
      </Container>
    </>
  );
};

ReservationViewPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
}) => {
  return {
    props: {
      messages: pick(await import(`../../../message/${locale}.json`), [
        'pages.reservations.view',
        'pages.reservations.index',
        'layouts.private.header',
        'components.shared.table',
        'components.shared.pagination',
        'general.common',
        'general.sidebar',
      ]),
    },
  };
};

export default ReservationViewPage;
