import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
import { writeToLogChannel } from "../controller/botController";

export const bulkDelete = {
  name: "bulkDelete",
  description:
    "filtert die letzten 25(oder angegebene Anzahl) Nachrichten nach der ID und löscht diese (Außer gepinnte Nachrichten)",
  usage: `[${config.prefix}bulkDelete @user anzahl(optional)]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    bulkDeleteFunc(message, client),
} as messageHandleFunction;

const bulkDeleteFunc = async (message: Message, client: Client) => {
  try {
    let [userId, anzahl] = message.content.slice("!renameUser ".length).split(" ");
    let parsedAnzahl = anzahl ? parseInt(anzahl) : undefined;
    if (parsedAnzahl > 100) {
      parsedAnzahl = 100;
    }
    const members = await message.guild.members.fetch();
    if (members.some((member) => message.mentions.has(member))) {
      const msgs = await message.channel.messages.fetch({ limit: parsedAnzahl || 25 });
      writeToLogChannel(`${message.author.username} called bulkDelete`, client);
      let messagesToBeDeleted = msgs.filter(
        (messageToBeDeleted) => message.mentions.has(messageToBeDeleted.author) && !message.pinned
      );
      messagesToBeDeleted.each(async (msg) => msg.deletable && (await msg.delete()));
      message.deletable && message.delete({ timeout: 500 });
    } else message.deletable && message.delete({ timeout: 2500 });
  } catch (error) {
    throw error;
  }
};
