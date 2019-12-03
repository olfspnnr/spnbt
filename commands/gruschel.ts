import { Client, Message } from "discord.js";
import { config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";

export const gruschel = {
  name: "gruschel",
  description: "Gruschelt einen anderen User",
  usage: `[${config.prefix}gruschel @member]`,
  roles: ["spinner", "trusted"],
  execute: ({ discord: { message, client }, custom }) => GruschelUser(message, client)
} as messageHandleFunction;

const GruschelUser = async (message: Message, client: Client) => {
  try {
    if (message.mentions && message.mentions.members) {
      const messageArr = message.mentions.members.map(member => {
        return `**${member.displayName}**`;
      });
      const newMessage = `${
        message.author.username
      } gruschelte folgende Personen: ${messageArr.join(", ")}`;
      if (message.deletable) {
        message.delete();
      }
      const gruscheltext = await message.channel.sendMessage(newMessage);
      return (gruscheltext as Message).delete(15000);
    }
  } catch (error) {
    if (message.deletable) {
      message.delete();
    }
    throw error;
  }
};
