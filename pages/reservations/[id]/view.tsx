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
  Badge,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import { PermissionGuard } from 'components/shared/permission-guard';
import { useGetReservation } from 'lib/hooks';
import { format } from 'date-fns';
import Loader from 'components/shared/loader';
import { getReservationStatusConfig } from 'lib/helpers/utils';

const ReservationViewPage: NextPageWithLayout = () => {
  const t = useTranslations('pages.reservations.view');
  const tIndex = useTranslations('pages.reservations.index');
  const router = useRouter();
  const { id } = router.query;
  const { reservation, isPending } = useGetReservation({ id: id as string });

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
      <VStack
        spacing={6}
        align="stretch"
        p={6}
      >
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
            {/* Basic Information */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  {t('sections.basicInfo')}
                </Heading>
                <VStack
                  align="stretch"
                  spacing={3}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.id')}:</Text>
                    <Text>{reservation.id}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.status')}:</Text>
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
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.careLocation')}:</Text>
                    <Text>
                      {tIndex(`careLocationLabels.${reservation.careLocation}`)}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            {/* Dates */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  {t('sections.dates')}
                </Heading>
                <VStack
                  align="stretch"
                  spacing={3}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.startDate')}:</Text>
                    <Text>
                      {format(
                        new Date(reservation.startDate),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.endDate')}:</Text>
                    <Text>
                      {format(
                        new Date(reservation.endDate),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </Text>
                  </HStack>
                  {reservation.visitsCount && (
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{t('fields.visitsCount')}:</Text>
                      <Text>{reservation.visitsCount}</Text>
                    </HStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
            {/* Location */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  {t('sections.location')}
                </Heading>
                <VStack
                  align="stretch"
                  spacing={3}
                >
                  <Text fontWeight="bold">{reservation.address.name}</Text>
                  <Text>{reservation.address.fullAddress}</Text>
                  {reservation.address.floor && (
                    <Text>Piso: {reservation.address.floor}</Text>
                  )}
                  {reservation.address.apartment && (
                    <Text>Departamento: {reservation.address.apartment}</Text>
                  )}
                  <Text>
                    Coordenadas: {reservation.address.coords.lat},{' '}
                    {reservation.address.coords.lon}
                  </Text>
                  {reservation.distance && (
                    <Text>Distancia: {reservation.distance} km</Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
            {/* Users */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  {t('sections.users')}
                </Heading>
                <VStack
                  align="stretch"
                  spacing={4}
                >
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
            {/* Pets */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  {t('sections.pets')}
                </Heading>
                <VStack
                  align="stretch"
                  spacing={3}
                >
                  {reservation.pets.map((pet) => (
                    <Box
                      key={pet.id}
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                    >
                      <HStack>
                        <Avatar
                          size="sm"
                          src={pet.avatar}
                          name={pet.name}
                        />
                        <VStack
                          align="start"
                          spacing={0}
                          flex={1}
                        >
                          <Text fontWeight="medium">{pet.name}</Text>
                          <Text
                            fontSize="sm"
                            color="gray.600"
                          >
                            {pet.petType.name}
                          </Text>
                          {pet.comment && (
                            <Text
                              fontSize="sm"
                              color="gray.600"
                            >
                              {pet.comment}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                      {pet.characteristics.length > 0 && (
                        <VStack
                          mt={3}
                          align="stretch"
                          spacing={1}
                        >
                          {pet.characteristics.map((char) => (
                            <Text
                              key={char.id}
                              fontSize="sm"
                            >
                              <Text
                                as="span"
                                fontWeight="medium"
                              >
                                {char.name}:
                              </Text>{' '}
                              {char.value}
                            </Text>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
            {/* Monto */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  Monto
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
                    <Text fontWeight="bold">{t('fields.totalCaregiver')}:</Text>
                    <Text>{reservation.totalCaregiver}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            {/* Timestamps */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  {t('sections.status')}
                </Heading>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={3}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.createdAt')}:</Text>
                    <Text>
                      {format(
                        new Date(reservation.createdAt!),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{t('fields.updatedAt')}:</Text>
                    <Text>
                      {format(
                        new Date(reservation.updatedAt!),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </Text>
                  </HStack>
                </SimpleGrid>
              </CardBody>
            </Card>
          </SimpleGrid>
        </PermissionGuard>
      </VStack>
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
      ]),
    },
  };
};

export default ReservationViewPage;
