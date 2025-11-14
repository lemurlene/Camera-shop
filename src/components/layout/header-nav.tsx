import { memo } from 'react';
import NavListMemo from './nav-list';
import { NAV_ITEMS, NAV_CLASSES } from './const';

function HeaderNav(): JSX.Element {
  return (
    <nav className="main-nav header__main-nav" data-testid="header-nav">
      <NavListMemo items={NAV_ITEMS} classes={NAV_CLASSES.header} />
    </nav>
  );
}

const HeaderNavMemo = memo(HeaderNav);

export default HeaderNavMemo;
