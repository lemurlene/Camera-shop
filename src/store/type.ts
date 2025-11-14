import { store } from './index.js';

export type RootState = ReturnType<typeof store.getState>;
export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
