import { BotOptionFlags, ClientEvents, PacketFlags, UUID } from '@caspertech/node-metaverse';
import { Agent } from '@caspertech/node-metaverse/dist/lib/classes/Agent';
import { Circuit } from '@caspertech/node-metaverse/dist/lib/classes/Circuit';
import {
  RegionHandshakeMessage,
  UseCircuitCodeMessage,
} from '@caspertech/node-metaverse/dist/lib/classes/MessageClasses';
import { Packet } from '@caspertech/node-metaverse/dist/lib/classes/Packet';
import { Region } from '@caspertech/node-metaverse/dist/lib/classes/Region';
import { Message } from '@caspertech/node-metaverse/dist/lib/enums/Message';

export interface ConnectToSim {
  id: string;
  ip: string;
  port: number;
  secureSessionID: string;
  sessionID: string;
  circuitCode: number;
  agent: Agent;
}

const connectToSim = async ({
  id,
  ip,
  port,
  sessionID,
  secureSessionID,
  circuitCode,
  agent,
}: ConnectToSim) => {
  console.log(`Connecting to region: ${id}.`);
  const clientEvents = new ClientEvents();
  const region = new Region(
    agent,
    clientEvents,
    BotOptionFlags.LiteObjectStore | BotOptionFlags.StoreMyAttachmentsOnly
  );
  region.caps = agent.currentRegion.caps;
  const circuit = region.circuit;

  circuit.ipAddress = ip;
  circuit.port = port;
  circuit.sessionID = new UUID(sessionID);
  circuit.secureSessionID = new UUID(secureSessionID);
  circuit.circuitCode = circuitCode;
  circuit.init();
  if (!circuit.client) throw new Error(`Circuit init failed.`);

  const msg: UseCircuitCodeMessage = new UseCircuitCodeMessage();
  msg.CircuitCode = {
    SessionID: circuit.sessionID,
    ID: agent.agentID,
    Code: circuit.circuitCode,
  };
  await circuit.waitForAck(circuit.sendMessage(msg, PacketFlags.Reliable), 60000);
  console.log(`Circuit connected to ${id}.`);

  const handshakeMessage = await circuit.waitForMessage<RegionHandshakeMessage>(
    Message.RegionHandshake,
    10000
  );
  await region.handshake(handshakeMessage);

  console.log(`Connected to ${region.regionName}.`);

  return region;
};

export default connectToSim;
