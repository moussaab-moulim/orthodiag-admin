import { SxProps, Typography } from '@mui/material';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { WithTooltip } from './Tooltip';

interface ITableCellWithTooltip {
  value?: string;
  sxParams?: SxProps;
}
export const TableCellWithTooltip = ({
  value = '',
  sxParams,
}: ITableCellWithTooltip) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const textElementRef = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    if (null !== textElementRef.current) {
      setIsOverflow(
        textElementRef.current.scrollWidth >
          textElementRef.current.clientWidth ||
          textElementRef.current.scrollWidth >
            textElementRef.current.offsetWidth
      );
    }
  }, [textElementRef]);

  return (
    <WithTooltip disable={!isOverflowed} title={value}>
      <Typography
        ref={textElementRef}
        sx={{
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: isOverflowed ? 'ellipsis' : 'initial',
          fontSize: '14px',
          ...sxParams,
        }}
      >
        {value}
      </Typography>
    </WithTooltip>
  );
};
