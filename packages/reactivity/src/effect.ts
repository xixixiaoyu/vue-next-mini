/**
 * 用于收集依赖的方法
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 */
export function track(target: object, key: unknown) {
  console.log('track: 收集依赖')
}

/**
 * 触发依赖的方法
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 * @param newValue 指定 key 的最新值
 * @param oldValue 指定 key 的旧值
 */
export function trigger(target: object, key?: unknown, newValue?: unknown) {
  console.log('trigger: 触发依赖')
}

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
