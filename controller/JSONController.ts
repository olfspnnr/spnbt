const fs = require("fs");

export const readJsonFile = (fileName: string) =>
  new Promise((resolve, reject) => {
    try {
      return fs.readFile(fileName, (err: boolean, jsonString: string) => {
        if (err) {
          throw err;
        } else {
          return resolve(jsonString);
        }
      });
    } catch (error) {
      return reject({ caller: "readJsonFile", error: error });
    }
  }) as Promise<string>;

export const writeJsonFile = (fileName: string) =>
  new Promise((resolve, reject) => {
    try {
      return fs.writeJsonFile(fileName);
    } catch (error) {}
  }) as Promise<void>;
