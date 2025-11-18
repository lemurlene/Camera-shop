import { Link, useLocation } from 'react-router-dom';
import { memo } from 'react';
import { AppRoute } from '../../../const/enum';
import { getLayoutState } from '../utils';
import { LogoConfigType } from './type';

type LogoProps = {
  config: LogoConfigType;
}

function Logo({ config }: LogoProps): JSX.Element {
  const { logoClass, logoImg } = config;
  const { pathname } = useLocation();
  const { logoAriaLabel, correctStyle } = getLayoutState(pathname as AppRoute);
  return (
    <Link className={logoClass} to="/"
      aria-label={logoAriaLabel}
      style={correctStyle}
    >
      <svg width="100" height="36" aria-hidden="true">
        <use xlinkHref={logoImg}></use>
      </svg>
    </Link>
  );
}

const LogoMemo = memo(Logo);

export default LogoMemo;
