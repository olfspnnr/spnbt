import { Message } from "discord.js";

export const sliceMessageFromCommand = (message: Message) => {
  let [command, ...args] = message.content.split(" ");
  return { command: command, args: args };
};
