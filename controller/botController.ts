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
  DMChannel,
} from "discord.js";
import {
  audioQueue,
  roleIds,
  channelIds,
  UserIds,
  config,
  userIds,
  commandProps,
  RoleName,
} from "../bot";
import * as ytdl from "ytdl-core";
import { userToRename } from "../commands/renameUser";
import { messageHandleFunction } from "../legacy/messageHandler";
import * as path from "path";
import { fillStateProp, getStateProp, getState, setState } from "./stateController";
import { audioQueueElement } from "./audioQueue";
import * as fs from "fs";

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

export interface wsMessage {
  type: string;
  payload: any;
}

export const ruleSet = [
  { user: "olaf", reactionsToAdd: ["💕"] },
  { user: "nils", reactionsToAdd: ["katze1"] },
  { user: "justus", reactionsToAdd: ["pille"] },
  { user: "marcel", reactionsToAdd: ["daddy"] },
  { user: "franny", reactionsToAdd: ["🔥"] },
  { user: "adrian", reactionsToAdd: ["💩"] },
] as reactionRuleSet[];

export interface reactionRuleSet {
  user: string;
  reactionsToAdd: string[];
}

export const replyToMessageWithLenny = (message: Message) => {
  if (message.content.toLowerCase().includes("lenny")) {
    if (message.content.toLowerCase().includes("lenny")) {
      if (
        message.content.toLowerCase().includes("ich ") ||
        message.content.toLowerCase().includes(" ich")
      ) {
        message.channel.send("*hust*").then((msg: Message) => msg.deletable && msg.delete(150000));
      } else if (
        message.content.toLowerCase().includes("bernd ") ||
        message.content.toLowerCase().includes(" bernd")
      ) {
        message.channel.send("frech").then((msg: Message) => msg.deletable && msg.delete(150000));
      } else {
        let messageWithLenny = message.content.toLowerCase().split("lenny").join("(͡° ͜ʖ ͡°)");
        message.channel.send(messageWithLenny).then((msg: Message) => {
          msg.deletable && msg.delete(15000);
          message.deletable && message.delete(240);
        });
      }
    }
  }
};

export const repeatMessageWithLenny = (message: Message) => {
  if (message.content.toLowerCase().includes("lenny")) {
    if (
      message.content.toLowerCase().includes("ich ") ||
      message.content.toLowerCase().includes(" ich")
    ) {
      message.channel.send("*hust*").then((msg: Message) => msg.deletable && msg.delete(15000));
    } else {
      message.channel.send(
        message.content.split("lenny").join("( ͡° ͜ʖ ͡°)").split("Lenny").join("(͡° ͜ʖ ͡°)")
      );
    }

    message.deletable && message.delete(250);
  }
};

export const stripMemberOfAllRoles = (member: GuildMember) =>
  new Promise((resolve, reject) =>
    member
      .removeRoles(member.roles)
      .then((member) => resolve(member))
      .catch((error) => reject(error))
  );

export const checkIfMemberHasntRolesAndAssignRoles = (
  client: Client,
  newMember: GuildMember,
  rolesToCheck: string[],
  rolesToAdd: RoleName[]
) => {
  let checkRoles = rolesToCheck.some((role) => newMember.roles.has(role));
  console.log({ checkRole: checkRoles });
  if (!checkRoles) {
    assignRolesToMember(client, newMember, rolesToAdd);
  }
};

