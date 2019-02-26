import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client } from "discord.js";
import { Parser, DomElement, DomAttributeNames } from "../controller/parser";
import { getState, setState } from "../controller/stateController";

export interface joke {
  [key: string]: string | Date;
  title: string;
  content: string;
  likes: string;
  dislikes: string;
  authorName: string;
  date: Date;
}

export const joke = {
  name: "joke",
  description: "holt einen Witz aus dem Web",
  usage: `[${config.prefix}joke]`,
  roles: [RoleNames.spinner, RoleNames.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) => handleJokeRequest(message)
} as messageHandleFunction;

const handleJokeRequest = (message: Message) => {
  getJoke().then(jokes => {});
  message.deletable && message.delete(250);
};

const getJoke = (skip?: number) =>
  new Promise((resolve, reject) => {
    fetch(`https://schlechtewitze.com/kurze-witze${skip ? "/?skip=" + skip : ""}`)
      .then(response => response.text())
      .then(response => {
        try {
          let domParser = new Parser();
          let dom = domParser.parse(response);
          let body = dom[0].next.children;

          let articleMain: DomElement[] = [];
          domParser.findInDomElements(body, DomAttributeNames.class, "Article__main", articleMain);
          let domElementByClass = domParser.getElementAsObject(
            articleMain[0],
            DomAttributeNames.class
          );
          let information = {
            title: undefined,
            content: undefined,
            likes: undefined,
            dislikes: undefined,
            authorName: undefined,
            date: undefined
          } as joke;
          Object.keys(domElementByClass).map(propName => {
            const checkAgainst = (searchString: string) =>
              ~propName.toLocaleLowerCase().indexOf(searchString);
            let element = domElementByClass[propName] as DomElement;
            if (checkAgainst("taglink")) {
              information.title = element.children[0].data;
            } else if (checkAgainst("author")) {
              console.log(domElementByClass[propName]);
              information.authorName = element.children[0].data;
            } else if (checkAgainst("date")) {
              information.date = new Date(element.children[0].attribs[DomAttributeNames.datetime]);
            } else if (checkAgainst("content")) {
              information.content = element.children[0].children[0].data
                .replace(/[\n\r]/g, " - ")
                .replace(/\s/g, " ")
                .replace(/&quot;/g, '"');
            } else if (checkAgainst("votebutton--up")) {
              let upvotes: DomElement[] = [];
              domParser.findInDomElements(
                element.children,
                DomAttributeNames.class,
                "Article__buttonText--checked",
                upvotes
              );
              information.likes = upvotes[0].children[0].data;
            } else if (checkAgainst("votebutton--down")) {
              let downvotes: DomElement[] = [];
              domParser.findInDomElements(
                element.children,
                DomAttributeNames.class,
                "Article__buttonText--checked",
                downvotes
              );
              information.dislikes = downvotes[0].children[0].data;
            }
          });
          console.log(information);
        } catch (error) {
          return reject({ caller: "getJoke", error: error });
        }
      })
      .catch(error => console.log({ caller: "getJoke", error: error }));
  }) as Promise<string[]>;
