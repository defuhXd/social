import {Component, computed, inject} from '@angular/core';
import {selectAllPosts} from '@tt/data-access/posts';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-global-Loader',
  imports: [],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.scss',
  standalone: true,
})
export class GlobalLoaderComponent {
  private store = inject(Store);

  // сигналы из стора
  // private postsLoading = this.store.selectSignal(selectLoading);
  private posts         = this.store.selectSignal(selectAllPosts);

  // единый флаг «занято»
  busy = computed(() => {
    // if (this.postsLoad()) return true;

    // если хотя бы по одному видимому посту ещё тянутся комменты — показываем
    const list = this.posts();
    // const byPost = this.comments().loadingByPost ?? {};
    for (let i = 0; i < list.length; i++) {
      // if (byPost[list[i].id]) return true;
    }

    // либо есть любая другая активная загрузка комментов
    // return this.anyCommentsLoading();
  });
}
