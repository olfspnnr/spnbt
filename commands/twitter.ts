import { commandProps, RoleNames, config, roleIds, channelIds } from "../bot";
import { writeHelpMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, TextChannel } from "discord.js";
import { ReadStream } from "tty";

export const twitter = {
  name: "twitter",
  description: "holt sich die 5 neusten Tweets zum Hashtag",
  usage: `[${config.prefix}twitter "hashtag"]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    listenToHashtag(message, client, custom.twitterClient)
} as messageHandleFunction;

const listenToHashtag = (message: Message, client: Client, twitterClient: Twitter) => {
  let hashtag = message.content.split('"')[1];
  const maxCount = 5;
  let currentCount = 0;
  console.log(`Hört auf: ${hashtag}`);
  message.delete();
  (twitterClient as any).stream("statuses/filter", { track: hashtag }, function(
    stream: ReadStream
  ) {
    (client.channels.get(channelIds.kikaloungeText) as TextChannel)
      .send(`Hört auf: ${hashtag}`)
      .then(msg => {
        (msg as Message).delete(120000);
      })
      .catch(error => console.log(error));
    stream.on("data", function(event: any) {
      if (currentCount >= maxCount) {
        (client.channels.get(channelIds.kikaloungeText) as TextChannel)
          .send(`Hört nichtmehr zu`)
          .then(msg => {
            (msg as Message).delete(120000);
          })
          .catch(error => console.log(error));
        return stream.destroy();
      }
      currentCount++;
      console.log(event);
      (client.channels.get(channelIds.kikaloungeText) as TextChannel)
        .send(
          `
            ${event.user.name}: ${
            event["extended_tweet"] !== undefined ? event.extended_tweet : event.text
          }`
        )
        .then(msg => {
          (msg as Message).delete(120000);
        })
        .catch(error => console.log(error));
    });
    stream.on("error", function(error: any) {
      throw error;
    });
  });
};
