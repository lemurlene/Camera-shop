import { configureStore } from '@reduxjs/toolkit';
import reducer from './root-reducer.ts';
import createAPI from '../services/api.ts';

const api = createAPI();

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export {api, store};
