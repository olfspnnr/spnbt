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
        return member.displayName;
      });
      const newMessage = `${
        message.author.username
      } gruschelte folgende Personen: ${messageArr.join(" ,")}`;
      await message.channel.sendMessage(newMessage);
      return;
    }
  } catch (error) {
    throw error;
  }
};
