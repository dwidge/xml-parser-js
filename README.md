# @dwidge/xml-parser

A lightweight XML parser for JavaScript.

This library provides a simple way to parse XML strings into a structured JavaScript object representation.

Compared to other XML parsing libraries that can often be multi-megabyte downloads due to their extensive feature sets and dependencies, `@dwidge/xml-parser` offers a lightweight and minimal alternative. If you need basic XML parsing functionality without the overhead of large dependencies, this library may be a better choice.

## Features

- Parses XML strings into an array of strings or objects.
- Handles nested tags and attributes.
- Supports mixed content (text and nested tags).
- Zero dependencies.

## Installation

```bash
npm install @dwidge/xml-parser
# or
yarn add @dwidge/xml-parser
# or
pnpm add @dwidge/xml-parser
```

## Usage

```javascript
import { parseXml, XmlItem } from "@dwidge/xml-parser";

const xmlString =
  '<book title="The Great Gatsby"><author>F. Scott Fitzgerald</author></book>';

const parsedXml: (string | XmlItem)[] = parseXml(xmlString);

console.log(JSON.stringify(parsedXml, null, 2));
/*
[
  {
    "name": "book",
    "args": {
      "title": "The Great Gatsby"
    },
    "children": [
      {
        "name": "author",
        "args": {},
        "children": [
          "F. Scott Fitzgerald"
        ]
      }
    ]
  }
]
*/
```

### XmlItem Interface

The parser returns `(string | XmlItem)[]`, where each `XmlItem` represents an XML tag.

```typescript
interface XmlItem {
  name: string;
  args: { [key: string]: string };
  children: (string | XmlItem)[];
}
```

## Tests

```bash
npm test .
# or
yarn test .
# or
pnpm test .
```

## License

Copyright DWJ 2024.  
Distributed under the Boost Software License, Version 1.0.  
https://www.boost.org/LICENSE_1_0.txt
