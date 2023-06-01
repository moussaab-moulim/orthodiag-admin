import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';

import { Logo } from '../../components/logo';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';
import { PageLayout } from '@components/page-layout';
import { PasswordResetForm } from '@components/authentication/password-reset-form';

type Platform = 'Amplify' | 'Auth0' | 'Firebase' | 'JWT';

const PasswordReset: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <PageLayout metaTitle={`Réinitialiser le mot de passe`}>
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
              <NextLink href='/' passHref>

                <Logo
                  sx={{
                    height: 40,
                    width: 40,
                  }}
                />

              </NextLink>
              <Typography variant='h4'>
                Réinitialiser le mot de passe
              </Typography>
              <Typography color='textSecondary' sx={{ mt: 2 }} variant='body2'>
                Veuillez saisir votre nouveau mot de passe.
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <PasswordResetForm />
            </Box>
            <Divider sx={{ my: 3 }} />
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

PasswordReset.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default PasswordReset;
