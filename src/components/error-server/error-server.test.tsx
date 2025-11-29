import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorServer from './error-server';
import { AppRoute } from '../../const/enum';

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="helmet">{children}</div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => render(
  <BrowserRouter>
    {component}
  </BrowserRouter>
);

describe('ErrorServer component', () => {
  it('renders error server page with correct content', () => {
    renderWithRouter(<ErrorServer />);

    expect(screen.getByTestId('error-server')).toBeInTheDocument();
    expect(screen.getByText('Error server')).toBeInTheDocument();
    expect(screen.getByText('Что-то пошло не так. Попробуйте перезагрузить страницу.')).toBeInTheDocument();
  });

  it('renders link to main page when mainPage is false', () => {
    renderWithRouter(<ErrorServer mainPage={false} />);

    const link = screen.getByRole('link', { name: 'Вернуться на главную' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', AppRoute.Root);
    expect(link).toHaveClass('btn', 'btn--purple');
  });

  it('does not render link when mainPage is true', () => {
    renderWithRouter(<ErrorServer mainPage />);

    const link = screen.queryByRole('link', { name: 'Вернуться на главную' });
    expect(link).not.toBeInTheDocument();
  });

  it('does not render link by default (mainPage false)', () => {
    renderWithRouter(<ErrorServer />);

    const link = screen.getByRole('link', { name: 'Вернуться на главную' });
    expect(link).toBeInTheDocument();
  });

  it('sets correct document title', () => {
    renderWithRouter(<ErrorServer />);

    const helmet = screen.getByTestId('helmet');
    expect(helmet).toHaveTextContent('Camera-shop: Error server');
  });

  it('has correct page structure and classes', () => {
    renderWithRouter(<ErrorServer />);

    expect(document.querySelector('.page-content')).toBeInTheDocument();
    expect(document.querySelector('.container')).toBeInTheDocument();

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveClass('title', 'title--h2');
    expect(headings[0]).toHaveTextContent('Error server');
    expect(headings[1]).toHaveClass('title', 'title--h3');
    expect(headings[1]).toHaveTextContent('Что-то пошло не так. Попробуйте перезагрузить страницу.');
  });

});
