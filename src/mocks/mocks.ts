import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { State } from '../store/type';
import createAPI from '../services/api';

export const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);

export type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;
