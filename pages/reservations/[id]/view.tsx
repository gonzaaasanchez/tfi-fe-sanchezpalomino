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
  Grid,
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
            {/* Información de la Reserva */}
            <Card>
              <CardBody>
                <Heading
                  size="md"
                  mb={4}
                >
                  Información de la Reserva
                </Heading>
                <VStack
                  align="stretch"
                  spacing={4}
                >
                  {/* ID y Estado */}
                  <HStack>
                    <Text fontWeight="semibold">{t('fields.id')}:</Text>
                    <Text>{reservation.id}</Text>
                  </HStack>
                  <HStack>
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
                      Ubicación de Cuidado
                    </Text>
                    <VStack
                      align="stretch"
                      spacing={2}
                    >
                      <HStack>
                        <Text fontWeight="medium">Lugar:</Text>
                        <Text>
                          {tIndex(
                            `careLocationLabels.${reservation.careLocation}`
                          )}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="medium">Dirección:</Text>
                        <Text>
                          {reservation.address.fullAddress}
                          {reservation.address.floor &&
                            `, Piso ${reservation.address.floor}`}
                          {reservation.address.apartment &&
                            `, Depto ${reservation.address.apartment}`}
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
                      Fechas
                    </Text>
                    <VStack
                      align="stretch"
                      spacing={2}
                    >
                      <HStack>
                        <Text fontWeight="medium">Inicio:</Text>
                        <Text>
                          {format(
                            new Date(reservation.startDate),
                            'dd/MM/yyyy'
                          )}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="medium">Fin:</Text>
                        <Text>
                          {format(new Date(reservation.endDate), 'dd/MM/yyyy')}
                        </Text>
                      </HStack>
                      {reservation.visitsCount && (
                        <HStack>
                          <Text fontWeight="medium">Visitas:</Text>
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
                      Mascotas
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
                </VStack>
              </CardBody>
            </Card>
            {/* Primera Card Derecha - Usuarios */}
            <VStack
              spacing={6}
              width="100%"
              height="100%"
            >
              <Card
                height="100%"
                width="100%"
              >
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
              {/* Segunda Card Derecha - Monto */}
              <Card
                height="100%"
                width="100%"
              >
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
                      <Text fontWeight="bold">
                        {t('fields.totalCaregiver')}:
                      </Text>
                      <Text>{reservation.totalCaregiver}</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
              {/* Tercera Card Derecha - Estado/Timestamps */}
              <Card
                height="100%"
                width="100%"
              >
                <CardBody>
                  <VStack
                    align="stretch"
                    spacing={3}
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
