const delay = (time = 1000) => new Promise<boolean>(resolve => {
    setTimeout(() => {
        resolve(true);
    }, time || 1);
});

export default delay;
