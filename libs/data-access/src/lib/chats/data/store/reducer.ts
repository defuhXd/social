import {createFeature, createReducer, on} from '@ngrx/store';
import {Chat, LastMessage} from '../interfaces/chats.interface';
import {chatActions} from '@tt/data-access/chats';

export interface ChatState {
  chats: Record<number, Chat>;
  activeChatId: number | null;
  lastMessage: LastMessage[];
}


export const initialstate: ChatState = ({
  chats: {},
  activeChatId: null,
  lastMessage: [],
})

export const chatFeature = createFeature({
  name: 'chat',
  reducer: createReducer(
    initialstate,
    on(chatActions.loadChatSuccess, (state, {chat}) => {
      return {
        ...state,
        chats: {
          ...state.chats,
          [chat.id]: chat,
        },
      }
    }),

    on(chatActions.loadMyChatsSuccess, (state, {lastMessages}) => {
      return {...state, lastMessage: lastMessages}
    }),

    on(chatActions.setActiveChat, (state, {chatId}) => {
      return {...state, activeChatId: chatId}
    }),

    on(chatActions.sendMessageSuccess, (state, {chat}) => ({
      ...state,
      chats: {
        ...state.chats,
        [chat.id]: chat,
      },
    })),
  )
})
