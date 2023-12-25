const getEventQueueXml = ({ ack }: { ack: number | null }) => {
  if (ack) {
    return /*xml*/ `
      <llsd><map><key>ack</key><integer>${ack}</integer><key>done</key><boolean>0</boolean></map></llsd>
    `.trim();
  } else {
    return /*xml*/ `
      <llsd><map><key>ack</key><undef/><key>done</key><boolean>0</boolean></map></llsd>
    `.trim();
  }
};

export default getEventQueueXml;
