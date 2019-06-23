import { commandProps, mappedRoles, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { Message, Client, RichEmbed } from "discord.js";
import { Parser, DomElement, DomAttributeNames } from "../controller/parser";
import { getState, setState } from "../controller/stateController";

export interface joke {
  [key: string]: string | Date;
  url: string;
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
  roles: [mappedRoles.spinner, mappedRoles.trusted],
  execute: ({ discord: { message, client }, custom }: commandProps) =>
    handleJokeRequest(message, custom.jokes)
} as messageHandleFunction;

const handleJokeRequest = (
  message: Message,
  jokeState: { jokePosition: number; jokes: joke[] }
) => {
  if (jokeState.jokes.length > 0) {
    let jokesToshift = jokeState.jokes;
    let nextJoke = jokesToshift.shift();
    sendJoke(message, nextJoke, jokesToshift.length + 1);
    setState({
      jokes: { ...jokeState, jokes: jokesToshift }
    });
  } else {
    getJokes(jokeState.jokePosition * 20).then(jokes => {
      let shiftJokes = jokes;
      let nextJoke = jokes.shift();

      setState({
        jokes: { jokePosition: jokeState.jokePosition += 1, jokes: shiftJokes }
      }).then(newState => {
        message.channel.send(
          `~~Klaue neue Witze~~ Denke mir neue Witze aus. ~~Bin bei Seite ${
            newState.jokes.jokePosition
          }~~`
        );
        sendJoke(message, nextJoke, newState.jokes.jokes.length + 1);
      });
    });
  }

  message.deletable && message.delete(250);
};

const sendJoke = (message: Message, joke: joke, jokeCount?: number) => {
  let date = [joke.date.getDate(), joke.date.getMonth() + 1, joke.date.getFullYear()].join(".");
  message.channel
    .send({
      embed: {
        color: 0xff6633,
        author: { name: joke.authorName, url: joke.url },
        fields: [{ name: joke.title, value: `${joke.content}` }],
        footer: { text: `👍${joke.likes} 👎${joke.dislikes} -- ${date}${" --  📁" + jokeCount}` }
      } as RichEmbed
    })
    .then((msg: Message) => msg.deletable && !msg.pinned && msg.delete(60000));
};

const getJokes = (skip?: number) =>
  new Promise((resolve, reject) => {
    fetch(`https://schlechtewitze.com/kurze-witze${skip > 0 ? "/?skip=" + skip : ""}`)
      .then(response => response.text())
      .then(response => {
        try {
          let domParser = new Parser();
          let dom = domParser.parse(response);
          let body = dom[0].next.children;

          let articleMain: DomElement[] = [];
          domParser.findInDomElements(body, DomAttributeNames.class, "Article__main", articleMain);
          let jokes = articleMain.map(artElement => {
            let domElementByClass = domParser.getElementAsObject(
              artElement,
              DomAttributeNames.class
            );
            let information = {
              title: undefined,
              content: undefined,
              likes: undefined,
              dislikes: undefined,
              authorName: undefined,
              date: undefined,
              url: undefined
            } as joke;
            Object.keys(domElementByClass).map(propName => {
              const checkAgainst = (searchString: string) =>
                ~propName.toLocaleLowerCase().indexOf(searchString);
              let element = domElementByClass[propName] as DomElement;
              if (checkAgainst("taglink")) {
                information.title = element.children[0].data;
              } else if (checkAgainst("author")) {
                information.authorName = element.children[0].data;
              } else if (checkAgainst("date")) {
                information.date = new Date(
                  element.children[0].attribs[DomAttributeNames.datetime]
                );
              } else if (checkAgainst("content")) {
                let data: string[] = [];
                let multipleData = element.children.map(parent => {
                  data = [
                    ...data,
                    ...(parent.children
                      ? parent.children.map(child => (child.data ? child.data : ""))
                      : [])
                  ];
                  return parent;
                });
                information.content = data
                  .join(" - ")
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
            information.url = `https://schlechtewitze.com/kurze-witze${
              skip > 0 ? "/?skip=" + skip : ""
            }`;
            return information;
          });
          return resolve(jokes);
        } catch (error) {
          return reject({ caller: "getJoke", error: error });
        }
      })
      .catch(error => console.log({ caller: "getJoke", error: error }));
  }) as Promise<joke[]>;
