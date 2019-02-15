import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";

export const help = {
  name: "help",
  description: "Übersicht",
  usage: `[${config.prefix}help]`,
  roles: [RoleNames.spinner, RoleNames.trusted, RoleNames.uninitiert, RoleNames.poop],
  execute: ({ discord: { message, client }, custom }: commandProps) => writeHelpMessage(message)
} as messageHandleFunction;
