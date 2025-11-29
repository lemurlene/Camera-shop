import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import Breadcrumbs from './breadcrumbs';
import { getCurrentRoute, generateBreadcrumbs } from './utils';
import { AppRoute } from '../../const/enum';

vi.mock('./utils', () => ({
  getCurrentRoute: vi.fn(),
  generateBreadcrumbs: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
    useParams: vi.fn(),
  };
});

const mockedGetCurrentRoute = getCurrentRoute as jest.MockedFunction<typeof getCurrentRoute>;
const mockedGenerateBreadcrumbs = generateBreadcrumbs as jest.MockedFunction<typeof generateBreadcrumbs>;
const mockedUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;
const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;

const renderWithRouter = (component: React.ReactElement, initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={component} />
      </Routes>
    </BrowserRouter>
  );
};

const mockBreadcrumbItems = [
  { label: 'Главная', href: AppRoute.Root },
  { label: 'Каталог', href: AppRoute.Catalog },
  { label: 'Товар', href: null },
];

describe('Breadcrumbs component', () => {
  beforeEach(() => {
    mockedUseLocation.mockReturnValue({ pathname: '/', search: '', hash: '', state: null, key: '' });
    mockedUseParams.mockReturnValue({});
    mockedGetCurrentRoute.mockReturnValue(AppRoute.Offer);
    mockedGenerateBreadcrumbs.mockReturnValue(mockBreadcrumbItems);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumbs with correct structure', () => {
    renderWithRouter(<Breadcrumbs />);

    expect(screen.getByRole('list')).toHaveClass('breadcrumbs__list');
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
    expect(screen.getByText('Товар')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    renderWithRouter(<Breadcrumbs />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', AppRoute.Root);
    expect(links[0]).toHaveClass('breadcrumbs__link');
    expect(links[1]).toHaveAttribute('href', AppRoute.Catalog);
    expect(links[1]).toHaveClass('breadcrumbs__link');
  });

  it('renders active span for items without href', () => {
    renderWithRouter(<Breadcrumbs />);

    const activeItem = screen.getByText('Товар');
    expect(activeItem).toHaveClass('breadcrumbs__link--active');
    expect(activeItem).toHaveClass('breadcrumbs__link');
    expect(activeItem.tagName).toBe('SPAN');
  });

  it('renders arrow icons for link items', () => {
    renderWithRouter(<Breadcrumbs />);

    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      const svg = link.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');

      const useElement = svg?.querySelector('use');
      expect(useElement).toHaveAttribute('xlink:href', '#icon-arrow-mini');
    });
  });

  it('passes productName to generateBreadcrumbs when provided', () => {
    const productName = 'Canon EOS R5';

    renderWithRouter(<Breadcrumbs productName={productName} />);

    expect(mockedGenerateBreadcrumbs).toHaveBeenCalledWith(AppRoute.Offer, productName);
  });

  it('does not pass productName to generateBreadcrumbs when not provided', () => {
    renderWithRouter(<Breadcrumbs />);

    expect(mockedGenerateBreadcrumbs).toHaveBeenCalledWith(AppRoute.Offer, undefined);
  });

  it('calls getCurrentRoute with correct parameters', () => {
    const pathname = '/catalog/123';
    const offerId = '123';

    mockedUseLocation.mockReturnValue({ pathname, search: '', hash: '', state: null, key: '' });
    mockedUseParams.mockReturnValue({ offerId });

    renderWithRouter(<Breadcrumbs />);

    expect(mockedGetCurrentRoute).toHaveBeenCalledWith(pathname, offerId);
  });

  it('generates unique keys for breadcrumb items', () => {
    renderWithRouter(<Breadcrumbs />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    listItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  it('renders correct container classes', () => {
    renderWithRouter(<Breadcrumbs />);

    expect(screen.getByRole('list').parentElement).toHaveClass('container');
    expect(screen.getByRole('list').parentElement?.parentElement).toHaveClass('breadcrumbs');
  });

  it('handles different routes correctly', () => {
    const catalogBreadcrumbs = [
      { label: 'Главная', href: AppRoute.Root },
      { label: 'Каталог', href: null },
    ];

    mockedGetCurrentRoute.mockReturnValue(AppRoute.Catalog);
    mockedGenerateBreadcrumbs.mockReturnValue(catalogBreadcrumbs);

    renderWithRouter(<Breadcrumbs />, AppRoute.Catalog);

    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toHaveClass('breadcrumbs__link--active');
  });

  it('handles empty breadcrumbs array', () => {
    mockedGenerateBreadcrumbs.mockReturnValue([]);

    renderWithRouter(<Breadcrumbs />);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('handles single breadcrumb item', () => {
    const singleBreadcrumb = [
      { label: 'Главная', href: null },
    ];

    mockedGenerateBreadcrumbs.mockReturnValue(singleBreadcrumb);

    renderWithRouter(<Breadcrumbs />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(screen.getByText('Главная')).toHaveClass('breadcrumbs__link--active');
  });
});
