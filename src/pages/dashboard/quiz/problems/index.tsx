import { useEffect, useState } from 'react';

import type { NextPage } from 'next';

import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Grid,
  Typography,
} from '@mui/material';

import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';

import { Plus as PlusIcon } from '../../../../icons/plus';

import { gtm } from '../../../../lib/gtm';

import { PageLayout } from '@components/page-layout';

import { ProblemListTable } from '@components/dashboard/quiz/ProblemListTable';
import { TableErrorComponent } from '@components/ErroComponents';
import { ErrorBoundary } from 'react-error-boundary';
import { CreateQuizModal } from '@components/dashboard/quiz/CreateQuizModal';
import { useRouter } from 'next/router';

const ProblemListPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleAddClick = () => {
    router.push(`${router.route}/new`);
  };
  return (
    <PageLayout metaTitle={`Dashboard: Problems List`}>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='xl'>
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent='space-between' spacing={3}>
              <Grid item>
                <Typography variant='h4'>Problems</Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize='small' />}
                  variant='contained'
                  onClick={handleAddClick}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <ErrorBoundary
              FallbackComponent={TableErrorComponent}
              onError={(error) => {
                console.log('error', error);
              }}
            >
              <ProblemListTable />
            </ErrorBoundary>
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

ProblemListPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default ProblemListPage;
