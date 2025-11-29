import {
  selectCurrentCategory,
  selectCurrentType,
  selectCurrentLevel,
  selectMinPrice,
  selectMaxPrice,
  selectAllFilters
} from './filters.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { Category, CameraType, Level } from '../../const/type';

describe('Filters selectors', () => {
  describe('selectCurrentCategory', () => {
    it('should return current category from state', () => {
      const expectedCategory: Category = 'photocamera';
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: expectedCategory,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectCurrentCategory(fakeState);

      expect(result).toBe(expectedCategory);
    });

    it('should return null when category is not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectCurrentCategory(fakeState);

      expect(result).toBeNull();
    });
  });

  describe('selectCurrentType', () => {
    it('should return current type array from state', () => {
      const expectedType: CameraType[] = ['digital', 'film'];
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: expectedType,
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectCurrentType(fakeState);

      expect(result).toEqual(expectedType);
    });

    it('should return empty array when no types selected', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectCurrentType(fakeState);

      expect(result).toEqual([]);
    });
  });

  describe('selectCurrentLevel', () => {
    it('should return current level array from state', () => {
      const expectedLevel: Level[] = ['zero', 'professional'];
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: expectedLevel,
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectCurrentLevel(fakeState);

      expect(result).toEqual(expectedLevel);
    });

    it('should return empty array when no levels selected', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectCurrentLevel(fakeState);

      expect(result).toEqual([]);
    });
  });

  describe('selectMinPrice', () => {
    it('should return min price from state', () => {
      const expectedMinPrice = 1000;
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: expectedMinPrice,
          maxPrice: null
        },
      });

      const result = selectMinPrice(fakeState);

      expect(result).toBe(expectedMinPrice);
    });

    it('should return null when min price is not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectMinPrice(fakeState);

      expect(result).toBeNull();
    });
  });

  describe('selectMaxPrice', () => {
    it('should return max price from state', () => {
      const expectedMaxPrice = 50000;
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: expectedMaxPrice
        },
      });

      const result = selectMaxPrice(fakeState);

      expect(result).toBe(expectedMaxPrice);
    });

    it('should return null when max price is not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Filters]: {
          category: null,
          type: [],
          level: [],
          minPrice: null,
          maxPrice: null
        },
      });

      const result = selectMaxPrice(fakeState);

      expect(result).toBeNull();
    });
  });

  describe('selectAllFilters', () => {
    it('should return all filters from state', () => {
      const expectedFilters = {
        category: 'photocamera' as Category,
        type: ['digital'] as CameraType[],
        level: ['zero'] as Level[],
        minPrice: 1000,
        maxPrice: 50000
      };

      const fakeState = makeFakeStore({
        [NameSpace.Filters]: expectedFilters,
      });

      const result = selectAllFilters(fakeState);

      expect(result).toEqual(expectedFilters);
    });

    it('should return default filters when no custom filters provided', () => {
      const fakeState = makeFakeStore();

      const result = selectAllFilters(fakeState);

      expect(result).toEqual({
        category: null,
        type: [],
        level: [],
        minPrice: null,
        maxPrice: null
      });
    });
  });
});
