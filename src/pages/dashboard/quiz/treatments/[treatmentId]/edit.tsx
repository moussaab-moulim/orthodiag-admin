import { useState, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { AuthGuard } from '../../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../../components/dashboard/dashboard-layout';

import { gtm } from '../../../../../lib/gtm';

import { PageLayout } from '@components/page-layout';
import { useGetTreatmentQuery } from '@slices/treatmentReduxApi';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { DataErrorComponent } from '@components/ErroComponents';
import { LoadingSkeleton } from '@components/Loading';
import { EditTreatmentForm } from '@components/dashboard/quiz/EditTreatmentForm';

const TreatmentEdit: NextPage = () => {
  const router = useRouter();
  const {
    data: treatment,
    isFetching,
    isError,
    error,
  } = useGetTreatmentQuery(+(router.query?.treatmentId as string) ?? skipToken);

  useErrorHandler(error);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <PageLayout metaTitle={`Dashboard: Treatment Edit`}>
      <Box
        component='main'
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8,
        }}
      >
        {!isFetching && treatment ? (
          <Container>
            <Box sx={{ mb: 4 }}>
              <NextLink href='/dashboard/quiz/treatments' passHref>
                <Link
                  color='textPrimary'
                  component='a'
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <ArrowBackIcon fontSize='small' sx={{ mr: 1 }} />
                  <Typography variant='subtitle2'>Treatmentes</Typography>
                </Link>
              </NextLink>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <div>
                <Typography noWrap variant='h4'>
                  {treatment!.name}
                </Typography>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography variant='subtitle2'>code:</Typography>
                  <Chip label={treatment!.code} size='small' sx={{ ml: 1 }} />
                </Box>
              </div>
            </Box>
            <Box mt={3}>
              <EditTreatmentForm treatment={treatment} disabled={false} />
            </Box>
          </Container>
        ) : (
          <Container maxWidth='md'>
            <Grid container>
              <Grid xs={12} sx={{ mb: 4 }} item>
                <LoadingSkeleton sx={{ height: 100 }} />{' '}
              </Grid>
              <Grid xs={12} item>
                <LoadingSkeleton sx={{ height: 400 }} />
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>
    </PageLayout>
  );
};

TreatmentEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={DataErrorComponent}>
        {page}
      </ErrorBoundary>
    </DashboardLayout>
  </AuthGuard>
);

export default TreatmentEdit;
