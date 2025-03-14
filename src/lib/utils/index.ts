export function getTransformNumber(value, type = 'string') {
  const newVal = value < 10 ? `0${value}` : value
  return !type || type === 'string' ? String(newVal) : Number(newVal)
}

export function getCurrentDate(time = null, insert = '') {
  const date = time ? new Date(time) : new Date()
  const year = date.getFullYear()
  const month = getTransformNumber(date.getMonth() + 1)
  const day = getTransformNumber(date.getDate())
  const week = ['末', '一', '二', '三', '四', '五', '六'][date.getDay()]
  return insert ? [year, month, day, week].join(insert) : [year, month, day, week]
}

/**
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function getUid(len = 32, firstU = true, radix = null) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
  if (firstU) {
    uuid.shift()
    return `u${uuid.join('')}`
  }
  return uuid.join('')
}

/**
 * @date  2022-09-18
 * @desc  随机命中给定数组的一条作为结果返回
 * @param {Array} 给定数组
 * @author jason@coindpay.xyz
 */
export function getRandomItem(arr = []) {
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx]
}
/**
 * @param {minNum} number 随机数最小值
 * @param {maxNum} number 随机数最大值
 * @param {decimal} number 小数位数
 */
export const getRandomNum = (minNum: number, maxNum: number, decimal?: number): number => {
  let randomNum = Math.random() * (maxNum - minNum) + minNum
  if (decimal !== undefined) {
    // 指定小数位数
    return parseFloat(randomNum.toFixed(decimal))
  } else {
    // 整数
    return Math.floor(randomNum)
  }
}

/**
 * https://nextjs.org/docs/api-reference/next/image#blurdataurl
 * @param str
 * @returns
 */
export const getBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

/**
 * https://github.com/vercel/next.js/blob/canary/examples/image-component/pages/shimmer.tsx
 * @param w
 * @param h
 * @returns
 * @author jason@coindpay.xyz
 */
export const getShimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#e5e7eb" offset="20%" />
        <stop stop-color="#d1d5db" offset="50%" />
        <stop stop-color="#e5e7eb" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#d1d5db" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`
/**
 * https://nextjs.org/docs/api-reference/next/image#placeholder
 * @param w
 * @param h
 * @returns
 * @author jason@coindpay.xyz
 */
export const getBlurDataURL = (w, h) =>
  `data:image/svg+xml;base64,${getBase64(getShimmer(w || window?.screen?.width, h || window?.screen?.height))}`

/**
 * @date 2022-07-13
 * @desc deeply copy object or arrays with nested attributes
 * @param  {any} obj
 * @return {any} a depply copied replica of arguement passed
 * @author  jason@coindpay.xyz
 */
export function deepClone(obj) {
  return structuredClone(obj)
  // if (!obj || typeof obj !== 'object') {
  //   return obj
  // }
  // // 根据obj的类型判断是新建一个数组还是对象
  // const newObj = obj instanceof Array ? [] : {}
  // for (let key in obj) {
  //   if (obj.hasOwnProperty(key)) {
  //     newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
  //   }
  // }
  // return newObj
}
/**
 * @date 2022-10-20
 * @desc 防抖函数
 * @param {Function} callBack
 * @return {Function} fn
 * @author  jason@coindpay.xyz
 */
