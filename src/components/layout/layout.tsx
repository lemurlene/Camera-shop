import { Outlet } from 'react-router-dom';
import HeaderBasketLinkMemo from './header-basket-link';
import LogoMemo from './logo';
import HeaderNavMemo from './header-nav';
import FooterMemo from './footer';
import FormSearchMemo from './form-search';
import { LogoConfig } from './const';

function Layout() {
  return (
    <div className="wrapper" data-testid="layout">
      <header className="header" id="header">
        <div className="container">
          <LogoMemo config={LogoConfig.Header}/>
          <HeaderNavMemo />
          <FormSearchMemo />
          <HeaderBasketLinkMemo />
        </div >
      </header >
      <Outlet />
      <FooterMemo />
    </div>
  );
}

export default Layout;
