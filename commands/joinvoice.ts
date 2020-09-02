import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message } from "discord.js";

export const joinvoice = {
  name: "joinvoice",
  description: "Lässt Bernd den Voicechannel betreten",
  usage: `[${config.prefix}joinvoice]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => enterVoiceChannel(message),
} as messageHandleFunction;

const enterVoiceChannel = (message: Message) => {
  const voiceChannel = message.member.voice.channel;
  message.delete();
  return voiceChannel.joinable ? voiceChannel.join().then((connection) => connection) : false;
};
