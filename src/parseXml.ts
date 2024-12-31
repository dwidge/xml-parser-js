import { parseArgString } from "./parseArgString.js";
import {
  parseXmlKeepArgStrings,
  XmlItemKeepArgs,
} from "./parseXmlKeepArgStrings.js";

export type XmlItem = {
  name: string;
  args: Record<string, string>;
  children: (XmlItem | string)[];
};

const convertToXmlItem = (item: XmlItemKeepArgs | string): XmlItem | string => {
  if (typeof item === "string") {
    return item;
  }
  return {
    name: item.name,
    args: parseArgString(item.argString),
    children: item.children.map(convertToXmlItem) as (XmlItem | string)[],
  };
};

export const parseXml = (xml: string): (XmlItem | string)[] => {
  const parsedWithArgStrings = parseXmlKeepArgStrings(xml);
  return parsedWithArgStrings.map(convertToXmlItem);
};
