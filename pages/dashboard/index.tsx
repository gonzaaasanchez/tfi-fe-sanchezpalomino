import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { PrivateLayout } from 'layouts/private';
import { GetServerSideProps } from 'next';
import { pick } from 'lodash';
import { useTranslations } from 'next-intl';

const Dashboard: NextPageWithLayout = () => {
  const t = useTranslations('pages.dashboard.index');

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
      />
      <VStack spacing={6} align="stretch" p={6}>
        <Box>
          <Heading size="lg" mb={2}>
            {t('title')}
          </Heading>
          <Text color="gray.600">
            {t('description')}
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
        'layouts.private.header',
        'general.common',
        'general.sidebar'
      ])
    }
  };
}

export default Dashboard;