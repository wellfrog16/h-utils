import { isNumber, isDate } from 'lodash-es';
import AES from 'crypto-js/AES';
import utf8 from 'crypto-js/enc-utf8';

const SECRET_KEY = 'frog';

// set 接口
export interface IStorageSetOption {
    expires?: number | Date,
    encrypt?: boolean,
    secret?: string,
}

// get 接口
export interface IStorageGetOption {
    secret?: string,
}

// storageData
export interface IStorageData {
    val: string | unknown,
    type: string,
    createAt: number,
    expires?: number | string,
    encrypt: boolean,
}

const use = { instance: localStorage };

// 带有效期的localStorage

// 删除指定的localStorge
function remove(key: string) {
    use.instance.removeItem(key);
}

// 设置localStorge
function set<T = string>(key: string, value: T, option?: IStorageSetOption) {
    const { expires, encrypt, secret } = option || {};

    let type = 'undefined';
    isNumber(expires) && (type = 'number');
    isDate(expires) && (type = 'date');

    const createAt = new Date().getTime();

    const val = encrypt ? AES.encrypt(JSON.stringify(value), secret || SECRET_KEY).toString() : value;
    const item: IStorageData = {
        val,
        type,
        createAt,
        encrypt: !!encrypt,
    };
    const handle: Record<string, () => void> = {
        date: () => { item.expires = new Date(expires as Date).getTime(); },
        number: () => { item.expires = expires ? +expires : 99999; },
    };

    handle[type] && handle[type]();
    use.instance.setItem(key, JSON.stringify(item));
}

// 获取localStorge
function get<T>(key: string, option?: IStorageGetOption): T | string | null {
    const val = use.instance.getItem(key);
    if (!val) { return val; }

    const item = JSON.parse(val); // 未做类型转换
    let result: string | null = null;

    const handle: Record<string, () => void> = {
        date() {
            if (new Date() > new Date(item.expires)) {
                remove(key);
                result = '';
            } else {
                result = item.val;
            }
        },
        number() {
            const ss = (new Date().getTime() - item.createAt) / 1000;
            if (ss > +item.expires) {
                remove(key);
                result = '';
            } else {
                result = item.val;
            }
        },
        undefined() {
            result = item.val;
        },
    };

    handle[item.type] && handle[item.type]();

    if (!result) { return null; }

    try {
        result = item.encrypt ? JSON.parse(AES.decrypt(result, option?.secret || SECRET_KEY).toString(utf8)) : result;
    } catch (err) {
        console.warn(err);
        result = null;
    }
    return result;
}

export default {
    use,
    set,
    get,
    remove,
};
