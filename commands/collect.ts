import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, Guild, GuildMember } from "discord.js";

export const collect = {
  name: "collect",
  description: "zum collecten von Userdaten - speichert diese in einer Lokalen JSON",
  usage: `[${config.prefix}collect]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    collectUserData(message, client),
} as messageHandleFunction;

const collectUserData = (message: Message, client: Client) => {
  message.deletable && message.delete({ timeout: 250 });
};

const getAllUserData = async (guild: Guild) => {
  try {
  } catch (error) {
    throw error;
  }
};
