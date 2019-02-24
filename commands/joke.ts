import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
const Parser = require("html-dom-parser");

export interface joke {
  name: string;
  content: string;
}

export const joke = {
  name: "joke",
  description: "holt einen Witz aus dem Web",
  usage: `[${config.prefix}joke]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => handleJokeRequest(message)
} as messageHandleFunction;

const handleJokeRequest = (message: Message) => {
  let domParser = new Parser();

  message.deletable && message.delete(250);
};

const getJoke = () => {
  fetch("https://schlechtewitze.com/kurze-witze")
    .then(response => response.text())
    .catch(error => console.log({ caller: "getJoke", error: error }))
    .then(response => response)
    .catch(error => console.log({ caller: "getJoke", error: error }));
};
