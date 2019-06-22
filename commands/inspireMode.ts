import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { sendInspiringMessage } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions } from "discord.js";
import { getState } from "../controller/stateController";

export const inspireMode = {
  name: "inspireMode",
  description: "Zufällige KI generierter Quote; alle 2 Minuten",
  usage: `[${config.prefix}inspireMode]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    inspireModeFunc(message, client)
} as messageHandleFunction;

const repeatInspire: (message: Message, client: Client) => void = (
  message: Message,
  client: Client
) =>
  setTimeout(
    () =>
      sendInspiringMessage(message, client).then((attachment: MessageOptions) =>
        repeatInspire(message, client)
      ),
    120000
  );

const inspireModeFunc = (message: Message, client: Client) => {
  let currentState = getState();
  if (!currentState.isInspiring) {
    let messageCopy = { ...message } as Message;
    return sendInspiringMessage(message, client)
      .then(() => {
        currentState.isInspiring = true;
        return repeatInspire(messageCopy, client);
      })
      .catch(error => console.error(error));
  } else {
    message.channel
      .send(`Is already Inspiring~`)
      .then(msg => {
        message.delete();
        (msg as Message).delete(8000);
      })
      .catch(error => console.log(error));
  }
};
