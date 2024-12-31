export const parseArgString = (argString: string): Record<string, string> => {
  const args: Record<string, string> = {};
  const attributeRegex =
    /(?<key>[a-zA-Z][a-zA-Z0-9_-]*)\s*=\s*"(?<value>(?:\\"|[^"])*)"/g;
  let match;
  while ((match = attributeRegex.exec(argString)) !== null) {
    const key = match.groups?.key;
    const value = match.groups?.value?.replace(/\\"/g, '"');
    if (key !== undefined && value !== undefined) {
      args[key] = value;
    }
  }
  return args;
};
