// 判断是否数组
export const isArray = Array.isArray

// 判断是否对象
export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object'

// 判断是否变化
export const hasChanged = (value: any, oldValue: any) =>
  !Object.is(value, oldValue)

// 判断是否函数
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
