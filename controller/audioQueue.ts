import { EventEmitter } from "events";
import { Message } from "discord.js";
import { playAudio } from "./botController";

export interface audioQueueElement {
  message: Message;
  youtube: boolean;
  url?: string;
  audioObject?: { stream: ReadableStream; length: number };
  volume?: number | undefined;
}

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
          this.emit("finish", this.currentQueue);
          this.play(this.shift());
        })
        .catch(error => {
          this.isPlaying = false;
          this.emit("error", error);
          this.emit("finish", this.currentQueue);
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
