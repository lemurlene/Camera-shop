import { describe, it, expect } from 'vitest';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import type { ReviewType } from '../../const/type';

import {
  selectOffersComments,
  selectCommentsOffersStatus,
  selectCommentStatus,
  selectCommentsError,
  selectPostCommentError,
} from './reviews.selector';

describe('reviews selectors', () => {
  it('selectOffersComments returns offerComments', () => {
    const fakeComments = [
      {
        id: '1',
        userName: 'Alex',
        advantage: 'fast',
        disadvantage: 'none',
        review: 'ok',
        rating: 5,
        createAt: '2024-01-01T10:00:00.000Z',
        cameraId: 1,
      },
    ] as unknown as ReviewType[];

    const state = makeFakeStore({
      [NameSpace.Reviews]: {
        offerComments: fakeComments,
        isLoadingComments: false,
        isLoadingComment: false,
        commentsError: null,
        postCommentError: null,
      },
    });

    expect(selectOffersComments(state)).toBe(fakeComments);
  });

  it('selectCommentsOffersStatus returns isLoadingComments', () => {
    const state = makeFakeStore({
      [NameSpace.Reviews]: {
        offerComments: [],
        isLoadingComments: true,
        isLoadingComment: false,
        commentsError: null,
        postCommentError: null,
      },
    });

    expect(selectCommentsOffersStatus(state)).toBe(true);
  });

  it('selectCommentStatus returns isLoadingComment', () => {
    const state = makeFakeStore({
      [NameSpace.Reviews]: {
        offerComments: [],
        isLoadingComments: false,
        isLoadingComment: true,
        commentsError: null,
        postCommentError: null,
      },
    });

    expect(selectCommentStatus(state)).toBe(true);
  });

  it('selectCommentsError returns commentsError', () => {
    const state = makeFakeStore({
      [NameSpace.Reviews]: {
        offerComments: [],
        isLoadingComments: false,
        isLoadingComment: false,
        commentsError: 'Ошибка загрузки комментариев',
        postCommentError: null,
      },
    });

    expect(selectCommentsError(state)).toBe('Ошибка загрузки комментариев');
  });

  it('selectPostCommentError returns postCommentError', () => {
    const state = makeFakeStore({
      [NameSpace.Reviews]: {
        offerComments: [],
        isLoadingComments: false,
        isLoadingComment: false,
        commentsError: null,
        postCommentError: 'Ошибка отправки комментария',
      },
    });

    expect(selectPostCommentError(state)).toBe('Ошибка отправки комментария');
  });
});
