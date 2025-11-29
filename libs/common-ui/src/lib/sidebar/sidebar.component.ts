import {Component, DestroyRef, inject, input, Input, OnInit} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarTimerComponent } from './sidebar-timer/sidebar-timer.component';
import {ImgUrlPipe, SvgIconComponent} from '@tt/shared';
import { Profile, ProfileService } from '@tt/data-access/profile';
import {ChatsService} from '@tt/data-access/chats';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    SubscriberCardComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
    SidebarTimerComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() profile!: Profile;
  // #globalStore = inject(GlobalStoreService);
  profileService = inject(ProfileService);
  #chatService = inject(ChatsService);
  destroy$ = inject(DestroyRef);

  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.profileService.me;
  // chat = input<Chat>()

  unreadMessages = this.#chatService.unreadMessagesCount;

  wsSubscribe!: Subscription

  constructor() {
    this.wsSubscribe =  this.#chatService
      .connectWS()
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  reconect(){
    this.wsSubscribe.unsubscribe()
    this.#chatService
      .connectWS()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe();
  }

  menuItems = [
    {
      icon: 'home',
      label: 'Моя Страница',
      link: 'profile/me',
    },
    {
      icon: 'chat',
      label: 'Чаты',
      link: 'chats',
      unreadMessages: ''
    },
    {
      icon: 'search',
      label: 'Поиск',
      link: 'search',
    },
    {
      icon: 'community',
      label: 'Сообщества',
      link: 'community',
    },
  ];


  ngOnInit() {
  }
}
