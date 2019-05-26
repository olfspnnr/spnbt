import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions } from "discord.js";
import { getState } from "../controller/stateController";
import { sliceMessageFromCommand } from "../controller/helpController";
import { writeJsonFile, readJsonFile } from "../controller/JSONController";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

interface userItem {
  clientname: string;
  nickname: string;
  displayName: string;
  id: string;
}

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST");
  readJsonFile("USERJSON")
    .then((users: userItem[]) => {
      if (users.some(usr => usr.id === message.mentions.members.first().id)) {
        message.channel.send(message.mentions.members.first().nickname + " already in list");
      } else {
        message.channel.send(message.mentions.members.first().nickname + " added");
      }
    })
    .catch(err => console.log({ caller: "", error: err }));

  // bisherige Einträge lesen
  // neuen Eintrag hineinschreiben
  // datei speichern

  // let currentUsersOnline = message.guild.members.filter(
  //   member => member.presence.status === "online"
  // );
  // let allMembers = message.guild.members;
  // let userArray = allMembers.map(
  //   memb =>
  //     ({
  //       clientname: memb.user.username,
  //       nickname: memb.nickname,
  //       displayName: memb.displayName,
  //       id: memb.id
  //     } as userItem)
  // );
  // writeJsonFile("USERJSON", JSON.stringify(userArray))
  //   .then(msg => {})
  //   .catch(err => console.log(err));

  // let currentState = getState();

  message.deletable && message.delete(250);
};
