import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { sendInspiringMessage, sendGeneratedPerson } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";

export const randomPerson = {
  name: "randomPerson",
  description: "Zufällige KI generierte Person",
  usage: `[${config.prefix}randomPerson]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    sendGeneratedPerson(message, client),
} as messageHandleFunction;
