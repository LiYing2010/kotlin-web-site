---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript 中的反射功能"
---

# JavaScript 中的反射功能

当 Kotlin 代码编译为 JavaScript 时, 对任意对象, 有一个可用的属性 `jsClass`, 这个属性的值类型为 `JsClass`. 通过 `JsClass` 类型, 目前只能得到对应的(非全称限定的)类名称. 但是, `JsClass` 的实例本身是一个指向构造函数的引用.
因此可以用来与那些需要用到构造函数引用的 JS 函数互操作.

还可以使用 `::class` 语法得到类的引用. 在 JavaScript 环境的 Kotlin 语言中, 目前还不支持完整的反射功能 API; 唯一可用的属性是: `.simpleName` 属性, 它返回类的名称, 以及 `.js` 属性, 它返回对应的 `JsClass` 实例.

示例:

``` kotlin
class A
class B
class C

inline fun <reified T> foo() {
    println(jsClass<T>().name)
}

println(A().jsClass.name)     // prints "A"
println(B::class.simpleName)  // prints "B"
println(B::class.js.name)     // prints "B"
foo<C>()                      // prints "C"
```
