import { Route } from '@angular/router';
import {ChatsPageComponent, ChatWorkspaceComponent} from '../../feature-chats';
// import {ChatsPageComponent, ChatWorkspaceComponent} from '@tt/chats';
// import { ChatsPageComponent } from '../../../../../../chats/src/lib/feature-chats/chats-page/chats.component';
// import { ChatWorkspaceComponent } from '../../../../../../chats/src/lib/feature-chats/chats-page/chat-workspace/chat-workspace.component';

export const chatRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];
