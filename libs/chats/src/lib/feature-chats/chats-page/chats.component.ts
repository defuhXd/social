import {Component, HostBinding, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsListComponent} from './chats-list';
import {ChatsService} from '@tt/data-access/chats';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-page',
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsPageComponent{
  #chatService = inject(ChatsService);

  #isChatListFull = false;

  @HostBinding('class.show-fullChat-List')
  get showFullChatList() {
    return this.#isChatListFull;
  }

  onToggleShow() {
    this.#isChatListFull = !this.#isChatListFull;
  }

  constructor() {
    this.#chatService.connectWS()
      .pipe(takeUntilDestroyed())
      .subscribe()
  }

}
