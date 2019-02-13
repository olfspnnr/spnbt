import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST");
  message.deletable && message.delete(250);
};
