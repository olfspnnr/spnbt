import { commandProps, config, roleIds } from "../bot";
import { getStreamFromYouTubeLink, addToQueue } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
import { audioQueueElement } from "../controller/audioQueue";

export const Gruschel = {
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
