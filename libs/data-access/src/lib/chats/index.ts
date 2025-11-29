import { Chat, LastMessage, Message } from "./data/interfaces/chats.interface"
// import { chatRoutes } from "../../../../chats/src/lib/data/routes/chatRoutes"
// import { chatRoutes } from "../../../../shared/src/lib/data/routes/chatRoutes"
// import { chatRoutes } from "../../../../chats/src/lib/data/routes/chatRoutes"
import { ChatsService } from "./data/services/chats.service"
export * from "./data/store"

export {
  ChatsService
}

export type{
  Chat,
  Message,
  LastMessage
}
