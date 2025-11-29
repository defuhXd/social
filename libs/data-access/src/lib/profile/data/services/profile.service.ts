import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs';
import {GlobalStoreService} from '../../../globals/';
import {Profile} from '../interfaces/';
import {Pageble} from '../interfaces/';
// import {SignalStoreService} from '@tt/data-access/profile/data/services/signal-store';

 // interface ProfileState {
 //    profiles: Profile[];
 //    profilesFilter: Record<string, any>
 // }

@Injectable({
  providedIn: 'root',
})
export class ProfileService { //extends SignalStoreService<ProfileState>
  http = inject(HttpClient);
  #globalStore = inject(GlobalStoreService);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  globalService = inject(GlobalStoreService);
  me = signal<Profile | null>(null);
  // filteredProfiles = signal<Profile[]>([]);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(tap((res) => {
          this.me.set(res)
          this.#globalStore.me.set(res)
        }
      ));
  }

  constructor() {
    // эффект следит за изменениями профиля и при необходимости обновляет данные
    effect(() => {
      const user = this.me();
      if (!user) {
        // при первом доступе (или logout) — загружаем профиль
        this.http.get<Profile>(`${this.baseApiUrl}account/me`)
          .subscribe({
            next: (res) => this.me.set(res),
            error: (err) => console.error('Не удалось загрузить профиль', err),
          });
      }
    });
  }

  getAccount(id: String) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getSubscribersShortList(subsAmount = 3) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
  }

  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, {params,})
      // .pipe(
      //   tap((res) => {
      //     this.set('profiles', res.items)
      //   })
      // )
      // .pipe(tap((res) => this.filteredProfiles.set(res.items)));
  }

  uploadImg(file: File) {
    const img = new FormData();
    img.append('image', file);
    return this.http.post<string>(
      `${this.baseApiUrl}account/upload_image`,
      img
    );
  }
}
