import {
  Attachment,
  Client,
  MessageOptions,
  Message,
  TextChannel,
  MessageCollector,
  VoiceChannel,
  StreamDispatcher,
  RichEmbed
} from "discord.js";
import { auth, roleIds, channelIds } from "../bot";
const auth: auth = require("./auth.json");
const Twitter = require("twitter");
import * as ytdl from "ytdl-core";
import { ReadStream } from "tty";
import { helpTextPleb } from "./messageHandlerPleb";
import {
  getStreamFromYouTubeLink,
  addToQueue,
  audioQueueElement,
  currentState,
  State
} from "../shared";

export interface commandBlock {
  command: string;
  function: (...any: any[]) => any;
}

const twitterClient = new Twitter({
  consumer_key: auth.consumer_key,
  consumer_secret: auth.consumer_secret,
  access_token_key: auth.access_token_key,
  access_token_secret: auth.access_token_secret
});

export interface messageHandleObjectTrusted {
  test: () => void;
  daddy: (message: Message, client?: Client) => void;
  twitter: (message: Message, client?: Client) => void;
  help: (message: Message, client?: Client) => void;
  natalieneu: (message: Message, client?: Client) => void;
  inspire: (message: Message, client?: Client) => void;
  inspireMode: (message: Message, client?: Client) => void;
  mindful: (message: Message, client?: Client) => void;
  flachbader: (message: Message, client?: Client) => void;
  play: (message: Message, client?: Client) => void;
  rigged: (message: Message, client?: Client) => void;
  pin: (message: Message, client?: Client) => void;
  wiki: (message: Message, client?: Client) => void;
  wilhelm: (message: Message, client?: Client) => void;
  "<:mist:509083062051799050>": (message: Message) => void;
  fault: (message: Message) => void;
  wisdom: (message: Message, client?: Client, numberToRepeat?: number) => void;
}

export const messageHandleObjectTrusted = {
  help: (message: Message, client?: Client) => writeHelpMessage(message),
  test: () => console.log("Hallo welt!"),
  daddy: async (message: Message, client?: Client) => sendDaddyImage(message),
  twitter: (message: Message, client?: Client) => listenToHashtag(message, client),
  natalieneu: (message: Message, client?: Client) => getNatalieRosenke(message),
  inspireMode: (message: Message, client?: Client) => inspireMode(message, client),
  inspire: (message: Message, client?: Client) => sendInspiringMessage(message, client),
  mindful: (message: Message, client?: Client) => playMindfulAudio(message),
  flachbader: (message: Message, client?: Client) => playFlachbader(message),
  play: (message: Message, client?: Client) => {
    let url = message.content.slice("!play ".length);
    if (!!~url.indexOf('"')) {
      url = url.replace('"', "");
    }
    playAudio(message, true, url);
  },
  add: (message: Message, client?: Client) => addToAudioQueue(message, client),
  rigged: (message: Message, client?: Client) => sendAluHut(message),
  pin: (message: Message, client?: Client) => pinMessage(message),
  wiki: (message: Message, client?: Client) => searchInWiki(message),
  wilhelm: (message: Message, client?: Client) => playWilhelmScream(message),
  "<:mist:509083062051799050>": (message: Message) => playMistSound(message),
  fault: (message: Message) => playItsNotYourFault(message),
  wisdom: (message: Message, client?: Client, numberToRepeat?: number) =>
    spitLovooWisdom(message, currentState)
} as messageHandleObjectTrusted;

