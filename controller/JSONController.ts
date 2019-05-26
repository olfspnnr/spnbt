import * as fs from "fs";

export const checkIfFileExists = (fileName: string) =>
  new Promise((resolve, reject) => {
    fs.access(`./${fileName}`, err => {
      if (err) return reject();
      else return resolve();
    });
  }) as Promise<void>;

export const readJsonFile = (fileName: string) =>
  new Promise((resolve, reject) => {
    try {
      fs.access(`./${fileName}`, err => {
        if (err) throw err;
        return fs.readFile(`./${fileName}`, (err, data) => {
          if (err) {
            throw err;
          } else {
            console.log(data);
            return resolve(JSON.parse(data as any));
          }
        });
      });
    } catch (error) {
      return reject({ caller: "readJsonFile", error: error });
    }
  }) as Promise<object>;

export const writeJsonFile = (fileName: string, content: string) =>
  new Promise((resolve, reject) => {
    let tempContent = content;
    try {
      return fs.writeFile(`./${fileName}`, tempContent, (error: string | object | boolean) => {
        if (error) {
          throw error;
        } else return resolve();
      });
    } catch (error) {
      return reject({ caller: "writeJsonFile", error: error });
    }
  }) as Promise<void>;
