import {Component, computed, HostListener, inject, input, OnInit, Signal, signal, ViewChild,} from '@angular/core';
import {CommentComponent} from '../../ui/';
import {AvatarCircleComponent, SvgIconComponent, TimePipe} from '@tt/shared';
import {ProfileService} from '@tt/data-access/profile';
import {Post, postActions, PostComments, selectCommentsByPostId} from '@tt/data-access/posts';
import {Store} from '@ngrx/store';
import {ClickOutsideDirective} from '@tt/data-access/directives';
import {TtInputComponent} from '@tt/common-ui';


@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    TimePipe,
    ClickOutsideDirective,
    TtInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  // ===== Inputs =====
  isCommentInput = input(false);
  profile = inject(ProfileService).me;
  post = input<Post>();
  profileService = inject(ProfileService);
  // ===== Store / селекторы =====
  private store = inject(Store);
  comments!: Signal<PostComments[]>

  comments2 = computed(()=>{
    if(this.comments()?.length > 0 ){
      return this.comments()
    }
    return this.post()?.comments
  })

  // ===== Локальные состояния =====
  menuOpen = signal(false);
  editOpen = signal(false);
  // Ссылка на внутренний tt-input в модалке, чтобы фокуснуть после открытия
  @ViewChild('editorInputRef') editorInputRef!: TtInputComponent;

  async ngOnInit() {
    this.comments = this.store.selectSignal(selectCommentsByPostId(this.post()!.id))
    this.store.dispatch(postActions.loadComments({ postId: this.post()!.id}))
  }
  // ===== Комментарии =====
  onCreateComment(commentText: string) {
    const me = this.profileService.me();
    const p = this.post();
    if (!me || !p) return;
    this.store.dispatch(postActions.createComment({
      commentDto: {text: commentText, authorId: me.id, postId: p.id, commentId: 0}
    }))
  }

  // onEditComment(e: { id: number; text: string }) {
  //   const p = this.post(); if (!p) return;
  //   this.store.dispatch(commentsActions.editComment({
  //     postId: p.id, commentId: e.id, changes: { text: e.text.trim() }
  //   }));
  // }

  // onDeleteComment(commentId: number) {
  //   const p = this.post(); if (!p) return;
  //   this.store.dispatch(postActions.deleteComment({ postId: p.id, commentId }));
  // }

  // ===== Меню поста =====

  toggleMenu($event: Event) {
    $event?.stopPropagation(); // чтобы клик по кнопке не всплывал
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  // если хочешь закрывать по Esc
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
    if (this.editOpen()) this.cancelEdit();
  }

  // ===== Операции с постом =====


  // editPost(){
  //   const p = this.post();
  //   if (!p) return;
  //   const changes = { title: p.title + ' (edited)', content: p.content };
  //   this.store.dispatch(postActions.editPost({id:p.id, changes}))
  // }

  // открыть редактор, заполнить черновик текущим контентом и сфокусироваться
  openEditor(event?: MouseEvent) {
    event?.stopPropagation();
    const p = this.post();
    if (!p) return;
    // this.draft.set(p.content ?? '');
    this.editOpen.set(true);

    queueMicrotask(() => this.editorInputRef?.focus());
  }

  // закрыть без сохранения
  cancelEdit() {
    this.editOpen.set(false);
  }

  // сохранить: прилетает текст из app-tt-input (editPost)
  onEditPost(newContent: string) {
    const p = this.post();
    if (!p) return;
    const content = (newContent ?? '').trim();
    if (!content) return;
    this.store.dispatch(
      postActions.editPost({
        postId: p.id,
        changes: {content}
      })
    );

    // закрываем сразу, ошибки поймаешь по selectError
    this.editOpen.set(false);
  }

  deletePost(id: number) {
    this.store.dispatch(postActions.deletePost({postId: id}))
    // this.store.dispatch(postActions.postLoad({postId: p.id}))
  }
}

