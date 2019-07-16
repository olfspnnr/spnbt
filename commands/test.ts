import { commandProps, config, roleIds, auth, userIds, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel } from "discord.js";
import { getState } from "../controller/stateController";
import { askIfWinnerWantsHisPrize } from "./getRaffleWinner";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: ["spinner"],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST7");
  message.channel.messages
    .filter((message: Message) => message.content.toLowerCase().includes("rafflereminder"))
    .map(entry => entry.deletable && entry.delete());
  return message.channel
    .send(`**Rafflereminder**\nVergesst nicht, euch ins Raffle einzutragen, mit ${
    config.prefix
  }raffle \n(Vorausgesetzt ihr habt die Rolle - Blauer Name) \n${
    config.raffleWinDescription !== -1 ? "Zu Gewinnen gibt es: " + config.raffleWinDescription : ""
  }
      \nWeitere Infos: ${config.helpPrefix}raffle`);
};
