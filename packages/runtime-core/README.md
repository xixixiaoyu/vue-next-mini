# runtime-core

运行时核心模块

## watch

- watch 本质上还是依赖于 ReactiveEffect 进行实现，也需要进行依赖收集和触发
- 还需要一个调度器来控制执行顺序和执行规则
