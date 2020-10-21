import {
    Wechaty,
    log
} from 'wechaty';

import WeChatController from './controller/wechat';

let wecaht = new WeChatController();

const bot = new Wechaty({
    name: 'wechat-fanli-robot',
    puppet: 'wechaty-puppet-padplus'
});

bot.on('scan', wecaht.onScan);
bot.on('login', wecaht.onLogin);
bot.on('logout', wecaht.onLogout);
bot.on('message', wecaht.onMessage);

bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e));
