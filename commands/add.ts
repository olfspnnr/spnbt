import { commandProps, config, roleIds } from "../bot";
import { getStreamFromYouTubeLink, addToQueue } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
import { audioQueueElement } from "../controller/audioQueue";

export const add = {
  name: "add",
  description: "Fügt Sound zu Playlist hinzu",
  usage: `[${config.prefix}add url]`,
  roles: ["spinner", "trusted"],
  execute: ({ discord: { message, client }, custom }) => addToAudioQueue(message, client)
} as messageHandleFunction;

const addToAudioQueue = (message: Message, client: Client) =>
  getStreamFromYouTubeLink(message)
    .then((audioElement: audioQueueElement) => addToQueue(audioElement))
    .catch(error => console.log(error));
