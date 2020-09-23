// Import the discord.js module
import { Client, TextChannel, Message, ClientUser, GuildMember, Guild } from "discord.js";
import "isomorphic-fetch";
import {
  handleNameChange,
  handleVoiceStateUpdate,
  checkIfMemberHasntRolesAndAssignRoles,
  loadCommands,
  handleMessageCall,
  getUserDifferences,
  writeToLogChannel,
  lovooUserEntry,
} from "./controller/botController";
import { websocketServer } from "./controller/server";
import { Clock } from "./controller/clock";
import { messageHandleFunction } from "./legacy/messageHandler";
import { fillStateProp, setState } from "./controller/stateController";
import { AudioQueue } from "./controller/audioQueue";
import { joke } from "./commands/joke";
import { handleRaffleTime } from "./commands/getRaffleWinner";
import { handleWebSocketMessage } from "./controller/webSocketController";
import { Berndsite } from "./controller/websiteController";
import { readJsonFile } from "./controller/JSONController";
import "@discordjs/opus";
import Twitter = require("twitter");

const auth: auth = require("../configs/auth.json");
export const config: config = require("../configs/config.json");
export const { roleIds, userIds, channelIds }: idObject = require("../configs/rolesanduser.json");

export interface config {
  prefix: string;
  helpPrefix: string;
  raffleFileName: string;
  raffleWinDescription: string | -1;
}

export interface auth {
  token: string;
  consumer_key: string;
  consumer_secret: string;
  access_token_key: string;
  access_token_secret: string;
  raffleWin: string | -1;
}

export type Channel =
  | "halloweltkanalText"
  | "kikaloungeText"
  | "kikaloungeVoice"
  | "donaulimesVoice"
  | "wanderdorfVoice"
  | "stilletreppeVoice"
  | "inspirationText";

export type ChannelIds = { [key in Channel]: string };

export type RoleName = "spinner" | "trusted" | "uninitiert" | "poop" | "raffleTeilnehmer";

export type RoleId = { [key in RoleName]: string };

export const mappedRoles = {
  spinner: "spinner",
  poop: "poop",
  raffleTeilnehmer: "raffleTeilnehmer",
  trusted: "trusted",
  uninitiert: "uninitiert",
} as Readonly<{ [key in RoleName]: RoleName }>;

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
  roleIds: RoleId;
  userIds: UserIds;
  channelIds: ChannelIds;
}

export interface commandProps {
  discord: {
    message: Message;
    client?: Client;
  };
  custom?: {
    twitterClient?: any;
    loadedCommands?: messageHandleFunction[];
    jokes?: { jokePosition: number; jokes: joke[] };
  };
}

export const twitterClient = new Twitter({
  consumer_key: auth.consumer_key,
  consumer_secret: auth.consumer_secret,
  access_token_key: auth.access_token_key,
  access_token_secret: auth.access_token_secret,
});

export const audioQueue = new AudioQueue();
audioQueue.on("add", (queue) => {
  audioQueue.play(audioQueue.shift());
});
// audioQueue.on("play", (song) => console.log("now playing: " + song.message));
// audioQueue.on("error", (error) => console.log(error));
// audioQueue.on("finish", (queue) => console.log("current queuelength: " + queue.length));

export const clock = new Clock();
clock.initialise();
const clockEmitter = clock.getEmitter();
clockEmitter.on("lenny", async () => {
  try {
    const kikalounge = (await client.channels.fetch(channelIds.kikaloungeText)) as TextChannel;
    if (kikalounge.lastMessage.author.id === userIds.justus) {
      kikalounge.send("Hallo Justus ( ͡° ͜ʖ ͡°)");
    } else kikalounge.send(`( ͡° ͜ʖ ͡°)`);
  } catch (error) {
    throw error;
  }
});
clockEmitter.on("raffleTime", () => {
  return handleRaffleTime(client);
});
clockEmitter.on("raffleReminder", async () => {
  try {
    const kikalounge = (await client.channels.fetch(channelIds.kikaloungeText)) as TextChannel;
    const messages = await kikalounge.messages.fetch();
    messages
      .filter(
        (message: Message) =>
          message.content.toLowerCase().includes("rafflereminder") && message.author.bot
      )
      .map((entry) => entry.deletable && entry.delete());
    const content: any = await readJsonFile("./configs/config.json");
    kikalounge.send(`**Rafflereminder**\nVergesst nicht, euch ins Raffle einzutragen, mit ${
      content.prefix
    }raffle \n(Vorausgesetzt ihr habt die Rolle - Blauer Name) \n${
      content.raffleWinDescription !== -1
        ? "Zu Gewinnen gibt es: " + content.raffleWinDescription
        : ""
    }
      \nWeitere Infos: ${content.helpPrefix}raffle`);
    return;
  } catch (error) {
    console.error({ caller: "rafflerminder", error: error });
    throw error;
  }
});
fillStateProp("clock", clock);

(async () => {
  try {
    const json = await readJsonFile("lovoouser.json");
    // console.log((json as any).length);
    const state = await setState({ lovooArray: json as lovooUserEntry[] });
    // console.log(state);
  } catch (error) {
    console.error(error);
  }
})();