export const helpTextTrusted = [
  "===============",
  "Funktionen für Spinner und Trusted: ",
  "------------------------",
  "!help - Übersicht",
  "!daddy - Bildniss der Daddygames",
  "!natalieneu - neuster Tweet",
  '!twitter "hashtag" - holt sich die 5 neusten Tweets zum Hashtag',
  "!inspire - Zufällige KI generierter Quote",
  "!inspireMode - Zufällige KI generierter Quote; alle 2 Minuten",
  "!mindful - Zufällige KI generierte Mindful Session",
  "!flachbader - Flachbader Song => !stop um zu beenden",
  "!play url - Spielt Youtube URL ab => !stop um zu beenden",
  "!add url - Fügt Sound zu Playlist hinzu",
  '!pin "message" user - Pinnt die Nachricht mit dem Aktuellen Datum an',
  '!wiki searchterm - Gibt eine Auswahl für den Begriff zurück => Nummer => "!link" eintippen wenn link gewünscht',
  "!wilhelm - spielt einen Willhelm Schrei ab",
  ":mist: - spielt Mist Sound ab",
  "!fault - spielt die weltberühmte Szene aus dem Klassiker 'Good Will Hunting' ab.",
  "!widsom - präsentiert eine Weißheit von einem LovooUser."
].join("\r");

const writeHelpMessage = async (message: Message) => {
  try {
    message.author.createDM().then(channel => {
      channel.send(helpTextTrusted);
      channel.send(helpTextPleb);
      channel.send("------------------------");
      channel.send(`Habe einen schönen Tag ${message.author.username}!`);
    });
    message.delete();
  } catch (error) {
    return console.log(error);
  }
};

const spitLovooWisdom = (message: Message, currenState: State, numberToRepeat?: number) => {
  let toRepeat =
    numberToRepeat ||
    (message.content.length > "!wisdom".length && message.content.slice("!wisdom ".length));
  if (currentState.lovooArray && currentState.lovooArray.length > 0) {
    const currentElement = currentState.lovooArray.pop();
    message.channel
      .sendEmbed({
        color: 0xff6633,
        title: "Wisdom of Lovoo~",
        author: {
          name: `${currentElement.name}${currentElement.verifications.verified ? " - ✔" : ""}`,
          url: `https://www.lovoo.com/profile/${currentElement.id}`
        },
        image: {
          ...currentElement.images[0]
        },
        thumbnail: {
          url:
            "https://cdn.discordapp.com/attachments/542410380757041173/543170245221941348/ezgif-5-2f5180a04e62.png"
        },
        description: currentElement.freetext,
        fields: [
          {
            name: "Info:",
            value: `${currentElement.age} Jahre - ${(currentElement.flirtInterests &&
              currentElement.flirtInterests
                .map(intrest => (intrest === "frie" ? "friends" : intrest))
                .join(" - ")) ||
              "Keine Angabe"} - ${currentElement.isOnline > 0 ? "Online" : "Offline"}`
          }
        ],
        footer: {
          text: `🏡${currentElement.locations.home.city} 📍${
            currentElement.locations.current.city
          } 🕵️‍${currentState.lovooArray.length}`
        }
      } as RichEmbed)
      .then((msg: Message) => {
        msg.deletable &&
          msg.delete(45000).then(() => {
            if (toRepeat) {
              if (typeof toRepeat === "number") {
                toRepeat -= 1;
              } else {
                toRepeat = parseInt(toRepeat);
              }
            }
            if (toRepeat > 0) spitLovooWisdom(message, currentState, toRepeat as number);
          });
      })
      .catch(error => {
        message.channel
          .send("Da ist was fehlgelaufen - Ups")
          .then((catchedMsg: Message) => catchedMsg.deletable && catchedMsg.delete(10000));
        console.log(error);
      });
  } else {
    message.channel
      .send("Sorry, keine LovooUser geladen ;(")
      .then((msg: Message) => msg.deletable && msg.delete(15000))
      .catch(error => console.log(error));
  }
  message.deletable && message.delete(500);
};

const playItsNotYourFault = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=wklDd8o8HFQ");

const playMistSound = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=6OVS77TN3yE");

const playWilhelmScream = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/watch?v=9FHw2aItRlw");

const playFlachbader = (message: Message) =>
  playAudio(message, true, "https://www.youtube.com/F62LEVZYMog");

