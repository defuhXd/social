import {Component, DestroyRef, effect, inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, firstValueFrom, map, startWith, Subscription, switchMap, take} from 'rxjs';
import {SvgIconComponent} from '@tt/shared';
import {profileFeature, ProfileService, profileStore, selectFilteredProfiles} from '@tt/data-access/profile';
import {Store} from '@ngrx/store';
import {profileActions} from '@tt/data-access/profile/data/store/actions';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
// import {postActions} from '@tt/data-access/posts';
// import { ProfileService } from '@tt/shared';

@Component({
  selector: 'app-profile-filters',
  imports: [FormsModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store);
  // private destroyRef = inject(DestroyRef);
  // store = inject(profileStore);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    city: [''],
    stack: [''],
  });
  searchFormSub!: Subscription;

  filtersSig = this.store.selectSignal(profileFeature.selectProfileFilters)

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(formValue => {
        return this.store.dispatch(
          profileActions.filterEvents({filters: formValue}))
      })
    this.searchForm.patchValue({
        ...this.filtersSig()
      }
    )
  }

  ngOnDestroy() {
    // this.searchFormSub.unsubscribe();
  }
}
