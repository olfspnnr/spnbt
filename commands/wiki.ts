import { commandProps, RoleNames, config, roleIds } from "../bot";
import { writeHelpMessage } from "../controller/shared";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, MessageCollector } from "discord.js";

export const wiki = {
  name: "wiki",
  description: "Durchsucht Wikipedia nach dem Suchbegriff",
  usage: `[${config.prefix}wiki suchbegriff => Zahl aus der Auswahl => !link]`,
  roles: [RoleNames.spinner, roleIds.trusted],
  execute: ({ discord: { message, client }, custom }) => searchInWiki(message)
} as messageHandleFunction;

const searchInWiki = (message: Message) => {
  let stringToSearch = message.content.slice("!wiki ".length);
  if (!!~stringToSearch.indexOf('"')) {
    stringToSearch = stringToSearch.replace('"', "");
  }
  if (stringToSearch !== "" && stringToSearch !== undefined) {
    fetch(
      `https://de.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${stringToSearch}&limit=12`
    )
      .then(resp => resp.json())
      .then(data => {
        const [searchTerm, headLines, descriptions, links] = data;
        message
          .reply(
            `will wissen, 'was ist ${searchTerm} tho?' => \r ${headLines
              .map((headline: string, idx: number) =>
                !~descriptions[idx].indexOf(`steht für:`) ? idx + ": " + headline + "\r " : ""
              )
              .join("")}`
          )
          .then(msg => {
            message.delete();
            let timeToDeletion = 20000;
            let lastItem: number = undefined;
            const collector = new MessageCollector(
              message.channel,
              m => m.author.id === message.author.id,
              { time: timeToDeletion }
            );
            collector.on("collect", (followUpMessage: Message) => {
              if (followUpMessage.content === "!link" && lastItem !== undefined) {
                followUpMessage.delete();
                followUpMessage
                  .reply(links[lastItem])
                  .then(fmsg => (fmsg as Message).delete(120000));
              }
              let messageNumber = parseInt(followUpMessage.content);
              if (messageNumber <= headLines.length) {
                lastItem = messageNumber;
                followUpMessage.delete();
                followUpMessage
                  .reply(descriptions[messageNumber])
                  .then(fmsg => (fmsg as Message).delete(120000));
              }
            });
            (msg as Message).delete(timeToDeletion);
          })
          .catch(error => console.log(error));
      });
  }
};
