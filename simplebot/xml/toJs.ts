import { ElementCompact, xml2js } from 'xml-js';
import { LLSD } from '@caspertech/llsd';

const toJson = (xml: string) => {
  try {
    return LLSD.parseXML(xml);
  } catch {
    return xml2js(xml, { compact: true }) as ElementCompact;
  }
};

export default toJson;
