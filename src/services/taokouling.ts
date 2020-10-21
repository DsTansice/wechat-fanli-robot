/**
 * Create by henry at 2020/10/19
 * API from taokouling
 */

import request from 'request';
import Config from '../config';

const {apiKey, siteId, adzoneId, uid} = new Config();

export default class TKLService {

    /**
     * 淘口令解析
     */
    check(text: string): any {
        return new Promise((resolve, reject) => {
            request.get(
                `http://api.taokouling.com/tkl/tkljm?apikey=${apiKey}&tkl=${encodeURI(text)}`,
                {json: true},
                (_err, _res, body) => {
                    if (body && body.code === 1) {
                        const data = body.url.split('?');
                        const obj = data[1].split('&');
                        let itemId: string = '';
                        for (let i = 0; i < obj.length; i++) {
                            const [key, value] = obj[i].split('=');
                            if (key === 'id') {
                                itemId = value;
                                break;
                            }
                        }
                        if (itemId) {
                            resolve(itemId);
                        }
                    }
                    reject('Check pwd error');
                }
            );
        });
    }

    /**
     * 高佣转链接
     */
    createLink(itemId: string): any {
        return new Promise((resolve, reject) => {
            request.get(
                `https://api.taokouling.com/tkl/TbkPrivilegeGet?apikey=${apiKey}&itemid=${itemId}&siteid=${siteId}&adzoneid=${adzoneId}&uid=${uid}`,
                {json: true},
                (_err, _res, body) => {
                    if (body && body.result && body.result.data) {
                        resolve(body.result.data);
                    } else {
                        reject('Create link error');
                    }
                }
            );
        });
    }
}
