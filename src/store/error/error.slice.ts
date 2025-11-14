import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../const';

type InitialStateType = {
  error: string | null;
};

const initialState: InitialStateType = {
  error: null,
};

export const errorSlice = createSlice({
  name: NameSpace.Error,
  initialState,
  reducers: {
    setError (state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setError } = errorSlice.actions;
