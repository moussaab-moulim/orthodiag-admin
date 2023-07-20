import { useEffect } from "react";

import type { NextPage } from "next";

import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";

import { PageLayout } from "@components/page-layout";
import { Plus as PlusIcon } from "../../../icons/plus";
import { TableErrorComponent } from "@components/ErroComponents";
import { ErrorBoundary } from "react-error-boundary";
import { PracticeListTable } from "@components/dashboard/practice/PracticeListTable";
import { AuthGuard } from "@components/authentication/auth-guard";
import { DashboardLayout } from "@components/dashboard/dashboard-layout";
import { gtm } from "@lib/gtm";
import { useRouter } from "next/router";

const QuizListPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const handleAddClick = () => {
    router.push(`${router.route}/new`);
  };

  return (
    <PageLayout metaTitle={`Dashboard: Practices List`}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Practices</Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
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
                console.log("error", error);
              }}
            >
              <PracticeListTable />
            </ErrorBoundary>
          </Card>
        </Container>
      </Box>
    </PageLayout>
  );
};

QuizListPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default QuizListPage;
