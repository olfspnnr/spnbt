import { commandProps, RoleNames, config, roleIds } from "../bot";
import { playAudio } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";

export const play = {
  name: "play",
  description: "zum playen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}play url]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }) => {
    let url = message.content.slice("!play ".length);
    if (!!~url.indexOf('"')) {
      url = url.replace('"', "");
    }
    playAudio(message, true, url);
  }
} as messageHandleFunction;
