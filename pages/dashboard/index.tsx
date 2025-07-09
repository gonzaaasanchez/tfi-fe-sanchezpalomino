import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { handlePrivateRoute } from '@helpers/middlewares';
import { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { pick } from 'lodash';

const Dashboard: NextPageWithLayout = () => {
  const t = useTranslations('pages.dashboard.index');
  return (
    <>
      <NextSeo
        title="Dashboard"
        description="Panel principal"
      />
      
      <Box>
        <Heading as="h1" size="xl" mb={6} color="gray.800">
          {t('title')}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="base"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel fontSize="sm" color="gray.600">Cuidadores Activos</StatLabel>
            <StatNumber fontSize="2xl" color="blue.600">12</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="base"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel fontSize="sm" color="gray.600">Cantidad de visitas por mes</StatLabel>
            <StatNumber fontSize="2xl" color="green.600">8</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12.5%
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="base"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel fontSize="sm" color="gray.600">Ingresos Mensuales</StatLabel>
            <StatNumber fontSize="2xl" color="orange.600">5</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              8.2%
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="base"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel fontSize="sm" color="gray.600">Puntuación Promedio</StatLabel>
            <StatNumber fontSize="2xl" color="purple.600">92%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              5.1%
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box mt={8} p={6} bg="white" rounded="lg" shadow="base" border="1px" borderColor="gray.200">
          <Heading as="h2" size="md" mb={4} color="gray.800">
            Actividad Reciente
          </Heading>
          <Text color="gray.600">
            Aquí puedes ver tu actividad reciente en la plataforma. Próximamente se mostrarán 
            las últimas acciones, proyectos actualizados y notificaciones importantes.
          </Text>
        </Box>
      </Box>
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
  const errors: any = await handlePrivateRoute(ctx.req, ctx.res, '/dashboard');
  if (errors) {
    return errors;
  }
  return {
    props: {
      messages: pick(await import(`../../message/${locale}.json`), [
        'pages.dashboard.index'
      ])
    }
  };
}

export default Dashboard;