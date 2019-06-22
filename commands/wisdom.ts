import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, RichEmbed, MessageEmbed } from "discord.js";
import { getState, fillStateProp, setState } from "../controller/stateController";

export const wisdom = {
  name: "wisdom",
  description: "präsentiert eine Weisheit von einem LovooUser",
  usage: `[${config.prefix}wisdom]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => spitLovooWisdom(message)
} as messageHandleFunction;

const spitLovooWisdom = (message: Message, numberToRepeat?: number) => {
  let toRepeat =
    numberToRepeat ||
    (message.content.length > "!wisdom".length && message.content.slice("!wisdom ".length));
  let currentState = getState();
  if (toRepeat && toRepeat > currentState.lovooArray.length) {
    toRepeat = currentState.lovooArray.length;
  }
  if (currentState.lovooArray && currentState.lovooArray.length > 0) {
    const currentElement = currentState.lovooArray.pop();
    setState({ lovooArray: currentState.lovooArray })
      .then(newState => {
        message.channel
          .send({
            embed: {
              color: 0xff6633,
              title: "Wisdom of Lovoo~",
              author: {
                name: `${currentElement.name}${
                  currentElement.verifications.verified ? " - ✔" : ""
                }`,
                url: `https://www.lovoo.com/profile/${currentElement.id}`
              },
              image: {
                ...currentElement.images[0]
              },
              thumbnail: {
                height: 200,
                width: 200,
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
                } 🕵️‍${newState.lovooArray.length}`
              }
            } as RichEmbed
          })
          .then((msg: Message) => {
            msg.deletable &&
              msg.delete(45000).then(deletedMessage => {
                if (toRepeat) {
                  if (typeof toRepeat === "number") {
                    toRepeat -= 1;
                  } else {
                    toRepeat = parseInt(toRepeat);
                  }
                }
                if (toRepeat > 0) spitLovooWisdom(deletedMessage, toRepeat as number);
              });
          })
          .catch(error => {
            message.channel
              .send("Da ist was fehlgelaufen - Ups")
              .then((catchedMsg: Message) => catchedMsg.deletable && catchedMsg.delete(10000));
            console.log(error);
          });
      })
      .catch(error => console.log(error));
  } else {
    message.channel
      .send("Sorry, keine LovooUser geladen ;(")
      .then((msg: Message) => msg.deletable && msg.delete(15000))
      .catch(error => console.log(error));
  }
  message.deletable && message.delete(500);
};
