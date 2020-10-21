/**
 * Create by henry at 2020/10/19
 * WeChat operation
 */

import {
    Contact,
    Message,
    ScanStatus,
    log,
} from 'wechaty';
import {generate} from 'qrcode-terminal';

import TaoBaoController from './taobao';

const taobao = new TaoBaoController();

export default class WeChatController {

    onScan(qrcode: string, status: ScanStatus) {
        if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
            generate(qrcode, {small: true});  // show qrcode on console

            const qrcodeImageUrl = [
                'https://wechaty.js.org/qrcode/',
                encodeURIComponent(qrcode),
            ].join('');

            log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
        } else {
            log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status);
        }
    }

    onLogin(user: Contact) {
        log.info('StarterBot', '%s login', user);
    }

    onLogout(user: Contact) {
        log.info('StarterBot', '%s logout', user);
    }

    async onMessage(msg: Message) {
        log.info('StarterBot', msg.toString());

        if (msg.text()) {
            try {
                const rgx = /([\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])\w{8,12}([\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])/;
                const pwd: any = msg.text().match(rgx);
                if (pwd !== null) {
                    const res = await taobao.getInfo(pwd[0]);
                    await msg.say(res);
                } else if (msg.text() === 'ding') {
                    await msg.say('dong');
                }
            } catch (err) {
                log.error(err);
            }
        }
    }

}

