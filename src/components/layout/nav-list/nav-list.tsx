import { Link, useLocation } from 'react-router-dom';
import { memo } from 'react';
import cn from 'classnames';
import { NavItemType, NavClassesType } from './type';

type NavListProps = {
  items: NavItemType[];
  classes: NavClassesType;
}

function NavList({ items, classes }: NavListProps): JSX.Element {
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <ul className={classes.list}>
      {items.map((item) => (
        <li key={item.key} className={classes.item}>
          <Link
            className={cn(classes.link, {
              [classes.active || '']: isActive(item.to, item.exact)
            })}
            to={item.to}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const NavListMemo = memo(NavList);

export default NavListMemo;
