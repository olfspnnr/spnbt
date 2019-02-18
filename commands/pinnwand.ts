import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, MessageEmbed } from "discord.js";

let parser = require("html-dom-parser");

export const pinnwand = {
  name: "pinnwand",
  description: "Holt den letzten Eintrag von der Steam Pinnwand",
  usage: `[${config.prefix}pinnwand profile/id(/profiles/ oder /id/) steamid]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => getPinnwandEintrag(message)
} as messageHandleFunction;

interface DomElement {
  [key: string]: string | DomElement | DomAttributes | DomElement[];
  data: string;
  type: string;
  next: DomElement;
  prev: DomElement;
  parent: DomElement;
  attribs: DomAttributes;
  children: DomElement[];
}

interface DomAttributes {
  [key: string]: string;
  class?: string;
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  src?: string;
}

const getPinnwandEintrag = (message: Message) => {
  let steamProfileOrId = message.content.split(" ")[1];
  let steamId = message.content.split(" ")[2];
  let domAsText: string = undefined;
  fetch(`https://steamcommunity.com/${steamProfileOrId}/${steamId}`)
    .then(response => response.text())
    .then(text => {
      domAsText = text;
      let dom = parser(domAsText);
      let foundDomElements: DomElement[] = [] as DomElement[];
      console.log(
        findInDomElements(
          dom[0].next.next.children,
          "class",
          "commentthread_comments",
          foundDomElements
        )
      );
      try {
        let comments = getComments(foundDomElements[0].children);
        let lastComment = comments[0];
        let textElements: DomElement[] = [];
        findInDomElements(
          lastComment.children,
          "class",
          "commentthread_comment_text",
          textElements
        );
        let pinnwandText = textElements[0].children[0].data;
        let images: DomElement[] = [];
        findInDomElements(lastComment.children, "src", "https://steamcdn-a", images);
        let imageLink = images[0].attribs.src;
        let authorNames = [] as DomElement[];
        findInDomElements(lastComment.children, "name", "bdi", authorNames);
        let authorName = authorNames[0].children[0].data;
        let authorLink = authorNames[0].parent.attribs.href;
        let imgColor = [] as DomElement[];
        findInDomElements(lastComment.children, "class", "playerAvatar", imgColor);
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

const findInDomElements = (
  arrayOfChildren: DomElement[],
  attribName: string,
  stringToFind: string,
  foundElements: DomElement[]
) => {
  arrayOfChildren.map((element, idx) => {
    if (element.attribs && element.attribs[attribName] !== undefined) {
      if (
        !!~element.attribs[attribName].toLocaleLowerCase().indexOf(stringToFind.toLocaleLowerCase())
      ) {
        console.log("success");
        foundElements.push(element);
        return element;
      } else if (
        element.children &&
        element.children.length !== undefined &&
        element.children.length > 0
      ) {
        findInDomElements(element.children, attribName, stringToFind, foundElements);
      }
    } else if (
      element[attribName] !== undefined &&
      typeof element[attribName] === "string" &&
      !!~(element[attribName] as string)
        .toLocaleLowerCase()
        .indexOf(stringToFind.toLocaleLowerCase())
    ) {
      foundElements.push(element);
      return element;
    } else {
      if (
        element.children &&
        element.children.length !== undefined &&
        element.children.length > 0
      ) {
        findInDomElements(element.children, attribName, stringToFind, foundElements);
      }
    }
  });
};

const getComments = (commentContainerChildren: DomElement[]) => {
  let foundElements: DomElement[] = [];
  findInDomElements(commentContainerChildren, "class", "commentthread_comment", foundElements);
  return foundElements;
};
