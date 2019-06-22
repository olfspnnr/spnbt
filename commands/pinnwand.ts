import { commandProps, mappedRoles, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, MessageEmbed } from "discord.js";
import { DomElement, Parser, DomAttributeNames } from "../controller/parser";

export const pinnwand = {
  name: "pinnwand",
  description: "Holt den letzten Eintrag von der Steam Pinnwand",
  usage: `[${config.prefix}pinnwand profile/id(/profiles/ oder /id/) steamid]`,
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => getPinnwandEintrag(message)
} as messageHandleFunction;

const getPinnwandEintrag = (message: Message) => {
  let domParser = new Parser();
  let steamProfileOrId = message.content.split(" ")[1];
  let steamId = message.content.split(" ")[2];
  let domAsText: string = undefined;
  fetch(`https://steamcommunity.com/${steamProfileOrId}/${steamId}`)
    .then(response => response.text())
    .then(text => {
      domAsText = text;
      let dom = domParser.parse(domAsText);
      let foundDomElements: DomElement[] = [] as DomElement[];
      console.log(
        domParser.findInDomElements(
          dom[0].next.next.children,
          DomAttributeNames.class,
          "commentthread_comments",
          foundDomElements
        )
      );
      try {
        let comments = getComments(foundDomElements[0].children, domParser);
        let lastComment = comments[0];
        let textElements: DomElement[] = [];
        domParser.findInDomElements(
          lastComment.children,
          DomAttributeNames.class,
          "commentthread_comment_text",
          textElements
        );
        let pinnwandText = textElements[0].children[0].data;
        let images: DomElement[] = [];
        domParser.findInDomElements(
          lastComment.children,
          DomAttributeNames.src,
          "https://steamcdn-a",
          images
        );
        let imageLink = images[0].attribs.src;
        let authorNames = [] as DomElement[];
        domParser.findInDomElements(
          lastComment.children,
          DomAttributeNames.name,
          "bdi",
          authorNames
        );
        let authorName = authorNames[0].children[0].data;
        let authorLink = authorNames[0].parent.attribs.href;
        let imgColor = [] as DomElement[];
        domParser.findInDomElements(
          lastComment.children,
          DomAttributeNames.class,
          "playerAvatar",
          imgColor
        );
        let imageColor = imgColor[0].attribs.class;
        let color = undefined;
        if (~imageColor.toLocaleLowerCase().indexOf("online")) {
          color = 0x41778f;
        } else if (~imageColor.toLocaleLowerCase().indexOf("in-game")) {
          color = 0x8fb93b;
        } else {
          color = 0x6a6a6a;
        }
        message.channel.send(`Pinnwand von ${steamId}`);
        message.channel.send({
          embed: {
            author: { name: authorName, url: authorLink },
            thumbnail: { url: imageLink },
            fields: [
              {
                name: "Hat hinterlassen: ",
                value:
                  pinnwandText !== undefined && pinnwandText !== null && pinnwandText !== ""
                    ? pinnwandText + "\u200b"
                    : "Smiley?"
              }
            ],
            color: color
          } as MessageEmbed
        });
      } catch (error) {
        console.log(error);

        message.channel
          .send(
            `Sorry, ich habe mich verschluckt, ${
              steamId && steamProfileOrId ? "ist das Profil privat?" : "da fehlt eine Info..."
            }`
          )
          .then((msge: Message) => {
            msge.deletable && msge.delete(10000);
          })
          .catch(error => console.log(error));
      }
    });

  message.deletable && message.delete(240);
};

const getComments = (commentContainerChildren: DomElement[], domParser: Parser) => {
  let foundElements: DomElement[] = [];
  domParser.findInDomElements(
    commentContainerChildren,
    DomAttributeNames.class,
    "commentthread_comment",
    foundElements
  );
  return foundElements;
};
