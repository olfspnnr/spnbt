// Import the discord.js module
import { Client, DMChannel, TextChannel } from "discord.js";
import "isomorphic-fetch";
import "opusscript";
import { messageHandleObjectTrusted } from "./messageHandlerTrusted";
import { messageHandleObjectAdmin } from "./messageHandlerAdmin";
import { messageHandleObjectPleb } from "./messageHandlerPleb";
import {
  AudioQueue,
  checkIfMemberHasntRolesAndAssignRoles,
  handleAdrianNameChange as handleNameChange,
  addReactionToMessage,
  ruleSet,
  currentState,
  handleWebSocketMessage
} from "./shared";
import { websocketServer } from "./server";

const auth: auth = require("./auth.json");
export const { roleIds, userIds, channelIds }: idObject = require("./rolesanduser.json");

export interface auth {
  token: string;
  consumer_key: string;
  consumer_secret: string;
  access_token_key: string;
  access_token_secret: string;
}

export interface ChannelIds {
  halloweltkanalText: string;
  kikaloungeText: string;
  kikaloungeVoice: string;
  donaulimesVoice: string;
  wanderdorfVoice: string;
  stilletreppeVoice: string;
  inspirationText: string;
}

export interface Roles {
  spinner: string;
  trusted: string;
  uninitiert: string;
  poop: string;
}

export interface UserIds {
  spinbot: string;
  marcel: string;
  justus: string;
  adrian: string;
  nils: string;
  olaf: string;
}

export interface idObject {
  roleIds: Roles;
  userIds: UserIds;
  channelIds: ChannelIds;
}

// Create an instance of a Discord client
const client = new Client();

export let audioQueue = new AudioQueue();

audioQueue.on("add", queue => {
  console.log("added something to the audioQueue");
  console.log("current queuelength: " + queue.length);
});

audioQueue.on("play", song => console.log("now playing: " + song.message));

audioQueue.on("error", error => console.log(error));

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setGame("mit deinen Gefühlen");
  let server = new websocketServer({
    port: 8080,
    onMessage: (message: any) => handleWebSocketMessage(message)
  });
});

client.on("error", error => console.error(error));

client.on("voiceStateUpdate", (oldMember, newMember) => {
  if (oldMember.voiceChannel === undefined && newMember.voiceChannel !== undefined) {
    (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
      `${newMember.user.username}/${newMember.displayName} joined.`
    );
    try {
      checkIfMemberHasntRolesAndAssignRoles(
        client,
        newMember,
        [roleIds.uninitiert, roleIds.poop],
        [roleIds.uninitiert]
      );
    } catch (error) {
      console.log(error);
    }
  } else if (newMember.voiceChannel === undefined) {
    (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
      `${oldMember.user.username}/${oldMember.displayName} left.`
    );
  } else if (newMember.voiceChannel !== undefined && oldMember.voiceChannel !== undefined) {
    console.log(`${oldMember.user.username}/${oldMember.displayName} moved Channels.`);
  } else {
    return console.log("Konnte nicht entscheiden was passiert ist");
  }
});

client.on("guildMemberUpdate", (oldUser, newUser) => {
  console.log(`${oldUser.nickname} => ${newUser.nickname}`);
  handleNameChange(currentState, newUser);
});

// Create an event listener for messages
client.on("message", message => {
  if (message.guild === null && message.channel instanceof DMChannel) {
    return console.log(`directMessage => ${message.author.username}: ${message.content}`);
  }
  try {
    console.log(`${message.member.displayName}/${message.member.user.username}: ${message.content}
      `);
    console.log(
      `${message.content.slice(
        0,
        !!~message.content.indexOf(" ") ? message.content.indexOf(" ") : message.content.length
      )}`
    );

    let possibleFunction: any = undefined;
    if (message.content.slice(0, 1) === "!") {
      if (message.member.id !== userIds.spinbot) {
        let functionCall = `${message.content.slice(
          0,
          !!~message.content.indexOf(" ") ? message.content.indexOf(" ") : message.content.length
        )}`;
        if (functionCall.slice(0, 1) === "!") {
          functionCall = functionCall.slice(1);
        }
        if (message.member.roles.has(roleIds.spinner)) {
          possibleFunction = (messageHandleObjectAdmin as any)[functionCall] || undefined;
        }
        if (
          (message.member.roles.has(roleIds.spinner) ||
            message.member.roles.has(roleIds.trusted)) &&
          possibleFunction === undefined
        ) {
          possibleFunction = (messageHandleObjectTrusted as any)[functionCall] || undefined;
        }
        if (possibleFunction === undefined) {
          possibleFunction = (messageHandleObjectPleb as any)[functionCall] || undefined;
        }
        if (typeof possibleFunction === "function") {
          return possibleFunction(message, client, currentState);
        } else {
          console.log("Scheint kein Command zu sein");
        }
      } else console.log("Nachricht von Bernd");
    } else addReactionToMessage(message, client, userIds, ruleSet);
  } catch (error) {
    console.log(error);
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
