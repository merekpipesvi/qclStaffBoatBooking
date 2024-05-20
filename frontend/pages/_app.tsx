import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { config } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import { theme } from '../theme';
import '../styles/global.css';
import { Header } from '@/components/Header/Header';
import { store } from '@/state/store';
import { AuthWrapper } from '@/utils/AuthWrapper';
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
config.autoAddCss = false;

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
          <link rel="shortcut icon" href="../../static/QCL_Q.png" />
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
