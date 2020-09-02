import { commandProps, mappedRoles, config, roleIds, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, TextChannel } from "discord.js";
import { ReadStream } from "tty";
import Twitter = require("twitter");
import { EventEmitter } from "events";
import { TwitterResponse } from "../models/TwitterResponse";

export const twitter = {
  name: "twitter",
  description: "holt sich die 5 neusten Tweets zum Hashtag",
  usage: `[${config.prefix}twitter "hashtag"]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    listenToHashtag(message, client, custom.twitterClient),
} as messageHandleFunction;

const listenToHashtag = async (message: Message, client: Client, twitterClient: Twitter) => {
  try {
    let [command, hashtag, amount] = message.content.split(" ");
    amount = amount ? amount : "5";
    if (message.deletable) {
      message.delete();
    }

    twitterClient.stream("statuses/filter", { track: hashtag }, (stream) =>
      handleStream(stream, client, hashtag, +amount, message)
    );
  } catch (error) {
    throw error;
  }
};

const handleStream = async (
  stream: EventEmitter,
  client: Client,
  hashtag: string,
  amount: number,
  message: Message
) => {
  try {
    if (isNaN(amount)) {
      throw new Error("Specified amount is not a number");
    }
    const listeningMsg = await message.channel.send(`Hört auf: ${hashtag}`);
    if (listeningMsg && (listeningMsg as Message).deletable) {
      (listeningMsg as Message).delete({ timeout: 10000 });
    }
    const destroyStream = () => stream.removeAllListeners();
    let currentCount = 0;
    stream.on("data", (data: TwitterResponse) => {
      if (data && data.user && data.user.verified) {
        handleStreamData(data, currentCount, amount, client, destroyStream, message);
        currentCount++;
      }
    });
    stream.on("error", function (error: any) {
      throw error;
    });
  } catch (error) {
    throw error;
  }
};

const handleStreamData = async (
  data: TwitterResponse,
  currentCount: number,
  maxCount: number,
  client: Client,
  destroyStream: () => any,
  message: Message
) => {
  try {
    const channel = message.channel;
    if (currentCount >= maxCount) {
      destroyStream();
      const stopListeningMessage = await channel.send(`Hört nichtmehr zu`);
      if ((stopListeningMessage as Message) && (stopListeningMessage as Message).deletable) {
        (stopListeningMessage as Message).delete({ timeout: 10000 });
      }
    } else {
      const message = {
        color: +("0x" + data.user.profile_background_color),
        title: "Tweet",
        author: {
          name: `${data.user.name}${data.user.verified ? " - ✔" : ""}`,
          url: data.user.url ? data.user.url + "" : undefined,
          icon_url: data.user.profile_image_url_https,
        },
        image: {
          url: data.user.profile_banner_url,
        },
        thumbnail: {
          url: data.user.profile_image_url_https,
        },
        description: data.text,
        fields: [
          {
            name: "Retweets:",
            value: `${data.retweet_count || "--"}`,
            inline: true,
          },
          {
            name: "Likes:",
            value: `${data.favorite_count || "--"}`,
            inline: true,
          },
          {
            name: "Replies:",
            value: `${data.reply_count || "--"}`,
            inline: true,
          },
          {
            name: "Follower:",
            value: `${data.user.followers_count || "--"}`,
            inline: true,
          },
          {
            name: "Nationality:",
            value: `${data.lang === "en" ? `\:flag_us: || \:flag_gb:` : `\:flag_${data.lang}:`}`,
            inline: true,
          },
        ],
        timestamp: new Date(+data.timestamp_ms),
        footer: {
          text: `📍${data.user.location || "--"}`,
        },
      };

      const sentMessage = await channel.send({ embed: message });
      if (sentMessage && (sentMessage as Message).deletable) {
        (sentMessage as Message).delete({ timeout: 250000 });
      }
    }
  } catch (error) {
    throw error;
  }
};

const toFlag = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
