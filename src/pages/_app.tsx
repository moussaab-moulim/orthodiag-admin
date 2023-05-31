import { useEffect } from 'react';
import type { FC } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { Provider as ReduxProvider } from 'react-redux';
import nProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { RTL } from '../components/rtl';
import { SettingsButton } from '../components/settings-button';
import { SplashScreen } from '../components/splash-screen';
import {
  SettingsConsumer,
  SettingsProvider,
} from '../contexts/settings-context';
import { AuthConsumer, AuthProvider } from '../contexts/jwt-context';
import { gtmConfig } from '../config';
import { gtm } from '../lib/gtm';
import { store, wrapper } from '../store';
import { createTheme } from '../theme';
import { createEmotionCache } from '../utils/create-emotion-cache';
import '../i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'reactflow/dist/style.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App: FC<EnhancedAppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Orthodiag admin</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => (
                  <ThemeProvider
                    theme={createTheme({
                      direction: settings.direction,
                      responsiveFontSizes: settings.responsiveFontSizes,
                      mode: settings.theme,
                    })}
                  >
                    <RTL direction={settings.direction}>
                      <CssBaseline />

                      <ToastContainer
                        position='top-center'
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop
                        draggable={false}
                        theme='colored'
                        closeOnClick
                        pauseOnHover
                      />
                      <SettingsButton />
                      <AuthConsumer>
                        {(auth) =>
                          !auth.isInitialized ? (
                            <SplashScreen />
                          ) : (
                            getLayout(<Component {...pageProps} />)
                          )
                        }
                      </AuthConsumer>
                    </RTL>
                  </ThemeProvider>
                )}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
