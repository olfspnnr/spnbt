import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, playAudio } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const fault = {
  name: "fault",
  description: "spielt die weltberühmte Szene aus dem Klassiker 'Good Will Hunting' ab.",
  usage: `[${config.prefix}fault]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    playAudio(message, true, "https://www.youtube.com/watch?v=wklDd8o8HFQ")
} as messageHandleFunction;
