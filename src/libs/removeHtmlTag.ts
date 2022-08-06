const removeHtmlTag = (str: string) => {
    if (!str) { return '' }
    return str.replace(/<[^>]+>|&[^>]+;/g, '').trim()
}

export default removeHtmlTag
