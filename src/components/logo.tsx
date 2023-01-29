import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

type Variant = 'light' | 'primary';

interface LogoProps {
  variant?: Variant;
}

export const Logo = styled((props: LogoProps) => {
  const { variant, ...other } = props;

  const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

  return <Image src='/static/logo.png' width={90} height={90} />;
})``;

Logo.defaultProps = {
  variant: 'primary',
};

Logo.propTypes = {
  variant: PropTypes.oneOf<Variant>(['light', 'primary']),
};
