import { mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import {
  Message,
  Client,
  MessageReaction,
  User,
  AwaitReactionsOptions,
  Collection,
} from "discord.js";

export const poll = {
  name: "poll",
  description: "Erstellt eine Umfrage",
  usage: `[${config.prefix}poll "Titel der Umfrage:Beschreibungstext" Zeit`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }) => handlePollRequest(message),
} as messageHandleFunction;

// TODO --  Menge an Emoji:Beschreibung getrennt durch Semikolon. Beispiel: !poll "Testumfrage:Umfrage zum Testen" ✅:"Ja, wäre nice";❌:"Nein, will ich net"
// Erweiterung der Funktion um Custom Emojis und Beschreibungen für die Buttons

const handlePollRequest = (message: Message) =>
  new Promise((resolve, reject) => {
    let [empty, titleAndDescription, time] = message.content
      .slice(`${poll.name} `.length)
      .split('"');
    (time as any) = 1000 * 60 * parseInt(time) || 1000 * 60 * 1;
    sendPoll(titleAndDescription, message, ["✅", "❌"], time as any);
    return resolve();
  }) as Promise<Message>;

export const sendPoll = (
  titleAndDescription: string,
  message: Message,
  emojisToFilterBy: string[] | undefined,
  time: number,
  winnigMessage?: string,
  losingMessage?: string
) => {
  return new Promise((resolve, reject) => {
    let [title, description] = titleAndDescription.split(":");
    emojisToFilterBy = emojisToFilterBy || ["✅", "❌"];
    console.log({ title: title, description: description, time: time });
    message.channel
      .send([
        `${message.member.displayName || message.author.username} hat eine Umfrage erstellt:`,
        `**${title}**`,
        description,
      ])
      .then((msg: Message) => {
        const filter = (reaction: MessageReaction, user: User) => {
          return emojisToFilterBy.some((emoji) => emoji === reaction.emoji.name);
        };
        emojisToFilterBy.map((emoji) => msg.react(emoji));
        msg
          .awaitReactions(filter, { time: time, errors: ["time"] } as AwaitReactionsOptions)
          .catch((collected) => {
            let sortedCollected = collected.sort(
              (emojiA: MessageReaction, emojiB: MessageReaction) => emojiB.count - emojiA.count
            ) as Collection<string, MessageReaction>;
            let [winner, second, ...rest] = sortedCollected.array();
            if (winner.count === second.count) {
              winner = undefined;
            }
            msg.reactions.cache.clear();
            msg
              .edit(
                `${
                  winner
                    ? winnigMessage ||
                      `${
                        message.member.displayName || message.author.username
                      }s Umfrage ist geendet.\n**${title}**\n${description}\nGewonnen hat Option: ${
                        winner.emoji.name
                      } mit ${winner.count} Stimmen`
                    : losingMessage || "Es gab keinen Gewinner"
                }`
              )
              .then((finalMsg: Message) => {
                return resolve(winner !== undefined);
              });
          });
      })
      .catch((error) => {
        console.log({ caller: "standardPoll send", error: error });
        return reject({ caller: "standardPoll send", error: error });
      });
    message.deletable && message.delete({ timeout: 250 });
  }) as Promise<boolean>;
};

const findGreatestProp = (object: { [key: string]: number }) =>
  Object.keys(object).reduce((curr, prev) =>
    object[curr] > object[prev]
      ? curr
      : object[curr] < object[prev]
      ? prev
      : object[curr] === object[prev]
      ? undefined
      : undefined
  );
