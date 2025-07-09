import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`
          }}
        />
        <script src="/js/maze.js" async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
