import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import React, { ReactElement } from 'react';

interface ITooltipProps {
  disable: boolean;
  title: string;
  children: ReactElement;
}

export const WithTooltip = styled(
  ({
    className,
    children,
    title,
    disable,
    ...props
  }: TooltipProps & ITooltipProps) => (
    <Tooltip
      {...props}
      title={title ?? ''}
      arrow
      classes={{ popper: className }}
      disableHoverListener={disable}
    >
      {children}
    </Tooltip>
  )
)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    marginTop: '6px!important',
  },
}));
