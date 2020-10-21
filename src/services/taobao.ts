/**
 * Create by henry at 2020/10/20
 * API from TaoBao
 */

import Config from '../config';

const {appKey, appSecret} = new Config();

// @ts-ignore
import {ApiClient} from '../lib/tb_sdk';

let client = new ApiClient({
    'appkey': appKey,
    'appsecret': appSecret,
    'url': 'http://gw.api.taobao.com/router/rest'
});

export default class TaoBaoService {
    basic(apiName: string, params?: any) {
        return new Promise((resolve, reject) => {
            client.executeWithHeader(
                apiName,
                params || {},
                {},
                (err: any, res: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

    /**
     *  淘宝客-公用-淘宝客商品详情查询(简版)
     */
    async getItemInfo(itemId: string) {
        const res: any = await this.basic(
            'taobao.tbk.item.info.get',
            {
                num_iids: itemId
            }
        );
        return res.results.n_tbk_item[0];
    }

    /**
     * 淘宝客-公用-淘口令生成
     */
    async createPwd(url: string, text: string) {
        const res: any = await this.basic(
            'taobao.tbk.tpwd.create',
            {
                'user_id': '1683928463',
                text,
                url
            }
        );
        return res.data;
    }

}
