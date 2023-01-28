import Head from 'next/head';
import React, { Fragment, PropsWithChildren } from 'react';

interface IProps {
  metaTitle?: string;
}

export const PageLayout = ({
  metaTitle,
  children,
}: PropsWithChildren<IProps>) => {
  return (
    <Fragment>
      <Head>
        <title>{`${metaTitle ? metaTitle + ' | ' : ''}Orthodiag admin`}</title>
        <meta name='robots' content='noindex,nofollow' />
      </Head>
      <Fragment>{children}</Fragment>
    </Fragment>
  );
};
