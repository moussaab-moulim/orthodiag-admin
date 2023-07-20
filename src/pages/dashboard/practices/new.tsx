import { useEffect } from "react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { PageLayout } from "@components/page-layout";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { useRouter } from "next/router";
import { DataErrorComponent } from "@components/ErroComponents";

import { gtm } from "@lib/gtm";
import { AuthGuard } from "@components/authentication/auth-guard";
import { DashboardLayout } from "@components/dashboard/dashboard-layout";
import { useTranslation } from "react-i18next";
import { EditPracticeForm } from "@components/dashboard/practice/EditPracticeForm";

const PracticeCreate: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <PageLayout metaTitle={`Dashboard: Practice Edit`}>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container>
          <Box sx={{ mb: 4 }}>
            <Link
              color="textPrimary"
              component={NextLink}
              href="/dashboard/practices"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Practices</Typography>
            </Link>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div>
              <Typography noWrap variant="h4">
                {t("new-practice")}
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <EditPracticeForm disabled={false} />
          </Box>
        </Container>
      </Box>
    </PageLayout>
  );
};

PracticeCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={DataErrorComponent}>
        {page}
      </ErrorBoundary>
    </DashboardLayout>
  </AuthGuard>
);

export default PracticeCreate;
