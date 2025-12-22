import { describe, it, expect } from 'vitest';
import type { AnyAction } from '@reduxjs/toolkit';
import { orderSlice, resetOrder, clearOrderError } from './order.slice';
import { sendOrder } from '../api-action';
import { LoadingStatusEnum } from '../../const/type';
import { LoadingStatus } from '../../const/enum';

type OrderState = {
  status: LoadingStatusEnum;
  error: string | null;
};

describe('orderSlice', () => {
  const reducer = orderSlice.reducer;

  const makeState = (patch: Partial<OrderState> = {}): OrderState => ({
    status: LoadingStatus.Idle,
    error: null,
    ...patch,
  });

  it('should return initial state for unknown action', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as AnyAction) as OrderState;
    expect(state).toEqual(makeState());
  });

  it('resetOrder sets idle and clears error', () => {
    const prev = makeState({ status: LoadingStatus.Error, error: 'boom' });

    const next = reducer(prev, resetOrder()) as OrderState;

    expect(next.status).toBe(LoadingStatus.Idle);
    expect(next.error).toBeNull();
  });


  it('clearOrderError clears only error', () => {
    const prev = makeState({ status: LoadingStatus.Error, error: 'boom' });

    const next = reducer(prev, clearOrderError()) as OrderState;

    expect(next.status).toBe(LoadingStatus.Error);
    expect(next.error).toBeNull();
  });

  it('sendOrder.pending sets loading and clears error', () => {
    const prev = makeState({ status: LoadingStatus.Idle, error: 'old error' });

    const next = reducer(prev, { type: sendOrder.pending.type } as AnyAction) as OrderState;

    expect(next.status).toBe(LoadingStatus.Loading);
    expect(next.error).toBeNull();
  });

  it('sendOrder.fulfilled sets succeeded and clears error', () => {
    const prev = makeState({ status: LoadingStatus.Loading, error: 'old error' });

    const next = reducer(prev, { type: sendOrder.fulfilled.type } as AnyAction) as OrderState;

    expect(next.status).toBe(LoadingStatus.Success);
    expect(next.error).toBeNull();
  });

  it('sendOrder.rejected sets failed and uses payload error', () => {
    const prev = makeState({ status: LoadingStatus.Loading, error: null });

    const action = {
      type: sendOrder.rejected.type,
      payload: 'Некорректные данные заказа',
    } as unknown as AnyAction;

    const next = reducer(prev, action) as OrderState;

    expect(next.status).toBe(LoadingStatus.Error);
    expect(next.error).toBe('Некорректные данные заказа');
  });

  it('sendOrder.rejected falls back to default error when payload is missing', () => {
    const prev = makeState({ status: LoadingStatus.Loading, error: null });

    const action = {
      type: sendOrder.rejected.type,
      payload: undefined,
    } as unknown as AnyAction;

    const next = reducer(prev, action) as OrderState;

    expect(next.status).toBe(LoadingStatus.Error);
    expect(next.error).toBe('Ошибка при оформлении заказа');
  });
});
