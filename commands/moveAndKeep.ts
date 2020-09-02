import { commandProps, mappedRoles, config, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, GuildMember, DMChannel } from "discord.js";

export const moveAndKeep = {
  name: "moveAndKeep",
  description: `Moved einen User in die Stille Treppe und behält ihn dort`,
  usage: `[${config.prefix}moveAndKeep userId]`,
  roles: [mappedRoles.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    moveAndKeepUserInChannel(message, client),
} as messageHandleFunction;

const moveAndKeepUserInChannel = (message: Message, client: Client) => {
  message.delete({ timeout: 250 });
  let userToMoveId = message.content.slice("!moveAndKeep ".length);
  userToMoveId = message.mentions.users.first().id;
  console.log(userToMoveId);
  message.guild.members.fetch(userToMoveId).then((member) => {
    member.voice.setChannel(channelIds.stilletreppeVoice).then((member: GuildMember) => {
      message.guild.members.fetch(userToMoveId).then((member) => member.voice.setDeaf(true));
      client.on("voiceStateUpdate", (oldState, newState) => {
        if (member.id === oldState.id && member.id === newState.id) {
          if (oldState.channel && newState.channel && oldState.channel.id !== newState.channelID) {
            message.member.voice.setChannel(channelIds.stilletreppeVoice);
          } else {
            return console.log("User nicht verschoben ");
          }
        }
      });
    });
  });
};
