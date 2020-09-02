import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { playAudio } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";

export const play = {
  name: "play",
  description: "zum playen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}play url]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }) => {
    let [url, start] = message.content.slice("!play ".length).split(" ");
    if (!!~url.indexOf('"')) {
      url = url.replace('"', "");
    }
    playAudio(message, true, url, undefined, undefined, start ? start : undefined);
  },
} as messageHandleFunction;
