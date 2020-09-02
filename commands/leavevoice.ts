import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const leavevoice = {
  name: "leavevoice",
  description: "Lässt Bernd den Voice Channel verlassen",
  usage: `[${config.prefix}leavevoice]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    leaveVoiceChannel(message, client),
} as messageHandleFunction;

const leaveVoiceChannel = (message: Message, client: Client) => {
  client.voice.connections.each((connection) => connection.disconnect());
  message.delete();
};
