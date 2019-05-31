import { commandProps, RoleNames, config, roleIds, auth, userIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel } from "discord.js";
import { getState } from "../controller/stateController";
import { askIfWinnerWantsHisPrize } from "./getRaffleWinner";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST");
  let state = getState();
  message.author.createDM().then(channel =>
    askIfWinnerWantsHisPrize(channel)
      .then(() => message.channel.send("ja"))
      .catch(() => {
        return message.channel.send("nein");
      })
  );

  message.channel.send("# Test\n", { code: "md" });
  message.deletable && message.delete(250);
};
