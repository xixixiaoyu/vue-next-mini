import { isFunction } from '@vue/shared'
import type { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue } from './ref'

/**
 * 计算属性类
 */
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  public readonly effect: ReactiveEffect<T>
  public readonly __v_isRef = true

  constructor(getter) {
    this.effect = new ReactiveEffect(getter)
    this.effect.computed = this
  }

  get value() {
    // 触发依赖
    trackRefValue(this)
    // 执行run函数，得到结果后返回
    this._value = this.effect.run()
    return this._value
  }
}

/**
 * 计算属性
 */
export function computed(getterOrOptions) {
  let getter
  // 判断是函数就赋值getter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  }

  const cRef = new ComputedRefImpl(getter)

  return cRef
}
