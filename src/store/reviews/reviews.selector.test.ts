import {
  selectOffersComments,
  selectCommentsOffersStatus,
  selectCommentStatus
} from './reviews.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { mockReviews } from '../../mocks/mock-reviews';

describe('Reviews selectors', () => {
  describe('selectOffersComments', () => {
    it('should return reviews array from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: mockReviews,
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectOffersComments(fakeState);

      expect(result).toEqual(mockReviews);
    });

    it('should return empty array when reviews are not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: [],
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectOffersComments(fakeState);

      expect(result).toEqual([]);
    });

    it('should return correct number of reviews', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: mockReviews,
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectOffersComments(fakeState);

      expect(result).toHaveLength(mockReviews.length);
    });
  });

  describe('selectCommentsOffersStatus', () => {
    it('should return comments loading status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: [],
          isLoadingComments: true,
          isLoadingComment: false
        },
      });

      const result = selectCommentsOffersStatus(fakeState);

      expect(result).toBe(true);
    });

    it('should return comments loading status false from state when reviews are loaded', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: mockReviews,
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectCommentsOffersStatus(fakeState);

      expect(result).toBe(false);
    });

    it('should return comments loading status false from state when reviews array is empty', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: [],
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectCommentsOffersStatus(fakeState);

      expect(result).toBe(false);
    });
  });

  describe('selectCommentStatus', () => {
    it('should return comment posting status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: mockReviews,
          isLoadingComments: false,
          isLoadingComment: true
        },
      });

      const result = selectCommentStatus(fakeState);

      expect(result).toBe(true);
    });

    it('should return comment posting status false from state when not posting', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: mockReviews,
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectCommentStatus(fakeState);

      expect(result).toBe(false);
    });

    it('should return comment posting status false from state when reviews array is empty', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Reviews]: {
          offerComments: [],
          isLoadingComments: false,
          isLoadingComment: false
        },
      });

      const result = selectCommentStatus(fakeState);

      expect(result).toBe(false);
    });
  });
});
