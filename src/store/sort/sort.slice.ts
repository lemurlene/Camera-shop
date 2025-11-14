import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { SortType, SortOrder } from '../../components/sort/type';
import { DefaultSort } from '../../components/sort/const';

type InitialStateType = {
  currentSortType: SortType;
  currentSortOrder: SortOrder;
};

const initialState: InitialStateType = {
  currentSortType: DefaultSort.type,
  currentSortOrder: DefaultSort.order,
};

export const sortSlice = createSlice({
  name: NameSpace.Sort,
  initialState,
  reducers: {
    changeSortType(state, action: PayloadAction<SortType>) {
      state.currentSortType = action.payload;
    },
    changeSortOrder(state, action: PayloadAction<SortOrder>) {
      state.currentSortOrder = action.payload;
    },
  },
});

export const { changeSortType, changeSortOrder } = sortSlice.actions;
