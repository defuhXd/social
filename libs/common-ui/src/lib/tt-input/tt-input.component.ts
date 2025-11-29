import {Component, effect, ElementRef, EventEmitter, HostBinding, inject, input, Output, Renderer2, ViewChild, ViewEncapsulation,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/shared';
import {ProfileService} from '@tt/data-access/profile';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-tt-input',
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule, PickerModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TtInputComponent {
  // =============== DI/Signals ===============================================
  r2 = inject(Renderer2);
  store = inject(Store)
  me = inject(ProfileService).me;
  // loading = this.store.selectSignal(selectLoading);
  // =============== МОДЫ (переиспользование) ================================
  postId = input<number>(0);
  isPostInput = input(false);
  isCommentInput = input(false);
  isMessageInput = input(false);
  isEditPost = input(false);
  isEditComment = input(false);
  // =============== Текст =====================================================
  postText = '';
  initialText = input<string>();
  // =============== Состояния UI ============================================
  showPicker = false;
  // selectedEmoji: string | null = null;
  // =============== Локализация эмодзи-пикера ===============================
  russianLabels = {
    search: 'Поиск',
    categories: {
      search: 'Результаты поиска',
      recent: 'Недавние',
      people: 'Смайлы и люди',
      nature: 'Животные и природа',
      foods: 'Еда и напитки',
      activity: 'Активность',
      places: 'Путешествия и места',
      objects: 'Объекты',
      symbols: 'Символы',
      flags: 'Флаги',
    },
  };
  // =============== События наружу ===========================================
  @Output() createdComment = new EventEmitter();
  @Output() createPost = new EventEmitter();
  @Output() createMessage = new EventEmitter<string>();
  @Output() editPost = new EventEmitter<string>();
  @Output() editComment = new EventEmitter<string>();
  // =============== Host-классы для стилей ==================================
  @HostBinding('class.comment')
  get isPost() {
    return this.isPostInput();
  }
  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }
  @HostBinding('class.message')
  get isMessage() {
    return this.isMessageInput();
  }
  @HostBinding('class.edit')
  get isEdit() {
    return this.isEditPost() || this.isEditComment()}

  // Ссылка на сам <textarea #messageInput>
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  // Авто-рост textarea по вводу
  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  // Показать/скрыть эмодзи-пикер
  togglePicker() {
    this.showPicker = !this.showPicker;
  }

  // Вставка эмодзи по текущей позиции курсора
  addEmoji(event: { emoji: { native: string } }) {
    const emoji = event.emoji.native;
    const input = this.messageInput.nativeElement;

    // позиции курсора
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    // вставляем эмодзи в нужное место
    this.postText =
      this.postText.substring(0, start) + emoji + this.postText.substring(end);

    // ставим курсор после вставленного смайла
    queueMicrotask(() => {
      input.selectionStart = input.selectionEnd = start + emoji.length;
      input.focus();
    });

    // this.showPicker = false;
  }

  constructor() {
    effect(() => {
      // [CHANGED] учитывать оба режима редактирования
      if (this.isEditPost() || this.isEditComment()) {
        const init = this.initialText() ?? '';
        if (!this.postText) {
          this.postText = init;

          queueMicrotask(() => {
            const ta = this.messageInput?.nativeElement;
            if (ta) {
              this.r2.setStyle(ta, 'height', 'auto');
              this.r2.setStyle(ta, 'height', ta.scrollHeight + 'px');
              ta.focus();
              ta.setSelectionRange(ta.value.length, ta.value.length);
            }
          });
        }
      }
    });
  }

  // Главная кнопка «отправить/сохранить»
  onPost() {
    const text = this.postText.trim();
    if (!text) return;

    switch (true) {
      case this.isPostInput():
        this.createPost.emit(text);
        break;

      case this.isCommentInput():
        this.createdComment.emit(text);
        break;

      case this.isMessageInput():
        this.createMessage.emit(text);
        break;

      case this.isEditPost():
        this.editPost.emit(text);
        break
      case this.isEditComment():
        this.editComment.emit(text);
        break;

      // default:
      //   this.created.emit(text);
    }
    // Очистка поля — только если это НЕ режим редактирования поста
    if (!this.isEditPost()) {
      this.postText = '';
      const ta = this.messageInput?.nativeElement;
      if (ta) this.r2.setStyle(ta, 'height', 'auto');
    }
  }


  // Публичный метод, чтобы родитель мог фокусить поле
  focus() {
    queueMicrotask(() => this.messageInput?.nativeElement?.focus());
  }

}
