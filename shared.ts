import {
  MessageCollector,
  Message,
  MessageReaction,
  GuildMember,
  Client,
  TextChannel,
  Emoji
} from "discord.js";
import { audioQueue, roleIds, channelIds, UserIds } from "./bot";
import * as ytdl from "ytdl-core";
import { EventEmitter } from "events";
import { playAudio } from "./messageHandlerTrusted";

export interface Options {
  profileShareable: number;
}

export interface Counts {
  p: number;
  m: number;
}

export interface Home {
  city: string;
  country: string;
  distance: number;
}

export interface Current {
  city: string;
  country: string;
  distance: number;
}

export interface Locations {
  home: Home;
  current: Current;
}

export interface Image {
  url: string;
  width: number;
  height: number;
}

export interface Verifications {
  facebook: number;
  verified: number;
  confirmed: number;
}

export interface lovooUserEntry {
  _type: string;
  id: string;
  name: string;
  gender: number;
  age: number;
  lastOnlineTime: number;
  whazzup: string;
  freetext: string;
  isInfluencer: number;
  subscriptions: any[];
  isVip: number;
  flirtInterests: string[];
  options: Options;
  counts: Counts;
  locations: Locations;
  isNew: number;
  isOnline: number;
  isMobile: number;
  isHighlighted: number;
  picture: string;
  images: Image[];
  isVerified: number;
  verifications: Verifications;
}

export interface globalObject {
  renameAdrian?: boolean;
  isPlayingAudio?: boolean;
  isInspiring?: boolean;
  lovooArray?: lovooUserEntry[];
}

export interface audioQueueElement {
  message: Message;
  youtube: boolean;
  url?: string;
  audioObject?: { stream: ReadableStream; length: number };
  volume?: number | undefined;
}

export const setStateProp = (propName: string, valueToSet: any) =>
  new Promise((resolve, reject) => {
    if ((currentState as any)[propName] !== undefined) {
      currentState = { ...currentState, [propName]: valueToSet };
      return resolve(currentState);
    }
    return reject(false);
  });

export const getState = () => ({ ...currentState });

export let currentState = {
  renameAdrian: false,
  isPlayingAudio: false,
  isInspiring: false,
  lovooArray: []
} as globalObject;

export interface wsMessage {
  type: string;
  payload: any;
}

export const handleWebSocketMessage = (wsMessage: any) => {
  try {
    if (
      (handlePayloadType as any)[wsMessage.type] !== undefined &&
      typeof (handlePayloadType as any)[wsMessage.type] === "function"
    ) {
      (handlePayloadType as any)[wsMessage.type](wsMessage.payload);
    } else throw `could not find function for ${wsMessage.type}`;
  } catch (error) {
    console.log(error);
  }
};

const handlePayloadType = {
  loadLovoo: (payload: any) =>
    setStateProp("lovooArray", payload)
      .then(newState => {
        console.log(newState);
      })
      .catch(error => console.log(error))
};

export const stripMemberOfAllRoles = (member: GuildMember) =>
  new Promise((resolve, reject) =>
    member
      .removeRoles(member.roles)
      .then(member => resolve(member))
      .catch(error => reject(error))
  );

export const checkIfMemberHasntRolesAndAssignRoles = (
  client: Client,
  newMember: GuildMember,
  rolesToCheck: string[],
  rolesToAdd: string[]
) => {
  let checkRoles = rolesToCheck.filter(role => newMember.roles.has(role));
  if (checkRoles.length <= 0) {
    assignRolesToMember(client, newMember, rolesToAdd);
  }
};

export const assignRolesToMember = (
  client: Client,
  newMember: GuildMember,
  rolesToAdd: string[]
) => {
  let roleNames: any = {};
  Object.keys(roleIds).map(prop => (roleNames[(roleIds as any)[prop]] = prop));
  rolesToAdd.map(role => {
    newMember
      .addRole(role)
      .then(() =>
        (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
          `<@${newMember.user.id}> you werde assigned role "${
            roleNames[role]
          }". Reconnect may be necessary to be able to talk.`
        )
      );
  });
};

