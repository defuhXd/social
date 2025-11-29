import {Component, HostBinding, inject, Input, input} from '@angular/core';
// import { DatePipe } from '@angular/common';
import {AvatarCircleComponent, TimePipe} from '@tt/shared';
import {ChatsService, LastMessage} from '@tt/data-access/chats';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, TimePipe, AsyncPipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  #chatService = inject(ChatsService)

  chat = input<LastMessage>();

  unreadMessages = this.#chatService.unreadMessagesCount;

  @Input() expanded = false;

  @HostBinding('class.show')
  get showClass() {
    return this.expanded;
  }

}
