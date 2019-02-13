import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, playAudio } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const mist = {
  name: "mist",
  description: "spielt Mist Sound ab",
  usage: `[${config.prefix}mist]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => playMistSound(message)
} as messageHandleFunction;

const playMistSound = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=6OVS77TN3yE");
