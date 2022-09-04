import defaultWindow from '../defaultWindow'
import type ClipboardJS from 'clipboard/src/clipboard'
import type Tinymce from 'tinymce/tinymce'
import type QRCode from 'qrcode'
import type QRcodeGe from 'qrcode-generator'
import type Cleave from 'cleave.js'
import type Screenfull from 'screenfull'

export { RawEditorSettings } from 'tinymce/tinymce.d'

export interface ICDNType {
    clipboard: typeof ClipboardJS
    screenfull: typeof Screenfull
    tinymce: typeof Tinymce
    qrcodeGe: typeof QRcodeGe
    QRCode: typeof QRCode
    cleave: typeof Cleave
    fontawesomeCss: any
    fontawesomeJs: any
}

export const baseCdnUrl = {
    jsdelivr: '//cdn.jsdelivr.net/npm', // jsdelivr.net
    defaultBase: defaultWindow ? (defaultWindow.h_utils?.cdn?.host || '//cdn.staticfile.org') : '',
    localCDN: defaultWindow ? (defaultWindow.h_utils?.cdn?.path || '/local-cdn') : '',
}

export const cdnMapping = {
    // 全屏
    screenfull: (version = '5.2.0') => ({
        version,
        instance: () => defaultWindow ? defaultWindow.screenfull as ICDNType['screenfull'] : undefined,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/screenfull@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/screenfull.js/${version}/screenfull.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/screenfull/${version}/screenfull.min.js`] },
        },
    }),

    // 复制黏贴
    clipboard: (version = '2.0.8') => ({
        version,
        instance: () => defaultWindow ? defaultWindow.ClipboardJS as ICDNType['clipboard'] : undefined,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/clipboard@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/clipboard.js/${version}/clipboard.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/clipboard/${version}/clipboard.min.js`] },
        },
    }),

    // 富文本编辑器
    tinymce: (version = '5.8.1') => ({
        version,
        instance: () => defaultWindow ? defaultWindow.tinyMCE as ICDNType['tinymce'] : undefined,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/tinymce@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/tinymce/${version}/tinymce.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/tinymce/${version}/tinymce.min.js`] },
        },
    }),

    // 二维码生成
    qrcodeGe: (version = '1.4.4') => ({
        version,
        instance: () => defaultWindow ? defaultWindow.qrcode as ICDNType['qrcodeGe'] : undefined,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/qrcode-generator@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/qrcode-generator/${version}/qrcode.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/qrcode-generator/${version}/qrcode.min.js`] },
        },
    }),

    // 二维码生成
    QRCode: (version = '1.5.1') => ({
        version,
        instance: () => defaultWindow ? defaultWindow.QRCode as ICDNType['QRCode'] : undefined,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/qrcode@${version}/build/qrcode.min.js`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/qrcodejs/${version}/qrcode.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/qrcode/${version}/qrcode.min.js`] },
        },
    }),

    // 千分位
    cleave: (version = '1.6.0') => ({
        version,
        instance: () => defaultWindow ? defaultWindow.Cleave as ICDNType['cleave'] : undefined,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/cleave.js@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/cleave.js/${version}/cleave.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/cleave/${version}/cleave.min.js`] },
        },
    }),

    // fontawesome 全量css版本
    fontawesomeCss: (version = '6.1.2') => ({
        version,
        instance: () => defaultWindow,
        source: {
            jsdelivr: { js: [], css: [`${baseCdnUrl.jsdelivr}/@fortawesome/fontawesome-free@${version}/css/all.min.css`] },
            defaultBase: { js: [], css: [`${baseCdnUrl.defaultBase}/font-awesome/${version}/css/all.min.css`] },
            localCDN: { js: [], css: [`${baseCdnUrl.localCDN}/font-awesome/${version}/css/all.min.css`] },
        },
    }),

    // fontawesome 全量js版本
    fontawesomeJs: (version = '6.1.2') => ({
        version,
        instance: () => defaultWindow,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/@fortawesome/fontawesome-free@${version}/js/all.min.js`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/font-awesome/${version}/js/all.min.js`] },
            localCDN: { js: [`${baseCdnUrl.localCDN}/font-awesome/${version}/js/all.min.js`] },
        },
    }),
}

type ICDNNameType = 'jsdelivr' | 'defaultBase' | 'localCDN'

const cdnSource = (name: keyof typeof cdnMapping, version?: string) => {
    if (!defaultWindow) { return }

    const cdnName = (window.h_utils?.cdn?.name || 'jsdelivr') as ICDNNameType
    const resource = cdnMapping[name]

    if (!resource) {
        const defaultResource = {
            instance: () => ({} as unknown),
            js: [`${baseCdnUrl.defaultBase}/${cdnName}.js/${version}/${cdnName}.min.js`],
            css: [`${baseCdnUrl.defaultBase}/${cdnName}/${version}/${cdnName}.min.css`],
        }
        return defaultResource
    }

    const item = resource(version)
    return Object.assign({ instance: undefined, js: [], css: [], version: '' }, { ...item.source[cdnName], instance: item.instance, version: item.version })
}

export default cdnSource
