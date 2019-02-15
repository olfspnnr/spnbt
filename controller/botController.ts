import {
  MessageCollector,
  Message,
  MessageReaction,
  GuildMember,
  Client,
  TextChannel,
  Emoji,
  StreamDispatcher,
  VoiceChannel,
  MessageOptions,
  Attachment,
  Collection,
  DMChannel
} from "discord.js";
import {
  audioQueue,
  roleIds,
  channelIds,
  UserIds,
  RoleNames,
  commandProps,
  config,
  userIds
} from "../bot";
import * as ytdl from "ytdl-core";
import { EventEmitter } from "events";
import { userToRename } from "../commands/renameUser";
import { messageHandleFunction } from "../legacy/messageHandler";
import * as path from "path";
import { setStateProp, getStateProp, getState, setState } from "./stateController";
const fs = require("fs");

export interface commandBlock {
  command: string;
  function: (...any: any[]) => any;
}

export interface Options {
  profileShareable: number;
}

export interface Counts {
  p: number;
  m: number;
}

export interface Home {
  city: string;
  country: string;
  distance: number;
}

export interface Current {
  city: string;
  country: string;
  distance: number;
}

export interface Locations {
  home: Home;
  current: Current;
}

export interface Image {
  url: string;
  width: number;
  height: number;
}

export interface Verifications {
  facebook: number;
  verified: number;
  confirmed: number;
}

export interface lovooUserEntry {
  _type: string;
  id: string;
  name: string;
  gender: number;
  age: number;
  lastOnlineTime: number;
  whazzup: string;
  freetext: string;
  isInfluencer: number;
  subscriptions: any[];
  isVip: number;
  flirtInterests: string[];
  options: Options;
  counts: Counts;
  locations: Locations;
  isNew: number;
  isOnline: number;
  isMobile: number;
  isHighlighted: number;
  picture: string;
  images: Image[];
  isVerified: number;
  verifications: Verifications;
}

export interface audioQueueElement {
  message: Message;
  youtube: boolean;
  url?: string;
  audioObject?: { stream: ReadableStream; length: number };
  volume?: number | undefined;
}

export const repeatMessageWithLenny = (message: Message) => {
  if (message.content.includes("lenny") || message.content.includes("Lenny")) {
    message.channel
      .send(
        message.content
          .split("lenny")
          .join("( ͡° ͜ʖ ͡°)")
          .split("Lenny")
          .join("(͡° ͜ʖ ͡°)")
      )
      .then(() => {
        message.deletable && message.delete(250);
      });
  }
};

export interface wsMessage {
  type: string;
  payload: any;
}

export const handleWebSocketMessage = (wsMessage: any) => {
  try {
    if (
      (handlePayloadType as any)[wsMessage.type] !== undefined &&
      typeof (handlePayloadType as any)[wsMessage.type] === "function"
    ) {
      (handlePayloadType as any)[wsMessage.type](wsMessage.payload);
    } else throw `could not find function for ${wsMessage.type}`;
  } catch (error) {
    console.log(error);
  }
};

const handlePayloadType = {
  loadLovoo: (payload: any) =>
    setStateProp("lovooArray", payload)
      .then(newState => {
        console.log(newState);
      })
      .catch(error => console.log(error))
};

export const stripMemberOfAllRoles = (member: GuildMember) =>
  new Promise((resolve, reject) =>
    member
      .removeRoles(member.roles)
      .then(member => resolve(member))
      .catch(error => reject(error))
  );

export const checkIfMemberHasntRolesAndAssignRoles = (
  client: Client,
  newMember: GuildMember,
  rolesToCheck: string[],
  rolesToAdd: string[]
) => {
  let checkRoles = rolesToCheck.some(role => newMember.roles.has(role));
  console.log({ checkRole: checkRoles });
  if (!checkRoles) {
    assignRolesToMember(client, newMember, rolesToAdd);
  }
};

export const assignRolesToMember = (
  client: Client,
  newMember: GuildMember,
  rolesToAdd: string[]
) => {
  let roleNames: any = {};
  Object.keys(roleIds).map(prop => (roleNames[roleIds[prop]] = prop));
  rolesToAdd.map(role => {
    newMember
      .addRole(role)
      .then(() =>
        (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
          `<@${newMember.user.id}> you werde assigned role "${roleNames[role]}". ${
            role === RoleNames.uninitiert ? "Reconnect may be necessary to be able to talk." : ""
          }`
        )
      );
  });
};

export const reactionDeletionHandler = (
  message: Message,
  reaction: MessageReaction,
  userIdOfMessage: string
) => {
  const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
    time: 600 * 1000
  });
  collector.on("collect", (followUpMessage: Message) => {
    if (followUpMessage.member.user.id === userIdOfMessage) reaction.remove();
    else return;
  });
};

export const addToQueue = (audioQueueElement: audioQueueElement) =>
  audioQueue.add(audioQueueElement);

