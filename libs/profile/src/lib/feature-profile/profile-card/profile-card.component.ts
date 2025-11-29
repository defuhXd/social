import { Component, Input, input } from '@angular/core';
// import { Profile } from '../../../../../interfaces/src/lib/data/interfaces/profile.interface';
import { RouterLink } from '@angular/router';
import {ImgUrlPipe} from '@tt/shared';
import {Profile} from '@tt/data-access/profile';
// import {Profile} from '@tt/interfaces';

@Component({
  selector: 'app-profile-card',
  imports: [ImgUrlPipe, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
