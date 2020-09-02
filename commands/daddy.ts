import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, MessageAttachment } from "discord.js";

export const daddy = {
  name: "daddy",
  description: "Bildniss der Daddygames",
  usage: `[${config.prefix}daddy]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => sendDaddyImage(message),
} as messageHandleFunction;

const sendDaddyImage = async (message: Message) => {
  const attachment = new MessageAttachment(
    "https://media.discordapp.net/attachments/403672009353199620/500799691647090688/66cb2f9c-d18f-4073-a84a-835d79f3e3e0.png"
  );
  try {
    const msg = await message.channel.send(attachment as MessageOptions);
    message.delete();
    (msg as Message).delete({ timeout: 120000 });
  } catch (error) {
    return console.log(error);
  }
};
