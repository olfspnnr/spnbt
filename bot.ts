// Import the discord.js module
import { Client, DMChannel, TextChannel, Message, GuildMember, Collection } from "discord.js";
import "isomorphic-fetch";
import { messageHandleObjectTrusted } from "./commands/messageHandlerTrusted";
import { messageHandleObjectAdmin } from "./commands/messageHandlerAdmin";
import { messageHandleObjectPleb } from "./commands/messageHandlerPleb";
import {
  AudioQueue,
  handleNameChange,
  addReactionToMessage,
  ruleSet,
  currentState,
  handleWebSocketMessage,
  repeatMessageWithLenny,
  State,
  handleVoiceStateUpdate
} from "./controller/shared";
import { websocketServer } from "./controller/server";
import { Clock } from "./controller/clock";
import "node-opus";
import { messageHandle } from "./commands/messageHandler";
const fs = require("fs");
const Twitter = require("twitter");
const auth: auth = require("../configs/auth.json");
const config: config = require("../configs/config.json");
export const { roleIds, userIds, channelIds }: idObject = require("../configs/rolesanduser.json");

export interface config {
  prefix: string;
}

export interface auth {
  token: string;
  consumer_key: string;
  consumer_secret: string;
  access_token_key: string;
  access_token_secret: string;
}

export interface ChannelIds {
  [key: string]: string;
  halloweltkanalText: string;
  kikaloungeText: string;
  kikaloungeVoice: string;
  donaulimesVoice: string;
  wanderdorfVoice: string;
  stilletreppeVoice: string;
  inspirationText: string;
}

export interface Roles {
  [key: string]: string;
  spinner: string;
  trusted: string;
  uninitiert: string;
  poop: string;
}
export enum RoleNames {
  spinner = "spinner",
  trusted = "trusted",
  uninitiert = "unintiert",
  poop = "poop"
}

export interface UserIds {
  [key: string]: string;
  spinbot: string;
  marcel: string;
  justus: string;
  adrian: string;
  nils: string;
  olaf: string;
  franny: string;
}

export interface idObject {
  roleIds: Roles;
  userIds: UserIds;
  channelIds: ChannelIds;
}

export interface generalFunctionProps {
  discord: {
    message: Message;
    client?: Client;
  };
  custom?: {
    currentState?: State;
    twitterClient?: Twitter;
  };
}

export let audioQueue = new AudioQueue();
audioQueue.on("add", queue => {
  console.log("added something to the audioQueue");
  console.log("current queuelength: " + queue.length);
});
audioQueue.on("play", song => console.log("now playing: " + song.message));
audioQueue.on("error", error => console.log(error));

export let clock = new Clock();
clock.initialise();
clock.getEmitter().on("lenny", () => {
  (client.channels.get(channelIds.kikaloungeText) as TextChannel).send(`( ͡° ͜ʖ ͡°)`);
});

const twitterClient = new Twitter({
  consumer_key: auth.consumer_key,
  consumer_secret: auth.consumer_secret,
  access_token_key: auth.access_token_key,
  access_token_secret: auth.access_token_secret
});

const handleMessageCall = (message: Message) => {
  if (message.guild === null && message.channel instanceof DMChannel) {
    return console.log(`directMessage => ${message.author.username}: ${message.content}`);
  }

  console.log(`${message.member.displayName}/${message.member.user.username}: ${message.content}
      `);
  console.log(`${message.content.split(" ").shift()}`);

  let possibleFunction: any = undefined;
  if (message.content.startsWith(config.prefix) && !message.author.bot) {
    let functionCall = message.content.split(" ")[0].slice(1);
    if (message.member.roles.has(roleIds.spinner)) {
      possibleFunction = (messageHandleObjectAdmin as any)[functionCall] || undefined;
    }
    if (
      (message.member.roles.has(roleIds.spinner) || message.member.roles.has(roleIds.trusted)) &&
      possibleFunction === undefined
    ) {
      possibleFunction = (messageHandleObjectTrusted as any)[functionCall] || undefined;
    }
    if (possibleFunction === undefined) {
      possibleFunction = (messageHandleObjectPleb as any)[functionCall] || undefined;
    }
  } else if (!message.author.bot) {
    if (message.member.roles.has(roleIds.spinner) || message.member.roles.has(roleIds.trusted)) {
      repeatMessageWithLenny(message);
      addReactionToMessage(message, client, userIds, ruleSet);
    }
  } else console.log("Nachricht von Bot");

  if (typeof possibleFunction === "function") {
    return possibleFunction({
      discord: { message: message, client: client },
      custom: { currentState: currentState, twitterClient: twitterClient }
    }) as (prop: generalFunctionProps) => void;
  } else {
    console.log("Scheint kein Command zu sein");
  }
};

// Create an instance of a Discord client
const client = new Client();
const availableMessageHandlers: { [key: string]: messageHandle } = undefined;
const commandFiles = fs.readdirSync("./commands").filter((file: any) => file.endsWith(".ts"));

for (let file in commandFiles) {
  const command = require(`./commands/${file}`) as messageHandle;
  availableMessageHandlers[file] = { ...command };
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

client.once("ready", () => {
  console.log("I am ready!");
  client.user.setActivity("mit deinen Gefühlen", { type: "PLAYING" });
  let server = new websocketServer({
    port: 8080,
    onMessage: (message: any) => handleWebSocketMessage(message)
  });
});

client.on("error", error => console.error(error));

client.on("voiceStateUpdate", (oldMember, newMember) =>
  handleVoiceStateUpdate(oldMember, newMember, client)
);

client.on("guildMemberUpdate", (oldUser, newUser) => {
  console.log(`${oldUser.nickname} => ${newUser.nickname}`);
  handleNameChange(currentState, newUser);
});

// Create an event listener for messages
client.on("message", message => {
  try {
    handleMessageCall(message);
  } catch (error) {
    console.log(error);
    return console.log(`Konnte nicht verarbeiten: ${message.content.split(" ")[0]}`);
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);
