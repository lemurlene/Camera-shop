import { describe, it, expect } from 'vitest';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import {
  selectOrderStatus,
  selectOrderError,
  selectIsOrderLoading,
  selectIsOrderSucceeded,
  selectIsOrderFailed,
} from './';

import { LoadingStatus } from '../../const/enum';

describe('order selectors', () => {
  it('selectOrderStatus returns status from state', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Order]: {
        status: LoadingStatus.Loading,
        error: null,
      },
    });

    expect(selectOrderStatus(fakeState)).toBe(LoadingStatus.Loading);
  });

  it('selectOrderStatus returns idle if slice is missing', () => {
    const store = makeFakeStore();
    const state = { ...store } as Record<string, unknown>;

    delete (state)[NameSpace.Order];

    expect(selectOrderStatus(state as unknown as ReturnType<typeof makeFakeStore>)).toBe(LoadingStatus.Idle);
  });

  it('selectOrderError returns error from state', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Order]: {
        status: LoadingStatus.Error,
        error: 'Ошибка при оформлении заказа',
      },
    });

    expect(selectOrderError(fakeState)).toBe('Ошибка при оформлении заказа');
  });

  it('selectOrderError returns null if slice is missing', () => {
    const store = makeFakeStore();
    const state = { ...store } as Record<string, unknown>;
    delete (state)[NameSpace.Order];

    expect(selectOrderError(state as unknown as ReturnType<typeof makeFakeStore>)).toBeNull();
  });

  it('selectIsOrderLoading returns true when status is loading', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Order]: {
        status: LoadingStatus.Loading,
        error: null,
      },
    });

    expect(selectIsOrderLoading(fakeState)).toBe(true);
  });

  it('selectIsOrderSucceeded returns true when status is succeeded', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Order]: {
        status: LoadingStatus.Success,
        error: null,
      },
    });

    expect(selectIsOrderSucceeded(fakeState)).toBe(true);
  });

  it('selectIsOrderFailed returns true when status is failed', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Order]: {
        status: LoadingStatus.Error,
        error: null,
      },
    });

    expect(selectIsOrderFailed(fakeState)).toBe(true);
  });

  it('boolean selectors return false if slice is missing', () => {
    const store = makeFakeStore();
    const state = { ...store } as Record<string, unknown>;
    delete (state)[NameSpace.Order];

    const typed = state as unknown as ReturnType<typeof makeFakeStore>;

    expect(selectIsOrderLoading(typed)).toBe(false);
    expect(selectIsOrderSucceeded(typed)).toBe(false);
    expect(selectIsOrderFailed(typed)).toBe(false);
  });
});
