---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript 中的反射功能"
---

# JavaScript 中的反射功能

目前, JavaScript 还不支持完整的 Kotlin 反射 API.
这部分 API 中唯一支持的是 `::class` 语法, 可以用来引用一个对象实例的类信息, 或者引用一个指定的类型的类信息.
`::class` 表达式的值是 [KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 的一个简化版实现,
只支持 [simpleName](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html)
和 [isInstance](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) 成员函数.

除此之外, 你还可以使用 [KClass.js](/api/latest/jvm/stdlib/kotlin.js/js.html)
来获取某个类的 [JsClass](/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 实例.
`JsClass` 的实例本身是一个指向构造函数的引用.
因此可以用来与那些需要用到构造函数引用的 JS 函数互操作.

示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class A
class B
class C

inline fun <reified T> foo() {
    println(T::class.simpleName)
}

val a = A()
println(a::class.simpleName)  // 获取对象实例的类信息; 打印结果为 "A"
println(B::class.simpleName)  // 获取数据类型的类信息; 打印结果为 "B"
println(B::class.js.name)     // 打印结果为 "B"
foo<C>()                      // 打印结果为 "C"
```
</div>
