import { Fragment } from 'react';

import type { NextPage } from 'next';

import Head from 'next/head';
import { AuthGuard } from '@components/authentication/auth-guard';
import { DashboardLayout } from '@components/dashboard/dashboard-layout';
import type { GetServerSideProps } from 'next/types';

const QuizPage: NextPage = () => {
  return <Fragment />;
};

QuizPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default QuizPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: true,
      destination: `/dashboard/quiz/quizes`,
    },
  };
};
