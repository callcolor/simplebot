const getNewFileAgentInventoryXml = ({ folderId }: { folderId: string }) => {
  return /*xml*/ `
    <llsd><map>
      <key>folder_id</key><uuid>${folderId}</uuid>
      <key>asset_type</key><string>texture</string>
      <key>inventory_type</key><string>texture</string>
      <key>name</key><string>Insert Image Title Here</string>
      <key>description</key><string>(No Description)</string>
      <key>everyone_mask</key><integer>581632</integer>
      <key>group_mask</key><integer>581632</integer>
      <key>next_owner_mask</key><integer>581632</integer>
      <key>expected_upload_cost</key><integer>0</integer>
    </map></llsd>
  `.trim();
};

export default getNewFileAgentInventoryXml;
