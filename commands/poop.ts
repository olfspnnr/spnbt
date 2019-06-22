import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { stripMemberOfAllRoles } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, GuildMember } from "discord.js";

export const poop = {
  name: "poop",
  description: "weist eine Person der Poopgruppe zu",
  usage: `[${config.prefix}poop userId]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) => poopCommand(message)
} as messageHandleFunction;

const poopCommand = (message: Message) => {
  message.delete(250);
  let userToAssignRoleToID = message.content.slice("!poop ".length);
  userToAssignRoleToID = !!~userToAssignRoleToID.indexOf("<@")
    ? userToAssignRoleToID
        .replace(/<@/g, "")
        .replace(/!/g, "")
        .replace(/>/g, "")
    : userToAssignRoleToID;
  userToAssignRoleToID = userToAssignRoleToID.replace(/\\/g, "").replace(" ", "");
  console.log(userToAssignRoleToID);
  message.guild
    .fetchMember(userToAssignRoleToID)
    .then(member =>
      stripMemberOfAllRoles(member).then((member: GuildMember) => member.addRole(roleIds.poop))
    );
};
