import axios from '../utilities/axios';
import { SECONDS } from '../utilities/constants';
import parseJson from '../utilities/parseJson';
import prisma from '../utilities/prisma';
import sleep from '../utilities/sleep';
import { postXml, getXml } from './src/postXml';
import getCapabilitiesXml from './xml/getCapabilitiesXml';
import getLoginXml from './xml/getLoginXml';

const main = async () => {
  const running = true;

  while (running) {
    try {
      const loginResponse = await postXml({
        url: 'https://login.agni.lindenlab.com/cgi-bin/login.cgi',
        xml: getLoginXml({
          first: 'FIRST_NAME',
          last: 'Resident',
          passwd: 'PASSWORD',
          start: 'uri:Region&128&128&4000',
        }),
      });
      const members = loginResponse.methodResponse.params.param.value.struct.member;
      console.log('Login complete.');
      const seed_capability_url = members.find((m: any) => m.name._text === 'seed_capability').value
        .string._text;
      const seedResponse = await postXml({
        url: seed_capability_url,
        xml: getCapabilitiesXml(),
      });
      console.log('Capabilities complete.');

      const readOfflineMessagesUrl = seedResponse.ReadOfflineMsgs;

      let loggedIn = true;
      let proxyUrl;
      while (loggedIn) {
        try {
          const offlineMessagesArray = await getXml({
            url: readOfflineMessagesUrl,
            xml: '',
          });

          for (const offlineMessages of offlineMessagesArray) {
            for (const offlineMessage of offlineMessages) {
              const { from_group, from_agent_id, from_agent_name, message, region_id, position } =
                offlineMessage;

              if (from_group) continue;

              const json = parseJson(message);
              if (json?.command === 'instant-message-proxy') {
                proxyUrl = json.url;
              }

              const region = await prisma.region.findFirst({
                where: { region_id: region_id.toString() },
              });
              const regionName = region?.region_name || region_id;

              if (proxyUrl && from_agent_id) {
                const message = `${from_agent_name} is in ${regionName} at <${Math.round(
                  position[0]
                )}, ${Math.round(position[1])}, ${Math.round(position[2])}>`;
                console.log(message);
                axios.post(proxyUrl, {
                  message,
                  uuid: from_agent_id,
                });
              }
            }
          }
        } catch (e) {
          console.log(e);
          loggedIn = false;
        }
        await sleep(3 * SECONDS);
      }
    } catch (e) {
      console.error('Error:', e);
    } finally {
      console.log('Restarting...');
      await sleep(120 * SECONDS);
    }
  }
};

main();
