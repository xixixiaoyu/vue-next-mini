import type { Dep } from './dep'
import { activeEffect, trackEffects, triggerEffects } from './effect'
import { createDep } from './dep'
import { toReactive } from './reactive'
import { hasChanged } from '@vue/shared'

export interface Ref<T = any> {
  value: T
}

// ref函数
export function ref(value?: unknown) {
  return createRef(value, false)
}

/**
 * 创建 RefImpl 实例
 * @param rawValue 原始数据
 * @param shallow boolean 形数据，表示《浅层的响应性（即：只有 .value 是响应性的）》
 * @returns
 */
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public dep?: Dep = undefined
  // 是否为 ref 类型数据的标记
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    // 如果__v_isShallow为true，则不会转换为响应式数据
    this._value = __v_isShallow ? value : toReactive(value)
    // 原始数据
    this._rawValue = value
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      // 更新原始数据
      this._rawValue = newValue
      // 更新.value的值
      this._value = toReactive(newValue)
      // 触发依赖
      triggerRefValue(this)
    }
  }
}

// 指定数据是否是 RefImpl 类型
function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

// 为 ref 的 value 进行依赖收集工作
export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

//  为 ref 的 value 进行触发依赖工作
export function triggerRefValue(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}
