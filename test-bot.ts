import { UUID } from '@caspertech/node-metaverse';
import { passwordBonnie, spaForum } from './config';
import getDiscordNames from './src/getDiscordNames';
import handleClose from './src/handleClose';
import loginBot, { LoginParameters } from './src/loginBot';
import sit from './src/helpers/sit';
import botIMForum from './src/botIMForum';
import closeOnDisconnect from './src/helpers/closeOnDisconnect';

getDiscordNames();

const osakiya = async () => {
  const loginParameters: LoginParameters = {
    agreeToTOS: true,
    extras: {},
    firstName: 'osakiya',
    lastName: 'Resident',
    password: passwordBonnie,
    start: 'uri:Petplay&81&109&52',
    url: 'https://login.agni.lindenlab.com/cgi-bin/login.cgi',
  };

  const bot = await loginBot(loginParameters);
  if (!bot?.bot) return;

  setTimeout(() => {
    closeOnDisconnect(bot);
    sit(bot, new UUID('180d470d-63df-29c7-435c-3e4c7dcffcea'));
  }, 20000);

  botIMForum(bot, spaForum, { listenDiscord: true, relayLocal: true });
};

try {
  osakiya();
} catch (e) {
  handleClose(e);
}
