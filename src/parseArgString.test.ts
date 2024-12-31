import { expect } from "expect";
import { describe, it } from "node:test";
import { parseArgString } from "./parseArgString.js";

describe("parseArgString", () => {
  it("should parse an empty attribute string", () => {
    const argString = "";
    const expected = {};
    expect(parseArgString(argString)).toEqual(expected);
  });

  it("should parse a single attribute", () => {
    const argString = 'id="123"';
    const expected = { id: "123" };
    expect(parseArgString(argString)).toEqual(expected);
  });

  it("should parse multiple attributes", () => {
    const argString = 'id="123" name="test"';
    const expected = { id: "123", name: "test" };
    expect(parseArgString(argString)).toEqual(expected);
  });

  it("should handle whitespace around attributes", () => {
    const argString = '  id  =  "123"  name  =  "test"  ';
    const expected = { id: "123", name: "test" };
    expect(parseArgString(argString)).toEqual(expected);
  });

  it("should handle attributes with various character combinations", () => {
    const argString = 'name="value with spaces" attr-1="hyphenated" num="123"';
    const expected = {
      name: "value with spaces",
      "attr-1": "hyphenated",
      num: "123",
    };
    expect(parseArgString(argString)).toEqual(expected);
  });

  it("should handle empty attribute values", () => {
    const argString = 'empty=""';
    const expected = { empty: "" };
    expect(parseArgString(argString)).toEqual(expected);
  });

  it("should handle attributes with quotes inside values", () => {
    const argString = 'text="value with \\"quotes\\""';
    const expected = { text: 'value with "quotes"' };
    expect(parseArgString(argString)).toEqual(expected);
  });
});
