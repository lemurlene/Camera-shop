import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { Category, Level, CameraType, FiltersType } from '../../const/type';

const initialState: FiltersType = {
  category: null,
  level: [],
  type: [],
  minPrice: null,
  maxPrice: null,
};

export const filtersSlice = createSlice({
  name: NameSpace.Filters,
  initialState,
  reducers: {
    changeCategory: (state, action: PayloadAction<Category>) => {
      state.category = action.payload;

      if (action.payload === 'videocamera') {
        state.type = state.type.filter((type) =>
          type !== 'film' && type !== 'snapshot'
        );
      }
    },

    changeType: (state, action: PayloadAction<CameraType>) => {
      const type = action.payload;
      const index = state.type.indexOf(type);

      if (index === -1) {
        if (state.category === 'videocamera' && (type === 'film' || type === 'snapshot')) {
          return;
        }
        state.type.push(type);
      } else {
        state.type.splice(index, 1);
      }
    },

    changeLevel: (state, action: PayloadAction<Level>) => {
      const level = action.payload;
      const index = state.level.indexOf(level);

      if (index === -1) {
        state.level.push(level);
      } else {
        state.level.splice(index, 1);
      }
    },

    changeMinPrice: (state, action: PayloadAction<number | null>) => {
      state.minPrice = action.payload;
    },

    changeMaxPrice: (state, action: PayloadAction<number | null>) => {
      state.maxPrice = action.payload;
    },

    resetFilters: (state) => {
      state.category = null;
      state.level = [];
      state.type = [];
      state.minPrice = null;
      state.maxPrice = null;
    },

    setTypes: (state, action: PayloadAction<CameraType[]>) => {
      state.type = action.payload.filter((type) => {
        if (state.category === 'videocamera' && (type === 'film' || type === 'snapshot')) {
          return false;
        }
        return true;
      });
    },

    setLevels: (state, action: PayloadAction<Level[]>) => {
      state.level = action.payload;
    },
  },
});

export const {
  changeCategory,
  changeType,
  changeLevel,
  changeMinPrice,
  changeMaxPrice,
  resetFilters,
  setTypes,
  setLevels,
} = filtersSlice.actions;