export function debounce(fn, delay = 500) {
  // 定时器，用来 setTimeout
  let timer
  return function (...args) {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * 2022-10-21
 * @desc 16进制颜色值转rgba值，支持透明度配置
 * @param {*} hex
 * @param {*} opacity
 * @returns rgba
 * @author  jason@coindpay.xyz
 */
export function getHexToRgba(hex, opacity) {
  return (
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    opacity +
    ')'
  )
}

/**
 * studio blocks url & email格式加工
 */
export function getBlocksUrlFactory(url: string) {
  if (!isUrl(url)) return
  if (isEmail(url) && !isEmailMailto(url)) {
    return `mailto:${url}`
  }
  return url
}
/**
 * @desc 将长字符串转为短字符串，超出部分显示为...
 * @param {*} str 待处理字符串
 * @param length 需保留的长度 默认为10
 * @return 返回处理后的字符串
 */
export const getShortenEndDots = (str: string, length = 10): string => {
  if (typeof str !== 'string') return str
  if (str.length < length) return str
  return str.slice(0, length) + '...'
}
/**
 * @desc 截取str一定长度并设置中间三个点
 * @param string
 * @returns
 */
export const getShortenMidDots = (str: string, length = 8) => {
  if (!str) return
  return `${str?.slice(0, length)}...${str?.slice(-length)}`
}

/**
 * 获取手机端和pc端的不同动画效果
 * @param isShow number 0隐藏，1淡入，2淡出
 * @param isMobile boolean 是否移动端
 * @returns className
 */
export function getAnimateClass(isShow: number, isMobile: boolean, isStudio: boolean) {
  switch (isShow) {
    case 1:
      return isMobile ? 'animate__fadeInUpBig' : isStudio ? 'animate__fadeInRightBig' : 'animate__zoomIn'
      break
    case 2:
      return isMobile ? 'animate__slideOutDown' : isStudio ? 'animate__fadeOutRightBig' : 'animate__zoomOut'
      break
    default:
      break
  }
}

export const generateId = () => Math.random().toString(10).slice(2)

export const generateRandomString = (randomNum = 9) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < randomNum; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * 判断是否为mongodb uuid规范
 * @param val
 * @returns
 */
export const isUuid = val => /^[0-9a-fA-F]{24}$/.test(val)

/**
 * 校验http、https url & email
 * @param url
 * @returns
 */
export function isUrl(url: string) {
  if (!url) return
  return /(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-]|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g.test(
    url
  )
}
/**
 * 仅匹配链接 http、https url
 */
export function isLink(url: string) {
  if (!url) return
  return url.match(/https?:\/\/(?:[\w-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?/g)
}
/**
 * 匹配不带前缀的url
 */
export function isUrlDomain(url: string) {
  if (!url) return
  return url.match(/(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/\S*)?/g)
}
/**
 * 匹配email（非mailto格式开头）
 */
export function isEmail(url: string) {
  if (!url) return
  return url.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g)
}
/**
 * 匹配email（mailto格式开头）
 */
export function isEmailMailto(url: string) {
  if (!url) return
  return url.match(/mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)
}

export function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}
export const isAppleOS = () =>
  typeof navigator !== 'undefined' && /(iPhone|iPad|iPod|iOS|iPhone OS|Mac OS)/i.test(navigator.userAgent)

export const isiOS = () => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

export const isNumber = val => typeof val === 'number' && !isNaN(val)

export function getEnvSplit(val) {
  if (!val) return
  let names = val?.split(/[(\r\n)\r\n]+/)
  if (names && Array.isArray(names)) return names
}

export function nFormatter(num?: number, digits?: number) {
  if (!num) return '0'
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0'
}

export function capitalize(str: string) {
  if (!str || typeof str !== 'string') return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @description 字符串转整数
 * @param str
 * @returns 返回转换后的数字
 */
export const convertToNumber = (str: string) => {
  if (typeof str !== 'string') {
    return null
  }
  // 检查字符串是否合法
  if (!/^\d+$/.test(str)) {
    return null // 或其他默认值或错误处理
  }
  // 尝试转换
  try {
    const num = parseInt(str, 10) // 或其他转换方法
    return num
  } catch (error) {
    return null // 或其他错误处理
  }
}

/**
 *
 * @param array
 * @returns
 */
export const shuffle = (array = []) => {
  if (!array || !array?.length) return
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * 首字母大写
 * @param str
 * @returns
 */
export function getCapitalizeWord(str) {
  if (!str?.length) return str
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(^|\s)\S/g, match => match.toUpperCase())
}

export function getCompareIgnoreCase(left: string, right: string): boolean {
  return left?.toLowerCase() == right?.toLowerCase()
}

export function getIncludesIgnoreCase(left: string, right: string): boolean {
  return left?.toLowerCase().includes(right?.toLowerCase())
}

export function getDecimalFormatValue({ val, decimal = 3 }) {
  if (val == null || val == undefined) return '' // 如果值为空，返回空字符串
  const num = parseFloat(val)
  if (isNaN(num)) return val // 如果值不是数字，返回原始值
  return num.toFixed(decimal).replace(/\.?0+$/, '') // 格式化显示值
}
