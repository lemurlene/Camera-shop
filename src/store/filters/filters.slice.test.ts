import { filtersSlice, changeCategory, changeType, changeLevel, changeMinPrice, changeMaxPrice, resetFilters, setTypes, setLevels } from './filters.slice';
import { Category, CameraType, Level, FiltersType } from '../../const/type';

describe('Filters slice', () => {
  const initialState: FiltersType = {
    category: null,
    level: [],
    type: [],
    minPrice: null,
    maxPrice: null,
  };

  describe('Initial state', () => {
    it('should return initial state with empty action', () => {
      const emptyAction = { type: '' };
      const result = filtersSlice.reducer(undefined, emptyAction);
      expect(result).toEqual(initialState);
    });

    it('should return unchanged state with empty action and defined state', () => {
      const currentState: FiltersType = {
        category: 'photocamera',
        type: ['digital'],
        level: ['zero'],
        minPrice: 1000,
        maxPrice: 50000
      };
      const emptyAction = { type: '' };
      const result = filtersSlice.reducer(currentState, emptyAction);
      expect(result).toEqual(currentState);
    });
  });

  describe('changeCategory', () => {
    it('should change category to photocamera', () => {
      const category: Category = 'photocamera';
      const result = filtersSlice.reducer(initialState, changeCategory(category));
      expect(result.category).toBe(category);
    });

    it('should change category to videocamera and remove incompatible types', () => {
      const currentState: FiltersType = {
        category: 'photocamera',
        type: ['digital', 'film', 'snapshot'],
        level: ['zero'],
        minPrice: null,
        maxPrice: null
      };
      const category: Category = 'videocamera';

      const result = filtersSlice.reducer(currentState, changeCategory(category));

      expect(result.category).toBe(category);
      expect(result.type).toEqual(['digital']);
    });

    it('should change category to videocamera and keep compatible types', () => {
      const currentState: FiltersType = {
        category: 'photocamera',
        type: ['digital', 'collection'],
        level: ['zero'],
        minPrice: null,
        maxPrice: null
      };
      const category: Category = 'videocamera';

      const result = filtersSlice.reducer(currentState, changeCategory(category));

      expect(result.category).toBe(category);
      expect(result.type).toEqual(['digital', 'collection']);
    });
  });

  describe('changeType', () => {
    it('should add type when not present', () => {
      const type: CameraType = 'digital';
      const result = filtersSlice.reducer(initialState, changeType(type));
      expect(result.type).toEqual(['digital']);
    });

    it('should remove type when already present', () => {
      const currentState: FiltersType = {
        category: null,
        type: ['digital', 'film'],
        level: [],
        minPrice: null,
        maxPrice: null
      };
      const type: CameraType = 'digital';

      const result = filtersSlice.reducer(currentState, changeType(type));

      expect(result.type).toEqual(['film']);
    });

    it('should not add incompatible type for videocamera', () => {
      const currentState: FiltersType = {
        category: 'videocamera',
        type: ['digital'],
        level: [],
        minPrice: null,
        maxPrice: null
      };
      const incompatibleType: CameraType = 'film';

      const result = filtersSlice.reducer(currentState, changeType(incompatibleType));

      expect(result.type).toEqual(['digital']);
    });

    it('should allow adding compatible type for videocamera', () => {
      const currentState: FiltersType = {
        category: 'videocamera',
        type: ['digital'],
        level: [],
        minPrice: null,
        maxPrice: null
      };
      const compatibleType: CameraType = 'collection';

      const result = filtersSlice.reducer(currentState, changeType(compatibleType));

      expect(result.type).toEqual(['digital', 'collection']);
    });
  });

  describe('changeLevel', () => {
    it('should add level when not present', () => {
      const level: Level = 'zero';
      const result = filtersSlice.reducer(initialState, changeLevel(level));
      expect(result.level).toEqual(['zero']);
    });

    it('should remove level when already present', () => {
      const currentState: FiltersType = {
        category: null,
        type: [],
        level: ['zero', 'professional'],
        minPrice: null,
        maxPrice: null
      };
      const level: Level = 'zero';

      const result = filtersSlice.reducer(currentState, changeLevel(level));

      expect(result.level).toEqual(['professional']);
    });

    it('should handle multiple level toggles', () => {
      let state: FiltersType = { ...initialState };

      state = filtersSlice.reducer(state, changeLevel('zero'));
      expect(state.level).toEqual(['zero']);

      state = filtersSlice.reducer(state, changeLevel('professional'));
      expect(state.level).toEqual(['zero', 'professional']);

      state = filtersSlice.reducer(state, changeLevel('zero'));
      expect(state.level).toEqual(['professional']);
    });
  });

  describe('changeMinPrice', () => {
    it('should set min price', () => {
      const minPrice = 1000;
      const result = filtersSlice.reducer(initialState, changeMinPrice(minPrice));
      expect(result.minPrice).toBe(minPrice);
    });

    it('should set min price to null', () => {
      const currentState: FiltersType = {
        category: null,
        type: [],
        level: [],
        minPrice: 1000,
        maxPrice: null
      };
      const result = filtersSlice.reducer(currentState, changeMinPrice(null));
      expect(result.minPrice).toBeNull();
    });
  });

  describe('changeMaxPrice', () => {
    it('should set max price', () => {
      const maxPrice = 50000;
      const result = filtersSlice.reducer(initialState, changeMaxPrice(maxPrice));
      expect(result.maxPrice).toBe(maxPrice);
    });

    it('should set max price to null', () => {
      const currentState: FiltersType = {
        category: null,
        type: [],
        level: [],
        minPrice: null,
        maxPrice: 50000
      };
      const result = filtersSlice.reducer(currentState, changeMaxPrice(null));
      expect(result.maxPrice).toBeNull();
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to initial state', () => {
      const currentState: FiltersType = {
        category: 'photocamera',
        type: ['digital', 'film'],
        level: ['zero', 'professional'],
        minPrice: 1000,
        maxPrice: 50000
      };

      const result = filtersSlice.reducer(currentState, resetFilters());

      expect(result).toEqual(initialState);
    });
  });

  describe('setTypes', () => {
    it('should set types and filter incompatible types for videocamera', () => {
      const currentState: FiltersType = {
        category: 'videocamera',
        type: [],
        level: [],
        minPrice: null,
        maxPrice: null
      };
      const types: CameraType[] = ['digital', 'film', 'snapshot', 'collection'];

      const result = filtersSlice.reducer(currentState, setTypes(types));

      expect(result.type).toEqual(['digital', 'collection']);
    });

    it('should set all types for photocamera', () => {
      const currentState: FiltersType = {
        category: 'photocamera',
        type: [],
        level: [],
        minPrice: null,
        maxPrice: null
      };
      const types: CameraType[] = ['digital', 'film', 'snapshot', 'collection'];

      const result = filtersSlice.reducer(currentState, setTypes(types));

      expect(result.type).toEqual(types);
    });
  });

  describe('setLevels', () => {
    it('should set levels', () => {
      const levels: Level[] = ['zero', 'professional'];
      const result = filtersSlice.reducer(initialState, setLevels(levels));
      expect(result.level).toEqual(levels);
    });

    it('should replace existing levels', () => {
      const currentState: FiltersType = {
        category: null,
        type: [],
        level: ['zero'],
        minPrice: null,
        maxPrice: null
      };
      const newLevels: Level[] = ['professional', 'non-professional'];

      const result = filtersSlice.reducer(currentState, setLevels(newLevels));

      expect(result.level).toEqual(newLevels);
    });
  });

  describe('Action creators', () => {
    it('should create correct changeCategory action', () => {
      const category: Category = 'photocamera';
      const action = changeCategory(category);
      expect(action).toEqual({
        type: 'FILTERS/changeCategory',
        payload: category
      });
    });

    it('should create correct resetFilters action', () => {
      const action = resetFilters();
      expect(action).toEqual({
        type: 'FILTERS/resetFilters'
      });
    });
  });
});
