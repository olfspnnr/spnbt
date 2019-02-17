import { commandProps, RoleNames, config } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message } from "discord.js";

let parser = require("html-dom-parser");

export const highendwand = {
  name: "highendwand",
  description: "Holt den letzten Eintrag von Olafs Pinnwand",
  usage: `[${config.prefix}highendwand]`,
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
  class?: string;
  id?: string;
  href?: string;
  target?: string;
  rel?: "string";
}

const getPinnwandEintrag = (message: Message) => {
  let domAsText: string = undefined;
  fetch("https://steamcommunity.com/id/HighendBark")
    .then(response => response.text())
    .then(text => {
      domAsText = text;
      let dom = parser(domAsText);
      let foundDomElements: DomElement[] = [] as DomElement[];
      console.log(
        findInDomElements(dom[0].next.next.children, "commentthread_comments", foundDomElements)
      );
      let comments = getComments(foundDomElements[0].children);
      let textElements: DomElement[] = [];
      findInDomElements(comments[0].children, "commentthread_comment_text", textElements);
      console.log(textElements[0].children[0].data);
      message.channel
        .send(textElements[0].children[0].data)
        .then((msg: Message) => console.log(msg));
    });

  message.deletable && message.delete(240);
};

const findInDomElements = (
  arrayOfChildren: DomElement[],
  stringToFind: string,
  foundElements: DomElement[]
) => {
  arrayOfChildren.map((element, idx) => {
    if (element.attribs !== undefined) {
      if (
        element.attribs.class !== undefined &&
        !!~element.attribs.class.toLocaleLowerCase().indexOf(stringToFind.toLocaleLowerCase())
      ) {
        console.log("success");
        foundElements.push(element);
      } else if (element.children.length !== undefined && element.children.length > 0) {
        findInDomElements(element.children, stringToFind, foundElements);
      }
    } else {
      if (
        element.children &&
        element.children.length !== undefined &&
        element.children.length > 0
      ) {
        findInDomElements(element.children, stringToFind, foundElements);
      }
    }
  });
};

const getComments = (commentContainerChildren: DomElement[]) => {
  let foundElements: DomElement[] = [];
  findInDomElements(commentContainerChildren, "commentthread_comment", foundElements);
  return foundElements;
};
