import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { getStateProp } from "../controller/stateController";
import { Message, Collection } from "discord.js";
import { chunk } from "../controller/botController";

export const help = {
  name: "help",
  description: "Übersicht",
  usage: `[${config.prefix}help]`,
  roles: [RoleNames.spinner, RoleNames.trusted, RoleNames.uninitiert, RoleNames.poop],
  execute: ({ discord: { message, client }, custom }: commandProps) => writeHelpMessage(message)
} as messageHandleFunction;

const handleHelpRequest = (message: Message) => {
  let splittedMessage = message.content.split(" ");
  if (splittedMessage.length > 0) {
    let [command, ...args] = splittedMessage;
    if (args.length > 1) {
      rejectRequest(message, "Das waren zu viele Argumente");
    }
  }
};

const rejectRequest = (message: Message, reason: string) => {
  message.channel
    .send(`Sorry, das habe ich nicht verstanden${reason ? " - " + reason : ""}`)
    .then((msg: Message) => msg.deletable && msg.delete(6000));
  message.deletable && message.delete(600);
};

const writeHelpMessage = async (message: Message) => {
  let commands = getStateProp("commands") as Collection<string, messageHandleFunction>;
  let helpMessages = commands.map((command: messageHandleFunction) => {
    if (command.roles.some(role => message.member.roles.has(roleIds[role])))
      return `**${command.usage}** ${command.description}`;
    else return undefined;
  });
  if (helpMessages) helpMessages = helpMessages.filter(entry => entry);
  try {
    message.author.createDM().then(channel => {
      channel.send("Mit folgenden Befehlen kann ich zu eurem Chillout beitragen:");
      channel.send("------------------------");
      channel.send(helpMessages, { split: true }).then(() => {
        channel.send("------------------------");
        channel.send(`Habe einen schönen Tag ${message.author.username}!`);
      });
    });
    message.delete();
  } catch (error) {
    return console.log(error);
  }
};
