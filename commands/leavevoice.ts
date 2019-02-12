import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message } from "discord.js";

export const leavevoice = {
  name: "leavevoice",
  description: "Lässt Bernd den Voice Channel verlassen",
  usage: `[${config.prefix}leavevoice]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => leaveVoiceChannel(message)
} as messageHandleFunction;

const leaveVoiceChannel = (message: Message) => {
  const voiceChannel = message.member.voiceChannel;
  message.delete();
  if (voiceChannel.connection !== undefined && voiceChannel.connection !== null) {
    voiceChannel.connection.disconnect();
  }
};
