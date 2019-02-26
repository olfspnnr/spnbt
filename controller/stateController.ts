import { userToRename } from "../commands/renameUser";
import { lovooUserEntry } from "./botController";
import { Collection } from "discord.js";
import { messageHandleFunction } from "../legacy/messageHandler";
import { joke } from "../commands/joke";

export interface State {
  [key: string]: any;
  renameUser?: userToRename[];
  isPlayingAudio?: boolean;
  isInspiring?: boolean;
  lovooArray?: lovooUserEntry[];
  commands?: Collection<string, messageHandleFunction>;
  reloadCommands?: () => void;
  jokes?: joke[];
}

export const setStateProp = (propName: string, valueToSet: any) =>
  new Promise((resolve, reject) => {
    if (currentState[propName] === undefined) {
      currentState = { ...currentState, [propName]: valueToSet };
      return resolve(currentState);
    } else if (typeof currentState[propName] === "object") {
      if (currentState[propName].length !== undefined) {
        currentState[propName] = [...currentState[propName], ...valueToSet];
      } else {
        currentState[propName] = { ...currentState[propName], ...valueToSet };
      }
      return resolve(currentState);
    }
    return reject(false);
  });

export const setState = (newState: State) =>
  new Promise((resolve, reject) => {
    try {
      currentState = { ...currentState, ...newState };
      return resolve(currentState);
    } catch (error) {
      console.log("state error");

      return reject(error);
    }
  }) as Promise<State>;

export const getState = () => ({ ...currentState } as State);

export const getStateProp = (propName: string) => (({ ...currentState } as State)[propName]);

let currentState = {
  renameUser: [],
  isPlayingAudio: false,
  isInspiring: false,
  lovooArray: [],
  commands: new Collection(),
  reloadCommands: undefined,
  jokes: undefined
} as State;
