import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, LastMessage, Message} from '../interfaces/chats.interface';
import {BehaviorSubject, map, Observable} from 'rxjs';
// import {DateTime} from 'luxon';
import {ChatWSMessage, ChatWsNativeService, ChatWsRxjsService, ChatWsService} from '@tt/web-socket';
import {ProfileService} from '@tt/data-access/profile';
import {AuthService} from '@tt/auth';
import {messages} from 'nx/src/utils/ab-testing';
import {
  isNewMessage,
  isUnreadMessage
} from '../../../../../../web-socket/src/lib/interface/type-guards';


@Injectable({
  providedIn: 'root',
})
export class  ChatsService {
  http = inject(HttpClient);
  // #profileService = inject(ProfileService);
  #authService = inject(AuthService);

  // wsAdapter: ChatWsService = new ChatWsNativeService();
  wsAdapter: ChatWsService = new ChatWsRxjsService();

  baseUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseUrl}chat/`;
  messageUrl = `${this.baseUrl}message/`;
  // #globalStore = inject(GlobalStoreService);
  me = inject(ProfileService).me;
  activeChatMessages = signal<Message[]>([]);
  unreadMessagesCount= signal(0)

  connectWS() {
    return  this.wsAdapter.connect({
      url: `${this.baseUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage,
    }) as Observable<ChatWSMessage>
  }

  handleWSMessage = (message: ChatWSMessage)=> {
    if(!('action' in message)) return

    if(isUnreadMessage(message)){
      // message.data.count
      this.unreadMessagesCount.set(message.data.count)
      return;
    }

    console.log(message)
    if (isNewMessage(message)) {
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: false,
        }
      ])
    }

    // if(isErrorMessage(message)){
    //   this.#authService.refreshAuthToken()
    // }
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessage[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  // private getGroupMessages(
  //   messages: Message[]
  // ): { title: string; messages: Message[] }[] {
  //   if (!messages || messages.length === 0) return [];
  //
  //   const groups: { title: string; messages: Message[] }[] = [];
  //
  //   const today = DateTime.now().startOf('day');
  //   const yesterday = today.minus({ days: 1 });
  //
  //   const grouped = new Map<string, Message[]>();
  //
  //   for (const message of messages) {
  //     const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' })
  //       .setZone(DateTime.local().zone)
  //       .startOf('day');
  //
  //     let dateLabel: string;
  //
  //     if (messageDate.equals(today)) {
  //       dateLabel = 'Сегодня';
  //     } else if (messageDate.equals(yesterday)) {
  //       dateLabel = 'Вчера';
  //     } else {
  //       dateLabel = messageDate.toFormat('dd.MM.yyyy');
  //     }
  //
  //     if (!grouped.has(dateLabel)) {
  //       grouped.set(dateLabel, []);
  //     }
  //     grouped.get(dateLabel)!.push(message);
  //   }
  //
  //   grouped.forEach((msgs, title) => groups.push({ title, messages: msgs }));
  //
  //   return groups;
  // }

  sendMessage(chatId: number, message: string) {
    return this.http.post(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
