// import {Profile} from '../../../profile';

import {Profile} from '@tt/data-access/profile';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number | undefined;
  communityId: number | undefined;
}

export interface Post {
  id: number;
  title: string;
  communityId: number;
  author: Profile;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  likesUsers: string[];
  comments: PostComments[];
}

export interface PostComments {
  id: number;
  text: string;
  author: Profile;
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsCreateDto {
  text: string;
  authorId: number;
  postId: number;
  commentId: number;
}
