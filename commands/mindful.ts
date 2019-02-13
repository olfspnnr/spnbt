import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, playAudio, State } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";

export const mindful = {
  name: "mindful",
  description: "Zufällige KI generierte Mindful Session",
  usage: `[${config.prefix}mindful]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    playMindfulAudio(message, custom.currentState)
} as messageHandleFunction;

const playMindfulAudio = (message: Message, currentState: State) => {
  if (!currentState.isPlayingAudio) {
    message.delete();
    fetch("http://inspirobot.me/api?generateFlow=1&sessionID=a473f800-395a-4e38-9766-1227cf8b2299")
      .then(response => response.json())
      .then(data => {
        const voiceChannel = message.member.voiceChannel;
        let textAndImages = data.data;
        voiceChannel
          .join()
          .then(connection => {
            fetch(data.mp3 as any)
              .then(response => response.body)
              .then(stream => {
                playAudio(message, false, "", {
                  stream: stream,
                  length:
                    textAndImages.filter((element: any) => element.type === "stop")[0].time * 1000
                });
                let qoutes = textAndImages.filter((element: any) => element.type === "quote");
                qoutes.forEach((quote: any) => {
                  setTimeout(
                    () =>
                      message.channel
                        .send(quote.text)
                        .then(msg => {
                          (msg as Message).delete(45000);
                        })
                        .catch(error => console.log(error)),
                    quote.time * 1000 - 250
                  );
                });
              })
              .catch(error3 => console.log(error3));
          })
          .catch(error2 => console.log(error2));
      })
      .catch(error1 => console.log(error1));
  }
};
