// Import the discord.js module
import {
  Client,
  DMChannel,
  TextChannel,
  Message,
  GuildMember,
  Collection,
  MessageOptions
} from "discord.js";
import "isomorphic-fetch";
import {
  handleNameChange,
  handleWebSocketMessage,
  handleVoiceStateUpdate,
  checkIfMemberHasntRolesAndAssignRoles,
  loadCommands,
  handleMessageCall,
  getUserDifferences
} from "./controller/botController";
import { websocketServer } from "./controller/server";
import { Clock } from "./controller/clock";
import "node-opus";
import { messageHandleFunction } from "./legacy/messageHandler";
import { fillStateProp, setState } from "./controller/stateController";
import { AudioQueue } from "./controller/audioQueue";
import { joke } from "./commands/joke";
import { getRandomWinner } from "./commands/getRaffleWinner";

const Twitter = require("twitter");
const auth: auth = require("../configs/auth.json");
export const config: config = require("../configs/config.json");
export const { roleIds, userIds, channelIds }: idObject = require("../configs/rolesanduser.json");

export interface config {
  prefix: string;
  helpPrefix: string;
  raffleFileName: string;
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
  raffleTeilnehmer: string;
}
export enum RoleNames {
  spinner = "spinner",
  trusted = "trusted",
  uninitiert = "uninitiert",
  poop = "poop",
  raffleTeilnehmer = "raffleTeilnehmer"
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
    jokes?: { jokePosition: number; jokes: joke[] };
  };
}

export let audioQueue = new AudioQueue();
audioQueue.on("add", queue => {
  console.log("added something to the audioQueue");
  console.log("current queuelength: " + queue.length);
  audioQueue.play(audioQueue.shift());
});
audioQueue.on("play", song => console.log("now playing: " + song.message));
audioQueue.on("error", error => console.log(error));
audioQueue.on("finish", queue => console.log("current queuelength: " + queue.length));

export let clock = new Clock();
clock.initialise();
clock.getEmitter().on("lenny", () => {
  (client.channels.get(channelIds.kikaloungeText) as TextChannel).send(`( ͡° ͜ʖ ͡°)`);
});
clock.getEmitter().on("raffleTime", () => {
  return getRandomWinner(client.channels.get(channelIds.kikaloungeText) as TextChannel).then(
    pckg => {
      (client.channels.get(channelIds.kikaloungeText) as TextChannel).send(
        " du wurdest im Raffle gezogen und damit gewonnen! Glückwunsch!",
        { reply: pckg.winner }
      );
      pckg.winner
        .createDM()
        .then(dmchannel =>
          dmchannel
            .send("Glückwunsch!!! 🍀 Hier dein Gewinn, du Gewinnerkönig du! 👑🎁🎉")
            .then((msg: Message) =>
              msg.channel
                .send("Hier könnte ein Gewinn stehen.", { code: true })
                .then(() =>
                  (client.channels.get(channelIds.kikaloungeText) as TextChannel).send(
                    `🎉 <@&${roleIds.raffleTeilnehmer}> höret und frohlocket! ✨\n🎊 ${
                      pckg.winner.displayName
                    }${
                      pckg.winner.nickname !== pckg.winner.displayName
                        ? "alias " + pckg.winner.nickname
                        : ""
                    } 🎈\n🎁 nahm soeben sein Gewinn entgegen! 🍀\n🔥 😎 🔥`
                  )
                )
            )
        );
    }
  );
});
fillStateProp("clock", clock);

export const twitterClient = new Twitter({
  consumer_key: auth.consumer_key,
  consumer_secret: auth.consumer_secret,
  access_token_key: auth.access_token_key,
  access_token_secret: auth.access_token_secret
});

// Create an instance of a Discord client
const client = new Client();
fillStateProp("reloadCommands", () => {
  loadCommands().then(commands => setState({ commands: commands }));
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

      try {
        let server = new websocketServer({
          port: 8080,
          onMessage: (message: any) => handleWebSocketMessage(message)
        });
      } catch (error) {
        console.log(error);
      }
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
      getUserDifferences(oldUser, newUser);
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
