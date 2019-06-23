import { commandProps, mappedRoles, config, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, GuildMember, DMChannel } from "discord.js";

export const moveAndKeep = {
  name: "moveAndKeep",
  description: `Moved einen User in die Stille Treppe und behält ihn dort`,
  usage: `[${config.prefix}moveAndKeep userId]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    moveAndKeepUserInChannel(message, client)
} as messageHandleFunction;

const moveAndKeepUserInChannel = (message: Message, client: Client) => {
  message.delete(250);
  let userToMoveId = message.content.slice("!moveAndKeep ".length);
  userToMoveId = message.mentions.users.first().id;
  console.log(userToMoveId);
  message.guild.fetchMember(userToMoveId).then(member => {
    member.setVoiceChannel(channelIds.stilletreppeVoice).then((member: GuildMember) => {
      message.guild.fetchMember(userToMoveId).then(member => member.setDeaf(true));
      client.on("voiceStateUpdate", (oldMember, newMember) => {
        if (member.id === oldMember.id && member.id === newMember.id) {
          if (
            oldMember.voiceChannel &&
            newMember.voiceChannel &&
            oldMember.voiceChannel.id !== newMember.voiceChannel.id
          ) {
            message.member.setVoiceChannel(channelIds.stilletreppeVoice);
          } else {
            return console.log("User nicht verschoben ");
          }
        }
      });
    });
  });
};
