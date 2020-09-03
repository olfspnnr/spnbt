import { commandProps, config, roleIds, auth, userIds, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel, ReactionEmoji, User } from "discord.js";
import { getState } from "../controller/stateController";
import { askIfWinnerWantsHisPrize } from "./getRaffleWinner";

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
    const optionmessage = await message.channel.send("Test1");
    const reactionCollector = ((Array.isArray(optionmessage)
      ? optionmessage[0]
      : optionmessage) as Message).createReactionCollector(
      (reaction: ReactionEmoji, user: User) => {
        const member =
          message.guild.members.cache.has(user.id) &&
          message.guild.members.cache.find((m) => m.id === user.id);
        const canInteract =
          user.id === message.author.id || member
            ? member.roles.highest.id === roleIds.spinner
            : false;

        return canInteract;
      }
    );

    reactionCollector.on("collect", async (reaction, user) => {
      try {
        const msg: Message = optionmessage;
        const member =
          message.guild.members.cache.has(user.id) &&
          message.guild.members.cache.find((m) => m.id === user.id);
        const hasHighRoles =
          (member.roles.highest.id === roleIds.trusted && member.user.id === message.author.id) ||
          member.roles.highest.id === roleIds.spinner;
        console.log(reaction, reaction.emoji, reaction.emoji.name, reaction.emoji.name === "⏹️");

        if (reaction.emoji.name === "⏹️") {
          console.log("test123123");
          await msg.channel.send("Test");
          await reaction.remove();
        } else if (reaction.emoji.name === "⏸️") {
          await msg.channel.send("Test1");
          await reaction.remove();
        } else if (reaction.emoji.name === "▶️") {
          await msg.channel.send("Test2");
          await reaction.remove();
        } else if (reaction.emoji.name === "🔊" && hasHighRoles) {
          await msg.channel.send("Test3");
          await reaction.remove();
        } else if (reaction.emoji.name === "🔉" && hasHighRoles) {
          await msg.channel.send("Test4");
          await reaction.remove();
        } else if (reaction.emoji.name === "☠️" && hasHighRoles) {
          await msg.channel.send("Test5");
          await reaction.remove();
        }
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};
