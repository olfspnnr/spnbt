import { Message, Client } from "discord.js";

export const helpTextPleb = [
  "Funktionen für Plebs: ",
  "------------------------",
  "!help - Übersicht",
  "!hallo - lass dich begrüßen"
].join("\r");

export interface messageHandleObjectPleb {
  "!help": (message: Message, client?: Client) => void;
  "!hallo": (message: Message, client?: Client) => void;
}

export const messageHandleObjectPleb = {
  "!help": (message: Message, client?: Client) => writeHelpMessage(message),
  "!hallo": async (message: Message, client?: Client) => sayHallo(message)
} as messageHandleObjectPleb;

const sayHallo = async (message: Message) => {
  try {
    const msg = await message.reply(`hallo.`);
    message.delete();
    (msg as Message).delete(120000);
  } catch (error) {
    return console.log(error);
  }
};

const writeHelpMessage = async (message: Message) => {
  try {
    const msg = await message.reply(helpTextPleb);
    message.delete();
    (msg as Message).delete(30000);
  } catch (error) {
    return console.log(error);
  }
};
