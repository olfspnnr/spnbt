import { commandProps, RoleNames, config } from "../bot";
import { loadCommands, chunk } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { getState, setState } from "../controller/stateController";
import { Collection } from "discord.js";

export const reloadCommands = {
  name: "reloadCommands",
  description: "Stößt einen Reload der Funktionsmodule an.",
  usage: `[${config.prefix}reloadCommands]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => {
    const backUpState = getState();
    setState({ commands: new Collection<string, messageHandleFunction>() });
    loadCommands()
      .then(commands => {
        const oldState = getState();
        setState({ commands: commands }).then(newState => {
          message.author.createDM().then(channel => {
            let newCommands = oldState.commands
              .filter(command => !newState.commands.some(cmd => cmd.name === command.name))
              .map(cmd => cmd.name);
            let deletedCommands = newState.commands
              .filter(cmd => !oldState.commands.some(command => cmd.name === command.name))
              .map(cmd => cmd.name);
            channel.send("Folgende Befehle sind neu:");
            channel.send((newCommands.length > 0 && newCommands) || "Keine");
            channel.send("Folgende Befehle sind gelöscht:");
            channel.send((deletedCommands.length > 0 && deletedCommands) || "Keine");
            channel.send("Folgende Befehle sind geladen:");
            let commandNameList = chunk(newState.commands.map(cmd => cmd.name), 5);
            commandNameList.map(chun => {
              channel.send((chun.length > 0 && chun) || "Keine?");
              channel.send("------------------------------------");
            });
          });
        });
      })
      .catch(error => {
        console.log(error);
        setState(backUpState);
      });
    message.delete(250);
  }
} as messageHandleFunction;
