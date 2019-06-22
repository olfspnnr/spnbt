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
  console.log("TEST5");
  message.channel.send("test8");
};
