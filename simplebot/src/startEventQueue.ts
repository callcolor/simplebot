import getEventQueueXml from '../xml/getEventQueueXml';
import { postXml } from './postXml';

const startEventQueue = async ({ event_queue_url }: { event_queue_url: string }) => {
  const eventQueue = {
    ack: null,
    done: false,
  };

  console.log('Event queue started.');

  while (!eventQueue.done) {
    try {
      const response = await postXml({
        url: event_queue_url,
        xml: getEventQueueXml(eventQueue),
      });
      console.log('eventQueue', response);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  console.log('Event queue stopped.');
};

export default startEventQueue;
