import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { playAudio } from "../controller/shared";

export const playLoud = {
  name: "playLoud",
  description: "Spielt ein binaurales Klopfgeräusch ab",
  usage: `[${config.prefix}playLoud url]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => {
    let url = message.content.slice("!playLoud ".length);
    if (!!~url.indexOf('"')) {
      url = url.replace('"', "");
    }
    playAudio(message, true, url, undefined, 1);
  }
} as messageHandleFunction;
