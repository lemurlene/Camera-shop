import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RouteNames } from '../../const/const';
import HeaderBasketLinkMemo from './header-basket-link';
import LogoMemo from './logo';
import HeaderNavMemo from './header-nav';
import FooterMemo from './footer';
import FormSearchMemo from '../form-search';
import { LogoConfig } from './const';
import { ModalProvider } from '../../contexts';
import { ModalContainer } from '../modals/modal-container';

function Layout() {
  const location = useLocation();
  const pageTitle = RouteNames[location.pathname as keyof typeof RouteNames];

  return (
    <ModalProvider>
      <Helmet>
        <title>{`Camera-shop: ${pageTitle}`}</title>
      </Helmet>
      <div className="wrapper" data-testid="layout">
        <header className="header" id="header">
          <div className="container">
            <LogoMemo config={LogoConfig.Header} />
            <HeaderNavMemo />
            <FormSearchMemo />
            <HeaderBasketLinkMemo />
          </div >
        </header >
        <main>
          <Outlet />
          <ModalContainer />
        </main>
        <FooterMemo />
      </div>
    </ModalProvider>
  );
}

export default Layout;