let wsServer = undefined;
const website = new Berndsite();

// Create an instance of a Discord client
const client = new Client();
fillStateProp("reloadCommands", () => {
  loadCommands().then((commands) => setState({ commands: commands }));
});
loadCommands().then((loadedCommands) => {
  setState({ commands: loadedCommands }).then(async (state) => {
    try {
      client.once("ready", () => {
        console.log("I am ready!");
        client.user.setActivity("mit deinen Gefühlen", { type: "PLAYING" });
        try {
          wsServer = new websocketServer({
            port: 8080,
            onMessage: (message: any) => handleWebSocketMessage(message, client),
          });
          website.start();
        } catch (error) {
          console.log(error);
        }
      });

      client.on("guildMemberAdd", (member) => {
        try {
          checkIfMemberHasntRolesAndAssignRoles(
            client,
            member as GuildMember,
            [roleIds.uninitiert, roleIds.poop],
            ["uninitiert"]
          );
        } catch (error) {
          console.log(error);
        }
      });

      client.on("error", (error) => console.error(error));

      client.on("voiceStateUpdate", (oldState, newState) => {
        const difference = getUserDifferences(oldState.member, newState.member);
        const date = new Date();
        const [hours, minutes] = [
          date.getHours() > 9 ? date.getHours() : "0" + date.getHours(),
          date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes(),
        ];
        writeToLogChannel(
          `[${hours}:${minutes}]\n**${oldState.member.user.username}/${oldState.member.displayName}** changed:\n${difference}`,
          client
        );
        return handleVoiceStateUpdate(oldState.member, newState.member, client);
      });

      client.on("guildMemberUpdate", (oldUser: GuildMember, newUser: GuildMember) => {
        const difference = getUserDifferences(oldUser, newUser);
        const date = new Date();
        const [hours, minutes] = [
          date.getHours() > 9 ? date.getHours() : "0" + date.getHours(),
          date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes(),
        ];
        writeToLogChannel(
          `[${hours}:${minutes}]\n**${oldUser.user.username}/${oldUser.displayName}** changed:\n${difference}`,
          client
        );
        handleNameChange(newUser);
      });

      client.on("messageDelete", async (message) => {
        try {
          const now = new Date();
          const auditLog = await message.guild.fetchAuditLogs();
          const nowHour = now.getHours();
          const nowMinute = now.getMinutes();
          const deletion = auditLog.entries.filter((entry) => {
            const createdHour = entry.createdAt.getHours();
            const createdMinute = entry.createdAt.getMinutes();

            return (
              entry.actionType === "DELETE" &&
              entry.targetType === "MESSAGE" &&
              (entry.target as ClientUser).id === message.client.user.id &&
              createdHour === nowHour &&
              (createdMinute === nowMinute ||
                createdMinute === nowMinute + 1 ||
                createdMinute - 1 === nowMinute ||
                createdMinute + 1 === nowMinute)
            );
          });
          const [hours, minutes] = [
            nowHour > 9 ? nowHour : "0" + nowHour,
            nowMinute > 9 ? nowMinute : "0" + nowMinute,
          ];
          let executor = "Uncertain";
          if (deletion.size === 1) {
            const first = deletion.first();
            if (first) {
              executor = first.executor.username;
            }
          } else if (deletion.size > 1) {
            executor =
              "Uncertain // Part of the deletion object // " +
              deletion
                .map((entry) => (entry && entry.executor ? entry.executor.username : ""))
                .join(" - ");
          } else {
            if (auditLog.entries.size > 0) {
              executor =
                "Uncertain // Last entry Auditlog // " + auditLog.entries.first().executor.username;
            }
          }
          return writeToLogChannel(
            [
              `[${hours}:${minutes}]`,
              `Executor: **${executor}**`,
              `User of message: **${message.member.user.username}/${message.member.displayName}**`,
              `_Deleted:_ \n${message.content}`,
            ],
            client,
            message as Message
          );
        } catch (error) {
          console.log(error);
        }
      });

      client.on("messageDeleteBulk", (messages) => {
        try {
          const msgs = messages.map((msg) => msg);
          writeToLogChannel(
            msgs.map(
              (entry) =>
                `User of message: **${entry.member.user.username}/${entry.member.displayName}**\nDeleted: ${entry.content}`
            ) || "EMPTY",
            client
          );
        } catch (error) {
          console.log(error);
        }
      });

      // Create an event listener for messages
      client.on("message", (message) => {
        try {
          try {
            if (
              message.channel instanceof TextChannel &&
              message.channel.permissionsFor(client.user.id).has("READ_MESSAGE_HISTORY")
            ) {
              message.channel.messages;
            }
          } catch (error) {
            throw "No read_messages permisson";
          }

          return handleMessageCall(message, client, twitterClient);
        } catch (error) {
          console.log(error);
          console.log(`Konnte nicht verarbeiten: ${message.content.split(" ")[0]}`);
        }
      });

      client.on("disconnect", () => {
        console.log("Disconnect");
      });
    } catch (error) {
      throw error;
    }
  });
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);
