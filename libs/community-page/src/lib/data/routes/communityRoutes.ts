import { Route } from '@angular/router';
import { CommunityPageComponent } from '../../community-page/community-page.component';
import { CommunityPageWrapperComponent } from '../../community-page/community-page-wrapper/community-page-wrapper.component';

export const communityRoutes: Route[] = [
  {
    path: '',
    component: CommunityPageComponent,
    children: [{ path: '', component: CommunityPageWrapperComponent }],
  },
];
