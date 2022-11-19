/**
 * effect 函数
 * @param fn 执行方法
 * @returns 以 ReactiveEffect 实例为 this 的 fn 执行函数
 */
export function effect<T = any>(fn: () => T) {
  // 生成ReactiveEffect实例
  const _effect = new ReactiveEffect(fn)
  // 执行实例run方法
  _effect.run()
}

// 单例的，当前的 effect
export let activeEffect: ReactiveEffect | undefined

// 响应性触发依赖时的执行类
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
  run() {
    // activeEffect赋值当前实例
    activeEffect = this
    // 执行effect传入函数
    return this.fn()
  }
}

type KeyToDepMap = Map<any, ReactiveEffect>
/**
 * 收集所有依赖的 WeakMap 实例：
 * 1. `key`：响应性对象
 * 2. `value`：`Map` 对象
 * 		1. `key`：响应性对象的指定属性
 * 		2. `value`：指定对象的指定属性的 执行函数
 */
const targetMap = new WeakMap<any, KeyToDepMap>()

/**
 * 用于收集依赖的方法
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 */
export function track(target: object, key: unknown) {
  // 当前不存在执行函数直接return
  if (!activeEffect) {
    return
  }
  // 根据new Proxy传入对象从targetMap取值
  let depsMap = targetMap.get(target)

  // 没有值，则构造外层结构映射关系
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 设置访问的key和activeEffect实例映射关系
  depsMap.set(key, activeEffect)

  console.log('targetMap', targetMap)
}

/**
 * 触发依赖的方法
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 * @param newValue 指定 key 的最新值
 * @param oldValue 指定 key 的旧值
 */
export function trigger(target: object, key?: unknown, newValue?: unknown) {
  // 根据new Proxy传入对象从targetMap取值
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  // 根据设置的key取到对象，该对象是一个ReactiveEffect实例
  const effect = depsMap.get(key) as ReactiveEffect
  if (!effect) {
    return
  }
  // 执行传入实例的fn方法
  effect.fn()
}
