import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { theme } from '../theme';
import '../styles/global.css';
import { Header } from '@/components/Header/Header';
import { store } from '@/state/store';
import { AuthWrapper } from '@/utils/AuthWrapper';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Head>
          <title>QCL Staff Boating</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <AuthWrapper>
          <main className="spa">
            <Header />
              <Component {...pageProps} />
          </main>
        </AuthWrapper>
      </MantineProvider>
    </Provider>
  );
}
