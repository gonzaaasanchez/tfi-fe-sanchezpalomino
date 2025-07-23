import { ReactElement } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next/types';
import { pick } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { PublicLayout } from 'layouts';
import { handlePublicRoute } from '@helpers/middlewares';
import { LoginForm } from 'components/forms/auth/login';

const Login: NextPageWithLayout = () => {
  const t = useTranslations('pages.auth.login');
  const { query } = useRouter();

  const updateMeta = {
    title: t('meta.title'),
    description: t('meta.description')
  };

  return (
    <>
      <NextSeo {...updateMeta} />
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
        'layouts.private',
        'pages.auth.login',
        'components.forms.auth.login',
        'general.common',
        'lib.shared.changePassword',
        'lib.shared.recoverPassword'
      ])
    }
  };
};

export default Login;
