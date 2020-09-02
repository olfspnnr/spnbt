import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, ChannelLogsQueryOptions } from "discord.js";

export const clearFails = {
  name: "clearFails",
  description: `Löscht alle Nachrichten mit ${config.prefix} am Anfang der Nachricht`,
  usage: `[${config.prefix}clearFails]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    clearFailedCommands(message, client),
} as messageHandleFunction;

const clearFailedCommands = async (message: Message, client: Client) => {
  try {
    const messages = await message.channel.messages.fetch({ limit: 25 });
    let messagesWithExclamation = messages.filter(
      (msg) => msg.content.slice(0, 1) === config.prefix
    );
    messagesWithExclamation.forEach((element) => {
      if (element.deletable) element.delete();
    });
  } catch (error) {
    throw error;
  }
};
