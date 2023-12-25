import { v4 } from 'uuid';

interface LoginParameters {
  first: string;
  last: string;
  passwd: string;
  start: string;
}

const getLoginXml = ({ first, last, passwd, start }: LoginParameters) => {
  const id0 = v4();

  const viewer_digest = v4();

  const mac = 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function () {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });

  return /*xml*/ `
  <?xml version="1.0" encoding="UTF-8"?>
  <methodCall>
    <methodName>login_to_simulator</methodName>
    <params>
      <param>
        <value>
          <struct>
            <member>
              <name>first</name>
              <value>
                <string>${first}</string>
              </value>
            </member>
            <member>
              <name>last</name>
              <value>
                <string>${last}</string>
              </value>
            </member>
            <member>
              <name>passwd</name>
              <value>
                <string>${passwd}</string>
              </value>
            </member>
            <member>
              <name>start</name>
              <value>
                <string><![CDATA[${start}]]></string>
              </value>
            </member>
            <member>
              <name>major</name>
              <value>
                <string>0</string>
              </value>
            </member>
            <member>
              <name>minor</name>
              <value>
                <string>0</string>
              </value>
            </member>
            <member>
              <name>patch</name>
              <value>
                <string>1</string>
              </value>
            </member>
            <member>
              <name>build</name>
              <value>
                <string>0</string>
              </value>
            </member>
            <member>
              <name>platform</name>
              <value>
                <string>win</string>
              </value>
            </member>
            <member>
              <name>token</name>
              <value>
                <string />
              </value>
            </member>
            <member>
              <name>mfa_hash</name>
              <value>
                <string />
              </value>
            </member>
            <member>
              <name>id0</name>
              <value>
                <string>${id0}</string>
              </value>
            </member>
            <member>
              <name>mac</name>
              <value>
                <string>${mac}</string>
              </value>
            </member>
            <member>
              <name>viewer_digest</name>
              <value>
                <string>${viewer_digest}</string>
              </value>
            </member>
            <member>
              <name>user_agent</name>
              <value>
                <string>simple-bonnie</string>
              </value>
            </member>
            <member>
              <name>author</name>
              <value>
                <string>ostiabs</string>
              </value>
            </member>
            <member>
              <name>agree_to_tos</name>
              <value>
                <boolean>1</boolean>
              </value>
            </member>
            <member>
              <name>read_critical</name>
              <value>
                <boolean>1</boolean>
              </value>
            </member>
            <member>
              <name>options</name>
              <value>
                <array>
                  <data>
                    <value>
                      <string>inventory-root</string>
                    </value>
                    <value>
                      <string>inventory-skeleton</string>
                    </value>
                    <value>
                      <string>inventory-lib-root</string>
                    </value>
                    <value>
                      <string>inventory-lib-owner</string>
                    </value>
                    <value>
                      <string>inventory-skel-lib</string>
                    </value>
                    <value>
                      <string>gestures</string>
                    </value>
                    <value>
                      <string>event_categories</string>
                    </value>
                    <value>
                      <string>event_notifications</string>
                    </value>
                    <value>
                      <string>classified_categories</string>
                    </value>
                    <value>
                      <string>buddy-list</string>
                    </value>
                    <value>
                      <string>ui-config</string>
                    </value>
                    <value>
                      <string>login-flags</string>
                    </value>
                    <value>
                      <string>global-textures</string>
                    </value>
                  </data>
                </array>
              </value>
            </member>
          </struct>
        </value>
      </param>
    </params>
  </methodCall>  
  `.trim();
};

export default getLoginXml;
