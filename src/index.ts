import {
  Wechaty,
  log,
  ScanStatus,
  Contact,
  Message,
  Friendship,

} from 'wechaty';
import { generate } from 'qrcode-terminal';
import Service from './service';

const service = new Service();

const bot = new Wechaty({
  name: 'wechat-fanli-robot',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {}
});

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true });  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('');

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status);
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user);
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user);
}

async function onFriendship(friendship: any) {
  if (friendship.type() === Friendship.Type.Receive) {
    await friendship.accept();
  }
}

async function onMessage(msg: Message) {
  log.info('StarterBot', msg.toString());
  try {
    if (msg.text()) {
      const res = await service.send(msg.text());
      if (res.data) {
        await msg.say(res.data);
      }
    }
  } catch (err) {
    log.error(err);
    await msg.say('好像有什么不对呢');
  }
}

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.on('friendship', onFriendship);

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e));

bot.on('error', (error) => {
  log.error(error);
});
