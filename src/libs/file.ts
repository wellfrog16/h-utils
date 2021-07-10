interface imageOption {
    format: string; // todo枚举
    quality: number;
}

const defaultImageOption: imageOption = {
    format: 'image/png',
    quality: 1,
};

// canvas转dataURL，todo：测试
export const canvasToDataURL = (canvas: HTMLCanvasElement, option?: Partial<imageOption>) => {
    const myOption = { ...defaultImageOption, ...option };
    return canvas.toDataURL(myOption.format, myOption.quality);
};

// img转canvas，可以是dataurl/src，todo：测试
export const imageToCanvas = (data: string) => new Promise<HTMLCanvasElement>((resolve, reject) => {
    const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
    };
    img.onerror = () => {
        reject(new Error('图片加载错误'));
    };
    img.src = data;
});

// canvas转image，todo：测试
export const canvasToImage = (canvas: HTMLCanvasElement, option?: Partial<imageOption>) => {
    const img = new Image();
    img.src = canvasToDataURL(canvas, option);
    return img;
};

// File/Blob对象转DataURL，todo：测试
export const fileOrBlobToDataURL = (obj: File | Blob) => new Promise<string | ArrayBuffer>((resolve, reject) => {
    const file = new FileReader();
    file.readAsDataURL(obj);
    file.onload = e => {
        if (e.target && e.target.result) {
            resolve(e.target.result);
        } else {
            reject(new Error('文件加载失败'));
        }
    };
    file.onerror = () => {
        reject(new Error('文件加载错误'));
    };
});

export const dataURLtoUint8Array = (dataurl: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match) { throw new Error('dataURL数据错误'); }
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) { // eslint-disable-line no-plusplus
        u8arr[n] = bstr.charCodeAt(n);
    }
    return { uint8Array: u8arr, type: mime };
};

// DataURL转Blob对象，todo：测试
export const dataURLToBlob = (dataurl: string) => {
    const data = dataURLtoUint8Array(dataurl);
    return new Blob([data.uint8Array], { type: data.type });
};

// DataURL转File对象，todo：测试
export const dataURLToFile = (dataurl: string, fileName: string) => {
    const data = dataURLtoUint8Array(dataurl);
    return new File([data.uint8Array], fileName, { type: data.type });
};

// Blob转image，todo：测试
export const blobToImage = (blob: Blob) => new Promise<HTMLImageElement>((resolve, reject) => {
    fileOrBlobToDataURL(blob).then(dataurl => {
        const img = new Image();
        img.src = dataurl as string;
        resolve(img);
    }).then(e => reject(e));
});

// image转Blob，todo：测试
export const imageToBlob = (data: string) => new Promise<Blob>((resolve, reject) => {
    imageToCanvas(data).then(canvas => {
        resolve(dataURLToBlob(canvasToDataURL(canvas)));
    }).catch(e => reject(e));
});

// Blob图片转canvas，todo：测试
export const blobToCanvas = (blob: Blob) => new Promise<HTMLCanvasElement>((resolve, reject) => {
    fileOrBlobToDataURL(blob).then(dataurl => {
        imageToCanvas(dataurl as string)
            .then(canvas => resolve(canvas))
            .catch(e => reject(e));
    }).catch(e => reject(e));
});

// canvas图片转Blob，todo：测试
export const canvasToBlob = (canvas: HTMLCanvasElement) => dataURLToBlob(canvasToDataURL(canvas));

// image（url/dataurl）转dataURL，todo：测试
export const imageToDataURL = (data: string) => new Promise<string>((resolve, reject) => {
    imageToCanvas(data)
        .then(canvas => resolve(canvasToDataURL(canvas)))
        .catch(e => reject(e));
});

// dataURL转image，todo：测试
export const dataURLToImage = (dataurl: string) => {
    const img = new Image();
    img.src = dataurl;
    return img;
};

// 字符串转ArrayBuffer，todo：测试
export const stringToArrayBuffer = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; i += 1) {
        view[i] = s.charCodeAt(i) & 0xFF; // eslint-disable-line
    }
    return buf;
};

export default {
    canvasToDataURL,
    imageToCanvas,
    canvasToImage,
    fileOrBlobToDataURL,
    dataURLtoUint8Array,
    dataURLToBlob,
    dataURLToFile,
    blobToImage,
    imageToBlob,
    blobToCanvas,
    canvasToBlob,
    imageToDataURL,
    dataURLToImage,
    stringToArrayBuffer,
}
