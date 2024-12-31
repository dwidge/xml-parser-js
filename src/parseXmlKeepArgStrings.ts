import assert from "assert";

export type XmlItemKeepArgs = {
  name: string;
  argString: string;
  children: (XmlItemKeepArgs | string)[];
};

const parseTag = (
  input: string,
  index: number
):
  | {
      type: "open" | "self-closing";
      name: string;
      argString: string;
      endIndex: number;
    }
  | {
      type: "close";
      name: string;
      endIndex: number;
    }
  | {
      type: "text";
      value: string;
      endIndex: number;
    }
  | null => {
  // Match opening tag with or without attributes
  const openTagMatch = /<(?<name>[a-zA-Z][\w-]*)\s*(?<args>[^>]*)?>/y;
  openTagMatch.lastIndex = index;
  let match = openTagMatch.exec(input);
  if (match?.groups?.name) {
    const name = match.groups.name;
    const args = match.groups.args?.trim() ?? "";
    const isSelfClosing = args?.endsWith("/");
    const argString = isSelfClosing
      ? args.slice(0, -1).trim()
      : args?.trim() || "";

    return {
      type: isSelfClosing ? "self-closing" : "open",
      name: name,
      argString: argString,
      endIndex: openTagMatch.lastIndex,
    };
  }

  // Match closing tag
  const closeTagMatch = /<\/(?<name>[a-zA-Z][\w-]*)>/y;
  closeTagMatch.lastIndex = index;
  match = closeTagMatch.exec(input);
  if (match?.groups?.name) {
    return {
      type: "close",
      name: match.groups.name,
      endIndex: closeTagMatch.lastIndex,
    };
  }

  return null;
};

export const parseXmlKeepArgStrings = (xml: string): XmlItemKeepArgs[] => {
  const result: XmlItemKeepArgs[] = [];
  let currentIndex = 0;

  const parseChildren = (parentName?: string): (XmlItemKeepArgs | string)[] => {
    const children: (XmlItemKeepArgs | string)[] = [];

    while (currentIndex < xml.length) {
      const nextTag = parseTag(xml, currentIndex);

      if (nextTag) {
        currentIndex = nextTag.endIndex;
        if (nextTag.type === "open") {
          const grandChildren = parseChildren(nextTag.name);
          children.push({
            name: nextTag.name,
            argString: nextTag.argString,
            children: grandChildren,
          });
        } else if (nextTag.type === "self-closing") {
          children.push({
            name: nextTag.name,
            argString: nextTag.argString,
            children: [],
          });
        } else if (nextTag.type === "close") {
          if (!parentName || nextTag.name === parentName) {
            return children;
          } else {
            // Handle mismatched closing tags (can be more sophisticated)
            continue;
          }
        }
      } else {
        // Handle text content
        const nextOpenTagIndex = xml.substring(currentIndex).indexOf("<");
        const textEndIndex =
          nextOpenTagIndex === -1
            ? xml.length
            : currentIndex + nextOpenTagIndex;
        const text = xml.substring(currentIndex, textEndIndex).trim();
        if (text) {
          children.push(text);
        }
        currentIndex = textEndIndex;
        if (currentIndex >= xml.length && parentName) {
          return children; // Ensure exit if parent tag expects closing
        }
        if (currentIndex >= xml.length) break;
      }
    }

    return children;
  };

  while (currentIndex < xml.length) {
    const nextTag = parseTag(xml, currentIndex);
    if (nextTag) {
      currentIndex = nextTag.endIndex;
      if (nextTag.type === "open") {
        const children = parseChildren(nextTag.name);
        result.push({
          name: nextTag.name,
          argString: nextTag.argString,
          children: children,
        });
      } else if (nextTag.type === "self-closing") {
        result.push({
          name: nextTag.name,
          argString: nextTag.argString,
          children: [],
        });
      } else if (nextTag.type === "close") {
        // Top-level closing tags are ignored
        continue;
      }
    } else {
      // Ignore top-level text content
      const nextOpenTagIndex = xml.substring(currentIndex).indexOf("<");
      const nextIndex =
        nextOpenTagIndex === -1 ? xml.length : currentIndex + nextOpenTagIndex;
      currentIndex = nextIndex;
      if (currentIndex >= xml.length) break;
    }
  }

  return result;
};
