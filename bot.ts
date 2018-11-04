// Import the discord.js module
import { Attachment, Client, MessageOptions, Message, TextChannel } from "discord.js";
import "isomorphic-fetch";
import "opusscript";
import { messageHandleObject } from "./messageHandler";

const auth: auth = require("./auth.json");

export interface auth {
  token: string;
  consumer_key: string;
  consumer_secret: string;
  access_token_key: string;
  access_token_secret: string;
}

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
  console.log("I am ready!");
});

export let currentState = {
  isPlayingAudio: false,
  isInspiring: false
};

// Create an event listener for messages
client.on("message", message => {
  if (
    (!message.member.roles.has("404673483696766978") &&
      !message.member.roles.has("223937179552841728")) ||
    message.member.user.id === "507244084209909770"
  ) {
    return;
  }
  try {
    console.log(`${message.member.displayName}/${message.member.user.username}: ${message.content}
      `);
    (messageHandleObject as any)[
      `${message.content.slice(
        0,
        !!~message.content.indexOf(" ") ? message.content.indexOf(" ") : message.content.length
      )}`
    ](message, client);
  } catch {
    if (message.member.user.id === "308998952718565377") {
      message.react(client.emojis.get("464175049822306304"));
    } else if (message.member.user.id === "314815200366690304") {
      message.react(client.emojis.get("498233411102834718"));
    } else if (message.member.user.id === "220943939845357569") {
      message.react("💕");
    } else
      return console.log(
        `Konnte nicht verarbeiten: ${message.content.slice(
          0,
          !!~message.content.indexOf(" ") ? message.content.indexOf(" ") : message.content.length
        )}`
      );
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);
