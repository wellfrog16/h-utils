const imageSize = (url: string) => {
    return new Promise<{ width: number, height: number }>((resolve, reject) => {
        const img = new Image();
        img.src = url;

        const timeout = 3000; // 检测超时上限
        const interval = 10; // 检测频率
        let times = 0; // 已用时
        let timer: NodeJS.Timeout; // setInterval

        function check() {
            times += interval;

            // 加载超时
            if (times >= timeout) {
                clearInterval(timer);
                img.src = '';
                reject(new Error('time out!'));
            }

            //  只要任何一方大于0
            // 表示服务器已经返回宽高
            if (img.width > 0 || img.height > 0) {
                clearInterval(timer);
                const size = { width: img.width, height: img.height };
                img.src = '';
                resolve(size);
            }
        }
        timer = setInterval(check, interval);
    });
}

export default imageSize;
