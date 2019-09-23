import * as React from "react";
import { PortalState } from "./Portal";

type TableProps = {
  tableData: any[];
  filter: ((array: any[]) => any[])[];
} & PortalState;

export const Table = (props: TableProps) => {
  return <div></div>;
};
