import { commandProps, config, roleIds, auth, userIds, channelIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageOptions, TextChannel } from "discord.js";
import { getState } from "../controller/stateController";
import { askIfWinnerWantsHisPrize } from "./getRaffleWinner";

export const test = {
  name: "test",
  description: "zum testen von Funktionen; wechselt stetig; bitte vorsichtig benutzen",
  usage: `[${config.prefix}test]`,
  roles: ["spinner"],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    executeTestFunction(message, client)
} as messageHandleFunction;

const executeTestFunction = (message: Message, client: Client) => {
  console.log("TEST");
  let state = getState();
  message.channel.send(
    `<@${message.member.user.id}> dir wurde folgende Rolle zugewiesen: "${
      message.member.guild.roles.get(roleIds.uninitiert).name
    }". ${
      roleIds.uninitiert === roleIds.uninitiert
        ? "Willkommen! Schnapp dir einen Medizinball und gesell dich dazu"
        : ""
    }`
  );

  message.channel.send("# Test\n", { code: "md" });
  message.deletable && message.delete(250);
};