const addToAudioQueue = (message: Message, client: Client) =>
  getStreamFromYouTubeLink(message)
    .then((audioElement: audioQueueElement) => addToQueue(audioElement))
    .catch(error => console.log(error));

const sendAluHut = (message: Message) => {
  const attachment = new Attachment(
    "https://images-na.ssl-images-amazon.com/images/I/71GV79NPpZL._UX425_.jpg"
  );
  message
    .reply(attachment as MessageOptions)
    .then(msg => {
      message.delete();
      (msg as Message).delete(120000);
    })
    .catch(error => console.log(error));
};

const pinMessage = (message: Message) => {
  let splitMessage = message.content.split('"');
  let messageContent = splitMessage[1];
  let messageUser = splitMessage[2].replace(" ", "");
  let currentDate = new Date();
  let { day, month, year } = {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  };
  message.channel
    .send(`"${messageContent}" - ${messageUser}, ${day}.${month}.${year}`)
    .then(msg => {
      message.delete();
      (msg as Message).pin();
    })
    .catch(error => console.log(error));
};

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

const getNatalieRosenke = (message: Message) =>
  twitterClient.get(
    "statuses/user_timeline",
    { user_id: "1053658318743441408", count: 3 },
    (error: any, tweets: any, response: any) => {
      tweets.forEach(async (element: any) => {
        try {
          const msg = await message.channel.send(element.text);
          message.delete();
          (msg as Message).delete(120000);
        } catch (error) {
          return console.log(error);
        }
      });
    }
  );

const listenToHashtag = (message: Message, client: Client) => {
  let hashtag = message.content.split('"')[1];
  const maxCount = 5;
  let currentCount = 0;
  console.log(`Hört auf: ${hashtag}`);
  message.delete();
  twitterClient.stream("statuses/filter", { track: hashtag }, function(stream: ReadStream) {
    (client.channels.get(channelIds.kikaloungeText) as TextChannel)
      .send(`Hört auf: ${hashtag}`)
      .then(msg => {
        (msg as Message).delete(120000);
      })
      .catch(error => console.log(error));
    stream.on("data", function(event: any) {
      if (currentCount >= maxCount) {
        (client.channels.get(channelIds.kikaloungeText) as TextChannel)
          .send(`Hört nichtmehr zu`)
          .then(msg => {
            (msg as Message).delete(120000);
          })
          .catch(error => console.log(error));
        return stream.destroy();
      }
      currentCount++;
      console.log(event);
      (client.channels.get(channelIds.kikaloungeText) as TextChannel)
        .send(
          `
            ${event.user.name}: ${
            event["extended_tweet"] !== undefined ? event.extended_tweet : event.text
          }`
        )
        .then(msg => {
          (msg as Message).delete(120000);
        })
        .catch(error => console.log(error));
    });
    stream.on("error", function(error: any) {
      throw error;
    });
  });
};

const sendDaddyImage = async (message: Message) => {
  const attachment = new Attachment(
    "https://media.discordapp.net/attachments/403672009353199620/500799691647090688/66cb2f9c-d18f-4073-a84a-835d79f3e3e0.png"
  );
  try {
    const msg = await message.channel.send(attachment as MessageOptions);
    message.delete();
    (msg as Message).delete(120000);
  } catch (error) {
    return console.log(error);
  }
};

