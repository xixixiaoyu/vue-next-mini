# reactivity

响应性模块

1.  首先我们在 packages/reactivity/src/reactive.ts 中，创建了一个 reactive 函数，该函数可以帮助我们生成一个 proxy 实例对象
2.  通过该 proxy 实例的 handler 可以监听到对应的 getter 和 setter
3.  然后我们在 packages/reactivity/src/effect.ts 中，创建了一个 effect 函数，通过该函数可以创建一个 ReactiveEffect 的实例，该实例的构造函数可以接收传入的回调函数 fn，并且提供了一个 run 方法
4.  触发 run 可以为 activeEffect 进行赋值，并且执行 fn 函数
5.  我们需要在 fn 函数中触发 proxy 的 getter，以此来激活 handler 的 get 函数
6.  在 handler 的 get 函数中，我们通过 WeakMap 收集了指定对象指定属性的 fn，这样的一步操作，我们把它叫做依赖收集
7.  最后我们可以在任意时刻修改 proxy 的数据，这样会触发 handler 的 setter
8.  在 handler 的 setter 中，我们会根据 指定对象 target 的 指定属性 key 来获取到保存的 依赖，然后我们只需要触发依赖，即可达到修改数据的效果
