import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction, messageHandleProps } from "../legacy/messageHandler";
import { getStateProp } from "../controller/stateController";
import { Message, Collection, RichEmbed } from "discord.js";

let props = {
  usage: `[${config.prefix}help]`,
  roles: [RoleNames.spinner, RoleNames.trusted, RoleNames.uninitiert, RoleNames.poop],
  description: "Übersicht über die Befehle",
  name: "help"
} as messageHandleProps;

export const help = {
  ...props,
  execute: ({ discord: { message, client }, custom }: commandProps) => writeHelpList(message),
  detailedInformation: {
    embed: {
      color: 0x3abeff,
      title: `${props.name}`,
      fields: [
        { name: "Nutzung", value: props.usage },
        {
          name: "Kurzbeschreibung",
          value: props.description
        },
        {
          name: "Beschreibung",
          value: `Liefert eine Übersicht über die Befehle, die für den User freigeschaltet sind, als Direktnachricht an den User`
        }
      ]
    } as RichEmbed
  }
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

const writeHelpList = async (message: Message) => {
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
