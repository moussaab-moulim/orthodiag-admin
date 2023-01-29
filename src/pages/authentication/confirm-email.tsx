import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { AuthBanner } from '../../components/authentication/auth-banner';
import { AmplifyVerifyCode } from '../../components/authentication/amplify-verify-code';
import { Logo } from '../../components/logo';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';
import { PageLayout } from '@components/page-layout';
import { useConfirmEmailMutation } from '@slices/authentication';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

type Platform = 'Amplify' | 'Auth0' | 'Firebase' | 'JWT';

const platformIcons: { [key in Platform]: string } = {
  Amplify: '/static/icons/amplify.svg',
  Auth0: '/static/icons/auth0.svg',
  Firebase: '/static/icons/firebase.svg',
  JWT: '/static/icons/jwt.svg',
};

const VerifyCode: NextPage = () => {
  const router = useRouter();
  const { platform }: { platform: Platform } = useAuth();
  const { disableGuard, token } = router.query;
  const [confirmEmail, { isLoading, isError, error, isSuccess }] =
    useConfirmEmailMutation();
  console.log('error', error);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
    if (token) {
      confirmEmail(token as string);
    } else {
      router.replace('/404');
    }
  }, [token]);
  const { t } = useTranslation();
  return (
    <PageLayout metaTitle={`Verify Code`}>
      <Box
        component='main'
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/*         <AuthBanner /> */}
        <Container
          maxWidth='sm'
          sx={{
            py: {
              xs: '60px',
              md: '120px',
            },
          }}
        >
          {/*         <Box
            sx={{
              alignItems: 'center',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'neutral.900' : 'neutral.100',
              borderColor: 'divider',
              borderRadius: 1,
              borderStyle: 'solid',
              borderWidth: 1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              mb: 4,
              p: 2,
              '& > img': {
                height: 32,
                width: 'auto',
                flexGrow: 0,
                flexShrink: 0,
              },
            }}
          >
            <Typography color='textSecondary' variant='caption'>
              The app authenticates via {platform}
            </Typography>
            <img alt='Auth platform' src={platformIcons[platform]} />
          </Box> */}
          <Card elevation={16} sx={{ p: 4 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <NextLink href='/' passHref>
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40,
                    }}
                    variant='light'
                  />
                </a>
              </NextLink>
              <Typography variant='h4'>{t('Email confirmation')}</Typography>
              <Typography color='textSecondary' sx={{ mt: 2 }} variant='body2'>
                {t('We are confirming your email')}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              {isLoading && (
                <Alert severity='info' icon={<CircularProgress />}>
                  Merci de patientez
                </Alert>
              )}
              {isError && (
                <Alert severity='error'>
                  <AlertTitle>
                    Un error est survenu:{' '}
                    {(error as FetchBaseQueryError).status}
                  </AlertTitle>
                  {(error as any)?.data?.error === 'notFound'
                    ? "Cette email est déjà confirmé ou n'existe pas"
                    : 'inconnu'}
                </Alert>
              )}
              {isSuccess && (
                <Alert severity='success'>
                  <AlertTitle>Votre email est confirmé avec succes</AlertTitle>
                  Veuilliez fermer cette page
                </Alert>
              )}
            </Box>
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

VerifyCode.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default VerifyCode;
