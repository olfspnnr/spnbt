import { MessageCollector, Message, MessageReaction } from "discord.js";
import { audioQueue } from "./bot";
import * as ytdl from "ytdl-core";
import { EventEmitter } from "events";
import { playAudio } from "./messageHandlerTrusted";

export interface audioQueueElement {
  message: Message;
  youtube: boolean;
  url?: string;
  audioObject?: { stream: ReadableStream; length: number };
  volume?: number | undefined;
}

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
