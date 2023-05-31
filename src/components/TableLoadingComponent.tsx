import { Grid } from '@mui/material';
import React, { Fragment } from 'react';
import { LoadingSkeleton } from './Loading';

export const TableLoadingComponent = ({ lines = 25 }: { lines?: number }) => {
  return (
    <Fragment>
      <Grid container sx={{ width: '100%' }}></Grid>
      {Array.from(Array(lines).keys()).map((_item) => (
        <Grid item sx={{ my: 0 }} key={_item} xs={12}>
          <LoadingSkeleton
            sx={{ width: '100%', borderRadius: 0 }}
            height={76}
          />
        </Grid>
      ))}
    </Fragment>
  );
};
