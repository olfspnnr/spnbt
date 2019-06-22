import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { messageHandleFunction, messageHandleProps } from "../legacy/messageHandler";
import { getStateProp } from "../controller/stateController";
import { Message, Collection, RichEmbed } from "discord.js";

let props = {
  usage: `[${config.prefix}help]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted, mappedRoles.uninitiert, mappedRoles.poop],
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

const spliceCommandArray = (
  commands: Collection<string, messageHandleFunction>,
  number: number
) => {
  if (commands.size > number) {
  }
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
    let perChunk = 25;
    let splicedCommands = commands.array().reduce((all, one, i) => {
      const ch = Math.floor(i / perChunk);
      all[ch] = [].concat(all[ch] || [], one);
      return all;
    }, []);

    let splicedCommandsMessage = splicedCommands.map((arr: messageHandleFunction[]) => ({
      embed: {
        color: 0x3abeff,
        author: {
          name: "Übersicht"
        },
        description:
          "Mit ?[Befehlname] kannst du dir genauere Informationen(falls vorhanden) zu einem Befehl holen",
        fields: [
          ...arr.map(
            command =>
              ({
                name: command.name,
                value: `${command.usage}\n${command.description}`
              } as {
                name: string;
                value: string;
                inline?: boolean;
              })
          )
        ],
        footer: {
          text: `Geladene Befehle: ${commands.size} ✔ - Einen schönen Tag ${
            message.author.username
          }!`
        }
      } as RichEmbed
    }));

    message.author.createDM().then(channel => {
      splicedCommandsMessage.map(embed => channel.send(embed));
    });
    message.delete();
  } catch (error) {
    return console.log(error);
  }
};
