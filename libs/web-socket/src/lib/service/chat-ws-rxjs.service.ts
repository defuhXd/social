import {Injectable} from '@angular/core';
import {ChatConnectionWSParams, ChatWSMessage, ChatWsService} from '@tt/web-socket';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {webSocket} from 'rxjs/webSocket';
import {finalize, Observable, tap} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ChatWsRxjsService implements ChatWsService {

  #socket: WebSocketSubject<ChatWSMessage> | null = null

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      })
    }
    return this.#socket.asObservable()
      .pipe(
        tap(message => params.handleMessage(message)),
        finalize(() => {
          console.log('socket closed')

        })
      )
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId
    })

  }

  disconnect(): void {
    this.#socket?.complete()
  }

}
