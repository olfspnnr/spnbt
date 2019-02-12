import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, sendInspiringMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const inspire = {
  name: "inspire",
  description: "Zufällige KI generierter Quote",
  usage: `[${config.prefix}inspire]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    sendInspiringMessage(message, client)
} as messageHandleFunction;
