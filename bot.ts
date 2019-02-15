// Import the discord.js module
import { Client, DMChannel, TextChannel, Message, GuildMember, Collection } from "discord.js";
import "isomorphic-fetch";
import {
  AudioQueue,
  handleNameChange,
  handleWebSocketMessage,
  handleVoiceStateUpdate,
  checkIfMemberHasntRolesAndAssignRoles,
  loadCommands,
  handleMessageCall
} from "./controller/botController";
import { websocketServer } from "./controller/server";
import { Clock } from "./controller/clock";
import "node-opus";
import { messageHandleFunction } from "./legacy/messageHandler";
import { setStateProp, setState } from "./controller/stateController";

const Twitter = require("twitter");
const auth: auth = require("../configs/auth.json");
export const config: config = require("../configs/config.json");
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

export interface commandProps {
  discord: {
    message: Message;
    client?: Client;
  };
  custom?: {
    twitterClient?: Twitter;
    loadedCommands?: messageHandleFunction[];
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

export const twitterClient = new Twitter({
  consumer_key: auth.consumer_key,
  consumer_secret: auth.consumer_secret,
  access_token_key: auth.access_token_key,
  access_token_secret: auth.access_token_secret
});

// Create an instance of a Discord client
const client = new Client();
setStateProp("reloadCommands", () => {
  loadCommands().then(commands => setStateProp("commands", commands));
});
loadCommands().then(loadedCommands => {
  setState({ commands: loadedCommands }).then(state => {
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

    client.on("guildMemberAdd", member => {
      try {
        checkIfMemberHasntRolesAndAssignRoles(
          client,
          member,
          [roleIds.uninitiert, roleIds.poop],
          [roleIds.uninitiert]
        );
      } catch (error) {
        console.log(error);
      }
    });

    client.on("error", error => console.error(error));

    client.on("voiceStateUpdate", (oldMember, newMember) =>
      handleVoiceStateUpdate(oldMember, newMember, client)
    );

    client.on("guildMemberUpdate", (oldUser, newUser) => {
      console.log(`${oldUser.nickname} => ${newUser.nickname}`);
      handleNameChange(newUser);
    });

    // Create an event listener for messages
    client.on("message", message => {
      try {
        handleMessageCall(message, client, twitterClient);
      } catch (error) {
        console.log(error);
        return console.log(`Konnte nicht verarbeiten: ${message.content.split(" ")[0]}`);
      }
    });
  });
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);
