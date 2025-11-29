import { Component, effect, inject, OnInit } from '@angular/core';
import { ProfileHeaderComponent } from '../../feature-profile/profile-header/profile-header.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  firstValueFrom,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AvatarUploadComponent } from '../../ui/avatar-upload/avatar-upload.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '@tt/shared';
import {ProfileService} from '@tt/data-access/profile';
// import { ProfileService } from '@tt/shared';

interface onDestroy {}

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    AvatarUploadComponent,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  me$ = toObservable(this.profileService.me);

  formSetting = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
    // avatarUrl: [''],
  });

  constructor() {
    effect(() => {
      // @ts-ignore
      this.formSetting.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  // avatarFile = inject(AvatarUploadComponent).file

  onSave(e: File | null | undefined) {
    console.log(`onSave ${e}`);
    this.formSetting.markAllAsTouched();
    this.formSetting.updateValueAndValidity();

    if (this.formSetting.invalid) return;

    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.formSetting.value,
        stack: this.splitStack(this.formSetting.value.stack),
      })
    );

    if (e == undefined) return;
    firstValueFrom(this.profileService.uploadImg(e));
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;
    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined): string[] {
    //@ts-ignore
    if (!stack) return '';
    //@ts-ignore
    if (Array.isArray(stack)) return stack.join(',');
    //@ts-ignore
    return stack;
  }
}
