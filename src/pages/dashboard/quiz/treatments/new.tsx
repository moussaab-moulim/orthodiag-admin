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

import { PageLayout } from '@components/page-layout';
import { useGetTreatmentQuery } from '@slices/treatmentReduxApi';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { DataErrorComponent } from '@components/ErroComponents';
import { LoadingSkeleton } from '@components/Loading';
import { EditTreatmentForm } from '@components/dashboard/quiz/EditTreatmentForm';
import { gtm } from '@lib/gtm';
import { AuthGuard } from '@components/authentication/auth-guard';
import { DashboardLayout } from '@components/dashboard/dashboard-layout';
import { useTranslation } from 'react-i18next';

const TreatmentCreate: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
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
                <Typography variant='subtitle2'>Treatments</Typography>
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
                {t('new-treatment')}
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <EditTreatmentForm disabled={false} />
          </Box>
        </Container>
      </Box>
    </PageLayout>
  );
};

TreatmentCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={DataErrorComponent}>
        {page}
      </ErrorBoundary>
    </DashboardLayout>
  </AuthGuard>
);

export default TreatmentCreate;
