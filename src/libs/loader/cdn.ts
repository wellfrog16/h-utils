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
}

export const baseCdnUrl = {
    jsdelivr: '//cdn.jsdelivr.net/npm', // jsdelivr.net
    defaultBase: window.h_utils?.cdn?.host || '//cdn.staticfile.org',
    localcdn: window.h_utils?.cdn?.path || '/localcdn',
}

export const cdnMapping = {
    // 全屏
    screenfull: (version = '5.2.0') => ({
        version,
        instance: () => window.screenfull as ICDNType['screenfull'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/screenfull@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/screenfull.js/${version}/screenfull.min.js`] },
            localcdn: { js: [`${baseCdnUrl.localcdn}/screenfull/${version}/screenfull.min.js`] },
        },
    }),

    // 复制黏贴
    clipboard: (version = '2.0.8') => ({
        version,
        instance: () => window.ClipboardJS as ICDNType['clipboard'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/clipboard@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/clipboard.js/${version}/clipboard.min.js`] },
            localcdn: { js: [`${baseCdnUrl.localcdn}/clipboard/${version}/clipboard.min.js`] },
        },
    }),

    // 富文本编辑器
    tinymce: (version = '5.8.1') => ({
        version,
        instance: () => window.tinyMCE as ICDNType['tinymce'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/tinymce@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/tinymce/${version}/tinymce.min.js`] },
            localcdn: { js: [`${baseCdnUrl.localcdn}/tinymce/${version}/tinymce.min.js`] },
        },
    }),

    // 二维码生成
    qrcodeGe: (version = '1.4.4') => ({
        version,
        instance: () => window.qrcode as ICDNType['qrcodeGe'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/qrcode-generator@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/qrcode-generator/${version}/qrcode.min.js`] },
            localcdn: { js: [`${baseCdnUrl.localcdn}/qrcode-generator/${version}/qrcode.min.js`] },
        },
    }),

    // 二维码生成
    QRCode: (version = '1.5.1') => ({
        version,
        instance: () => window.QRCode as ICDNType['QRCode'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/qrcode@${version}/build/qrcode.min.js`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/qrcode/${version}/qrcode.min.js`] },
            localcdn: { js: [`${baseCdnUrl.localcdn}/qrcode/${version}/qrcode.min.js`] },
        },
    }),

    // 千分位
    cleave: (version = '1.6.0') => ({
        version,
        instance: () => window.Cleave as ICDNType['cleave'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/cleave.js@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/cleave.js/${version}/cleave.min.js`] },
            localcdn: { js: [`${baseCdnUrl.localcdn}/cleave/${version}/cleave.min.js`] },
        },
    }),
}

type ICDNNameType = 'jsdelivr' | 'defaultBase'

const cdnSource = (name: keyof typeof cdnMapping, version?: string) => {
    const cdnName = (window.h_utils?.cdn?.name || 'defaultBase') as ICDNNameType
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
    return Object.assign({ instance: () => { }, js: [], css: [], version: '' }, { ...item.source[cdnName], instance: item.instance, version: item.version })
}

export default cdnSource
