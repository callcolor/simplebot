import getLoginXml from './xml/getLoginXml';
import { postXml } from './src/postXml';
import getCapabilitiesXml from './xml/getCapabilitiesXml';
import getNewFileAgentInventoryXml from './xml/getNewFileAgentInventoryXml';
import axios from '../utilities/axios';
import Os from 'os';
import runCommand from '../utilities/runCommand';
import * as fs from 'fs';
import * as path from 'path';
// import connectToSim from './src/connectToSim';
// import startEventQueue from './src/startEventQueue';

const loginParameters = {
  first: 'FIRST_NAME',
  last: 'Resident',
  passwd: 'PASSWORD',
  start: 'uri:Region&128&128&4000',
};

const createInventory = (loginData: any) => {
  const byId: Record<string, any> = {};
  const rootId: string = loginData.find((m: any) => m.name._text === 'inventory-root')?.value?.array
    .data.value.struct.member.value.string._text;
  const skeletons = loginData.find((m: any) => m.name._text === 'inventory-skeleton')?.value?.array
    .data.value;
  for (const skeleton of skeletons) {
    const inventory: Record<string, any> = {};
    const members: any[] = skeleton.struct.member;
    for (const member of members) {
      const key: string = member.name._text;
      inventory[key] = Object.values<any>(member.value)[0]._text;
    }
    if (inventory.folder_id) {
      byId[inventory.folder_id] = inventory;
    } else {
      console.warn(inventory);
    }
  }

  return {
    byId,
    flat: Object.values(byId),
    root: byId[rootId],
    rootId,
  };
};

const main = async (): Promise<void> => {
  const loginResponse = await postXml({
    url: 'https://login.agni.lindenlab.com/cgi-bin/login.cgi',
    xml: getLoginXml(loginParameters),
  });
  const loginData = loginResponse.methodResponse.params.param.value.struct.member;
  console.log('Login complete:', loginData.length);
  const url = loginData.find((m: any) => m.name._text === 'seed_capability')?.value?.string._text;
  const seedResponse = await postXml({
    url,
    xml: getCapabilitiesXml(),
  });
  console.log(seedResponse);

  const inventory = createInventory(loginData);

  const uploadFolder = inventory.flat.find((i: any) => i.name === 'uploaded images');

  const newFileAgentInventory = await postXml({
    url: seedResponse.NewFileAgentInventory,
    xml: getNewFileAgentInventoryXml({ folderId: uploadFolder.folder_id }),
  });

  console.log(newFileAgentInventory);

  const uploadUrl = newFileAgentInventory.uploader;

  const tempFilename = 'c:\\tmp\\test';
  const cmd = Os.platform() === 'win32' ? `./openjpeg/opj_compress` : '/usr/bin/opj_compress';
  await runCommand(cmd, ['-i', `${tempFilename}.png`, '-o', `${tempFilename}.j2c`, '-r', '1']);
  const imageFile = fs.readFileSync(path.resolve(__dirname, `${tempFilename}.j2c`));

  const resp = await axios.post(uploadUrl, imageFile, {
    headers: { 'Content-Type': 'application/octet-stream' },
  });

  console.log(resp);

  // Sim connection test.
  // const agentID = members.find((m: any) => m.name._text === 'agent_id').value.string._text;
  // const secureSessionID = members.find((m: any) => m.name._text === 'secure_session_id').value
  //   .string._text;
  // const sessionID = members.find((m: any) => m.name._text === 'session_id').value.string._text;
  // const circuitCode = Number(
  //   members.find((m: any) => m.name._text === 'circuit_code').value.int._text
  // );
  // const ip = members.find((m: any) => m.name._text === 'sim_ip').value.string._text;
  // const port = Number(members.find((m: any) => m.name._text === 'sim_port').value.int._text);

  // await connectToSim({
  //   id: 'TEST',
  //   ip,
  //   port,
  //   secureSessionID,
  //   sessionID,
  //   circuitCode,
  //   agentID,
  // });

  // startEventQueue({ event_queue_url: seedResponse.EventQueueGet });
};

main();
