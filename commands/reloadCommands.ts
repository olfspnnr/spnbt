import { commandProps, RoleNames, config } from "../bot";
import { loadCommands, chunk } from "../controller/botController";
import { messageHandleFunction } from "../legacy/messageHandler";
import { getState, setState } from "../controller/stateController";

export const reloadCommands = {
  name: "reloadCommands",
  description: "Stößt einen Reload der Funktionsmodule an.",
  usage: `[${config.prefix}reloadCommands]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => {
    const oldState = getState();
    setState({ commands: undefined }).then(() => {
      loadCommands()
        .then(commands => {
          setState({ commands: commands }).then(newState => {
            console.log(oldState);
            message.author.createDM().then(channel => {
              let changedCommands = oldState.commands
                .filter(command => !newState.commands.some(cmd => cmd.name === command.name))
                .map(cmd => cmd.name);
              let newCommands = newState.commands
                .filter(cmd => !oldState.commands.some(command => cmd.name === command.name))
                .map(cmd => cmd.name);
              channel.send("Folgende Befehle sind neu:");
              channel.send((changedCommands.length > 0 && changedCommands) || "Keine");
              channel.send("Folgende Befehle sind gelöscht:");
              channel.send((newCommands.length > 0 && newCommands) || "Keine");
              channel.send("Folgende Befehle sind geladen:");
              channel.send("------------------------------------");
              let commandNameList = chunk(newState.commands.map(cmd => cmd.name), 5);
              commandNameList.map(chun => {
                channel.send(
                  (chun.length > 0 && [...chun, "------------------------------------"]) || "Keine?"
                );
              });
            });
          });
        })
        .catch(error => {
          console.log(error);
          setState(oldState);
        });
    });

    message.delete(250);
  }
} as messageHandleFunction;
