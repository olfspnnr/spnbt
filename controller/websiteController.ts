import * as path from "path";
import * as express from "express";

const port = process.env.PORT || 8081;

export class Berndsite {
  app: any;
  pathName: string;
  constructor() {
    this.app = undefined;
    this.pathName = "../../berndsite/build";
  }

  public start = () => {
    this.app = express();
    this.app.use(express.static(path.resolve(__dirname, this.pathName)));
    this.app.get("/*", (request: any, response: any) => {
      response.sendFile(path.resolve(__dirname, this.pathName, "index.html"));
    });
    this.app.listen(port);
    console.log("Website Server started on port " + port);
  };

  public getApp = () => this.app;
}
