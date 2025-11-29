import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {SvgIconComponent} from '@tt/shared';
import {ProfileService} from '@tt/data-access/profile';
// import {ProfileService} from '@tt/shared';

@Component({
  selector: 'app-community-page-filter',
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './community-page-filter.component.html',
  styleUrl: './community-page-filter.component.scss',
})
export class CommunityPageFilterComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  communityForm = this.fb.group({
    communityName: [''],
    theme: [''],
    city: [''],
    tag: [''],
  });
}
