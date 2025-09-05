import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({ ignoreAttributes: false });

export function parseXml(xml: string): any {
  return parser.parse(xml);
}

export function buildXml(obj: any): string {
  return builder.build(obj);
}
