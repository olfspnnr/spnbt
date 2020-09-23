import { commandProps, config, roleIds, auth, userIds, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel, ReactionEmoji, User } from "discord.js";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: ["spinner"],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client),
} as messageHandleFunction;

const executeTestFunction = async (message: Message, client: Client) => {
  try {
  } catch (error) {
    throw error;
  }
};
