import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {chatActions, ChatsService} from '@tt/data-access/chats';
import {map, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatEffects {
  actions$ = inject(Actions)
  chatService = inject(ChatsService)

  loadChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.loadChat),
      switchMap(({chatId}) => {
        return this.chatService.getChatById(chatId).pipe(
          map((chat) => chatActions.loadChatSuccess({chat})),
        )
      })
    )
  })

  loadMyChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.loadMyChats),
      switchMap(() =>
        this.chatService.getMyChats().pipe(
          map((lastMessages) => chatActions.loadMyChatsSuccess({lastMessages})),
        )
      )
    )
  })

  sendMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.sendMessage),
      switchMap(({chatId, message}) =>
        this.chatService.sendMessage(chatId, message).pipe(
          switchMap(() => this.chatService.getChatById(chatId)),
          map((chat) => chatActions.sendMessageSuccess({ chat }))
        )
      )
    )
  })

}


function toMsg(err: unknown) {
  return (err as any)?.message ?? 'Unknown error';
}
