export interface IRuleOptions {
    name: string
    allowEmpty: boolean // allowEmpty: 允许为空(false)
    allowSpecial: boolean // allowSpecial: 允许特殊字符(true)
    trigger: 'change' | 'blur'
    message: string
}

const rules = {
    /**
     * 自带类型校验
     *
     * @param {String} key 校验的字段
     * @param {JSON} [options={}]
     * @returns
     */
    check<T, P>(key: string, options: T): P {
        const params = { required: true, trigger: 'blur', ...options }
        const r: any = {}
        r[key] = [{ ...params }]
        return r
    },

    /**
     * 校验字符串
     *
     * @param {*} key
     * @param {*} [options={}]
     * @returns
     */
    checkString(key: string, options?: Partial<IRuleOptions>) {
        const params: Partial<IRuleOptions> = {
            name: '此项',
            allowEmpty: false,
            allowSpecial: true,
            trigger: 'change',
            ...options,
        }
        const { name, message, trigger } = params
        const r: Record<string, Record<string, unknown>[]> = {}
        const rule: Record<string, unknown>[] = []

        // 是否允许特殊字符，待扩展
        if (!params.allowSpecial) {
            rule.push({ pattern: /^[\u4E00-\u9FA5|a-z|A-Z]+$/, message: `${name}只可中文/英文/拼音，不可特殊符号，数字`, trigger })
        }

        // 是否允许为空
        if (!params.allowEmpty) {
            rule.push({ required: true, message: (message || `请输入${name}`), trigger })
        }

        r[key] = rule
        return r
    },
}

export default rules
