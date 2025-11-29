import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { CommunityPageWrapperComponent } from './community-page-wrapper/community-page-wrapper.component';
import {SvgIconComponent} from '@tt/shared';
// import { SvgIconComponent } from '../../../../../../libs/shared/src/lib/ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-community-page',
  imports: [RouterOutlet, SvgIconComponent],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.scss',
})
export class CommunityPageComponent {}
