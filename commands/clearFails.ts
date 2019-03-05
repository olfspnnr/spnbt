import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, ChannelLogsQueryOptions } from "discord.js";

export const clearFails = {
  name: "clearFails",
  description: `Löscht alle Nachrichten mit ${config.prefix} am Anfang der Nachricht`,
  usage: `[${config.prefix}clearFails]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    clearFailedCommands(message, client)
} as messageHandleFunction;

const clearFailedCommands = (message: Message, client: Client) => {
  message.channel.fetchMessages({ limit: 25 } as ChannelLogsQueryOptions).then(messages => {
    let messagesWithExclamation = messages.filter(msg => msg.content.slice(0, 1) === config.prefix);
    messagesWithExclamation.forEach(element => {
      if (element.deletable) element.delete();
    });
  });
};
