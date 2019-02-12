import { commandProps, RoleNames, config } from "../bot";
import { writeHelpMessage, State } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message } from "discord.js";

export interface userToRename {
  id: string;
  isBeingRenamed: boolean;
  renameTo?: string;
}

export const renameUser = {
  name: "renameUser",
  description: "nennt User um zu angegebenen Namen / toggle ob dies automatisch passieren soll",
  usage: `[${config.prefix}renameUser userId nickname]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    renameUserFunc(message, custom.currentState)
} as messageHandleFunction;

const renameUserFunc = (message: Message, currentState: State) => {
  let [userId, nicknameToSet] = message.content.slice("!renameUser ".length).split(" ");
  console.log({ userid: userId, nickname: nicknameToSet });
  userId = userId
    .replace(/<@/g, "")
    .replace(/!/g, "")
    .replace(/>/g, "");
  if (message.guild.members.some(member => member.id === userId)) {
    console.log("user gefunden");
    if (currentState.renameUser.some(userRe => userRe.id === userId)) {
      currentState.renameUser = currentState.renameUser.map(userRe => {
        if (userRe.id === userId) {
          return { ...userRe, isBeingRenamed: !userRe.isBeingRenamed };
        } else return userRe;
      });
    } else
      currentState.renameUser.push({
        id: userId,
        isBeingRenamed: true,
        renameTo: nicknameToSet
      } as userToRename);

    let user = currentState.renameUser.find(user => user.id === userId);
    if (user.isBeingRenamed) {
      message.guild.members.get(user.id).setNickname(nicknameToSet);
      console.log("Werde nun User umbennen");
    } else {
      message.guild.members
        .get(user.id)
        .setNickname(message.guild.members.get(user.id).user.username);
      console.log("Werde nun User nichtmehr umbennen");
    }
  } else
    message.channel
      .send("User nicht gefunden")
      .then((msg: Message) => msg.deletable && msg.delete(15000));
  message.deletable && message.delete(500);
  return console.log(currentState.renameUser);
};
