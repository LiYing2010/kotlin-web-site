---
type: doc
layout: reference
category: "JavaScript"
title: "在 JavaScript 中调用 Kotlin"
---

# 在 JavaScript 中调用 Kotlin

Kotlin 编译器会生成通常的 JavaScript 类, 函数, 和属性, 你可以在 JavaScript 代码中自由地使用它们.
但是, 有一些细节问题, 你应该记住.

## 将声明隔离在独立的 JavaScript 对象内

为了避免破坏全局对象, Kotlin 会创建一个对象, 其中包含来自当前模块的所有 Kotlin 声明.
因此, 如果你将你的模块命名为 `myModule`, 在 JavaScript 中可以通过 `myModule` 对象访问到所有的声明. 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun foo() = "Hello"
```
</div>

在 JavaScript 中可以这样调用:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(myModule.foo());
```
</div>

如果你将你的 Kotlin 模块编译为 JavaScript 模块(详情请参见 [JavaScript 模块](js-modules.html)), 就会出现兼容问题.
这时不会存在一个封装对象, 所有的声明会以相应的 JavaScript 模块的形式对外公开.
比如, 在 CommonJS 中你应该这样:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(require('myModule').foo());
```
</div>


## 包结构

Kotlin 会将它的包结构公开到 JavaScript 中, 因此, 除非你将你的声明定义在最顶层包中,
否则在 JavaScript 中就必须使用完整限定名来访问你的声明. 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```
</div>

在 JavaScript 中应该这样访问:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(myModule.my.qualified.packagename.foo());
```
</div>


## @JsName 注解

某些情况下 (比如, 为了支持重载(overload)), Kotlin 编译器会对 JavaScript 代码中生成的函数和属性的名称进行混淆.
为了控制编译器生成的函数和属性名称, 你可以使用 `@JsName` 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// 'kjs' 模块
class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```
</div>

然后, 你可以在 JavaScript 中通过以下方式来使用这个类:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
var person = new kjs.Person("Dmitry");   // 参照到 'kjs' 模块
person.hello();                          // 打印结果为 "Hello Dmitry!"
person.helloWithGreeting("Servus");      // 打印结果为 "Servus Dmitry!"
```
</div>

如果我们不指定 `@JsName` 注解, 那么编译器将会根据函数签名计算得到一个后缀字符串,
添加到生成的函数名末尾, 比如 `hello_61zpoe$`.

注意, Kotlin 编译器对 `external` 声明不会进行这样的名称混淆, 因此你不必对 `external` 声明使用 `@JsName` 注解.
另一种值得注意的情况是, 从 `external` 类继承来的非 `external` 类.
这种情况下, 所有被覆盖的函数名称都不会进行混淆.

`@JsName` 注解的参数要求是字面值的字符串常量, 而且必须是一个有效的标识符.
如果将非标识符字符串用于 `@JsName` 注解, 编译器会报告错误.
下面的示例会常数一个编译期错误:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@JsName("new C()")   // 此处发生错误
external fun newC()
```
</div>


## Kotlin 类型在 JavaScript 中的表达

* 除 `kotlin.Long` 外, Kotlin 的数字类型都被映射为 JavaScript 的 Number 类型.
* `kotlin.Char` 被映射为 JavaScript 的 Number, 值为字符编码.
* Kotlin 在运行时无法区分数字类型(除 `kotlin.Long` 外), 也就是说, 以下代码能够正常工作:
  <div class="sample" markdown="1" theme="idea" data-highlight-only>
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```
  </div>

* Kotlin 保留了 `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` 和 `kotlin.Long` 的溢出语义.
* 在 JavaScript 中没有 64 位整数, 所以 `kotlin.Long` 没有映射到任何 JavaScript 对象,
  它会通过一个 Kotlin 类来模拟实现.
* `kotlin.String` 映射为 JavaScript 字符串.
* `kotlin.Any` 映射为 JavaScript 的 Object (也就是 `new Object()`, `{}`, 等等).
* `kotlin.Array` 映射为 JavaScript 的 Array.
* Kotlin 集合 (也就是 `List`, `Set`, `Map`, 等等) 不会映射为任何特定的 JavaScript 类型.
* `kotlin.Throwable` 映射为 JavaScript 的 Error.
* Kotlin 在 JavaScript 中保留了延迟加载对象的初始化处理.
* Kotlin 在 JavaScript 中没有实现顶级属性的延迟加载初始化处理.

从 Kotlin 1.1.50 版开始, 基本类型的数组使用 JavaScript 的 TypedArray 来实现:

* `kotlin.ByteArray`, `-.ShortArray`, `-.IntArray`, `-.FloatArray`, 以及 `-.DoubleArray`
分别映射为 JavaScript 的 Int8Array, Int16Array, Int32Array, Float32Array, 和 Float64Array.
* `kotlin.BooleanArray` 映射为 JavaScript 的 Int8Array, 并且属性 `$type$ == "BooleanArray"`
* `kotlin.CharArray` 映射为 JavaScript 的 UInt16Array, 并且属性 `$type$ == "CharArray"`
* `kotlin.LongArray` 映射为 JavaScript 的 `kotlin.Long` 数组, 并且属性 `$type$ == "LongArray"`.
