import { Component, input } from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/shared';
import {Profile} from '@tt/data-access/profile';
// import {Profile} from '@tt/interfaces';
// import { Profile } from '../../../../../../../../libs/shared/src/lib/data/interfaces/profile.interface';
// import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
// import { SvgIconComponent } from '../../../../../../../../libs/shared/src/lib/ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-chat-workspace-header',
  imports: [AvatarCircleComponent, SvgIconComponent],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input.required<Profile>();
}
