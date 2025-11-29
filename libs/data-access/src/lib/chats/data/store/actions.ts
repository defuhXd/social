import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Chat, LastMessage} from '../interfaces/chats.interface';


export const chatActions= createActionGroup({
  source: "chat",
  events: {
    "load chat": props<{ chatId: number }>(),
    "load chat success": props<{ chat: Chat }>(),

    "load my chats": emptyProps(),
    'load my chats success': props<{ lastMessages: LastMessage[] }>(),

    'set active chat': props<{ chatId: number | null }>(),

    "send message": props<{chatId: number, message: string }>(),
    "send message success": props<{ chat: Chat }>(),

  }
})
