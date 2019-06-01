import { commandProps, RoleNames, config, roleIds, channelIds, auth } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import {
  TextChannel,
  DMChannel,
  GroupDMChannel,
  GuildMember,
  Client,
  Message,
  MessageCollector
} from "discord.js";
import * as fs from "fs";
import { readJsonFile, writeJsonFile } from "../controller/JSONController";
import { raffleItem } from "./raffle";
import { stringify } from "querystring";
const auth: auth = require("../../configs/auth.json");

export const getRandomWinner = (messageChannel: DMChannel | TextChannel | GroupDMChannel) => {
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  console.log("test");
  return new Promise((resolve, reject) => {
    if (fs.existsSync(config.raffleFileName)) {
      console.log("test");

      readJsonFile(config.raffleFileName).then(data => {
        if (
          (data as any).empty === undefined &&
          (data as raffleItem[]).some(usr => usr.hasEnteredRaffle)
        ) {
          let userList: raffleItem[] = data as any;
          const finalList = userList.filter(usr => usr.hasEnteredRaffle);
          const winningNumber = getRandomInt(0, finalList.length - 1);
          const winningId = finalList[winningNumber].id;
          const winnerArray = (messageChannel as TextChannel).guild.members
            .filter(usr => usr.id === winningId)
            .array();
          if (winnerArray.length > 1) {
            return reject("Es scheint, als gäbe es mehr als einen User mit der GewinnerID?");
          } else if (winnerArray.length === 0) {
            return reject("Es scheint, als würde es keinen mit der GewinnerId geben");
          } else {
            const winner = winnerArray[0];

            return resolve({
              name: `${winner.nickname !== null ? winner.nickname + " /" : ""} ${
                winner.displayName
              } / ${winner.user.username}`,
              winner: winner
            });
          }
        } else reject("Es scheint, als hätte keiner hat am Raffle teilgenommen 😭😭😭😭😭");
      });
    } else reject({ caller: "getRandomWinner", error: "Raffle Datei existiert nicht." });
  }) as Promise<{ name: string; winner: GuildMember }>;
};

export const askIfWinnerWantsHisPrize = (channel: DMChannel) =>
  new Promise((resolve, reject) => {
    channel
      .send(
        `Möchtest du deinen Preis entgegen nehmen?\n(${
          config.raffleWinDescription
        })\nDu hast 5 Minuten Zeit\nJ/N?`
      )
      .then((msg: Message) => {
        let messageCollector = new MessageCollector(
          channel,
          (message: Message) => message.author === channel.recipient,
          { max: 1, time: 60000 * 5 }
        );
        messageCollector.on("end", (collected, reason) => {
          if (collected.first() !== undefined) {
            let answer = collected.first().content.toLowerCase();
            if (answer === "j" || answer === "ja") {
              msg.edit("Yay!");
              return resolve();
            } else if (answer === "n" || answer === "nein") {
              msg.edit("Okay :(");
              return reject();
            } else {
              msg.edit("Das habe ich nicht verstanden - also möchtest du wohl nicht :(");
              return reject();
            }
          } else {
            msg.edit("Leider hast du nicht reagiert :(");
            return reject();
          }
        });
      });
  }) as Promise<void>;

const cleanUpJsonFiles = () => {
  readJsonFile("./configs/auth.json").then((authJson: auth) => {
    let authJsonTemp: auth = { ...authJson, raffleWin: -1 };
    writeJsonFile("./configs/auth.json", JSON.stringify(authJsonTemp))
      .then(() => {
        console.log("Cleaned auth");
      })
      .catch(error => console.log({ caller: "raffleWin", error: error }));
  });
  readJsonFile("./configs/config.json").then((configJson: config) => {
    let configJsonTemp: config = {
      ...configJson,
      raffleWinDescription: -1
    };
    writeJsonFile("./configs/config.json", JSON.stringify(configJsonTemp))
      .then(() => {
        console.log("Cleaned config");
      })
      .catch(error => console.log({ caller: "raffleWin", error: error }));
  });
  writeJsonFile(config.raffleFileName, JSON.stringify({ empty: true })).catch(err =>
    console.log({ caller: "getRandomWinner => writeJsonFile", error: err })
  );
};

const winnerAcceptsPrize = (client: Client, channel: DMChannel, winner: GuildMember) => {
  channel
    .send("Glückwunsch!!! 🍀 Hier dein Gewinn, du Gewinnerkönig du! 👑🎁🎉")
    .then((msg: Message) =>
      msg.channel
        .send(
          auth.raffleWin && auth.raffleWin !== -1
            ? auth.raffleWin
            : "Hier könnte ein Gewinn stehen.",
          { code: true }
        )
        .then(() =>
          (client.channels.get(channelIds.kikaloungeText) as TextChannel)
            .send(
              `🎉 <@&${roleIds.raffleTeilnehmer}> höret und frohlocket! ✨\n🎊 ${
                winner.displayName
              }${
                winner.nickname !== winner.displayName && winner.nickname !== null
                  ? "alias " + winner.nickname
                  : ""
              } 🎈\n🎁 nahm soeben sein Gewinn entgegen! 🍀\n🔥 😎 🔥`
            )
            .then(() => cleanUpJsonFiles())
            .catch(error => console.log({ caller: "raffleWin", error: error }))
        )
        .catch(error => console.log({ caller: "raffleWin", error: error }))
    )
    .catch(error => console.log({ caller: "raffleWin", error: error }));
};

export const winnerRejectsPrize = (client: Client, channel: DMChannel, winner: GuildMember) => {
  channel
    .send("Schade ☹ kein Gewinn für dich, wie es ausschaut... 😭👎")
    .then((msg: Message) =>
      msg.channel
        .send("Hier würde ein Gewinn stehen 🎁💀", { code: true })
        .then(() =>
          (client.channels.get(channelIds.kikaloungeText) as TextChannel)
            .send(
              `🎉 <@&${roleIds.raffleTeilnehmer}> höret und staunet! ✨\n⁉ ${winner.displayName}${
                winner.nickname !== winner.displayName && winner.nickname !== null
                  ? "alias " + winner.nickname
                  : ""
              } ❓\n🎁 hat seinen Gewinn nicht entgegen genommen!\n\nDas bedeutet ihr habt wieder eine Chance auf diesen Gewinn!`
            )
            .then((msg: Message) => msg.react("❓"))
            .catch(error => console.log({ caller: "raffleWin", error: error }))
        )
        .catch(error => console.log({ caller: "raffleWin", error: error }))
    )
    .catch(error => console.log({ caller: "raffleWin", error: error }));
};

export const handleRaffleTime = (client: Client) => {
  getRandomWinner(client.channels.get(channelIds.kikaloungeText) as TextChannel)
    .then(pckg => {
      (client.channels.get(channelIds.kikaloungeText) as TextChannel).send(
        " du wurdest im Raffle gezogen und hast damit gewonnen! Glückwunsch!",
        { reply: pckg.winner }
      );
      pckg.winner
        .createDM()
        .then(dmchannel =>
          askIfWinnerWantsHisPrize(dmchannel)
            .then(() => winnerAcceptsPrize(client, dmchannel, pckg.winner))
            .catch(() => winnerRejectsPrize(client, dmchannel, pckg.winner))
        )
        .catch(error => console.log({ caller: "raffleWin", error: error }));
    })
    .catch(error => (client.channels.get(channelIds.kikaloungeText) as TextChannel).send(error));
};
