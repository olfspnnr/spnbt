import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { playAudio } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";

export const wilhelm = {
  name: "wilhelm",
  description: "spielt einen Willhelm Schrei ab",
  usage: `[${config.prefix}wilhelm]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    playAudio(message, true, "https://www.youtube.com/watch?v=9FHw2aItRlw")
} as messageHandleFunction;
