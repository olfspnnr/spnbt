import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const natalieneu = {
  name: "natalieneu",
  description: "neuste Tweets von Natalie Rosenke",
  usage: `[${config.prefix}natalieneu]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    getNatalieRosenke(message, custom.twitterClient)
} as messageHandleFunction;

const getNatalieRosenke = (message: Message, twitterClient: Twitter) =>
  (twitterClient as any).get(
    "statuses/user_timeline",
    { user_id: "1053658318743441408", count: 3 },
    (error: any, tweets: any, response: any) => {
      tweets.forEach(async (element: any) => {
        try {
          const msg = await message.channel.send(element.text);
          message.delete();
          (msg as Message).delete(120000);
        } catch (error) {
          return console.log(error);
        }
      });
    }
  );
