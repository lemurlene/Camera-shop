import { describe, it, expect } from 'vitest';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { mockReviews } from '../../mocks/mock-reviews';

import {
  selectOffersComments,
  selectCommentsOffersStatus,
  selectCommentStatus,
  selectCommentsError,
  selectPostCommentError,
} from './reviews.selector';

describe('reviews selectors', () => {
  it('selectOffersComments returns offerComments', () => {

    const state = makeFakeStore({
      [NameSpace.Reviews]: {
        offerComments: mockReviews,
        isLoadingComments: false,
        isLoadingComment: false,
        commentsError: null,
        postCommentError: null,
      },
    });

    expect(selectOffersComments(state)).toBe(mockReviews);
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
