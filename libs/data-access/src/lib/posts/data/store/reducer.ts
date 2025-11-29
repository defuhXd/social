import {CommentsCreateDto, Post, PostComments, PostCreateDto} from '../interfaces/';
import {createFeature, createReducer, on} from '@ngrx/store';
import {postActions} from './actions';

export interface PostState {
  posts: Post[],
  postId: number,
  postDto: PostCreateDto,
  comments: Record<number, PostComments[]>,
  commentId: number,
  commentDto: CommentsCreateDto
}

export const initialState: PostState = ({
  posts: [],
  postId: 0,
  postDto: {
    title: " Новый пост",
    content: "",
    authorId: 0,
    communityId: 0
  },
  comments: {},
  commentId: 0,
  commentDto: {
    text: "",
    authorId: 0,
    postId: 0,
    commentId: 0
  }
})

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState,

    on(postActions.postLoadSuccess, (state, {posts}) => {
      return {...state, posts}}),

    on(postActions.createPost, (state, {postDto}) => {
      return {...state, postDto: postDto}}),

    on(postActions.createPostSuccess, (state, {post}) => {
      return {...state, posts: [post, ...state.posts]}}),

    on(postActions.editPostSuccess, (state, {postId, changes})=>{
      return {...state, posts: state.posts.map(p => p.id === postId ? {...p, ...changes} : p)}
    }),

    on(postActions.deletePost, (state, {postId}) => {return {...state,
      posts: state.posts.filter(p => p.id !== postId)}}),

  )
});

export const commentsFeature = createFeature({
  name: 'commentsFeature',
  reducer: createReducer(
    initialState,
    on(postActions.loadCommentsSuccess, (state, {comments}) => {
      const stateComments = {...state.comments}
      if (comments.length) {
        stateComments[comments[0].postId] = comments
      }
      return {
        ...state,
        comments: stateComments
      }
    }),

    on(postActions.createCommentSuccess, (state, {comment}) => {
      const stateComments = { ...state.comments };
      const postId = comment.postId;
      const current = stateComments[postId] ?? [];
      stateComments[postId] = [...current, comment];
      return {
        ...state,
        comments: stateComments
      };
    }),

    on(postActions.editCommentSuccess,(state, {postId, commentId, changes})=>{
      const stateComments = { ...state.comments };
      const current = stateComments[postId] ?? [];
      stateComments[postId] = current.map(c =>
        c.id === commentId ? { ...c, ...changes } : c
      );
      return {
        ...state,
        comments: stateComments
      };
    }),

    on(postActions.deleteCommentSuccess, (state, {commentId, postId}) => {
      const stateComments = { ...state.comments };
      const current = stateComments[postId] ?? [];
      stateComments[postId] = current.filter(c => c.id !== commentId);
      return {
        ...state,
        comments: stateComments
      }})


  )
});
