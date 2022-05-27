import ClipboardJS from 'clipboard/src/clipboard';
import Vditor from 'vditor/dist';
import Tinymce from 'tinymce/tinymce';
import QRCode from 'qrcode';
import QRcodeGe from 'qrcode-generator';
import Cleave from 'cleave.js';

export const tinymceVersion = 'tinymce@5.8.1';
export { RawEditorSettings } from 'tinymce/tinymce.d';

export interface ICDNType {
    clipboard: typeof ClipboardJS;
    screenfull: string;
    vditor: typeof Vditor;
    tinymce: typeof Tinymce;
    qrcodeGe: typeof QRcodeGe;
    QRCode: typeof QRCode;
    cleave: typeof Cleave;
}

export const baseCdnUrl = {
    jsdelivr: '//cdn.jsdelivr.net/npm', // jsdelivr.net
    defaultBase: window.h_utils?.cdn?.host || '//cdn.staticfile.org',
}

const cdnMapping = {
    // 全屏
    screenfull: (version: string = '4.0.1') => ({
        instance: () => window.screenfull as () => string,
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/screenfull@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/screenfull.js/${version}/screenfull.min.js`] },
        }
    }),

    // 复制黏贴
    clipboard: (version: string = '2.0.8') => ({
        instance: () => window.ClipboardJS as ICDNType['clipboard'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/clipboard@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/clipboard.js/${version}/clipboard.min.js`] },
        }
    }),

    // md编辑器
    vditor: (version: string = '3.8.5') => ({
        instance: () => window.Vditor as ICDNType['vditor'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/vditor@${version}`], css: [`${baseCdnUrl.jsdelivr}/vditor@${version}/dist/index.css`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/vditor/${version}/index.min.js`], css: [`${baseCdnUrl.defaultBase}/vditor/${version}/index.min.css`] },
        }
    }),

    // 富文本编辑器
    tinymce: (version: string = '5.8.1') => ({
        instance: () => window.tinyMCE as ICDNType['tinymce'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/tinymce@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/tinymce/${version}/tinymce.min.js`] },
        }
    }),

    // 二维码生成
    qrcodeGe: (version: string = '1.4.4') => ({
        instance: () => window.qrcode as ICDNType['qrcodeGe'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/qrcode-generator@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/qrcode-generator/${version}/qrcode.min.js`] },
        }
    }),

    // 二维码生成
    QRCode: (version: string = '1.4.4') => ({
        instance: () => window.QRcode as ICDNType['QRCode'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/qrcode@${version}/build/qrcode.min.js`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/qrcode/${version}/qrcode.min.js`] },
        }
    }),

    // 千分位
    cleave: (version: string = '1.6.0') => ({
        instance: () => window.Cleave as ICDNType['cleave'],
        source: {
            jsdelivr: { js: [`${baseCdnUrl.jsdelivr}/cleave.js@${version}`] },
            defaultBase: { js: [`${baseCdnUrl.defaultBase}/cleave.js/${version}/cleave.min.js`] },
        }
    }),
};

type ICDNNameType = 'jsdelivr' | 'defaultBase';

const cdnSource = (name: keyof typeof cdnMapping, version?: string) => {
    const cdnName = (window.h_utils?.cdn?.name || 'defaultBase') as ICDNNameType
    const resource = cdnMapping[name];

    if (!resource) {
        const defaultResource = {
            instance: () => ({} as unknown),
            js: [`${baseCdnUrl.defaultBase}/${cdnName}.js/${version}/${cdnName}.min.js`],
            css: [`${baseCdnUrl.defaultBase}/${cdnName}/${version}/${cdnName}.min.css`],
        };
        return defaultResource;
    }

    const item = resource(version);
    return Object.assign({ instance: () => {}, js:[], css:[] }, { ...item.source[cdnName], instance: item.instance });
}

export default cdnSource;
