import {CommentsCreateDto, Post, PostComments, PostCreateDto } from "./data/interfaces/post.interface";
import { PostService } from "./data/services/post.service";

export * from "./data/store"

export {
  PostService
}

export type{
  PostCreateDto,
  Post,
  PostComments,
  CommentsCreateDto
}
