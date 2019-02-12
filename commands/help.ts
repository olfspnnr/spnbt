import { commandProps, RoleNames, config } from "../bot";
import { writeHelpMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";

export const help = {
  name: "help",
  description: "Übersicht",
  usage: `[${config.prefix}help]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => writeHelpMessage(message)
} as messageHandleFunction;
