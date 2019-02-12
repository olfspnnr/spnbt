import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, playAudio } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const flachbader = {
  name: "flachbader",
  description: "Spielt den Weltberühmten Song ab",
  usage: `[${config.prefix}flachbader]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => playFlachbader(message)
} as messageHandleFunction;

const playFlachbader = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/F62LEVZYMog");
