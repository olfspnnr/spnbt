import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const pin = {
  name: "pin",
  description: "Pinnt die Nachricht mit dem Aktuellen Datum an",
  usage: `[${config.prefix}pin "Nachricht" name]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => pinMessage(message)
} as messageHandleFunction;

const pinMessage = (message: Message) => {
  let splitMessage = message.content.split('"');
  let messageContent = splitMessage[1];
  let messageUser = splitMessage[2].replace(" ", "");
  let currentDate = new Date();
  let { day, month, year } = {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  };
  message.channel
    .send(`"${messageContent}" - ${messageUser}, ${day}.${month}.${year}`)
    .then(msg => {
      message.delete();
      (msg as Message).pin();
    })
    .catch(error => console.log(error));
};