const playMindfulAudio = (message: Message) => {
  if (!currentState.isPlayingAudio) {
    message.delete();
    fetch("http://inspirobot.me/api?generateFlow=1&sessionID=a473f800-395a-4e38-9766-1227cf8b2299")
      .then(response => response.json())
      .then(data => {
        const voiceChannel = message.member.voiceChannel;
        let textAndImages = data.data;
        voiceChannel
          .join()
          .then(connection => {
            fetch(data.mp3 as any)
              .then(response => response.body)
              .then(stream => {
                playAudio(message, false, "", {
                  stream: stream,
                  length:
                    textAndImages.filter((element: any) => element.type === "stop")[0].time * 1000
                });
                let qoutes = textAndImages.filter((element: any) => element.type === "quote");
                qoutes.forEach((quote: any) => {
                  setTimeout(
                    () =>
                      message.channel
                        .send(quote.text)
                        .then(msg => {
                          (msg as Message).delete(45000);
                        })
                        .catch(error => console.log(error)),
                    quote.time * 1000 - 250
                  );
                });
              })
              .catch(error3 => console.log(error3));
          })
          .catch(error2 => console.log(error2));
      })
      .catch(error1 => console.log(error1));
  }
};

export const createCollector = (
  message: Message,
  timeToDeletion: number,
  externalProptertyForFunction?: any,
  ...triggerMessages: commandBlock[]
) => {
  let triggerMessagesRef = [...triggerMessages];
  let collector = new MessageCollector(
    message.channel,
    (m: Message) =>
      m.author.id === message.author.id ||
      m.member.roles.has(roleIds.spinner) ||
      m.member.roles.has(roleIds.trusted),
    {
      time: timeToDeletion
    }
  );
  collector.on("collect", (followUpMessage: Message) => {
    try {
      if (triggerMessagesRef.filter(msg => msg.command === followUpMessage.content)[0]) {
        if (
          followUpMessage.content ===
          triggerMessagesRef.filter(msg => msg.command === followUpMessage.content)[0].command
        ) {
          triggerMessagesRef
            .filter(msg => msg.command === followUpMessage.content)[0]
            .function(externalProptertyForFunction, collector);
          followUpMessage.delete();
        }
      } else return console.log("Keine Funktion gefunden");
    } catch (error) {
      console.log(error);
    }
  });
  return collector;
};

const createDispatcher = (
  message: Message,
  voiceChannel: VoiceChannel,
  stream: any,
  volume: number | undefined,
  length: number,
  ...blocks: commandBlock[]
) => {
  let dispatcher = voiceChannel.connection
    .playStream(stream, {
      volume: volume || 0.2
    })
    .on("end", end => {
      message.delete();
      // voiceChannel.leave();
      currentState.isPlayingAudio = false;
    });
  return {
    collector: createCollector(message, length * 1000, dispatcher, ...blocks),
    dispatcher: dispatcher
  };
};

