import { memo } from 'react';
import LogoMemo from './logo';
import SocialLinksMemo from './social-links';
import NavListMemo from './nav-list';
import { FooterItemsMemo } from './footer-items';
import { LogoConfig, NAV_ITEMS, NAV_CLASSES, RESOURCES_ITEMS, SUPPORT_ITEMS } from './const';

function Footer(): JSX.Element {
  return (
    <footer className="footer" data-testid="footerId">
      <div className="container">
        <div className="footer__info">
          <LogoMemo config={LogoConfig.Footer} />
          <p className="footer__description">Интернет-магазин фото- и видеотехники</p>
          <SocialLinksMemo />
        </div>
        <ul className="footer__nav">
          <li className="footer__nav-item">
            <p className="footer__title">Навигация</p>
            <NavListMemo items={NAV_ITEMS} classes={NAV_CLASSES.footer} />
          </li>
          <FooterItemsMemo title="Ресурсы" items={RESOURCES_ITEMS} />
          <FooterItemsMemo title="Поддержка" items={SUPPORT_ITEMS} />
        </ul>
      </div>
    </footer>
  );
}

const FooterMemo = memo(Footer);

export default FooterMemo;
