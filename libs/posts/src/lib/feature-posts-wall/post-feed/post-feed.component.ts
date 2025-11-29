import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, ViewChild,} from '@angular/core';
import {debounceTime, fromEvent, Subject, switchMap, takeUntil,} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {PostComponent} from '../post';
import {ProfileService} from '@tt/data-access/profile';
import {Store} from '@ngrx/store';
import {postActions, selectAllPosts} from '@tt/data-access/posts';
import {GlobalLoaderComponent, TtInputComponent} from '@tt/common-ui';


@Component({
  selector: 'app-post-feed',
  imports: [PostComponent, AsyncPipe, TtInputComponent, GlobalLoaderComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements OnInit, OnDestroy, AfterViewInit {
  profileService = inject(ProfileService);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private r2 = inject(Renderer2);
  private hostElement = inject(ElementRef);
  private destroyed$ = new Subject<void>();

  profile = inject(ProfileService).me;
  // postId = input<number>(0);
  // feed = signal<Post[]>([]);
  // loading = signal<boolean>(true);

  // селекторы как signals
  feed = this.store.selectSignal(selectAllPosts);
  // если нужен "me"
  me$ = toObservable(this.profileService.me);

  profile$ = this.route.params.pipe(
    switchMap(({id}) => id === 'me' ? this.me$ : this.profileService.getAccount(id))
  );

  onCreatePost(postText: string) {
    const me = this.profileService.me()
    if (!postText?.trim() || !me) return
    // Вместо HTTP — экшен создания
    this.store.dispatch(postActions.createPost({
      postDto: {
        title: 'New post',
        content: postText,
        authorId: me.id,
        communityId: 0,
      }
    }))
  }



  ngOnInit() {
    this.profile$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(profile => {
        if (!profile) return;
        this.store.dispatch(postActions.postLoad({ postId: profile.id }));
      });
  }

  @ViewChild('postsWrapper', {static: false})
  postsWrapper!
    :
    ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.resizeFeed();
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.resizeFeed();
        console.log('resize complete');
      });
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
