import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const bulkDelete = {
  name: "bulkDelete",
  description:
    "filtert die letzten 25(oder angegebene Anzahl) Nachrichten nach der ID und löscht diese (Außer gepinnte Nachrichten)",
  usage: `[${config.prefix}bulkDelete userId anzahl(optional)]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => bulkDeleteFunc(message)
} as messageHandleFunction;

const bulkDeleteFunc = (message: Message) => {
  let [userId, anzahl] = message.content.slice("!renameUser ".length).split(" ");
  userId = userId
    .replace(/<@/g, "")
    .replace(/!/g, "")
    .replace(/>/g, "");
  let parsedAnzahl = anzahl ? parseInt(anzahl) : undefined;
  if (parsedAnzahl > 100) {
    parsedAnzahl = 100;
  }
  console.log({ userid: userId });
  if (message.guild.members.some(member => member.id === userId)) {
    message.channel.fetchMessages({ limit: parsedAnzahl || 25 }).then(msgs => {
      let messagesToBeDeleted = msgs.filter(
        message => message.author.id === userId && !message.pinned
      );
      messagesToBeDeleted.deleteAll();
      message.deletable && message.delete(500);
    });
  } else message.deletable && message.delete(2500);
};
