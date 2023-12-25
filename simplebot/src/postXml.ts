import axios from 'axios';
import toJson from '../xml/toJs';

// SL capabilities do not have valid SSL certificates.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface PostXml {
  url: string;
  xml: string;
}

export const getXml = async ({ url, xml }: PostXml) => {
  const response = await axios.get(url, {
    headers: {
      Accept: 'text/xml',
      'Accept-Charset': 'UTF8',
      'Content-Type': 'text/xml',
    },
  });

  return toJson(response.data);
};

export const postXml = async ({ url, xml }: PostXml) => {
  const response = await axios.post(url, xml, {
    headers: {
      Accept: 'text/xml',
      'Accept-Charset': 'UTF8',
      'Content-Type': 'text/xml',
    },
  });

  return toJson(response.data);
};
