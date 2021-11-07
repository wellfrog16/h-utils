import { isNumber, isDate } from 'lodash-es';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

const SECRET_KEY = 'THIS_IS_SECRET';

// set 接口
export interface IStorageSetOption {
    expires?: number | Date;
    encrypt?: boolean;
    secret?: string;
    instance?: Storage;
}

// get 接口
export interface IStorageGetOption {
    secret?: string;
    instance?: Storage;
}

// get 接口
export interface IStorageRemoveOption {
    instance?: Storage;
}

// storageData
export interface IStorageData {
    val: string | unknown;
    type: string;
    createAt: number;
    expires?: number | string;
    encrypt: boolean;
}

// 带有效期的localStorage

// 删除指定的localStorge
function remove(key: string, option?: IStorageRemoveOption) {
    const { instance = localStorage } = option || {};
    instance.removeItem(key);
}

// 设置localStorge
function set<T = string>(key: string, value: T, option?: IStorageSetOption) {
    const { expires, encrypt, secret, instance = localStorage } = option || {};

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
    instance.setItem(key, JSON.stringify(item));
}

// 获取localStorge
function get<T>(key: string, option?: IStorageGetOption): T | string | null {
    const { secret, instance = localStorage } = option || {};
    const val = instance.getItem(key);
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
        result = item.encrypt ? JSON.parse(AES.decrypt(result, secret || SECRET_KEY).toString(encUtf8)) : result;
    } catch (err) {
        console.warn(err);
        result = null;
    }
    return result;
}

const info = () => {
    const count = (instance: Storage) => {
        let size = 0;
        for(const item in instance) {
            if(instance.hasOwnProperty(item)) {
                size += instance.getItem(item)?.length || 0;
            }
        }
        return (size / 1024).toFixed(2) + ' KB';
    }

    const totalSpace = () => new Promise((resolve) => {
        let test = '0123456789';
        do { test += test; }
        while (test.length < 10240)

        let sum = test;
        let timer = setInterval(() => {
            sum += test;
            try {
                window.localStorage.removeItem('test-storage-space');
                window.localStorage.setItem('test-storage-space', sum);
            } catch {
                resolve(`${sum.length / 1024} KB`);
                clearInterval(timer);
            }
        }, 0)
    })

    return {
        sessionSpace: count(sessionStorage),
        localSpace: count(localStorage),
        totalSpace,
    }
}

export default {
    set,
    get,
    remove,
    info,
};
