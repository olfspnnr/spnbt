import { MessageCollector, Message, MessageReaction } from "discord.js";
import { userIds } from "./bot";

export const reactionDeletionHandler = (message: Message, reaction: MessageReaction) => {
  const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
    time: 600 * 1000
  });
  collector.on("collect", (followUpMessage: Message) => {
    if (followUpMessage.member.user.id === userIds.olaf) reaction.remove();
    else return;
  });
};
