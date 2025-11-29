import { AppRoute } from '../../const/enum';
import { getCurrentRoute, generateBreadcrumbs, BreadcrumbItem } from './utils';
import { breadcrumbChains } from './const';

vi.mock('./const', () => ({
  breadcrumbChains: {
    [AppRoute.Root]: [],
    [AppRoute.Catalog]: [AppRoute.Root],
    [AppRoute.Offer]: [AppRoute.Root, AppRoute.Catalog],
    [AppRoute.Guarantees]: [AppRoute.Root],
    [AppRoute.Delivery]: [AppRoute.Root],
    [AppRoute.About]: [AppRoute.Root],
    [AppRoute.Basket]: [AppRoute.Root, AppRoute.Catalog],
    [AppRoute.Loading]: [AppRoute.Root],
    [AppRoute.Error404]: [AppRoute.Root],
  },
}));

vi.mock('../../const/const', () => ({
  RouteNames: {
    [AppRoute.Root]: 'Главная',
    [AppRoute.Catalog]: 'Каталог',
    [AppRoute.Offer]: 'Товар',
    [AppRoute.Guarantees]: 'Гарантии',
    [AppRoute.Delivery]: 'Доставка',
    [AppRoute.About]: 'О компании',
    [AppRoute.Basket]: 'Корзина',
    [AppRoute.Loading]: 'Загрузка',
    [AppRoute.Error404]: '404',
  },
}));

describe('Breadcrumb utilities', () => {
  describe('getCurrentRoute', () => {
    it('should return Offer route when offerId is provided', () => {
      expect(getCurrentRoute('/some/path', '123')).toBe(AppRoute.Offer);
    });

    it('should return exact match when pathname matches AppRoute', () => {
      expect(getCurrentRoute(AppRoute.Catalog)).toBe(AppRoute.Catalog);
      expect(getCurrentRoute(AppRoute.Guarantees)).toBe(AppRoute.Guarantees);
      expect(getCurrentRoute(AppRoute.Delivery)).toBe(AppRoute.Delivery);
      expect(getCurrentRoute(AppRoute.About)).toBe(AppRoute.About);
      expect(getCurrentRoute(AppRoute.Basket)).toBe(AppRoute.Basket);
      expect(getCurrentRoute(AppRoute.Root)).toBe(AppRoute.Root);
    });

    it('should return Offer route for catalog item paths', () => {
      expect(getCurrentRoute('/catalog/123')).toBe(AppRoute.Offer);
      expect(getCurrentRoute('/catalog/some-product')).toBe(AppRoute.Offer);
    });

    it('should return Root route for unknown paths', () => {
      expect(getCurrentRoute('/unknown')).toBe(AppRoute.Root);
      expect(getCurrentRoute('/some/random/path')).toBe(AppRoute.Root);
    });

    it('should prioritize offerId over pathname', () => {
      expect(getCurrentRoute(AppRoute.Catalog, '123')).toBe(AppRoute.Offer);
    });
  });

  describe('generateBreadcrumbs', () => {
    it('should generate breadcrumbs for Root route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Root);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Catalog route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Каталог',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Catalog);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Offer route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Каталог',
          href: AppRoute.Catalog,
        },
        {
          label: 'Товар',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Offer);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Offer route with product name', () => {
      const productName = 'Canon EOS R5';
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Каталог',
          href: AppRoute.Catalog,
        },
        {
          label: productName,
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Offer, productName);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Guarantees route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Гарантии',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Guarantees);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Delivery route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Доставка',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Delivery);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for About route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'О компании',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.About);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Basket route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Каталог',
          href: AppRoute.Catalog,
        },
        {
          label: 'Корзина',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Basket);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Loading route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: 'Загрузка',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Loading);
      expect(result).toEqual(expected);
    });

    it('should generate breadcrumbs for Error404 route', () => {
      const expected: BreadcrumbItem[] = [
        {
          label: 'Главная',
          href: AppRoute.Root,
        },
        {
          label: '404',
          href: null,
        },
      ];

      const result = generateBreadcrumbs(AppRoute.Error404);
      expect(result).toEqual(expected);
    });

    it('should use RouteNames when productName is not provided', () => {
      const result = generateBreadcrumbs(AppRoute.Offer);
      expect(result[result.length - 1].label).toBe('Товар');
    });

    it('should use productName when provided for Offer route', () => {
      const productName = 'Sony Alpha A7 III';
      const result = generateBreadcrumbs(AppRoute.Offer, productName);
      expect(result[result.length - 1].label).toBe(productName);
    });

    it('should handle all routes in breadcrumbChains', () => {
      const routes = Object.keys(breadcrumbChains) as AppRoute[];

      routes.forEach((route) => {
        const result = generateBreadcrumbs(route);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(breadcrumbChains[route].length + 1);

        expect(result[result.length - 1].href).toBeNull();

        result.slice(0, -1).forEach((item) => {
          expect(item.href).not.toBeNull();
        });
      });
    });
  });
});