export const getCurrentSong = () => audioQueue.currentQueue[0] && audioQueue.currentQueue[0];

export const getStreamFromYouTubeLink = (message: Message) =>
  new Promise((resolve, reject) => {
    try {
      let url = message.content.slice("!testfunction ".length);
      if (!!~url.indexOf('"')) {
        url = url.replace('"', "");
      }
      console.log(`getting stream for ${url}`);
      let audioElement: audioQueueElement = undefined;
      const youtubeStream = ytdl(url, {
        filter: "audioonly"
      }).on("info", info => {
        audioElement = {
          message: message,
          youtube: false,
          audioObject: { length: info.length_seconds, stream: youtubeStream as any }
        };
        return resolve(audioElement);
      });
    } catch (error) {
      (error: any) => reject(error);
    }
  });

export class AudioQueue extends EventEmitter {
  currentQueue: audioQueueElement[];
  isPlaying: boolean;

  constructor() {
    super();
    this.currentQueue = [];
    this.isPlaying = false;
  }

  add = ({ youtube, url, audioObject, message, volume }: audioQueueElement) => {
    this.currentQueue = [
      ...this.currentQueue,
      { message: message, volume: volume, audioObject: audioObject, url: url, youtube: youtube }
    ];
    this.emit("add", this.currentQueue);
    return this.currentQueue;
  };

  shift = () => {
    if (this.currentQueue.length > 0) {
      this.isPlaying = false;
      let shiftedElement = this.currentQueue.shift();
      return shiftedElement;
    }
    return undefined;
  };

  play = (audioToBePlayed: audioQueueElement) => {
    if (audioToBePlayed === undefined) return;
    try {
      this.isPlaying = true;
      this.emit("play", audioToBePlayed);
      let { audioObject, message, url, volume, youtube } = audioToBePlayed;
      playAudio(message, youtube, url, audioObject, volume)
        .then(() => {
          this.isPlaying = false;
          this.emit("finish", audioToBePlayed);
          this.play(this.shift());
        })
        .catch(error => {
          this.isPlaying = false;
          this.emit("error", error);
          this.emit("finish", audioToBePlayed);
          this.play(this.shift());
        });
    } catch (error) {
      (error: any) => {
        this.emit("error", error);
        this.shift();
      };
    }
  };
}

export const handleNameChange = (userToChange: GuildMember) => {
  let renameUser = getStateProp("renameUser") as userToRename[];
  if (renameUser) {
    renameUser.map(rename => {
      if (rename.id === userToChange.id && rename.isBeingRenamed) {
        userToChange.setNickname(rename.renameTo || userToChange.user.username);
      }
    });
  }
};

export const ruleSet = [
  { user: "olaf", reactionToAdd: "💕" },
  { user: "nils", reactionToAdd: "katze1" },
  { user: "justus", reactionToAdd: "pill~1" },
  { user: "marcel", reactionToAdd: "daddy" },
  { user: "franny", reactionToAdd: "🔥" },
  { user: "adrian", reactionToAdd: "💩" }
] as reactionRuleSet[];

export interface reactionRuleSet {
  user: string;
  reactionToAdd: string;
}

export const addReactionToMessage = (
  message: Message,
  client: Client,
  userIds?: UserIds,
  rulesets?: reactionRuleSet[],
  reaction?: string
) => {
  if (ruleSet && userIds) {
    rulesets.map(ruleset => {
      let emoji: Emoji | string = undefined;
      ruleSet.map(({ user, reactionToAdd }) => {
        if (userIds[user] === message.member.id) {
          emoji = client.emojis.find(emoji => emoji.identifier === reactionToAdd);
          if (!emoji) {
            emoji = reactionToAdd;
          }
        }
      });
      if (message.member.user.id === (userIds as any)[ruleset.user]) {
        message
          .react(emoji)
          .then(reaction =>
            reactionDeletionHandler(message, reaction, (userIds as any)[ruleset.user])
          )
          .catch(error => console.log(error));
      }
    });
  } else {
    let emoji: Emoji | string = undefined;
    emoji = client.emojis.find(emoji => emoji.name === reaction);
    if (!emoji) {
      emoji = reaction;
    }
    message
      .react(emoji)
      .then(reaction => reactionDeletionHandler(message, reaction, message.client.user.id))
      .catch(error => console.log(error));
  }
};

