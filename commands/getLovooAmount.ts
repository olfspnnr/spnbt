import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
import { getState } from "../controller/stateController";

export const getLovooAmount = {
  name: "getLovooAmount",
  description: "gibt die Anzahl der Lovoo-User im 'Speicher' zurück.",
  usage: `[${config.prefix}getLovooAmount]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    getLovooAmountFunc(message, client)
} as messageHandleFunction;

const getLovooAmountFunc = (message: Message, client: Client) => {
  let currentState = getState();
  if (currentState.lovooArray) {
    message.channel
      .send(`Derzeit vorhandene User: ${currentState.lovooArray.length}`)
      .then((msg: Message) => msg.deletable && msg.delete(60000))
      .catch(error => console.log({ caller: "getLovooAmount", error: error }));
  }
  message.deletable && message.delete(250);
};
