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

import { QuestionListTable } from '@components/dashboard/quiz/QuestionListTable';
import { TableErrorComponent } from '@components/ErroComponents';
import { ErrorBoundary } from 'react-error-boundary';
import { CreateQuizModal } from '@components/dashboard/quiz/CreateQuizModal';

const QuestionListPage: NextPage = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleAddClick = () => {
    setAddModalOpen(true);
  };
  const handleModalClose = () => {
    setAddModalOpen(false);
  };
  return (
    <PageLayout metaTitle={`Dashboard: Questions List`}>
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
                <Typography variant='h4'>Questions</Typography>
              </Grid>
              <Grid item>
                {/*   <Button
                  startIcon={<PlusIcon fontSize='small' />}
                  variant='contained'
                  onClick={handleAddClick}
                >
                  Ajouter
                </Button> */}

                <CreateQuizModal
                  open={addModalOpen}
                  onClose={handleModalClose}
                />
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
              <QuestionListTable />
            </ErrorBoundary>
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

QuestionListPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default QuestionListPage;
