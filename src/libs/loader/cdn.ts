import ClipboardJS from 'clipboard/src/clipboard';
import Vditor from 'vditor/dist';
import Tinymce from 'tinymce/tinymce';
import QRCode from 'qrcode';

export const baseCdn = '//cdn.jsdelivr.net/npm';
export const tinymceVersion = 'tinymce@5.8.1';

export interface ICDNType {
    clipboard: typeof ClipboardJS;
    screenfull: string;
    vditor: typeof Vditor;
    tinymce: typeof Tinymce;
    QRCode: typeof QRCode;
}

const cdn = {
    screenfull: {
        instance: () => window.screenfull as () => string,
        css: [],
        js: [
            `${baseCdn}/screenfull@4.0.1`,
        ],
    },

    // 复制黏贴
    clipboard: {
        instance: () => window.ClipboardJS as ICDNType['clipboard'],
        css: [],
        js: [
            `${baseCdn}/clipboard@2.0.8`,
        ],
    },

    // md编辑器
    vditor: {
        instance: () => window.Vditor as ICDNType['vditor'],
        css: [
            `${baseCdn}/vditor@3.8.5/dist/index.css`,
        ],
        js: [
            `${baseCdn}/vditor@3.8.5`,
        ],
    },

    tinymce: {
        instance: () => window.tinyMCE as ICDNType['tinymce'],
        css: [
            // `${baseCdn}/tinymce@5.8.1/skins/content/default/content.css`, // 会修改body
            // `${baseCdn}/tinymce@5.8.1/skins/ui/oxide/skin.min.css`,
            // `${baseCdn}/tinymce@5.8.1/skins/ui/oxide/content.min.css`,
        ],
        js: [
            `${baseCdn}/tinymce@5.8.1`,
            // `${baseCdn}/tinymce@5.8.1/themes/silver/theme.min.js`,
            // `${baseCdn}/tinymce@5.8.1/icons/default/icons.js`,
            // `${baseCdn}/tinymce@5.8.1/plugins/lists/plugin.js`,
        ],
    },

    QRCode: {
        instance: () => window.QRCode as ICDNType['QRCode'],
        css: [],
        js: [
            `${baseCdn}/qrcode@1.4.4/build/qrcode.min.js`,
        ],
    },
};

export default cdn;
