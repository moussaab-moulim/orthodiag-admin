import { SxProps, Theme, Typography } from '@mui/material';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WithTooltip } from './Tooltip';

interface IStateColors {
  [state: string]: string;
}
const stateColors: IStateColors = {
  Draft: 'states.orange',
  Published: 'states.green',
};
interface IProps {
  label: string;
  sx?: SxProps<Theme>;
  textSx?: SxProps<Theme>;
}

const State = ({ label, textSx }: IProps) => {
  const { t } = useTranslation();
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
  }, []);
  return (
    <WithTooltip disable={!isOverflowed} title={t<string>(`${label}`)}>
      <Typography
        ref={textElementRef}
        sx={{
          bgcolor: stateColors[label] ?? 'primary.main',
          borderRadius: 7,
          p: '4px 12px',
          color: 'white',
          textAlign: 'center',
          fontSize: 11,
          overflow: 'hidden',
          textOverflow: isOverflowed ? 'ellipsis' : 'initial',
          ...textSx,
        }}
      >
        {t<string>(`${label}`)}
      </Typography>
    </WithTooltip>
  );
};

export default State;
