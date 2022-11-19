// 判断是否数组
export const isArray = Array.isArray

// 判断是否对象
export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object'
