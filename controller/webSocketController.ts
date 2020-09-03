import { fillStateProp } from "./stateController";
import { readJsonFile, writeJsonFile, checkIfFileExists } from "./JSONController";
import { lovooUserEntry } from "./botController";
import { Client, TextChannel } from "discord.js";
import { channelIds } from "../bot";

export const handleWebSocketMessage = (wsMessage: any, client: Client) => {
  try {
    const { type, payload } = JSON.parse(wsMessage);
    if (
      (handlePayloadType as any)[type] !== undefined &&
      typeof (handlePayloadType as any)[type] === "function"
    ) {
      (handlePayloadType as any)[type](payload, client);
    } else throw `could not find function for ${type}`;
  } catch (error) {
    console.log(error);
  }
};

const handlePayloadType = {
  loadLovoo: (payload: any) => loadLovoo(payload),
  sendMessage: (payload: any, client: Client) => sendToKika(payload, client),
};

const sendToKika = async (payload: string, client: Client) => {
  try {
    const kikaLounge = (await client.channels.fetch(channelIds.kikaloungeText)) as TextChannel;
    const message = await kikaLounge.send(payload, { tts: true });
    message.deletable && message.delete({ timeout: 5000 });
  } catch (error) {
    throw error;
  }
};

const loadLovoo = (payload: any) =>
  fillStateProp("lovooArray", payload)
    .then(async (newState) => {
      try {
        console.log(checkIfFileExists("lovoouser.json"));
        const json = await readJsonFile("lovoouser.json");
        const resp = await writeJsonFile(
          "lovoouser.json",
          JSON.stringify([...((json as lovooUserEntry[]) || []), ...payload])
        );
        console.log(resp);
      } catch (error) {
        console.error(error);
        return;
      }
      console.log(newState);
    })
    .catch((error) => console.log(error));
