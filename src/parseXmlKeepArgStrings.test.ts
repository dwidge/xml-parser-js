import { expect } from "expect";
import { describe, it } from "node:test";
import { parseXmlKeepArgStrings } from "./parseXmlKeepArgStrings.js";

describe("parseXmlKeepArgStrings", () => {
  it("should parse an empty XML string", () => {
    const xml = "";
    const expected: { name: string; argString: string; children: any[] }[] = [];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse a simple XML tag with no attributes or children", () => {
    const xml = "<item></item>";
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: "", children: [] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse an XML tag with attributes, keeping the arg string", () => {
    const xml = '<item id="123" name="test"></item>';
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: 'id="123" name="test"', children: [] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse an XML tag with text content", () => {
    const xml = "<item>This is some text</item>";
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: "", children: ["This is some text"] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse an XML tag with nested tags", () => {
    const xml = "<parent><child>Inner text</child></parent>";
    const expected: { name: string; argString: string; children: any[] }[] = [
      {
        name: "parent",
        argString: "",
        children: [{ name: "child", argString: "", children: ["Inner text"] }],
      },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse an XML tag with mixed content (text and nested tags)", () => {
    const xml =
      "<parent>Some text <child>Inner text</child> more text</parent>";
    const expected: { name: string; argString: string; children: any[] }[] = [
      {
        name: "parent",
        argString: "",
        children: [
          "Some text",
          { name: "child", argString: "", children: ["Inner text"] },
          "more text",
        ],
      },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse multiple top-level XML tags", () => {
    const xml = "<item1></item1><item2>Content</item2>";
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item1", argString: "", children: [] },
      { name: "item2", argString: "", children: ["Content"] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should handle whitespace around tags, keeping arg string", () => {
    const xml = '  <item  id="1"  >  Content  </item>  ';
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: 'id="1"', children: ["Content"] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse nested tags with attributes, keeping arg strings", () => {
    const xml = '<parent><child id="sub1">Inner</child></parent>';
    const expected: { name: string; argString: string; children: any[] }[] = [
      {
        name: "parent",
        argString: "",
        children: [
          { name: "child", argString: 'id="sub1"', children: ["Inner"] },
        ],
      },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should handle self-closing tags, keeping arg string", () => {
    const xml = '<item id="1" /><item2>Content</item2>';
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: 'id="1"', children: [] },
      { name: "item2", argString: "", children: ["Content"] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse attributes with various character combinations, keeping arg string", () => {
    const xml =
      '<item name="value with spaces" attr-1="hyphenated" num="123"></item>';
    const expected: { name: string; argString: string; children: any[] }[] = [
      {
        name: "item",
        argString: 'name="value with spaces" attr-1="hyphenated" num="123"',
        children: [],
      },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse XML with leading and trailing text outside the main tags", () => {
    const xml = " leading text <item>Content</item> trailing text ";
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: "", children: ["Content"] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should parse XML with text content before and after nested tags", () => {
    const xml = "<parent>before <child>inner</child> after</parent>";
    const expected: { name: string; argString: string; children: any[] }[] = [
      {
        name: "parent",
        argString: "",
        children: [
          "before",
          { name: "child", argString: "", children: ["inner"] },
          "after",
        ],
      },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });

  it("should handle empty tags with attributes, keeping arg string", () => {
    const xml = '<item id="empty"></item>';
    const expected: { name: string; argString: string; children: any[] }[] = [
      { name: "item", argString: 'id="empty"', children: [] },
    ];
    expect(parseXmlKeepArgStrings(xml)).toEqual(expected);
  });
});