export const assignRolesToMember = (
  client: Client,
  newMember: GuildMember,
  rolesToAdd: RoleName[]
) => {
  rolesToAdd.map((role) => {
    newMember
      .addRole(roleIds[role])
      .then(() =>
        (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
          `<@${newMember.user.id}> dir wurde folgende Rolle zugewiesen: "${
            newMember.guild.roles.get(roleIds[role]).name
          }". ${
            roleIds[role] === roleIds.uninitiert
              ? "Willkommen! Schnapp dir einen Medizinball und gesell dich dazu\nSolltest du nicht in der Lage sein zu Sprechen, musst du einmal reconnecten\n(unten links den Hörer auflegen)"
              : ""
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
  const collector = new MessageCollector(
    message.channel,
    (m) => m.author.id === message.author.id,
    {
      time: 60 * 1000,
    }
  );
  collector.on("collect", async (followUpMessage: Message, currentCollector: MessageCollector) => {
    if (followUpMessage.member.user.id === userIdOfMessage) {
      try {
        await reaction.remove();
        return currentCollector.stop();
      } catch (error) {
        throw console.error({ caller: "reactionDeletionHandler", error: error });
      }
    } else return;
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
        filter: "audioonly",
      }).on("info", (info) => {
        audioElement = {
          message: message,
          youtube: false,
          audioObject: { length: info.length_seconds, stream: youtubeStream as any },
        };
        return resolve(audioElement);
      });
    } catch (error) {
      (error: any) => reject(error);
    }
  });

export const handleNameChange = (userToChange: GuildMember) => {
  let renameUser = getStateProp("renameUser") as userToRename[];
  if (renameUser) {
    renameUser.map((rename) => {
      if (rename.id === userToChange.id && rename.isBeingRenamed) {
        userToChange.setNickname(rename.renameTo || userToChange.user.username);
      }
    });
  }
};

export const addReactionToMessage = (
  message: Message,
  client: Client,
  userIds?: UserIds,
  rulesets?: reactionRuleSet[],
  reactionAdd?: string
) => {
  if (ruleSet && userIds) {
    rulesets.map((ruleset) => {
      let emoji: Emoji | string = undefined;
      ruleSet.map(({ user, reactionsToAdd }) => {
        if (userIds[user] === message.member.id) {
          reactionsToAdd.map((reactionToAdd: string) => {
            emoji = client.emojis.find((emoji) => emoji.name === reactionToAdd);
            if (!emoji) {
              emoji = reactionToAdd;
            }
            if (message.member.user.id === userIds[ruleset.user]) {
              message.channel.fetchMessages({ limit: 10 }).then((messages) => {
                messages.map((fetchedMessage) => {
                  fetchedMessage.reactions.map((reaction) => {
                    if (reaction.me && fetchedMessage.author.id == message.member.user.id) {
                      reaction.remove();
                    }
                  });
                });
                message
                  .react(emoji)
                  // .then(reaction => reactionDeletionHandler(message, reaction, userIds[ruleset.user]))
                  .catch((error) => console.log(error));
              });
            }
          });
        }
      });
    });
  } else {
    let emoji: Emoji | string = undefined;
    emoji = client.emojis.find((emoji) => emoji.name === reactionAdd);
    if (!emoji) {
      emoji = reactionAdd;
    }
    message.channel.fetchMessages({ limit: 10 }).then((messages) => {
      messages.map((fetchedMessage) => {
        fetchedMessage.reactions.map((reaction) => {
          if (reaction.me && fetchedMessage.author.id == message.member.user.id) {
            reaction.remove();
          }
        });
        message
          .react(emoji)
          // .then(reaction => reactionDeletionHandler(message, reaction, userIds[ruleset.user]))
          .catch((error) => console.log(error));
      });
    });
  }
};

export const getUserDifferences = (oldMember: GuildMember, newMember: GuildMember) => {
  console.log(`Something changed with [${oldMember.user.username}/${oldMember.displayName}]`);
  let differences = {};
  Object.keys(oldMember).map((key) => {
    Object.keys(newMember).map((newKey) => {
      if ((oldMember as any)[newKey] !== (newMember as any)[newKey]) {
        (differences as any)[newKey] = `${(oldMember as any)[newKey]} => ${
          (newMember as any)[newKey]
        }`;
      }
    });
  });
  let different = Object.keys(differences)
    .map((key) => `${key}: ${(differences as any)[key]}`)
    .join(";\n");
  console.log(different);

  return different;
};

export const handleVoiceStateUpdate = (
  oldMember: GuildMember,
  newMember: GuildMember,
  client: Client
) => {
  const date = new Date();
  const [hours, minutes] = [
    date.getHours() > 9 ? date.getHours() : "0" + date.getHours(),
    date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes(),
  ];
  if (oldMember.voiceChannel === undefined && newMember.voiceChannel !== undefined) {
    (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
      `[${hours}:${minutes}] ${newMember.user.username}/${newMember.displayName} joined.`
    );
  } else if (newMember.voiceChannel === undefined) {
    (client.channels.get(channelIds.halloweltkanalText) as TextChannel).send(
      `[${hours}:${minutes}] ${oldMember.user.username}/${oldMember.displayName} left.`
    );
  } else if (newMember.voiceChannel !== undefined && oldMember.voiceChannel !== undefined) {
    return getUserDifferences(oldMember, newMember);
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

const _handleGeneralCatch = async (message: Message) => {
  try {
    await setState({ isPlayingAudio: false });
    const msg = await message.channel.send(
      `Could not play link; Invalid Link? Not connected to Voice Channel?`
    );
    if (message.deletable) {
      await message.delete();
      if ((msg as Message).deletable) {
        await (msg as Message).delete();
      }
    }
  } catch (error) {
    throw error;
  }
};

const _handleOtherStream = async (
  dispatcher: StreamDispatcher,
  message: Message,
  audioObject: any,
  volume: number
) => {
  try {
    const voiceChannel = message.member.voiceChannel;
    if (voiceChannel === undefined || voiceChannel === null) {
      throw new Error("Not connected to voicechannel");
    }
    const connection = await voiceChannel.join();
    await setState({ isPlayingAudio: true });
    dispatcher = createDispatcher(
      message,
      voiceChannel,
      audioObject.stream,
      volume,
      audioObject.length,
      {
        command: "!stop",
        function: (dispatcher: StreamDispatcher, collector) => {
          collector.stop();
          dispatcher.end();
          return async () => {
            try {
              await setState({ isPlayingAudio: false });

              return;
            } catch (error) {
              throw error;
            }
          };
        },
      }
    ).dispatcher.on("end", async () => {
      try {
        await setState({ isPlayingAudio: false });
        return;
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    await setState({ isPlayingAudio: false });
    throw error;
  }
};

const _handleYouTubeStream = async (
  info: any,
  message: Message,
  dispatcher: StreamDispatcher,
  youtubeStream: any,
  volume: number
) => {
  try {
    const voiceChannel = message.member.voiceChannel;
    if (voiceChannel === undefined || voiceChannel === null) {
      const dmChannel = await message.member.createDM();
      await dmChannel.send(
        "Du kannst keine Sounds abspielen, wenn du dich nicht in einem Voicechannel befindest."
      );
      await setState({ isPlayingAudio: false });
      return;
    } else {
      await voiceChannel.join();
      if (voiceChannel.connection) {
        await setState({ isPlayingAudio: true });
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
              dispatcher.end();
              return async () => {
                try {
                  await setState({ isPlayingAudio: false });
                } catch (error) {
                  throw error;
                }
              };
            },
          }
        ).dispatcher.on("end", async () => await setState({ isPlayingAudio: false }));
      } else {
        const connection = await voiceChannel.join();
        await setState({ isPlayingAudio: true });
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
                return () => setState({ isPlayingAudio: false }).then(() => dispatcher.end());
              },
            }
          ).dispatcher.on("end", () => {});
        } catch (error) {
          setState({ isPlayingAudio: false });
        }
      }
    }
  } catch (error) {
    await setState({ isPlayingAudio: false });
    throw error;
  }
};

const _handleYouTubeLink = async (
  url: string,
  message: Message,
  dispatcher: StreamDispatcher,
  volume: number
) => {
  try {
    const youtubeStream: any = ytdl(url, {
      filter: "audioonly",
    }).on(
      "info",
      async (info) => await _handleYouTubeStream(info, message, dispatcher, youtubeStream, volume)
    );
    if (youtubeStream === undefined) {
      throw new Error("Stream is undefined");
    }
    if (dispatcher) {
      dispatcher.on("end", async () => await setState({ isPlayingAudio: false }));
    }
    youtubeStream.on("error", async (error: any) => {
      try {
        await setState({ isPlayingAudio: false });
        throw new Error(error);
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};

export const playAudio = async (
  message: Message,
  isYoutubeLink: boolean,
  url?: string,
  audioObject?: { stream: ReadableStream; length: number },
  volume?: number | undefined
) => {
  try {
    const isPlayingAudio: boolean = getStateProp("isPlayingAudio");
    try {
      if (isPlayingAudio) {
        throw new Error("Is already playing Audio");
      } else {
        let dispatcher: StreamDispatcher;

        if (isYoutubeLink) {
          _handleYouTubeLink(url, message, dispatcher, volume);
        } else {
          _handleOtherStream(dispatcher, message, audioObject, volume);
        }
      }
    } catch (error) {
      _handleGeneralCatch(message);
      throw error;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createCollector = (
  message: Message,
  timeToDeletion: number,
  externalProptertyForFunction?: any,
  ...triggerMessages: commandBlock[]
) => {
  let triggerMessagesRef = [...triggerMessages];
  let collector = new MessageCollector(
    message.channel,
    (m: Message) => m.author.id === message.author.id || m.member.hasPermission("KICK_MEMBERS"),
    {
      time: timeToDeletion,
    }
  );
  collector.on("collect", (followUpMessage: Message) => {
    try {
      if (triggerMessagesRef.filter((msg) => msg.command === followUpMessage.content)[0]) {
        if (
          followUpMessage.content ===
          triggerMessagesRef.filter((msg) => msg.command === followUpMessage.content)[0].command
        ) {
          triggerMessagesRef
            .filter((msg) => msg.command === followUpMessage.content)[0]
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
      volume: volume || 0.5,
    })
    .on("end", (end) => {
      message.delete();
      // voiceChannel.leave();
      setState({ isPlayingAudio: false });
    });
  return {
    collector: createCollector(message, length * 1000, dispatcher, ...blocks),
    dispatcher: dispatcher,
  };
};

export const sendGeneratedPerson = async (message: Message, client: Client) => {
  try {
    const resp: Response = await fetch(
      "https://thispersondoesnotexist.com/image?" + new Date().getTime()
    );
    if (resp.ok) {
      const arrayBuffer = await (resp as any).buffer();
      // const buffer = Buffer.from(arrayBuffer);
      const attachment = new Attachment(arrayBuffer);
      const channel = message.channel;
      if (attachment) {
        if (message.deletable) {
          await message.delete(5);
        }
        const msg = await channel.send(attachment);
        if ((msg as Message).deletable) {
          (msg as Message).delete(120000);
        }
        return;
      } else {
        if (message.deletable) {
          await message.delete(5);
        }
        throw new Error("Attachment seems broken");
      }
    } else {
      throw new Error("Response did not indicate success");
    }
  } catch (error) {
    throw error;
  }
};

export const sendInspiringMessage = (message: Message, client: Client) =>
  new Promise((resolve, reject) => {
    fetch("http://inspirobot.me/api?generate=true")
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        const attachment = new Attachment(data);
        message.channel
          .send(attachment as MessageOptions)
          .then((msg) => {
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
                    .catch((error) =>
                      message.channel
                        .send("Fehler beim Speichern des Bildes :(")
                        .then((errorMsg: Message) => errorMsg.delete(12000))
                    );
                },
              },
              {
                command: "!inspire",
                function: (extProp: any, collector: MessageCollector) => {
                  collector.stop();
                },
              }
            );
            if (message.delete) message.delete();
            console.log(data);
            (msg as Message).delete(120000);
            return resolve(attachment as MessageOptions);
          })
          .catch((error) => reject(error));
      });
  });

export const handleMessageCall = (message: Message, client: Client, twitterClient: any) => {
  if (message.guild === null && message.channel instanceof DMChannel) {
    writeToLogChannel(`DM: ${message.content || "EMPTY"}`, client);
    return console.log(`directMessage => ${message.author.username}: ${message.content}`);
  }
  console.log(`${message.member.displayName}/${message.member.user.username}: ${message.content}
      `);
  console.log(`${message.content.split(" ").shift()}`);
  let functionCall = message.content.split(" ")[0].slice(1);
  let currentState = getState();
  if (currentState.commands === undefined) {
    return console.log({ caller: "handleMessageCall", error: "no commands were loaded" });
  }
  if (message.content.startsWith(config.prefix) && !message.author.bot) {
    if (currentState.commands.has(functionCall)) {
      let command = currentState.commands.get(functionCall) as messageHandleFunction;
      try {
        if (command.roles.some((role: RoleName) => message.member.roles.has(roleIds[role]))) {
          command.execute({
            discord: { message: message, client: client },
            custom: {
              twitterClient: twitterClient,
              jokes: currentState.jokes,
            },
          } as commandProps);
        } else throw "Unzureichende Berechtigung";
      } catch (error) {
        return console.log({ caller: "handleMessageCall", error: error });
      }
    } else console.log(`${functionCall} nicht gefunden`);
  } else if (message.content.startsWith(config.helpPrefix) && !message.author.bot) {
    if (currentState.commands.has(functionCall)) {
      let command = currentState.commands.get(functionCall) as messageHandleFunction;
      try {
        if (command.roles.some((role: RoleName) => message.member.roles.has(roleIds[role]))) {
          message.author
            .createDM()
            .then((channel) =>
              channel.send(
                command.detailedInformation || "Keine detailierte Beschreibung vorhanden."
              )
            );
          message.deletable && message.delete(250);
        } else throw "Unzureichende Berechtigung";
      } catch (error) {
        return console.log({ caller: "handleMessageCall", error: error });
      }
    }
  } else if (!message.author.bot) {
    if (message.member.roles.has(roleIds.spinner) || message.member.roles.has(roleIds.trusted)) {
      replyToMessageWithLenny(message);
      return addReactionToMessage(message, client, userIds, ruleSet);
    }
  } else return console.log("Nachricht von Bot");
};

export const loadCommands = () =>
  new Promise((resolve) => {
    let commandCollection = new Collection<string, messageHandleFunction>();
    try {
      fs.readdir("./dist/commands", (err: NodeJS.ErrnoException, files: string[]) => {
        if (err) {
          throw err;
        }
        const commandFiles = files.filter((file: any) => file.endsWith(".js"));
        let PromiseArr = [];
        for (let file in commandFiles) {
          console.log(commandFiles[file]);
          if (file !== "reloadCommands.js" && file !== "botController.js")
            delete require.cache[path.resolve(__dirname, "..", "./commands", commandFiles[file])];

          PromiseArr.push(
            import(path.resolve(__dirname, "..", "./commands", commandFiles[file]))
              .then((command: any) => {
                let innerObject = command[commandFiles[file].split(".")[0]];
                commandCollection.set(innerObject.name, innerObject);
              })
              .catch((error: any) => console.log({ file: commandFiles[file], error: error }))
          );
        }
        Promise.all(PromiseArr).then((arr) => {
          if (arr.some((entry) => !(entry as any))) {
            console.log("Module mit Fehler geladen");
          } else console.log("Alle Module erfolgreich geladen");

          return resolve(commandCollection);
        });
      });
    } catch (error) {
      console.log(error);
      return resolve();
    }
  }) as Promise<Collection<string, messageHandleFunction>>;

export const writeToLogChannel = (
  message: string | string[],
  client: Client,
  original?: Message
) => {
  const logChannel = client.channels.find((entry: TextChannel) =>
    entry.name.toLowerCase().includes("bernd-log")
  );
  if (logChannel) {
    (logChannel as TextChannel)
      .send("---\n")
      .then(() => {
        try {
          if (message === "" || message === undefined || message === null) {
            throw "message is empty";
          }
          if (original) {
            let { attachments } = original;
            if (attachments.array.length === 0) {
              (logChannel as TextChannel).send(message).catch((error) => {
                console.error({ caller: "writeToLogChannel", error: error });
              });
            } else {
              (logChannel as TextChannel)
                .send(message || "EMPTY", {
                  attachment: attachments || null,
                } as MessageOptions)
                .catch((error) => {
                  console.error({ caller: "writeToLogChannel", error: error });
                });
            }
            if (attachments.map((entry) => entry.proxyURL).length > 0) {
              (logChannel as TextChannel)
                .send(attachments.map((entry) => entry.proxyURL) || ["EMPTY"], {
                  split: true,
                })
                .catch((error) => {
                  console.error({ caller: "writeToLogChannel", error: error });
                });
            }
          } else {
            (logChannel as TextChannel)
              .send(message || "EMPTY", {
                split: true,
              })
              .catch((error) => {
                console.error({ caller: "writeToLogChannel", error: error });
              });
          }
        } catch (error) {
          console.error({ caller: "writeToLogChannel", error: error });
        }
      })
      .catch((error) => console.error({ caller: "writeToLogChannel", error: error }));
  } else console.error({ caller: "writeToLogChannel", error: "LogChannel missing" });
};
