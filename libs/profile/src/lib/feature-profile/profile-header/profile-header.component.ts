import { Component, input } from '@angular/core';
import {AvatarCircleComponent} from '@tt/shared';
import {Profile} from '@tt/data-access/profile';
// import {Profile} from '@tt/interfaces';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
}
