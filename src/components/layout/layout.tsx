import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RouteNames } from '../../const/const';
import HeaderBasketLinkMemo from './header-basket-link';
import LogoMemo from './logo';
import HeaderNavMemo from './header-nav';
import { ButtonUpMemo } from '../buttons';
import FooterMemo from './footer';
import FormSearchMemo from '../form-search';
import { LogoConfig } from './const';
import { ModalProvider } from '../../contexts';
import ModalContainer from '../modals';
import { getLayoutState } from './utils';
import { AppRoute } from '../../const/enum';

function Layout() {
  const location = useLocation();
  const pageTitle = RouteNames[location.pathname as keyof typeof RouteNames];
  const { isRenderButtonUp } = getLayoutState(location.pathname as AppRoute);

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
        {isRenderButtonUp && <ButtonUpMemo />}
        <FooterMemo />
      </div>
    </ModalProvider>
  );
}

export default Layout;
