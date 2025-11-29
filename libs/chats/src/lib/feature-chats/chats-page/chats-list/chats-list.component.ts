import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, HostBinding,
  inject,
  Input, OnDestroy,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {ChatsBtnComponent} from '../chats-btn/chats-btn.component';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, fromEvent, map, startWith, Subject, switchMap, takeUntil} from 'rxjs';
import {SvgIconComponent} from '@tt/shared';
import {ChatsService} from '@tt/data-access/chats';

@Component({
  selector: 'app-chats-list',
  imports: [
    ChatsBtnComponent,
    SvgIconComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements AfterViewInit, OnDestroy {
  chatsService = inject(ChatsService);
  filterChatControl = new FormControl('');
  r2 = inject(Renderer2);
  private destroyed$ = new Subject<void>();

  @Output() mobBtn = new EventEmitter();
  @Output() unreadMessages = new EventEmitter();

  onMobBtnClick() {
    this.mobBtn.emit();
  }

  @ViewChild('listWrapper') listWrapper!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.resizeFeed();
    if (!this.listWrapper) return;
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.resizeFeed();
        console.log(123);
      });
  }

  resizeFeed() {
    const {top} = this.listWrapper.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;
    this.r2.setStyle(this.listWrapper.nativeElement, 'height', `${height}px`);
  }

  chats$ = this.chatsService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterChatControl.valueChanges.pipe(
        startWith(''),
        map((inputValue) => {
          return chats.filter((chat) => {
            return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
              .toLowerCase()
              .includes(inputValue?.toLowerCase() ?? '');
          });
        })
      );
    })
  );

  @Input() expanded = false;

  @HostBinding('class.show')
  get showClass() {
    return this.expanded;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
