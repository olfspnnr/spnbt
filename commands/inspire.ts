import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { sendInspiringMessage } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";

export const inspire = {
  name: "inspire",
  description: "Zufällige KI generierter Quote",
  usage: `[${config.prefix}inspire]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    sendInspiringMessage(message, client)
} as messageHandleFunction;
