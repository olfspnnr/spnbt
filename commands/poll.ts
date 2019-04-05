import { RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import {
  Message,
  Client,
  MessageReaction,
  User,
  AwaitReactionsOptions,
  Collection
} from "discord.js";

export const poll = {
  name: "poll",
  description: "Erstellt eine Umfrage",
  usage: `[${config.prefix}poll "Titel der Umfrage:Beschreibungstext"`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }) => handlePollRequest(message)
} as messageHandleFunction;

// TODO --  Menge an Emoji:Beschreibung getrennt durch Semikolon. Beispiel: !poll "Testumfrage:Umfrage zum Testen" ✅:"Ja, wäre nice";❌:"Nein, will ich net"
// Erweiterung der Funktion um Custom Emojis und Beschreibungen für die Buttons

const handlePollRequest = (message: Message) =>
  new Promise((resolve, reject) => {
    let [empty, titleAndDescription, ...args] = message.content
      .slice(`${poll.name} `.length)
      .split('"');
    sendPoll(titleAndDescription, message, ["✅", "❌"], 5000);
    return resolve();
  }) as Promise<Message>;

const sendPoll = (
  titleAndDescription: string,
  message: Message,
  emojisToFilterBy: string[],
  time: number
) => {
  let [title, description] = titleAndDescription.split(":");
  emojisToFilterBy = emojisToFilterBy || ["✅", "❌"];
  message.channel
    .send([`**${title}**`, description])
    .then((msg: Message) => {
      const filter = (reaction: MessageReaction, user: User) => {
        return emojisToFilterBy.some(emoji => emoji === reaction.emoji.name);
      };
      emojisToFilterBy.map(emoji => msg.react(emoji));
      msg
        .awaitReactions(filter, { time: time, errors: ["time"] } as AwaitReactionsOptions)
        .catch(collected => {
          let sortedCollected = collected.sort(
            (emojiA: MessageReaction, emojiB: MessageReaction) => emojiB.count - emojiA.count
          ) as Collection<string, MessageReaction>;
          let [winner, second, ...rest] = sortedCollected.array();
          if (winner.count === second.count) {
            winner = undefined;
          }
          msg.reactions.clear();
          msg
            .edit(
              `${
                winner
                  ? `**${title}**\n${description}\nGewonnen hat Option: ${winner.emoji.name} mit ${
                      winner.count
                    } Stimmen`
                  : "Es gab keinen Gewinner"
              }`
            )
            .then((finalMsg: Message) => {});
        });
    })
    .catch(error => console.log({ caller: "standardPoll send", error: error }));
  message.deletable && message.delete(250);
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
