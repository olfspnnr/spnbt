import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message } from "discord.js";
import { playAudio } from "../controller/botController";

export const cheer = {
  name: "cheer",
  description: "Spielt weiblichen Jubel ab",
  usage: `[${config.prefix}cheer]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => playCheer(message)
} as messageHandleFunction;

const playCheer = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=Bel7uDcrIho");
