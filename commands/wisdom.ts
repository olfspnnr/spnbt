import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage, State } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, RichEmbed } from "discord.js";

export const wisdom = {
  name: "wisdom",
  description: "präsentiert eine Weisheit von einem LovooUser",
  usage: `[${config.prefix}wisdom]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    spitLovooWisdom(message, custom.currentState)
} as messageHandleFunction;

const spitLovooWisdom = (message: Message, currentState: State, numberToRepeat?: number) => {
  let toRepeat =
    numberToRepeat ||
    (message.content.length > "!wisdom".length && message.content.slice("!wisdom ".length));
  if (currentState.lovooArray && currentState.lovooArray.length > 0) {
    const currentElement = currentState.lovooArray.pop();
    message.channel
      .sendEmbed({
        color: 0xff6633,
        title: "Wisdom of Lovoo~",
        author: {
          name: `${currentElement.name}${currentElement.verifications.verified ? " - ✔" : ""}`,
          url: `https://www.lovoo.com/profile/${currentElement.id}`
        },
        image: {
          ...currentElement.images[0]
        },
        thumbnail: {
          url:
            "https://cdn.discordapp.com/attachments/542410380757041173/543170245221941348/ezgif-5-2f5180a04e62.png"
        },
        description: currentElement.freetext,
        fields: [
          {
            name: "Info:",
            value: `${currentElement.age} Jahre - ${(currentElement.flirtInterests &&
              currentElement.flirtInterests
                .map(intrest => (intrest === "frie" ? "friends" : intrest))
                .join(" - ")) ||
              "Keine Angabe"} - ${currentElement.isOnline > 0 ? "Online" : "Offline"}`
          }
        ],
        footer: {
          text: `🏡${currentElement.locations.home.city} 📍${
            currentElement.locations.current.city
          } 🕵️‍${currentState.lovooArray.length}`
        }
      } as RichEmbed)
      .then((msg: Message) => {
        msg.deletable &&
          msg.delete(45000).then(() => {
            if (toRepeat) {
              if (typeof toRepeat === "number") {
                toRepeat -= 1;
              } else {
                toRepeat = parseInt(toRepeat);
              }
            }
            if (toRepeat > 0) spitLovooWisdom(message, currentState, toRepeat as number);
          });
      })
      .catch(error => {
        message.channel
          .send("Da ist was fehlgelaufen - Ups")
          .then((catchedMsg: Message) => catchedMsg.deletable && catchedMsg.delete(10000));
        console.log(error);
      });
  } else {
    message.channel
      .send("Sorry, keine LovooUser geladen ;(")
      .then((msg: Message) => msg.deletable && msg.delete(15000))
      .catch(error => console.log(error));
  }
  message.deletable && message.delete(500);
};
