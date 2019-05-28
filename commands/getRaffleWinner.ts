import { commandProps, RoleNames, config, roleIds } from "../bot";
import { messageHandleFunction } from "../legacy/messageHandler";
import { TextChannel, DMChannel, GroupDMChannel, GuildMember } from "discord.js";
import * as fs from "fs";
import { readJsonFile, writeJsonFile } from "../controller/JSONController";
import { raffleItem } from "./raffle";
import { stringify } from "querystring";

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
            writeJsonFile(config.raffleFileName, JSON.stringify({ empty: true })).catch(err =>
              console.log({ caller: "getRandomWinner => writeJsonFile", error: err })
            );
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
