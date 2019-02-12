import { commandProps, RoleNames } from "../bot";

export interface messageHandleFunction {
  roles: RoleNames[];
  name: string;
  description: string;
  usage: string;
  execute: (props: commandProps) => void;
}

class MessageHandler {
  constructor() {}
}
