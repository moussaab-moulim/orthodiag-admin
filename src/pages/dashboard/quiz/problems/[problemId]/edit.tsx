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
import { useGetProblemQuery } from '@slices/problemReduxApi';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { DataErrorComponent } from '@components/ErroComponents';
import { LoadingSkeleton } from '@components/Loading';
import { EditProblemForm } from '@components/dashboard/quiz/EditProblemFrom';

const ProblemEdit: NextPage = () => {
  const router = useRouter();
  const {
    data: problem,
    isFetching,
    isError,
    error,
  } = useGetProblemQuery(+(router.query?.problemId as string) ?? skipToken);

  useErrorHandler(error);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <PageLayout metaTitle={`Dashboard: Problem Edit`}>
      <Box
        component='main'
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8,
        }}
      >
        {!isFetching && problem ? (
          <Container>
            <Box sx={{ mb: 4 }}>
              <Link
                color='textPrimary'
                component={NextLink}
                href='/dashboard/quiz/problems'
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <ArrowBackIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography variant='subtitle2'>Problems</Typography>
              </Link>
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
                  {problem!.name}
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
                  <Chip label={problem!.code} size='small' sx={{ ml: 1 }} />
                </Box>
              </div>
            </Box>
            <Box mt={3}>
              <EditProblemForm problem={problem} disabled={false} />
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

ProblemEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={DataErrorComponent}>
        {page}
      </ErrorBoundary>
    </DashboardLayout>
  </AuthGuard>
);

export default ProblemEdit;
