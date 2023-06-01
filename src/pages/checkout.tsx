/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../icons/arrow-right';
import { gtm } from '../lib/gtm';
import { PageLayout } from '@components/page-layout';
import { Logo } from '@components/logo';

import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { apiConfig } from 'src/config';
import { Pass } from '@interfaces/order';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutSession } from './api/checkout';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout: NextPage = () => {
  const router = useRouter();

  const isSuccess = router.query.success;
  const isError = router.query.canceled;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    stripePromise.then((st) => console.log('st', st));
  }, []);

  const handleClose = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };
  return (
    <PageLayout metaTitle='Checkout'>
      <Box
        component='main'
        sx={{
          backgroundColor: 'background.paper',
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='lg'>
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
                  variant='light'
                />

              </NextLink>
              <Typography variant='h4'>Passe OrthoDiag</Typography>
              {/*       <Typography color='textSecondary' sx={{ mt: 2 }} variant='body2'>
                {t('We are confirming your email')}
              </Typography> */}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
                display: 'flex',
                flexFlow: 'column nowrap',

                justifyContent: 'center',
              }}
            >
              {isError && (
                <Alert severity='error'>
                  <AlertTitle>Un error est survenu:</AlertTitle>
                  Commande annulée - veuillez ressayer ou contacter le support.
                </Alert>
              )}
              {isSuccess && (
                <Alert severity='success'>
                  <AlertTitle>Commande passée!</AlertTitle>
                  Vous recevrez un e-mail de confirmation. Veillez fermer cetter
                  page et retourner vers l'application
                </Alert>
              )}

              <Button
                color='primary'
                endIcon={<ArrowRightIcon fontSize='small' />}
                size='large'
                sx={{ mt: 3, textAlign: 'center' }}
                type='button'
                variant='contained'
                onClick={handleClose}
              >
                Fermer
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale, query } = context;
  const origin = `http://${context.req.headers.host}/checkout`;

  const { hash, canceled, success } = query;
  if (hash && !success && !canceled) {
    //fetch hash
    const passResponse = await fetch(
      `${apiConfig.apiUrl}/passes/checkout?hash=${hash}`
    );

    if (passResponse.status === 200) {
      const pass: Pass = await passResponse.json();

      try {
        // Create Checkout Sessions from body params.
        const session = await checkoutSession({
          priceId: pass.passPlan.price.id,
          customerId: pass.user.stripeCustomerId,
          origin,
          passId: pass.id,
          hash: hash as string,
        });
        return {
          redirect: {
            statusCode: 303,
            destination: session.url ?? `${origin}`,
          },
        };
      } catch (err) {
        console.error(err);
        throw new Error(err.message);
      }
    }
    if (passResponse.status === 404) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};

export default Checkout;
