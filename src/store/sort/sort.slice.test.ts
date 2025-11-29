import { DefaultSort, SortTypes, SortOrders } from '../../components/sort/const';
import { sortSlice, changeSortType, changeSortOrder } from './sort.slice';

describe('sort slice', () => {
  const defaultSortType = DefaultSort.type;
  const testSortType = SortTypes.Popular;
  const defaultSortOrder = DefaultSort.order;
  const testSortOrder = SortOrders.Desc;

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const expectedState = {
      currentSortType: testSortType,
      currentSortOrder: testSortOrder
    };

    const result = sortSlice.reducer(expectedState, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const expectedState = {
      currentSortType: defaultSortType,
      currentSortOrder: defaultSortOrder
    };

    const result = sortSlice.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should change sort type with changeSortType action', () => {
    const initialState = {
      currentSortType: defaultSortType,
      currentSortOrder: defaultSortOrder
    };
    const expectedState = {
      currentSortType: testSortType,
      currentSortOrder: defaultSortOrder
    };

    const result = sortSlice.reducer(initialState, changeSortType(testSortType));

    expect(result).toEqual(expectedState);
  });

  it('should change sort order with changeSortOrder action', () => {
    const initialState = {
      currentSortType: defaultSortType,
      currentSortOrder: defaultSortOrder
    };
    const expectedState = {
      currentSortType: defaultSortType,
      currentSortOrder: testSortOrder
    };

    const result = sortSlice.reducer(initialState, changeSortOrder(testSortOrder));

    expect(result).toEqual(expectedState);
  });

  it('should handle both sort type and order changes independently', () => {
    const initialState = {
      currentSortType: defaultSortType,
      currentSortOrder: defaultSortOrder
    };

    let state = sortSlice.reducer(initialState, changeSortType(SortTypes.Popular));
    expect(state).toEqual({
      currentSortType: SortTypes.Popular,
      currentSortOrder: defaultSortOrder
    });

    state = sortSlice.reducer(state, changeSortOrder(SortOrders.Desc));
    expect(state).toEqual({
      currentSortType: SortTypes.Popular,
      currentSortOrder: SortOrders.Desc
    });
  });

  it('should create correct actions with payload', () => {
    const changeTypeAction = changeSortType(SortTypes.Price);
    expect(changeTypeAction).toEqual({
      type: 'SORT/changeSortType',
      payload: SortTypes.Price,
    });

    const changeOrderAction = changeSortOrder(SortOrders.Asc);
    expect(changeOrderAction).toEqual({
      type: 'SORT/changeSortOrder',
      payload: SortOrders.Asc,
    });
  });
});
