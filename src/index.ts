import {
    Wechaty,
    log,
    ScanStatus,
    Contact,
    Message,
    Friendship,

} from 'wechaty';
import { generate } from 'qrcode-terminal';
import TaoBaoController from './controller/taobao';

const taobao = new TaoBaoController();

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
            // 提取淘口令
            // const rgx = /([\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])\w{8,12}([\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])/;
            const rgx = /\w{8,11}/;
            const pwd: any = msg.text().match(rgx);
            if (pwd !== null) {
                const res = await taobao.getInfo(`￥${pwd[0]}￥`);
                await msg.say(res);
            } else if (msg.text() === 'ding') {
                await msg.say('dong');
            }
        }
    } catch (err) {
        log.error(err);
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
