import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel } from "discord.js";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: [RoleNames.spinner],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST");
  message.channel.send(
    message.guild.members
      .filter(member => member.roles.has(roleIds.spinner) || member.roles.has(roleIds.trusted))
      .map(member => member.displayName),
    {
      split: true
    }
  );
  message.guild.members
    .filter(member => member.roles.has(roleIds.spinner) || member.roles.has(roleIds.trusted))
    .map(member => member.addRole(roleIds.raffleTeilnehmer));

  message.deletable && message.delete(250);
};
