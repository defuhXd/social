import {PostService} from '../services';
import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, of, switchMap} from 'rxjs';
import {postActions} from './actions';


@Injectable({
  providedIn: 'root',
})

export class PostEffects {
  postService = inject(PostService);
  actions$ = inject(Actions)

  //Получение постов
  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.postLoad),
      switchMap(({postId}) => {
        return this.postService.getPostsByUserId(postId).pipe(
          map((posts) => postActions.postLoadSuccess({posts}))
        )
      })
    )
  })

  //Создание постов
  createPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createPost),
      concatMap(({postDto}) =>
        this.postService.createPost(postDto).pipe(
          // map(raw => normalizePost(raw)),
          map(post => postActions.createPostSuccess({post})),
          catchError(err => {
            console.error('create post failed', err);
            return of();
          })
        )
      )
    )
  })

  editPost$ = createEffect(()=>{
    return this.actions$.pipe(
      ofType(postActions.editPost),
      concatMap(({postId, changes})=>
        this.postService.editPost(postId, changes).pipe(
          map(()=> postActions.editPostSuccess({postId, changes}))
        )
      )
    )
  })


  deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.deletePost),
      concatMap(({postId}) =>
        this.postService.deletePost(postId).pipe(
          map(() => postActions.deletePostSuccess({postId}))
        )
      )
    )
  })

  loadComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.loadComments),
      concatMap(({postId}) =>
        this.postService.getCommentsByPostId(postId).pipe(
          map(comments => postActions.loadCommentsSuccess({comments}))
        ))
    )
  })

  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createComment),
      concatMap(({commentDto}) =>
        this.postService.createComment(commentDto).pipe(
          map((comment) => postActions.createCommentSuccess({comment})),
          catchError(err => {
            console.error('create post failed', err);
            return of();
          })
        )
      )
    )
  })

  editComments$ = createEffect(()=>{
    return this.actions$.pipe(
      ofType(postActions.editComment),
      concatMap(({postId, commentId, changes})=>
        this.postService.editComment(commentId, changes).pipe(
          map(()=> postActions.editCommentSuccess({postId, commentId, changes}))
        )
      )
    )
  })

  deleteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.deleteComment),
      concatMap(({commentId, postId}) =>
        this.postService.deleteComment(commentId).pipe(
          map(() =>
            postActions.deleteCommentSuccess({commentId, postId})),
          catchError(err => {
              console.error('delete comment failed', err);
              return of();
            }
          )
        )
      )
    )
  })

}

// function toMsg(err: unknown) {
//   return (err as any)?.message ?? 'Unknown error';
// }
