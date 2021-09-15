// 歌词解析
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
const parseLyric = (lrc: string) => {
    const lines = lrc.split('\n')
    const lyric = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const result = timeExp.exec(line)
        if (!result) { continue; }
        const text = line.replace(timeExp, '').trim()
        if (!text) { continue; }
        lyric.push({
            time: (<any>result[1] * 6e4 + <any>result[2] * 1e3 + (<any>result[3] || 0) * 1) / 1e3,
            text,
        })
    }
    return lyric
}

export default parseLyric;
