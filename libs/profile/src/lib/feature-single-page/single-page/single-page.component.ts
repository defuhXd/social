import { Component, Input } from '@angular/core';
// import { Profile } from '@tt/interfaces';
import { ImgUrlPipe } from '@tt/shared';
import {Profile} from '@tt/data-access/profile';
// import { ImgUrlPipe } from '../../../../../shared/src/lib/helpers/pipes/img-url.pipe';
// import { Profile } from '../../../../../interfaces/src/lib/data/interfaces/profile.interface';

@Component({
  selector: 'app-single-page',
  imports: [ImgUrlPipe],
  templateUrl: './single-page.component.html',
  styleUrl: './single-page.component.scss',
})
export class SinglePageComponent {
  @Input() profile!: Profile;
}
