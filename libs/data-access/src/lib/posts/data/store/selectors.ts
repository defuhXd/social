import {commentsFeature, postsFeature} from '../store/reducer';
import {createSelector} from '@ngrx/store';

export const selectAllPosts = createSelector(
  postsFeature.selectPosts,
  (posts)=> posts,
)

// export const selectAllComments = createSelector(
//   commentsFeature.selectComments,
//   (comments)=> comments
// )

export const selectCommentsByPostId=(postId: number)=>
createSelector(commentsFeature.selectComments,
  (comments)=> comments[postId])

