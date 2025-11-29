// import { Profile } from '../../../../../interfaces/src/lib/data/interfaces/profile.interface';

// import {Profile} from '@tt/interfaces';

import {Profile} from '@tt/data-access/profile';

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt?: string;
  user?: Profile;
  isMine?: boolean;
}

export interface LastMessage {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: number;
  unreadMessages: number;
}

export interface LastMessageRes {
  id: number;
  userFrom: Profile;
  message: string | null;
}