export const playAudio = (
  message: Message,
  youtube: boolean,
  url?: string,
  audioObject?: { stream: ReadableStream; length: number },
  volume?: number | undefined
) =>
  new Promise((resolve, reject) => {
    console.log(currentState);
    if (currentState.isPlayingAudio === false) {
      try {
        let dispatcher: StreamDispatcher;
        if (youtube) {
          const youtubeStream = ytdl(url, {
            filter: "audioonly"
          }).on("info", info => {
            const voiceChannel = message.member.voiceChannel;
            if (voiceChannel === undefined || voiceChannel === null) {
              message.member
                .createDM()
                .then(dmChannel =>
                  dmChannel.send(
                    "Du kannst keine Sounds abspielen, wenn du dich nicht in einem Voicechannel befindest."
                  )
                );
              return reject(console.log("Voicechannel ist undefined"));
            }

            if (voiceChannel.connection !== undefined && voiceChannel.connection !== null) {
              currentState.isPlayingAudio = true;
              try {
                dispatcher = createDispatcher(
                  message,
                  voiceChannel,
                  youtubeStream,
                  volume,
                  info.length_seconds,
                  {
                    command: "!stop",
                    function: (dispatcher: StreamDispatcher, collector: MessageCollector) => {
                      collector.stop();
                      youtubeStream.destroy();
                      return () => dispatcher.end();
                    }
                  }
                ).dispatcher.on("end", () => resolve());
              } catch (error) {
                return reject(console.log(error));
              }
            } else {
              voiceChannel
                .join()
                .then(connection => {
                  currentState.isPlayingAudio = true;
                  try {
                    dispatcher = createDispatcher(
                      message,
                      voiceChannel,
                      youtubeStream,
                      volume,
                      info.length_seconds,
                      {
                        command: "!stop",
                        function: (dispatcher, collector) => {
                          collector.stop();
                          youtubeStream.destroy();
                          return () => dispatcher.end();
                        }
                      }
                    ).dispatcher.on("end", () => resolve());
                  } catch (error) {
                    return reject(console.log(error));
                  }
                })
                .catch(error => reject(console.log(error)));
            }
          });
          if (youtubeStream === undefined) {
            console.log("test");
            return;
          }
          dispatcher && dispatcher.on("end", () => resolve(() => {}));
          youtubeStream.on("error", error => reject(error));
        } else {
          try {
            const voiceChannel = message.member.voiceChannel;
            voiceChannel.join().then(
              connection =>
                (dispatcher = createDispatcher(
                  message,
                  voiceChannel,
                  audioObject.stream,
                  volume,
                  audioObject.length,
                  {
                    command: "!stop",
                    function: (dispatcher: StreamDispatcher, collector) => {
                      collector.stop();
                      return () => dispatcher.end();
                    }
                  }
                ).dispatcher.on("end", () => resolve()))
            );
          } catch (error) {
            (error: any) => reject(console.log(error));
          }
        }
      } catch (error) {
        console.log(error);
        currentState.isPlayingAudio = false;
        message.channel
          .send(`Could not play link; Invalid Link? Not connected to Voice Channel?`)
          .then(msg => {
            message.delete();
            return resolve((msg as Message).delete(8000));
          })
          .catch(error => reject(console.log(error)));
      }
    } else {
      return reject(console.log("Already playing Audio"));
    }
  });

const inspireMode = (message: Message, client: Client) => {
  if (!currentState.isInspiring) {
    let messageCopy = { ...message } as Message;
    return sendInspiringMessage(message, client)
      .then(() => {
        currentState.isInspiring = true;
        return repeatInspire(messageCopy, client);
      })
      .catch(error => console.error(error));
  } else {
    message.channel
      .send(`Is already Inspiring~`)
      .then(msg => {
        message.delete();
        (msg as Message).delete(8000);
      })
      .catch(error => console.log(error));
  }
};

const repeatInspire: (message: Message, client: Client) => void = (
  message: Message,
  client: Client
) =>
  setTimeout(
    () =>
      sendInspiringMessage(message, client).then((attachment: MessageOptions) =>
        repeatInspire(message, client)
      ),
    120000
  );

const sendInspiringMessage = (message: Message, client: Client) =>
  new Promise((resolve, reject) => {
    fetch("http://inspirobot.me/api?generate=true")
      .then(response => response.text())
      .then(data => {
        console.log(data);
        const attachment = new Attachment(data);
        message.channel
          .send(attachment as MessageOptions)
          .then(msg => {
            createCollector(
              message,
              120 * 1000,
              undefined,
              {
                command: "!save",
                function: (extProp: any, collector: MessageCollector) => {
                  (client.channels.get(channelIds.inspirationText) as TextChannel)
                    .send(attachment)
                    .then(() =>
                      message.channel
                        .send(`Bild gespeichert im dedizierten Inspirationskanal`)
                        .then((saveMsg: Message) => {
                          collector.stop();
                          saveMsg.delete(8000);
                        })
                    )
                    .catch(error =>
                      message.channel
                        .send("Fehler beim Speichern des Bildes :(")
                        .then((errorMsg: Message) => errorMsg.delete(12000))
                    );
                }
              },
              {
                command: "!inspire",
                function: (extProp: any, collector: MessageCollector) => {
                  collector.stop();
                }
              }
            );
            if (message.delete) message.delete();
            console.log(data);
            (msg as Message).delete(120000);
            return resolve(attachment as MessageOptions);
          })
          .catch(error => reject(error));
      });
  });
