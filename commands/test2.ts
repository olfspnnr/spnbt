import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
import { getState } from "../controller/stateController";

export const test2 = {
  name: "test2",
  description: "zum test2en von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test2]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executetest2Function(message, client)
} as messageHandleFunction;

const executetest2Function = (message: Message, client: Client) => {
  console.log("test2");
  let currentState = getState();

  console.log("test2");
  message.deletable && message.delete(250);
};
