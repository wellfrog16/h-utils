// 树查找，节点符合要求则返回整个节点
// eslint-disable-next-line no-unused-vars
const filter = <T extends { children?: T[] }>(items: T[], check: (item: T) => boolean): T[] => {
    const result: T[] = [];

    items.forEach(item => {
        if (check(item)) {
            result.push(item);
        } else if (item.children && item.children.length > 0) {
            const children = filter(item.children, check);
            if (children && children.length > 0) {
                result.push({ ...item, children });
            }
        }
    });

    return result;
};

// 返回节点路径
// eslint-disable-next-line no-unused-vars
const getPath = <T extends { children?: T[] }>(items: T[], check: (item: T) => boolean): T[] => {
    const result: T[] = [];

    const getNode = (items1: T[]): boolean => {
        return items1.some(item => {
            result.push(item);

            if (check(item)) {
                return true;
            } else if (item.children && item.children.length > 0) {
                const isGot = getNode(item.children)
                if (isGot) {
                    return true;
                } else {
                    result.pop();
                    return false;
                }
            } else {
                result.pop();
                return false;
            }
        });
    }

    getNode(items);
    return result;
};

export default {
    filter,
    getPath,
};
