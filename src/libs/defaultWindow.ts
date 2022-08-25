const isClient = typeof window !== 'undefined'
const defaultWindow = /* #__PURE__ */ isClient ? window : undefined

export default defaultWindow
