import {Routes} from '@angular/router';
import {ExperimentalComponent} from './experimental/experimental.component';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import {ProfilePageComponent, SearchPageComponent, SettingsPageComponent, SinglePageComponent} from '@tt/profile';
import {LayoutComponent} from '@tt/layouts';
import {communityRoutes} from '@tt/community-page';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {chatRoutes} from '@tt/chats';
import {ChatEffects, chatFeature} from '@tt/data-access/chats';
import {commentsFeature, PostEffects, postsFeature} from '@tt/data-access/posts';
import {ProfileEffects, profileFeature, profileStore} from '@tt/data-access/profile';
// import {profileStore} from '@tt/data-access/profile/data/store/profile.store';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile/me',
        pathMatch: 'full',
        providers: [
          // provideState(postsFeature),
          // provideEffects(PostEffects),
        ]
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
           // profileStore,
          provideState(profileFeature),
          provideEffects([ProfileEffects]),
        ]
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postsFeature),
          provideState(commentsFeature),
          provideEffects(PostEffects),
        ]
      },
      {path: 'settings', component: SettingsPageComponent,},
      {
        path: 'chats',
        loadChildren: () => chatRoutes,
        providers: [
          provideState(chatFeature),
          provideEffects(ChatEffects),
        ]
      },
      {path: 'community', loadChildren: () => communityRoutes},
    ],
    canActivate: [canActivateAuth],
  },
  {path: 'login', component: LoginPageComponent},
  {path: 'single', component: SinglePageComponent},
  {path: 'experiment', component: ExperimentalComponent},
];
