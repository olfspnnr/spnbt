import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, Attachment, MessageOptions } from "discord.js";

export const rigged = {
  name: "rigged",
  description: "Aluhut",
  usage: `[${config.prefix}rigged]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => sendAluHut(message)
} as messageHandleFunction;

const sendAluHut = (message: Message) => {
  const attachment = new Attachment(
    "https://images-na.ssl-images-amazon.com/images/I/71GV79NPpZL._UX425_.jpg"
  );
  message
    .reply(attachment as MessageOptions)
    .then(msg => {
      message.delete();
      (msg as Message).delete(120000);
    })
    .catch(error => console.log(error));
};
