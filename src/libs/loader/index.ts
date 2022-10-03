import cdnSource, { baseCdnUrl, cdnMapping } from './cdn'
import type { ICDNType } from './cdn'

export { RawEditorSettings } from 'tinymce/tinymce.d'
export { ICDNType } from './cdn'

// 动态加载js文件和css文件

const FLAG_LOADEED = 'yes'

// 指定url的js是否已加载
const isScriptLoaded = (url: string) => {
    const script = url && document.querySelector<HTMLScriptElement>(`script[src="${url}"]`)
    return !!(script && script.dataset.loader === FLAG_LOADEED)
}

// 获取指定url正在加载中的的js，如还未加载返回null
const getScript = (url: string) => {
    const script = url && document.querySelector<HTMLScriptElement>(`script[src="${url}"]`)
    return script && !script.dataset.loader ? script : null
}

// 指定url的css是否已加载
const isCssLoaded = (url: string) => !!(url && document.querySelector<HTMLStyleElement>(`link[href="${url}"]`))

// 加载单个js
export const loadScriptSingle = (url: string) => new Promise((resolve, reject) => {
    // 如果已经加载，直接返回
    if (isScriptLoaded(url)) { resolve(true) }
    else {
        const myScript = getScript(url)

        // （非）多个程序同时加载同一个cdn资源
        if (!myScript) {
            const head = document.getElementsByTagName('head')[0]
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = url

            script.onload = () => {
                script.dataset.loaded = FLAG_LOADEED
                resolve(true)
            }

            // 加载失败删除标签，并返回reject
            script.onerror = () => {
                head.removeChild(script)
                reject(new Error('load failed'))
            }
            head.appendChild(script)
        }
        else { // 多个程序同时加载同一个cdn资源，则用计时器检测loader状态
            const timeout = 10000 // 检测超时上限
            const interval = 10 // 检测频率
            let times = 0 // 已用时

            const timer = setInterval(() => {
                times += interval

                // 加载超时
                if (times >= timeout) {
                    clearInterval(timer)
                    reject(new Error('time out!'))
                }

                if (myScript.dataset.loaded === FLAG_LOADEED) {
                    clearInterval(timer)
                    resolve(true)
                }
            }, interval)
        }
    }
})

interface ILoadScriptOptions {
    sequence?: boolean // 顺序加载
}

// 加载js
export const loadScript = async (urls: string[], options: ILoadScriptOptions = { sequence: true }) => {
    // 按顺序加载
    if (options.sequence) {
        try {
            for (let i = 0; i < urls.length; i += 1) {
                await loadScriptSingle(urls[i])
            }
            return Promise.resolve(true)
        }
        catch (e) {
            return Promise.reject(e)
        }
    }
    return Promise.all(urls.map(url => loadScriptSingle(url)))
}

// 加载css
export const loadCss = (urls: string[]) => {
    const head = document.getElementsByTagName('head')[0]
    urls.filter(url => !isCssLoaded(url))
        .forEach(url => {
            const link = document.createElement('link')
            link.type = 'text/css'
            link.rel = 'stylesheet'
            link.href = url
            head.appendChild(link)
        })
}

// 按库名加载cdn资源
export const loadCdnSingle = <T extends keyof ICDNType>(name: T, version?: string) => {
    const { js = [], css, instance } = cdnSource(name, version) || {}
    Array.isArray(css) && css.length > 0 && loadCss(css)

    return new Promise<ICDNType[T]>((resolve, reject) => {
        loadScript(js)
            .then(() => resolve(instance?.() as ICDNType[T]))
            .catch(() => reject(new Error(`加载 ${name} 失败`)))
    })
}

// 按库名批量加载cdn资源
export const loadCdn = <T extends keyof ICDNType>(names: T[]) => Promise.all(names.map(name => loadCdnSingle(name)))

export default {
    loadScriptSingle,
    loadScript,
    loadCss,
    loadCdnSingle,
    loadCdn,
    baseCdnUrl,
    cdnMapping,
    cdnSource,
}
