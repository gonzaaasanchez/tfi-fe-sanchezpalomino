import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next/types';
import { pick } from 'lodash';
import { useTranslations } from 'next-intl';
import { LoginForm } from 'components/forms/auth/login';
import { useRouter } from 'next/router';
import { Center, Tag } from '@chakra-ui/react';
import { PublicLayout } from 'layouts';
import { handlePublicRoute } from '@helpers/middlewares';

const Login: NextPageWithLayout = () => {
  const t = useTranslations('pages.auth.login');
  const { pathname, query, replace } = useRouter();
  const token = query.token as string;
  const resetPassword = query.resetPassword as string;

  const updateMeta = {
    title: t('meta.title'),
    description: t('meta.description')
  };

  return (
    <>
      <NextSeo {...updateMeta} />
      {!!resetPassword && (
        <Center>
          <Tag
            borderRadius="10rem"
            bg="goldenrod.600"
            mb={7}
            size="sm"
            variant="messageSuccess"
          >
            {t('responses.passwordUpdated')}
          </Tag>
        </Center>
      )}
      <LoginForm />
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
  ...ctx
}) => {
  const errors: any = await handlePublicRoute(ctx.req, ctx.res);
  if (errors) {
    return errors;
  }

  return {
    props: {
      messages: pick(await import(`/message/${locale}.json`), [
        'general.form.errors',
        'pages.auth.login',
        'components.forms.auth.login'
      ])
    }
  };
};

export default Login;
