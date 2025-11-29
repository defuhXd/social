import { Component, Input } from '@angular/core';
// import { Profile } from '../../../../../interfaces/src/lib/data/interfaces/profile.interface';
// import { ImgUrlPipe } from '../../../../../shared/src/lib/helpers/pipes/img-url.pipe';
import { RouterLink } from '@angular/router';
import {ImgUrlPipe} from '@tt/shared';
import {Profile} from '@tt/data-access/profile';
// import {Profile} from '@tt/interfaces';

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe, RouterLink],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
}
