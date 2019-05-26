import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel } from "discord.js";
import { getState } from "../controller/stateController";
import { Clock } from "../controller/clock";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST");
  let state = getState();
  // message.channel.send("test", { code: true } as MessageOptions);
  // ((state as any)["clock"] as Clock).eventEmitter.emit("raffleTime");
  message.deletable && message.delete(250);
};
