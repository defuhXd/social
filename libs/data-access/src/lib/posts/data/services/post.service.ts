import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CommentsCreateDto, Post, PostComments, PostCreateDto,} from '../interfaces/';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  // posts = signal<Post[]>([]);
  //Посты
  // fetchPosts() {
  //   return this.#http.get<Post[]>(`${this.baseApiUrl}post/`)
  //   //   .pipe(
  //   //   tap((posts: Post[]) => {
  //   //     this.posts.set(posts);
  //   //   })
  //   // );
  // }

  getPostsByUserId(user_id: number) {
    const params = new HttpParams().set('user_id', String(user_id));

    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`, {params} )
      // .pipe(
      //   tap((posts: Post[]) => {
      //     this.posts.set(posts);
      //   })
      // );
  }
  createPost(dto: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, dto)
  }
  editPost(id: number, changes: Partial<Post>) {
    // сервер часто ждёт PATCH /post/:id с частичным объектом
    return this.#http.patch<Post>(`${this.baseApiUrl}post/${id}`, changes);
  }
  deletePost(id: number) {
    return this.#http.delete<void>(`${this.baseApiUrl}post/${id}`);
  }


  createComment(dto: CommentsCreateDto) {
    return this.#http.post<PostComments>(`${this.baseApiUrl}comment/`, dto);
  }

  getCommentsByPostId(postId: number) {
    return this.#http.get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }

  editComment(commentId: number, changes: Partial<PostComments>){
  return this.#http.patch<PostComments>(`${this.baseApiUrl}comment/${commentId}`, changes )
  }
  deleteComment(commentId: number) {
    return this.#http.delete<void>(`${this.baseApiUrl}comment/${commentId}`);
  }

}
