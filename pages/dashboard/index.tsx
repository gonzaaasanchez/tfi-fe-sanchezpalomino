import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
} from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useDashboard } from '../../lib/hooks';

const Dashboard: NextPageWithLayout = () => {
  const t = useTranslations('pages.dashboard.index');
  const { data, loading, error } = useDashboard();

  const RechartsComponents = dynamic(
    () => import('../../components/dashboard/charts'),
    {
      ssr: false,
      loading: () => (
        <Box
          p={4}
          textAlign="center"
        >
          {t('charts.petTypes.loading')}
        </Box>
      ),
    }
  );

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
        <Box>
          <Heading
            size="lg"
            mb={2}
          >
            {t('title')}
          </Heading>
          <Text color="gray.600">{t('description')}</Text>
        </Box>

        {/* Indicadores */}
        <HStack
          spacing={6}
          align="stretch"
        >
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel
                  color="gray.600"
                  fontSize="md"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {t('indicators.totalUsers')}
                </StatLabel>
                {loading ? (
                  <Box
                    textAlign="center"
                    py={4}
                  >
                    <Spinner
                      size="sm"
                      color="blue.500"
                    />
                  </Box>
                ) : (
                  <>
                    <StatNumber
                      fontSize="3xl"
                      fontWeight="bold"
                      color="blue.600"
                      textAlign="center"
                    >
                      {data?.stats.totalUsers.toLocaleString() || '0'}
                    </StatNumber>
                    <StatHelpText
                      color={
                        data?.stats.usersGrowth && data.stats.usersGrowth >= 0
                          ? 'green.700'
                          : 'red.700'
                      }
                      fontSize="xs"
                      textAlign="center"
                    >
                      {data?.stats.usersGrowth && data.stats.usersGrowth >= 0
                        ? '+'
                        : ''}
                      {data?.stats.usersGrowth || 0}% desde el mes pasado
                    </StatHelpText>
                  </>
                )}
              </Stat>
            </CardBody>
          </Card>

          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel
                  color="gray.600"
                  fontSize="md"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {t('indicators.totalReservations')}
                </StatLabel>
                {loading ? (
                  <Box
                    textAlign="center"
                    py={4}
                  >
                    <Spinner
                      size="sm"
                      color="purple.500"
                    />
                  </Box>
                ) : (
                  <>
                    <StatNumber
                      fontSize="3xl"
                      fontWeight="bold"
                      color="purple.600"
                      textAlign="center"
                    >
                      {data?.stats.totalReservations.toLocaleString() || '0'}
                    </StatNumber>
                    <StatHelpText
                      color={
                        data?.stats.reservationsGrowth &&
                        data.stats.reservationsGrowth >= 0
                          ? 'green.700'
                          : 'red.700'
                      }
                      fontSize="xs"
                      textAlign="center"
                    >
                      {data?.stats.reservationsGrowth &&
                      data.stats.reservationsGrowth >= 0
                        ? '+'
                        : ''}
                      {data?.stats.reservationsGrowth || 0}% desde el mes pasado
                    </StatHelpText>
                  </>
                )}
              </Stat>
            </CardBody>
          </Card>

          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel
                  color="gray.600"
                  fontSize="md"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {t('indicators.totalPets')}
                </StatLabel>
                {loading ? (
                  <Box
                    textAlign="center"
                    py={4}
                  >
                    <Spinner
                      size="sm"
                      color="orange.500"
                    />
                  </Box>
                ) : (
                  <>
                    <StatNumber
                      fontSize="3xl"
                      fontWeight="bold"
                      color="orange.600"
                      textAlign="center"
                    >
                      {data?.stats.totalPets.toLocaleString() || '0'}
                    </StatNumber>
                    <StatHelpText
                      color={
                        data?.stats.petsGrowth && data.stats.petsGrowth >= 0
                          ? 'green.700'
                          : 'red.700'
                      }
                      fontSize="xs"
                      textAlign="center"
                    >
                      {data?.stats.petsGrowth && data.stats.petsGrowth >= 0
                        ? '+'
                        : ''}
                      {data?.stats.petsGrowth || 0}% desde el mes pasado
                    </StatHelpText>
                  </>
                )}
              </Stat>
            </CardBody>
          </Card>
        </HStack>

        {/* Gráficos */}
        <RechartsComponents />
      </VStack>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'es',
  ...ctx
}) => {
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.dashboard.index',
        'layouts.private.header',
        'general.common',
        'general.sidebar',
        'general.auth.logout',
      ]),
    },
  };
};

export default Dashboard;
