import {
  selectSortType,
  selectSortOrder
} from './sort.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { SortTypes, SortOrders, DefaultSort } from '../../components/sort/const';

describe('Sort selectors', () => {
  describe('selectSortType', () => {
    it('should return current sort type from state', () => {
      const expectedSortType = SortTypes.Price;
      const fakeState = makeFakeStore({
        [NameSpace.Sort]: {
          currentSortType: expectedSortType,
          currentSortOrder: SortOrders.Asc
        },
      });

      const result = selectSortType(fakeState);

      expect(result).toBe(expectedSortType);
    });

    it('should return default sort type when state has default values', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Sort]: {
          currentSortType: DefaultSort.type,
          currentSortOrder: DefaultSort.order
        },
      });

      const result = selectSortType(fakeState);

      expect(result).toBe(DefaultSort.type);
    });

    it('should return all possible sort types correctly', () => {
      const sortTypes = Object.values(SortTypes);

      sortTypes.forEach((expectedSortType) => {
        const fakeState = makeFakeStore({
          [NameSpace.Sort]: {
            currentSortType: expectedSortType,
            currentSortOrder: SortOrders.Asc
          },
        });

        const result = selectSortType(fakeState);

        expect(result).toBe(expectedSortType);
      });
    });
  });

  describe('selectSortOrder', () => {
    it('should return current sort order from state', () => {
      const expectedSortOrder = SortOrders.Desc;
      const fakeState = makeFakeStore({
        [NameSpace.Sort]: {
          currentSortType: SortTypes.Price,
          currentSortOrder: expectedSortOrder
        },
      });

      const result = selectSortOrder(fakeState);

      expect(result).toBe(expectedSortOrder);
    });

    it('should return default sort order when state has default values', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Sort]: {
          currentSortType: DefaultSort.type,
          currentSortOrder: DefaultSort.order
        },
      });

      const result = selectSortOrder(fakeState);

      expect(result).toBe(DefaultSort.order);
    });

    it('should return all possible sort orders correctly', () => {
      const sortOrders = Object.values(SortOrders);

      sortOrders.forEach((expectedSortOrder) => {
        const fakeState = makeFakeStore({
          [NameSpace.Sort]: {
            currentSortType: SortTypes.Price,
            currentSortOrder: expectedSortOrder
          },
        });

        const result = selectSortOrder(fakeState);

        expect(result).toBe(expectedSortOrder);
      });
    });
  });

  describe('Combined selectors', () => {
    it('should work correctly with all sort type and order combinations', () => {
      const testCases = [
        { type: SortTypes.Price, order: SortOrders.Asc },
        { type: SortTypes.Price, order: SortOrders.Desc },
        { type: SortTypes.Popular, order: SortOrders.Asc },
        { type: SortTypes.Popular, order: SortOrders.Desc },
      ];

      testCases.forEach(({ type, order }) => {
        const fakeState = makeFakeStore({
          [NameSpace.Sort]: {
            currentSortType: type,
            currentSortOrder: order
          },
        });

        const resultType = selectSortType(fakeState);
        const resultOrder = selectSortOrder(fakeState);

        expect(resultType).toBe(type);
        expect(resultOrder).toBe(order);
      });
    });
  });

  describe('Empty state', () => {
    it('should return default values from makeFakeStore', () => {
      const fakeState = makeFakeStore();

      const resultType = selectSortType(fakeState);
      const resultOrder = selectSortOrder(fakeState);

      expect(resultType).toBe(DefaultSort.type);
      expect(resultOrder).toBe(DefaultSort.order);
    });
  });
});
