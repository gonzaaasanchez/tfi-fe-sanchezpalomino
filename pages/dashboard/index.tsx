import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Dashboard"
        description="Panel principal"
      />
      <VStack spacing={6} align="stretch" p={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Dashboard
          </Heading>
          <Text color="gray.600">
            Panel principal del sistema
          </Text>
        </Box>
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
        'layouts.private.header'
      ])
    }
  };
}

export default Dashboard;