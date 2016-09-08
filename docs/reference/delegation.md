---
type: doc
layout: reference
category: "Syntax"
title: "委托"
---

# 委托(Delegation)

## 类的委托(Class Delegation)

[委托模式](https://en.wikipedia.org/wiki/Delegation_pattern) 已被实践证明为类继承模式之外的另一种很好的替代方案, Kotlin 直接支持委托模式, 因此你不必再为了实现委托模式而手动编写那些无聊的例行公事的代码(boilerplate code)了.
比如, `Derived` 类可以继承 `Base` 接口, 并将 `Base` 接口所有的 public 方法委托给一个指定的对象:

``` kotlin
interface Base {
  fun print()
}

class BaseImpl(val x: Int) : Base {
  override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main(args: Array<String>) {
  val b = BaseImpl(10)
  Derived(b).print() // 打印结果为: 10
}
```

`Derived` 类声明的基类列表中的 *by*{: .keyword } 子句表示, `b` 将被保存在 `Derived` 的对象实例内部, 而且编译器将会生成继承自 `Base` 接口的所有方法, 并将调用转发给 `b`.

