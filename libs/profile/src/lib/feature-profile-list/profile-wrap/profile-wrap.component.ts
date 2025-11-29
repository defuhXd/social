import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ProfileCardComponent } from '../../feature-profile/profile-card/profile-card.component';
import { debounceTime, fromEvent } from 'rxjs';
import {Store} from '@ngrx/store';
import {ProfileService, profileStore, selectFilteredProfiles} from '@tt/data-access/profile';
// import {selectFilteredProfiles} from '../../data';
// import {ProfileService} from '@tt/data-access/profile';
// import { ProfileService } from '@tt/shared';

@Component({
  selector: 'app-profile-wrap',
  imports: [ProfileCardComponent],
  templateUrl: './profile-wrap.component.html',
  styleUrl: './profile-wrap.component.scss',
})
export class ProfileWrapComponent implements OnInit, OnDestroy {
  // profileService = inject(ProfileService);
  // store = inject(profileStore);
  profileService = inject(ProfileService)
  // profiles = this.store.profiles
  // profiles = this.profileService.select('profiles')

  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe((event) => {
        this.resizeFeed();
        console.log(123);
      });
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngOnDestroy() {}
}
