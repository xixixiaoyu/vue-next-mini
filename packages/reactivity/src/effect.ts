import type { Dep } from './dep'
import { createDep } from './dep'
import { isArray } from '@vue/shared'
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

type KeyToDepMap = Map<any, Dep>
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

  // 获取指定key的dep
  let dep = depsMap.get(key)
  // 设置访问的key和依赖set的映射关系
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  // 收集依赖
  trackEffect(dep)

  console.log('targetMap', targetMap)
}

/**
 * 利用 dep 依次跟踪指定 key 的所有 effect
 * @param dep
 */
export function trackEffect(dep: Dep) {
  dep.add(activeEffect!)
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

  // 根据设置的key获取Set依赖
  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) {
    return
  }

  // 遍历触发依赖Set里对象的run方法
  triggerEffects(dep)
}

/**
 * 依次触发Set中保存的依赖
 */
export function triggerEffects(dep: Dep) {
  // 转换数组
  const effects = isArray(dep) ? dep : [...dep]
  // 依次触发
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

/**
 * 触发指定的依赖
 */
export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
