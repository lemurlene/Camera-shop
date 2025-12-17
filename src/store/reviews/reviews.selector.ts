import { NameSpace } from '../const';
import type { State } from '../type';
import type { ReviewType } from '../../const/type';

const selectOffersComments = (state: State): ReviewType[] =>
  state[NameSpace.Reviews].offerComments;

const selectCommentsOffersStatus = (state: State): boolean =>
  state[NameSpace.Reviews].isLoadingComments;

const selectCommentStatus = (state: State): boolean =>
  state[NameSpace.Reviews].isLoadingComment;

const selectCommentsError = (state: State): string | null =>
  state[NameSpace.Reviews].commentsError;

const selectPostCommentError = (state: State): string | null =>
  state[NameSpace.Reviews].postCommentError;

export {
  selectOffersComments,
  selectCommentsOffersStatus,
  selectCommentStatus,
  selectCommentsError,
  selectPostCommentError,
};
