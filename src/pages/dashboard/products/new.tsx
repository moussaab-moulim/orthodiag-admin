import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProductCreateForm } from '../../../components/dashboard/product/product-create-form';
import { gtm } from '../../../lib/gtm';
import { PageLayout } from '@components/page-layout';

const ProductCreate: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <PageLayout metaTitle={`Dashboard: Product Create`}>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='md'>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h4'>Create a new product</Typography>
            <Breadcrumbs separator='/' sx={{ mt: 1 }}>
              <Link component={NextLink} href='/dashboard' variant='subtitle2'>
                Dashboard
              </Link>

              <Link
                href='/dashboard'
                component={NextLink}
                color='primary'
                variant='subtitle2'
              >
                Management
              </Link>

              <Typography color='textSecondary' variant='subtitle2'>
                Products
              </Typography>
            </Breadcrumbs>
          </Box>
          <ProductCreateForm />
        </Container>
      </Box>
    </PageLayout>
  );
};

ProductCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default ProductCreate;
