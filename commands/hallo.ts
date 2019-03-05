import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const hallo = {
  name: "hallo",
  description: "lass dich von Bernd begrüßen",
  usage: `[${config.prefix}hallo]`,
  roles: [RoleNames.spinner, RoleNames.trusted, RoleNames.uninitiert],
  execute: ({ discord: { message, client }, custom }: commandProps) => sayHallo(message)
} as messageHandleFunction;

const sayHallo = async (message: Message) => {
  try {
    const msg = await message.reply(`du auch da? Mist.`);
    message.delete();
    (msg as Message).delete(8000);
  } catch (error) {
    return console.log(error);
  }
};
