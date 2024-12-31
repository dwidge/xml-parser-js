import { expect } from "expect";
import { describe, it } from "node:test";
import { parseXml, XmlItem } from "./parseXml.js";

describe("parseXml", () => {
  it("should parse an empty XML string", () => {
    const xml = "";
    const expected: XmlItem[] = [];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse a simple XML tag with no attributes or children", () => {
    const xml = "<item></item>";
    const expected: XmlItem[] = [{ name: "item", args: {}, children: [] }];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse an XML tag with attributes", () => {
    const xml = '<item id="123" name="test"></item>';
    const expected: XmlItem[] = [
      { name: "item", args: { id: "123", name: "test" }, children: [] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse an XML tag with text content", () => {
    const xml = "<item>This is some text</item>";
    const expected: XmlItem[] = [
      { name: "item", args: {}, children: ["This is some text"] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse an XML tag with nested tags", () => {
    const xml = "<parent><child>Inner text</child></parent>";
    const expected: XmlItem[] = [
      {
        name: "parent",
        args: {},
        children: [{ name: "child", args: {}, children: ["Inner text"] }],
      },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse an XML tag with mixed content (text and nested tags)", () => {
    const xml =
      "<parent>Some text <child>Inner text</child> more text</parent>";
    const expected: XmlItem[] = [
      {
        name: "parent",
        args: {},
        children: [
          "Some text",
          { name: "child", args: {}, children: ["Inner text"] },
          "more text",
        ],
      },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse multiple top-level XML tags", () => {
    const xml = "<item1></item1><item2>Content</item2>";
    const expected: XmlItem[] = [
      { name: "item1", args: {}, children: [] },
      { name: "item2", args: {}, children: ["Content"] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should handle whitespace around tags", () => {
    const xml = '  <item  id="1"  >  Content  </item>  ';
    const expected: XmlItem[] = [
      { name: "item", args: { id: "1" }, children: ["Content"] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse nested tags with attributes", () => {
    const xml = '<parent><child id="sub1">Inner</child></parent>';
    const expected: XmlItem[] = [
      {
        name: "parent",
        args: {},
        children: [
          { name: "child", args: { id: "sub1" }, children: ["Inner"] },
        ],
      },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should handle self-closing tags (not standard XML, but might be encountered)", () => {
    const xml = '<item id="1" /><item2>Content</item2>';
    const expected: XmlItem[] = [
      { name: "item", args: { id: "1" }, children: [] },
      { name: "item2", args: {}, children: ["Content"] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse attributes with various character combinations", () => {
    const xml =
      '<item name="value with spaces" attr-1="hyphenated" num="123"></item>';
    const expected: XmlItem[] = [
      {
        name: "item",
        args: { name: "value with spaces", "attr-1": "hyphenated", num: "123" },
        children: [],
      },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse XML with leading and trailing text outside the main tags", () => {
    const xml = " leading text <item>Content</item> trailing text ";
    const expected: XmlItem[] = [
      { name: "item", args: {}, children: ["Content"] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should parse XML with text content before and after nested tags", () => {
    const xml = "<parent>before <child>inner</child> after</parent>";
    const expected: XmlItem[] = [
      {
        name: "parent",
        args: {},
        children: [
          "before",
          { name: "child", args: {}, children: ["inner"] },
          "after",
        ],
      },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });

  it("should handle empty tags with attributes", () => {
    const xml = '<item id="empty"></item>';
    const expected: XmlItem[] = [
      { name: "item", args: { id: "empty" }, children: [] },
    ];
    expect(parseXml(xml)).toEqual(expected);
  });
});
