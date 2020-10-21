/**
 * Create by henry at 2020/10/20
 */

import TKLService from '../services/taokouling';
import TaoBaoService from '../services/taobao';

const tkl = new TKLService();
const taobao = new TaoBaoService();

export default class TaoBaoController {
    async getInfo(text: string): Promise<any> {
        // 1. 检查淘口令
        const itemId = await tkl.check(text);
        // 2. 高佣转链接
        const {coupon_click_url, coupon_info, max_commission_rate} = await tkl.createLink(itemId);
        // 3. 生成淘口令
        const pwd = await taobao.createPwd(coupon_click_url, '我的淘口令');
        const info = await taobao.getItemInfo(itemId);
        const str = `${pwd.model}\n\n优惠券：${coupon_info || '无'}\n预计返利：${info.zk_final_price * max_commission_rate / 100} 元`;
        return str;
    }
}
