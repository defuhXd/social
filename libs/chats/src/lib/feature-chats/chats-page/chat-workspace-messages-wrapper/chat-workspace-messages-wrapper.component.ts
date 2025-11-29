import {Component, ElementRef, inject, input, OnInit, Renderer2, Signal,} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {debounceTime, firstValueFrom, fromEvent, Subject, takeUntil,} from 'rxjs';
import {Chat, ChatsService,} from '@tt/data-access/chats';
import {TtInputComponent} from '@tt/common-ui';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessageComponent,
    TtInputComponent,
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})

export class ChatWorkspaceMessagesWrapperComponent implements OnInit{

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  private destroyed$ = new Subject<void>();
  private chatService = inject(ChatsService);
  store = inject(Store)

  messages = this.chatService.activeChatMessages;
  // messages = this.store.selectSignal(selectActiveChatMessages)
  chat = input.required<Chat>();
  //
  // groupedMessages= this.store.select(selectChatGroupedMessages)
  //   // { initialValue: [] as MessageGroup[] }

  ngAfterViewInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe(() => {
          this.resizeFeed();//console.log(123);
        }
      );

  }

  ngOnInit() {
    // this.store.dispatch(chatActions.loadChat({
    //     chatId: this.chat().id
    //   })
    // )
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  async onSendMessage(text: string) {
    this.chatService.wsAdapter.sendMessage(
      text,
      this.chat().id
    )

    // this.store.dispatch(chatActions.sendMessage(
    //   {
    //     chatId: this.chat().id,
    //     message: messageText,
    //   }
    // ))

    // await firstValueFrom(
    //   this.chatService.sendMessage(this.chat().id, messageText)
    // );

    await firstValueFrom(this.chatService.getChatById(this.chat().id));
  }

}
