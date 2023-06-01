import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { AuthBanner } from '../../components/authentication/auth-banner';
import { AmplifyLogin } from '../../components/authentication/amplify-login';
import { Auth0Login } from '../../components/authentication/auth0-login';
import { FirebaseLogin } from '../../components/authentication/firebase-login';
import { JWTLogin } from '../../components/authentication/jwt-login';
import { Logo } from '../../components/logo';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';
import { PageLayout } from '@components/page-layout';
import { useTranslation } from 'react-i18next';

type Platform = 'JWT';

const Login: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { platform }: { platform: Platform } = useAuth();
  const { disableGuard } = router.query;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <PageLayout metaTitle={`Login`}>
      <Box
        component='main'
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth='sm'
          sx={{
            py: {
              xs: '60px',
              md: '120px',
            },
          }}
        >
          <Card elevation={16} sx={{ p: 4 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <NextLink href='/'>
                <Logo
                  sx={{
                    height: 40,
                    width: 40,
                  }}
                />
              </NextLink>
              <Typography variant='h4'> {t('Log in')}</Typography>
              <Typography color='textSecondary' sx={{ mt: 2 }} variant='body2'>
                {t('Sign in on the internal platform ')}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              {platform === 'JWT' && <JWTLogin />}
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* <div>
              <NextLink
                href={
                  disableGuard
                    ? `/authentication/register?disableGuard=${disableGuard}`
                    : '/authentication/register'
                }
                passHref
              >
                <Link color='textSecondary' variant='body2'>
                  {t('Create new account')}
                </Link>
              </NextLink>
            </div> */}

            <Box sx={{ mt: 1 }}>
              <Link
                color='textSecondary'
                href={
                  disableGuard
                    ? `/authentication/password-recovery?disableGuard=${disableGuard}`
                    : '/authentication/password-recovery'
                }
                variant='body2'
                component={NextLink}
              >
                {t('Forgot password')}
              </Link>
            </Box>
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

Login.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default Login;
