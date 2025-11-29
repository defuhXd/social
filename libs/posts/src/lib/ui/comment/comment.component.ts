import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent, TimePipe} from '@tt/shared';
import {Post, postActions, PostComments} from '@tt/data-access/posts';
import {ClickOutsideDirective} from '@tt/data-access/directives';
import {Store} from '@ngrx/store';
import {TtInputComponent} from '@tt/common-ui';


@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, TimePipe, SvgIconComponent, ClickOutsideDirective, TtInputComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComments>();
  post = input<Post>();
  postId = input<number>();
  private store = inject(Store);
  // loading = this.store.selectSignal(selectLoading);
  // pendingByPost = signal(false); // [NEW]
  // errorText = signal<string | null>(null); // [NEW]

  @Output() edit = new EventEmitter<{ id: number; text: string }>();
  @Output() remove = new EventEmitter<number>();
  // @Output() comment = new EventEmitter<comment>();

  // меню/редактор
  menuOpen = signal(false);
  editOpen = signal(false);
  // draft = signal<string>('');

  @ViewChild('editorInputRef') editorInputRef!: TtInputComponent;


  toggleMenu($event: Event){
    $event?.stopPropagation(); // чтобы клик по кнопке не всплывал
    this.menuOpen.update(v => !v);
  }
  closeMenu() {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
    if (this.editOpen()) this.cancelEdit();
  }

  // открыть редактор, заполнить черновик текущим контентом и сфокусироваться
  openEditor(event?: MouseEvent) {
    event?.stopPropagation();
    const p = this.comment();
    if (!p) return;
    this.editOpen.set(true);

    queueMicrotask(() => this.editorInputRef?.focus());
  }

  cancelEdit() {
    this.editOpen.set(false);
  }

  onEditComment(newText: string) {
    const c = this.comment();
    const postId = this.postId();
    if (!c || !postId) return;
    const text = newText.trim();
    if (!text || text === c.text) {
      this.editOpen.set(false);
      return;
    }
    this.store.dispatch(
      postActions.editComment({
        postId,
        commentId: c.id,
        changes: { text }
      })
    );
    this.editOpen.set(false);
    this.closeMenu();
  }

  deleteComment(commentId: number) {
    const postId = this.postId();
    if (!postId || !commentId) return;
    this.store.dispatch(postActions.deleteComment({ commentId, postId}));
    console.log(commentId);
    this.remove.emit(commentId);
    this.closeMenu();
  }
}

