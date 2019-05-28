import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction, messageHandleProps } from "../legacy/messageHandler";
import {
  Message,
  Client,
  MessageOptions,
  RichEmbed,
  User,
  TextChannel,
  DMChannel,
  GroupDMChannel,
  GuildMember
} from "discord.js";
import { writeJsonFile, readJsonFile, checkIfFileExists } from "../controller/JSONController";
import * as fs from "fs";

export interface raffleItem {
  clientname: string;
  id: string;
  hasEnteredRaffle: boolean;
  enteringDate: Date;
}

let props = {
  description: "Trägt den Nutzer ins Raffle ein",
  name: "raffle",
  roles: [RoleNames.spinner, RoleNames.trusted, RoleNames.raffleTeilnehmer],
  usage: `[${config.prefix}raffle]`
} as messageHandleProps;

export const raffle = {
  ...props,
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    handleRaffleRequest(message, client),
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
          value: `Mit ${config.prefix}${
            props.name
          } wird der Nutzer in die Liste der Rafflenamen eingetragen. Nach einem Zeitraum wird daraus der Gewinner gezogen und bekanntgegeben.`
        },
        {
          name: "Derzeitiger Gewinn",
          value: `Folgendes gibt es derzeit zu gewinnen:\n${
            config.raffleWinDescription !== -1 ? config.raffleWinDescription : "Nichts :("
          }`
        }
      ]
    } as RichEmbed
  }
} as messageHandleFunction;

const writeEntryAndSendMessages = (
  userOfRequest: User,
  messageChannel: TextChannel | DMChannel | GroupDMChannel
) =>
  new Promise((resolve, reject) => {
    writeEntryForUser(userOfRequest)
      .then(() => {
        messageChannel.send(" du wurdest dem Raffle hinzugefügt! Viel Glück!", {
          reply: userOfRequest
        } as MessageOptions);
      })
      .catch(err => {
        if (typeof err === "string") {
          messageChannel
            .send(err, { reply: userOfRequest } as MessageOptions)
            .then(
              (msg: Message) => msg.deletable && msg.delete(5000).catch(err => console.log(err))
            )
            .catch(err => console.log(err));
          return resolve();
        } else {
          console.log({ caller: "writeEntryAndSendMessages", error: err });
          return reject();
        }
      });
  }) as Promise<void>;

const writeEntryForUser = (userOfRequest: User) =>
  new Promise((resolve, reject) => {
    readJsonFile(config.raffleFileName)
      .then((users: raffleItem[]) => {
        addUserToRaffle(userOfRequest, users)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  }) as Promise<void>;

const addUserToRaffle = (userOfRequest: User, users: raffleItem[]) => {
  return new Promise((resolve, reject) => {
    const userList = users;
    if (
      (userList as any).empty === undefined &&
      userList.some(usr => usr.id === userOfRequest.id && usr.hasEnteredRaffle)
    ) {
      return reject(" du bist bereits in der Liste! Bald wird ein Sieger bekanntgegeben!");
    } else {
      let newUserList =
        (userList as any).empty !== undefined
          ? [
              {
                clientname: userOfRequest.username,
                id: userOfRequest.id,
                hasEnteredRaffle: true,
                enteringDate: new Date()
              }
            ]
          : [
              ...userList,
              {
                clientname: userOfRequest.username,
                id: userOfRequest.id,
                hasEnteredRaffle: true,
                enteringDate: new Date()
              }
            ];
      writeJsonFile(config.raffleFileName, JSON.stringify(newUserList))
        .then(() => {
          return resolve();
        })
        .catch(err => {
          return reject({ caller: "addUserToRaffle", error: err });
        });
    }
  }) as Promise<void>;
};

const handleRaffleRequest = (message: Message, client: Client) => {
  let userOfRequest = message.author;
  const messageChannel = message.channel;
  if (message.member.roles.has(roleIds.spinner) && message.mentions.users.size > 0) {
    userOfRequest = message.mentions.users.first();
    if (
      !message.guild.members
        .get(message.mentions.users.first().id)
        .roles.has(roleIds.raffleTeilnehmer)
    ) {
      message.guild.members
        .get(message.mentions.users.first().id)
        .addRole(roleIds.raffleTeilnehmer)
        .then(member => {
          message.channel.send(
            `${message.author} hat dich soeben zum Raffle hinzugefügt und dir die neue Rolle ${
              message.guild.roles.get(roleIds.raffleTeilnehmer).name
            } zugewiesen. Viel Glück! 🍀`,
            { reply: member } as MessageOptions
          );
        });
    }
  }

  message.deletable && message.delete(250).catch(err => console.log(err));

  if (fs.existsSync(config.raffleFileName)) {
    writeEntryAndSendMessages(userOfRequest, messageChannel).catch(err =>
      console.log({ caller: "handleRaffleRequest", error: err })
    );
  } else {
    writeJsonFile(config.raffleFileName, JSON.stringify({ empty: true }))
      .then(() =>
        writeEntryAndSendMessages(userOfRequest, messageChannel).catch(err =>
          console.log({ caller: "handleRaffleRequest", error: err })
        )
      )
      .catch(err => console.log(err));
  }
};
