import { generalFunctionProps } from "../bot";

export interface messageHandle {
  roles: string[];
  functions: messageHandleFunction[];
}

export interface messageHandleFunction {
  name: string;
  description: string;
  execute: (props: generalFunctionProps) => void[];
}
