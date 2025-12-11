import { AppRoute } from '../../const/enum';
import { NavItemType } from './nav-list/type';

export const LogoConfig = {
  Header: {
    logoClass: 'header__logo',
    logoImg: '#icon-logo',
  },
  Footer: {
    logoClass: 'footer__logo',
    logoImg: '#icon-logo-mono',
  }
};

export const NAV_ITEMS: NavItemType[] = [
  {
    key: 'catalog',
    label: 'Каталог',
    to: AppRoute.Catalog,
    exact: true,
  },
  {
    key: 'guarantees',
    label: 'Гарантии',
    to: AppRoute.Guarantees,
    exact: true,
  },
  {
    key: 'delivery',
    label: 'Доставка',
    to: AppRoute.Delivery,
    exact: true,
  },
  {
    key: 'delivery',
    label: 'О компании',
    to: AppRoute.About,
    exact: true,
  },
];

export const NAV_CLASSES = {
  header: {
    list: 'main-nav__list',
    item: 'main-nav__item',
    link: 'main-nav__link',
    active: 'main-nav__link--active'
  },
  footer: {
    list: 'footer__list',
    item: 'footer__item',
    link: 'link',
    active: 'link--active'
  }
};

export const RESOURCES_ITEMS = [
  { href: '#', text: 'Курсы операторов' },
  { href: '#', text: 'Блог' },
  { href: '#', text: 'Сообщество' },
];

export const SUPPORT_ITEMS = [
  { href: '#', text: 'FAQ' },
  { href: '#', text: 'Задать вопрос' },
];
