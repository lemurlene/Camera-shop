import { MemoryRouter } from 'react-router-dom';
import { ReactElement } from 'react';

export const withRouter = (component: ReactElement, initialEntries: string[] = ['/']) => (
  <MemoryRouter initialEntries={initialEntries}>
    {component}
  </MemoryRouter>
);
