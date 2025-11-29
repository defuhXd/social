import {createActionGroup, props} from '@ngrx/store';
import {CommentsCreateDto, Post, PostComments, PostCreateDto} from '../interfaces/';

export const postActions= createActionGroup({
  source: "post",
  events: {
    //Загрузка
    "post load": props<{ postId: number }>(),
    "post load success": props<{ posts: Post[] }>(),
    //Создание
    "create post": props<{ postDto: PostCreateDto }>(),
    "create post success": props<{ post: Post }>(),
    //Редактирование
    "edit post":props<{ postId: number, changes: Partial<Post> }>(),
    "edit post success": props<{ postId: number, changes: Partial<Post> }>(),
    //Удаление
    "delete post": props<{ postId: number }>(),
    "delete post success": props<{ postId: number}>(),

    //Загрузка
    "load comments": props<{ postId: number }>(),
    "load comments success": props<{ comments: PostComments[] }>(),
    //Создание
    "create comment": props<{ commentDto: CommentsCreateDto }>(),
    "create comment success": props<{ comment: PostComments }>(),
    //Редактирование
    "edit comment":props<{ postId: number, commentId: number, changes: Partial<PostComments> }>(),
    "edit comment success": props<{ postId: number, commentId: number, changes: Partial<Post> }>(),
    //Удаление
    "delete comment": props<{  commentId: number, postId: number }>(),
    "delete comment success": props<{  commentId: number, postId: number }>(),
  }
})
// export const commentsActions= createActionGroup({
//   source: "comments",
//   events: {
//
//   }
// })
