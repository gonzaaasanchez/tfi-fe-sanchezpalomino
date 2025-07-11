import type { AppProps } from 'next/app';
import { Theme } from '../styles';
import { NextPage } from 'next';
import { ReactElement, ReactNode, useRef } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: any) => ReactNode;
};

type AppPropsWithLayout = AppProps<{
  dehydratedState: any;
  layout: any;
  session: any;
  messages: any;
}> & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { dehydratedState, layout, session, messages, ...props } = pageProps;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const getLayout = Component.getLayout ?? (page => page);
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';


  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <NextIntlClientProvider
      messages={messages}
      locale="es"
      timeZone={timeZone ?? 'America/New_York'}
    >
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClientRef.current}>
          <HydrationBoundary state={dehydratedState}>
            <Theme>{getLayout(<Component {...props} />, layout)}</Theme>
          </HydrationBoundary> 
          {!isProduction && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
