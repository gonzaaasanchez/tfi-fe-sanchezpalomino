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
} from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const Dashboard: NextPageWithLayout = () => {
  const t = useTranslations('pages.dashboard.index');

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
                <StatNumber
                  fontSize="3xl"
                  fontWeight="bold"
                  color="blue.600"
                  textAlign="center"
                >
                  1,247
                </StatNumber>
                <StatHelpText
                  color="green.700"
                  fontSize="xs"
                  textAlign="center"
                >
                  +12% desde el mes pasado
                </StatHelpText>
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
                <StatNumber
                  fontSize="3xl"
                  fontWeight="bold"
                  color="purple.600"
                  textAlign="center"
                >
                  856
                </StatNumber>
                <StatHelpText
                  color="green.700"
                  fontSize="xs"
                  textAlign="center"
                >
                  +8% desde el mes pasado
                </StatHelpText>
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
                <StatNumber
                  fontSize="3xl"
                  fontWeight="bold"
                  color="orange.600"
                  textAlign="center"
                >
                  2,134
                </StatNumber>
                <StatHelpText
                  color="red.700"
                  fontSize="xs"
                  textAlign="center"
                >
                  -5% desde el mes pasado
                </StatHelpText>
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
