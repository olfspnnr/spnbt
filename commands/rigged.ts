import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, MessageAttachment } from "discord.js";

export const rigged = {
  name: "rigged",
  description: "Aluhut",
  usage: `[${config.prefix}rigged]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => sendAluHut(message),
} as messageHandleFunction;

const sendAluHut = (message: Message) => {
  const attachment = new MessageAttachment(
    "https://images-na.ssl-images-amazon.com/images/I/71GV79NPpZL._UX425_.jpg"
  );
  message
    .reply(attachment as MessageOptions)
    .then((msg) => {
      message.delete();
      (msg as Message).delete({ timeout: 120000 });
    })
    .catch((error) => console.log(error));
};
