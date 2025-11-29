import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from '@tt/common-ui';
// import { SidebarComponent } from '../../../../common-ui/src/lib/sidebar/sidebar.component';
// import { ProfileService } from '@tt/shared';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
