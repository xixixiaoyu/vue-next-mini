import { isFunction } from '@vue/shared'
import type { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

/**
 * 计算属性类
 */
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  public readonly effect: ReactiveEffect<T>
  public readonly __v_isRef = true
  // 脏数据标识
  public _dirty = true

  constructor(getter) {
    this.effect = new ReactiveEffect(getter, () => {
      // 为false表示需要触发依赖
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
  }

  get value() {
    // 收集依赖
    trackRefValue(this)
    // 为true时直接触发run方法获取最新数据
    if (this._dirty) {
      this._dirty = false
      // 执行run函数
      this._value = this.effect.run()
    }
    // 返回run函数执行结果
    return this._value
  }
}

/**
 * 计算属性
 */
export function computed(getterOrOptions) {
  let getter
  // 判断是函数就赋值getter
  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
  }

  const cRef = new ComputedRefImpl(getter)

  return cRef
}
