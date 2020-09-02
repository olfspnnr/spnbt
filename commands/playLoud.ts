import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { playAudio } from "../controller/botController";

export const playLoud = {
  name: "playLoud",
  description:
    "Spielt ein Youtube Video in der definierten Lautstärke ab. (Volume ist Optional, default 5)",
  usage: `[${config.prefix}playLoud url volume]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => {
    let [url, volume, start] = message.content.slice("!playLoud ".length).split(" ");
    if (volume && !isNaN(+volume)) {
      playAudio(message, true, url, undefined, +volume, start ? start : undefined);
    } else {
      playAudio(message, true, url, undefined, 5, start ? start : undefined);
    }
  },
} as messageHandleFunction;
