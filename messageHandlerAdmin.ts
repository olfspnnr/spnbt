import { Message, Client } from "discord.js";
import { playAudio, helpTextTrusted } from "./messageHandlerTrusted";
import { helpTextPleb } from "./messageHandlerPleb";

export const helpTextSpinner = [
  "===============",
  "Funktionen für Spinner: ",
  "------------------------",
  "!help - Übersicht",
  "!leavevoice - lässt den Bot den VoiceChannel verlassen",
  "!joinvoice - lässt den Bot den VoiceChannel beitreten",
  "!knock - spielt Klopfgeräusch ab",
  "!cheer - spielt weiblichen Jubel ab",
  "!playLoud - gleich wie !play, nur laut"
].join("\r");

const writeHelpMessage = async (message: Message) => {
  try {
    message.author.createDM().then(channel => {
      channel.send(helpTextSpinner);
      channel.send(helpTextTrusted);
      channel.send(helpTextPleb);
      channel.send("------------------------");
      channel.send("Habe einen schönen Tag!");
    });
    message.delete();
  } catch (error) {
    return console.log(error);
  }
};

export interface messageHandleObjectAdmin {
  "!help": (message: Message, client?: Client) => void;
  "!leavevoice": (message: Message, client?: Client) => void;
  "!joinvoice": (message: Message, client?: Client) => void;
  "!knock": (message: Message, client?: Client) => void;
  "!cheer": (message: Message, client?: Client) => void;
  "!playLoud": (message: Message, client?: Client) => void;
}

export const messageHandleObjectAdmin = {
  "!help": (message: Message) => writeHelpMessage(message),
  "!leavevoice": (message: Message) => leaveVoiceChannel(message),
  "!joinvoice": (message: Message, client?: Client) => enterVoiceChannel(message, client),
  "!knock": (message: Message) => playKnockSound(message),
  "!cheer": (message: Message) => playCheer(message),
  "!playLoud": (message: Message) => {
    let url = message.content.slice("!play ".length);
    if (!!~url.indexOf('"')) {
      url = url.replace('"', "");
    }
    playAudio(message, true, url, undefined, 1);
  }
} as messageHandleObjectAdmin;

const playCheer = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=Bel7uDcrIho");

const playKnockSound = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=ZqNpXJwgO8o");

const enterVoiceChannel = (message: Message, client: Client) => {
  const voiceChannel = message.member.voiceChannel;
  message.delete();
  return voiceChannel.joinable ? voiceChannel.join().then(connection => connection) : false;
};

const leaveVoiceChannel = (message: Message) => {
  const voiceChannel = message.member.voiceChannel;
  message.delete();
  if (voiceChannel.connection !== undefined && voiceChannel.connection !== null) {
    voiceChannel.connection.disconnect();
  }
};
