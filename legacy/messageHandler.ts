import { commandProps, RoleName } from "../bot";
import { MessageEmbed } from "discord.js";

export interface messageHandleProps {
  roles: RoleName[];
  name: string;
  description: string;
  usage: string;
}

export interface messageHandleFunction extends messageHandleProps {
  execute: (props: commandProps) => void;
  detailedInformation?: { embed: MessageEmbed };
}
