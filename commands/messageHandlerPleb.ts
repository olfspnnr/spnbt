import { Message, Client } from "discord.js";
import { generalFunctionProps } from "../bot";

export const helpTextPleb = [
  "===============",
  "Funktionen für Uninitierte: ",
  "------------------------",
  "!help - Übersicht",
  "!hallo - lass dich begrüßen"
].join("\r");

const writeHelpMessage = async (message: Message) => {
  try {
    message.author.createDM().then(channel => {
      channel.send(helpTextPleb);
      channel.send("------------------------");
      channel.send(`Habe einen schönen Tag ${message.author.username}!`);
    });
    message.delete();
  } catch (error) {
    return console.log(error);
  }
};

export interface messageHandleObjectPleb {
  help: (prop: generalFunctionProps) => void;
  hallo: (prop: generalFunctionProps) => void;
}

export const messageHandleObjectPleb = {
  help: ({ discord: { message, client }, custom }) => writeHelpMessage(message),
  hallo: async ({ discord: { message, client }, custom }) => sayHallo(message)
} as messageHandleObjectPleb;

const sayHallo = async (message: Message) => {
  try {
    const msg = await message.reply(`du auch da? Mist.`);
    message.delete();
    (msg as Message).delete(8000);
  } catch (error) {
    return console.log(error);
  }
};
