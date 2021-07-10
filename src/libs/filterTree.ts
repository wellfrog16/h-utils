// 树查找，节点符合要求则返回整个节点
const filterTree = <T extends { children?: T[] }>(items: T[], check: (item: T) => boolean): T[] => {
    const result: T[] = [];

    items.forEach(item => {
        if (check(item)) {
            result.push(item);
        } else if (item.children && item.children.length > 0) {
            const children = filterTree(item.children, check);
            if (children && children.length > 0) {
                result.push({ ...item, children });
            }
        }
    });

    return result;
};

export default filterTree;
