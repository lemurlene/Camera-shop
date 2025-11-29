import { describe, it, expect } from 'vitest';
import { getLayoutState } from './utils';
import { AppRoute } from '../../const/enum';

describe('getLayoutState', () => {
  describe('route-specific states', () => {
    it('should return root configuration for root route', () => {
      const result = getLayoutState(AppRoute.Root);

      expect(result).toEqual({
        logoAriaLabel: 'Логотип',
        correctStyle: { pointerEvents: 'none', cursor: 'default' },
        isRenderButtonUp: false,
      });
    });

    it('should return offer page configuration for offer routes', () => {
      const result = getLayoutState(AppRoute.Offer);

      expect(result).toEqual({
        logoAriaLabel: 'Переход на главную',
        correctStyle: {},
        isRenderButtonUp: true,
      });
    });

    it('should return default configuration for other routes', () => {
      const routes = [AppRoute.Guarantees, AppRoute.Loading, AppRoute.Error404];

      routes.forEach((route) => {
        const result = getLayoutState(route);

        expect(result).toEqual({
          logoAriaLabel: 'Переход на главную',
          correctStyle: {},
          isRenderButtonUp: false,
        });
      });
    });
  });

  describe('logo behavior', () => {
    it('should disable logo interaction on root page', () => {
      const result = getLayoutState(AppRoute.Root);

      expect(result.correctStyle).toEqual({
        pointerEvents: 'none',
        cursor: 'default',
      });
    });
  });
});
