import {createSelector} from '@ngrx/store';
import {chatActions, chatFeature} from '@tt/data-access/chats';

export const selectAllChats= createSelector(
  chatFeature.selectChats,
  (chats) => chats
)

export const selectChatById=(chatId:number) => createSelector(
  chatFeature.selectChats,
  (chats)=>chats[chatId]
)

export const selectActiveChat = createSelector(
  chatFeature.selectChats,
  chatFeature.selectActiveChatId,
  (chats, activeId) => (activeId != null ? chats[activeId] : undefined),
);
export const selectActiveChatMessages = createSelector(
  selectActiveChat,
  (chat) => chat?.messages ?? [],
);
