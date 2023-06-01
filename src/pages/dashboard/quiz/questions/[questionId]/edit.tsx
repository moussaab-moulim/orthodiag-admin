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
import { useGetQuestionQuery } from '@slices/questionReduxApi';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { DataErrorComponent } from '@components/ErroComponents';
import { LoadingSkeleton } from '@components/Loading';
import { EditQuestionForm } from '@components/dashboard/quiz/EditQuestionForm';

const QuestionEdit: NextPage = () => {
  const router = useRouter();
  const {
    data: question,
    isFetching,
    isError,
    error,
  } = useGetQuestionQuery(+(router.query?.questionId as string) ?? skipToken);

  useErrorHandler(error);
  useEffect(() => {
    console.log('mount');
    gtm.push({ event: 'page_view' });
    return () => {
      console.log('unmout', question);
    };
  }, []);

  return (
    <PageLayout metaTitle={`Dashboard: Question Edit`}>
      <Box
        component='main'
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8,
        }}
      >
        {!isFetching && question ? (
          <Container>
            <Box sx={{ mb: 4 }}>
              <Link
                color='textPrimary'
                component={NextLink}
                href='/dashboard/quiz/questions'
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <ArrowBackIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography variant='subtitle2'>Questions</Typography>
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
                  {question!.question}
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
                  <Chip label={question!.code} size='small' sx={{ ml: 1 }} />
                </Box>
              </div>
            </Box>
            <Box mt={3}>
              <EditQuestionForm disabled={false} question={question} />
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

QuestionEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={DataErrorComponent}>
        {page}
      </ErrorBoundary>
    </DashboardLayout>
  </AuthGuard>
);

export default QuestionEdit;