export const handleVoiceStateUpdate = (
  oldMember: GuildMember,
  newMember: GuildMember,
  client: Client
) => {
  if (oldMember.voiceChannel === undefined && newMember.voiceChannel !== undefined) {
    (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
      `${newMember.user.username}/${newMember.displayName} joined.`
    );
  } else if (newMember.voiceChannel === undefined) {
    (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
      `${oldMember.user.username}/${oldMember.displayName} left.`
    );
  } else if (newMember.voiceChannel !== undefined && oldMember.voiceChannel !== undefined) {
    console.log(`Something changed with [${oldMember.user.username}/${oldMember.displayName}]`);
    let differences = {};
    Object.keys(oldMember).map(key => {
      Object.keys(newMember).map(newKey => {
        if ((oldMember as any)[newKey] !== (newMember as any)[newKey]) {
          (differences as any)[newKey] = `${(oldMember as any)[newKey]} => ${
            (newMember as any)[newKey]
          }`;
        }
      });
    });
    let different = Object.keys(differences)
      .map(key => `${key}: ${(differences as any)[key]}`)
      .join(";\n");
    console.log(different);
  } else {
    return console.log("Konnte nicht entscheiden was passiert ist");
  }
};

export const chunk = (arr: string[], len: number) => {
  let chunks = [];
  let i = 0;
  let n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};

export const writeHelpMessage = async (message: Message) => {
  let commands = getStateProp("commands") as Collection<string, messageHandleFunction>;
  let helpMessages = commands.map((command: messageHandleFunction) => {
    if (command.roles.some(role => message.member.roles.has(roleIds[role])))
      return `**${command.usage}** ${command.description}`;
    else return undefined;
  });
  if (helpMessages) helpMessages = helpMessages.filter(entry => entry);
  let helpMessageChunks = chunk(helpMessages, 10);
  try {
    message.author.createDM().then(channel => {
      channel.send("Mit folgenden Befehlen kann ich zu eurem Chillout beitragen:");
      channel.send("------------------------");
      helpMessageChunks.map((part, idx) => {
        if (idx === 0) channel.send([...part]);
        else {
          channel.send(["-", ...part]);
        }
      });
      channel.send("------------------------");
      channel.send(`Habe einen schönen Tag ${message.author.username}!`);
    });
    message.delete();
  } catch (error) {
    return console.log(error);
  }
};

export const playAudio = (
  message: Message,
  youtube: boolean,
  url?: string,
  audioObject?: { stream: ReadableStream; length: number },
  volume?: number | undefined
) =>
  new Promise((resolve, reject) => {
    if ((getStateProp("isPlayingAudio") as boolean) === false) {
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
              setStateProp("isPlayingAudio", true)
                .then(currentState => {
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
                })
                .catch(error => console.log(error));
            } else {
              voiceChannel
                .join()
                .then(connection => {
                  let currentState = getState();
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
        setStateProp("isPlayingAudio", false);
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

const createCollector = (
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
      setStateProp("isPlayingAudio", false);
    });
  return {
    collector: createCollector(message, length * 1000, dispatcher, ...blocks),
    dispatcher: dispatcher
  };
};

export const sendInspiringMessage = (message: Message, client: Client) =>
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

export const handleMessageCall = (message: Message, client: Client, twitterClient: Twitter) => {
  if (message.guild === null && message.channel instanceof DMChannel) {
    return console.log(`directMessage => ${message.author.username}: ${message.content}`);
  }
  console.log(`${message.member.displayName}/${message.member.user.username}: ${message.content}
      `);
  console.log(`${message.content.split(" ").shift()}`);
  if (message.content.startsWith(config.prefix) && !message.author.bot) {
    let functionCall = message.content.split(" ")[0].slice(1);
    let currentState = getState();
    if (currentState.commands.has(functionCall)) {
      let command = currentState.commands.get(functionCall) as messageHandleFunction;
      try {
        if (command.roles.some((role: RoleNames) => message.member.roles.has(roleIds[role]))) {
          command.execute({
            discord: { message: message, client: client },
            custom: { twitterClient: twitterClient }
          });
        } else throw "Unzureichende Berechtigung";
      } catch (error) {
        console.log(error);
      }
    } else console.log(`${functionCall} nicht gefunden`);
  } else if (!message.author.bot) {
    if (message.member.roles.has(roleIds.spinner) || message.member.roles.has(roleIds.trusted)) {
      repeatMessageWithLenny(message);
      addReactionToMessage(message, client, userIds, ruleSet);
    }
  } else console.log("Nachricht von Bot");
};

export const loadCommands = () =>
  new Promise(resolve => {
    let commandCollection = new Collection<string, messageHandleFunction>();
    const commandFiles = fs
      .readdirSync("./dist/commands")
      .filter((file: any) => file.endsWith(".js"));
    let PromiseArr = [];
    for (let file in commandFiles) {
      console.log(commandFiles[file]);
      PromiseArr.push(
        import(path.resolve(__dirname, "..", "./commands", commandFiles[file]))
          .then((command: any) => {
            let innerObject = command[commandFiles[file].split(".")[0]];
            commandCollection.set(innerObject.name, innerObject);
            return;
          })
          .catch((error: any) => console.log({ file: commandFiles[file], error: error }))
      );
    }

    Promise.all(PromiseArr).then(() => {
      console.log("Alle Module erfolgreich geladen");
      return resolve(commandCollection);
    });
  }) as Promise<Collection<string, messageHandleFunction>>;
