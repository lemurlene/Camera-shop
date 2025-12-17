import { describe, it, expect } from 'vitest';
import type { AnyAction } from '@reduxjs/toolkit';
import { orderSlice, resetOrder, clearOrderError } from './order.slice'; // поправь путь/имя файла при необходимости
import { sendOrder } from '../api-action';

type OrderState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

describe('orderSlice', () => {
  const reducer = orderSlice.reducer;

  const makeState = (patch: Partial<OrderState> = {}): OrderState => ({
    status: 'idle',
    error: null,
    ...patch,
  });

  it('should return initial state for unknown action', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as AnyAction) as OrderState;
    expect(state).toEqual(makeState());
  });

  it('resetOrder sets idle and clears error', () => {
    const prev = makeState({ status: 'failed', error: 'boom' });

    const next = reducer(prev, resetOrder()) as OrderState;

    expect(next.status).toBe('idle');
    expect(next.error).toBeNull();
  });

  it('clearOrderError clears only error', () => {
    const prev = makeState({ status: 'failed', error: 'boom' });

    const next = reducer(prev, clearOrderError()) as OrderState;

    expect(next.status).toBe('failed');
    expect(next.error).toBeNull();
  });

  it('sendOrder.pending sets loading and clears error', () => {
    const prev = makeState({ status: 'idle', error: 'old error' });

    const next = reducer(prev, { type: sendOrder.pending.type } as AnyAction) as OrderState;

    expect(next.status).toBe('loading');
    expect(next.error).toBeNull();
  });

  it('sendOrder.fulfilled sets succeeded and clears error', () => {
    const prev = makeState({ status: 'loading', error: 'old error' });

    const next = reducer(prev, { type: sendOrder.fulfilled.type } as AnyAction) as OrderState;

    expect(next.status).toBe('succeeded');
    expect(next.error).toBeNull();
  });

  it('sendOrder.rejected sets failed and uses payload error', () => {
    const prev = makeState({ status: 'loading', error: null });

    const action = {
      type: sendOrder.rejected.type,
      payload: 'Некорректные данные заказа',
    } as unknown as AnyAction;

    const next = reducer(prev, action) as OrderState;

    expect(next.status).toBe('failed');
    expect(next.error).toBe('Некорректные данные заказа');
  });

  it('sendOrder.rejected falls back to default error when payload is missing', () => {
    const prev = makeState({ status: 'loading', error: null });

    const action = {
      type: sendOrder.rejected.type,
      payload: undefined,
    } as unknown as AnyAction;

    const next = reducer(prev, action) as OrderState;

    expect(next.status).toBe('failed');
    expect(next.error).toBe('Ошибка при оформлении заказа');
  });
});
