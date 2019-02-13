import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, playAudio } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const wilhelm = {
  name: "wilhelm",
  description: "spielt einen Willhelm Schrei ab",
  usage: `[${config.prefix}wilhelm]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    playAudio(message, true, "https://www.youtube.com/watch?v=9FHw2aItRlw")
} as messageHandleFunction;
