import {
  Backdrop,
  BackdropTypeMap,
  Box,
  CircularProgress,
  Skeleton as MuiSkeleton,
  styled,
} from '@mui/material';
import {
  DefaultComponentProps,
  OverridableComponent,
} from '@mui/material/OverridableComponent';
import React, { FC } from 'react';

const sx = {
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  pt: `calc(50vh - 40px)`,
};

const Loading = () => (
  <Box sx={sx}>
    <CircularProgress />
  </Box>
);

export const LoadingBackdrop: FC<
  DefaultComponentProps<BackdropTypeMap<'div', {}>>
> = (props: DefaultComponentProps<BackdropTypeMap<'div', {}>>) => {
  const { sx, ...rest } = props;
  return (
    <Backdrop
      {...rest}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, ...sx }}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default Loading;

export const LoadingSkeleton = styled(MuiSkeleton)`
  transform: scale(1);
`;