export const reactionDeletionHandler = (
  message: Message,
  reaction: MessageReaction,
  userIdOfMessage: string
) => {
  const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
    time: 600 * 1000
  });
  collector.on("collect", (followUpMessage: Message) => {
    if (followUpMessage.member.user.id === userIdOfMessage) reaction.remove();
    else return;
  });
};

export const addToQueue = (audioQueueElement: audioQueueElement) =>
  audioQueue.add(audioQueueElement);

export const getCurrentSong = () => audioQueue.currentQueue[0] && audioQueue.currentQueue[0];

export const getStreamFromYouTubeLink = (message: Message) =>
  new Promise((resolve, reject) => {
    try {
      let url = message.content.slice("!testfunction ".length);
      if (!!~url.indexOf('"')) {
        url = url.replace('"', "");
      }
      console.log(`getting stream for ${url}`);
      let audioElement: audioQueueElement = undefined;
      const youtubeStream = ytdl(url, {
        filter: "audioonly"
      }).on("info", info => {
        audioElement = {
          message: message,
          youtube: false,
          audioObject: { length: info.length_seconds, stream: youtubeStream as any }
        };
        return resolve(audioElement);
      });
    } catch (error) {
      (error: any) => reject(error);
    }
  });

export class AudioQueue extends EventEmitter {
  currentQueue: audioQueueElement[];
  isPlaying: boolean;

  constructor() {
    super();
    this.currentQueue = [];
    this.isPlaying = false;
  }

  add = ({ youtube, url, audioObject, message, volume }: audioQueueElement) => {
    this.currentQueue = [
      ...this.currentQueue,
      { message: message, volume: volume, audioObject: audioObject, url: url, youtube: youtube }
    ];
    this.emit("add", this.currentQueue);
    return this.currentQueue;
  };

  shift = () => {
    if (this.currentQueue.length > 0) {
      this.isPlaying = false;
      let shiftedElement = this.currentQueue.shift();
      return shiftedElement;
    }
    return undefined;
  };

  play = (audioToBePlayed: audioQueueElement) => {
    if (audioToBePlayed === undefined) return;
    try {
      this.isPlaying = true;
      this.emit("play", audioToBePlayed);
      let { audioObject, message, url, volume, youtube } = audioToBePlayed;
      playAudio(message, youtube, url, audioObject, volume)
        .then(() => {
          this.isPlaying = false;
          this.emit("finish", audioToBePlayed);
          this.play(this.shift());
        })
        .catch(error => {
          this.isPlaying = false;
          this.emit("error", error);
          this.emit("finish", audioToBePlayed);
          this.play(this.shift());
        });
    } catch (error) {
      (error: any) => {
        this.emit("error", error);
        this.shift();
      };
    }
  };
}

export const handleAdrianNameChange = (
  global: globalObject,
  newUser: GuildMember,
  userIds: UserIds
) => {
  if (global.renameAdrian) {
    if (newUser.user.id === userIds.adrian && newUser.nickname !== "Omniadrimon") {
      newUser.setNickname("Omniadrimon");
    }
  }
};

export const ruleSet = [
  { user: "olaf", reactionToAdd: "💕" },
  { user: "nils", reactionToAdd: 510584011781963786 },
  { user: "justus", reactionToAdd: 508737241443729408 },
  { user: "marcel", reactionToAdd: 508737241930006561 }
] as reactionRuleSet[];

export interface reactionRuleSet {
  user: string;
  reactionToAdd: MessageReaction | number | string;
}

export const addReactionToMessage = (
  message: Message,
  client: Client,
  userIds: UserIds,
  rulesets: reactionRuleSet[]
) => {
  rulesets.map(ruleset => {
    let emoji: Emoji | string | number = undefined;
    if (typeof ruleset.reactionToAdd !== "string") {
      emoji = client.emojis.get("" + ruleset.reactionToAdd);
    } else emoji = ruleset.reactionToAdd;
    if (message.member.user.id === (userIds as any)[ruleset.user]) {
      message
        .react(emoji as string | Emoji)
        .then(reaction =>
          reactionDeletionHandler(message, reaction, (userIds as any)[ruleset.user])
        )
        .catch(error => console.log(error));
    }
  });
};
