---
type: doc
layout: reference
category: "JavaScript"
title: "在 JavaScript 中使用 Kotlin 代码"
---

# 在 JavaScript 中使用 Kotlin 代码

本页面最终更新: 2021/08/25

根据选择的 [JavaScript 模块](js-modules.html) 系统不同, Kotlin/JS 编译期会产生不同的输出.
但通常 Kotlin 编译器会生成通常的 JavaScript 类, 函数, 和属性, 你可以在 JavaScript 代码中自由地使用它们.
但是, 有一些细节问题, 你需要记住.

## 将声明隔离在 plain 模式下的独立 JavaScript 对象内

如果你将模块类型明确设置为 `plain`, Kotlin 会创建一个对象,
其中包含来自当前模块的所有 Kotlin 声明, 以免破坏全局对象.
因此, 对于模块 `myModule`, 在 JavaScript 中可以通过 `myModule` 对象访问到所有的声明.
比如:

```kotlin
fun foo() = "Hello"
```

在 JavaScript 中可以这样调用:

```javascript
alert(myModule.foo());
```

如果你将你的 Kotlin 模块编译为 JavaScript 模块, 比如 UMD, CommonJS 或 AMD
(对编译目标 `browser` 和 `nodejs`, 默认设定是 UMD), 就会出现兼容问题.
这种情况下, 你的声明对外公开时使用的格式将由你选择的 JavaScript 模块系统决定.
比如, 如果使用 UMD 或 CommonJS, 那么需要这样来使用你的代码:

```javascript
alert(require('myModule').foo());
```

关于 JavaScript 模块系统, 更多详情请参见 [JavaScript 模块(Module)](js-modules.html).

## 包结构

Kotlin 会将它的包结构公开到 JavaScript 中, 因此, 除非你将你的声明定义在最顶层包中,
否则在 JavaScript 中就必须使用完整限定名来访问你的声明. 比如:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

比如, 如果使用 UMD 或 CommonJS, 那么调用端应该如下:

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

如果模块系统使用 `plain` 模式, 那么应该是:

```javascript
alert(myModule.my.qualified.packagename.foo());
```

## @JsName 注解

某些情况下 (比如, 为了支持重载(overload)), Kotlin 编译器会对 JavaScript 代码中生成的函数和属性的名称进行混淆.
为了控制编译器生成的函数和属性名称, 你可以使用 `@JsName` 注解:

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

然后, 你可以在 JavaScript 中通过以下方式来使用这个类:

```javascript
// 如果需要, 请根据你选择的模块系统, import 对应的 'kjs' 模块
var person = new kjs.Person("Dmitry");   // 参照到 'kjs' 模块
person.hello();                          // 打印结果为 "Hello Dmitry!"
person.helloWithGreeting("Servus");      // 打印结果为 "Servus Dmitry!"
```

如果我们不指定 `@JsName` 注解, 那么编译器将会根据函数签名计算得到一个后缀字符串,
添加到生成的函数名末尾, 比如 `hello_61zpoe$`.

注意, 有些情况下 Kotlin 编译器不会进行这样的名称混淆:
- 对 `external` 声明, 不会进行名称混淆.
- 从 `external` 类继承的非 `external` 类之内, 被覆盖的函数, 不会进行名称混淆.

`@JsName` 注解的参数要求是字面值的字符串常量, 而且必须是一个有效的标识符.
如果将非标识符字符串用于 `@JsName` 注解, 编译器会报告错误.
下面的示例会常数一个编译期错误:

```kotlin
@JsName("new C()")   // 此处发生错误
external fun newC()
```


### @JsExport 注解

> `@JsExport` 注解目前还在实验性阶段. 在未来的发布版本中, 它的设计可能会发生变化.
{:.note}

对一个顶级声明 (比如一个类或函数)使用 `@JsExport` 注解, 就可以在 JavaScript 中访问 Kotlin 声明.
这个注解会使用 Kotlin 中给定的名称, 导出所有的下层声明.
使用 `@file:JsExport` 的方式, 还可以将这个注解应用于整个源代码文件.

为了在导出声明时解决名称的歧义(比如同名函数的重载(overload)),
可以将 `@JsExport` 注解和 `@JsName` 注解一起使用, 用来指定生成和导出的函数名称.

在当前默认的编译器后端, 以及新的 [IR 编译器后端](js-ir-compiler.html)中, 都可以使用 `@JsExport` 注解.
如果你使用 IR 编译器后端, 那么 **必须** 从一开始就使用 `@JsExport` 注解, 来确保你的函数在 Kotlin 中可以使用.

对于跨平台项目, 在共通代码中也可以使用 `@JsExport`.
它只在针对 JavaScript 目标进行编译时才起作用, 并且允许你导出那些平台无关的 Kotlin 声明.

## JavaScript 中的 Kotlin 类型

* 除 `kotlin.Long` 外, Kotlin 的数字类型都被映射为 JavaScript 的 `Number` 类型.
* `kotlin.Char` 被映射为 JavaScript 的 `Number`, 值为字符编码.
* Kotlin 在运行时无法区分数字类型(除 `kotlin.Long` 外), 因此以下代码能够正常工作:

  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 保留了 `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` 和 `kotlin.Long` 的溢出语义.
* `kotlin.Long` 没有映射到任何 JavaScript 对象, 因为在 JavaScript 中没有 64 位整数. 它通过一个 Kotlin 类来模拟实现.
* `kotlin.String` 映射为 JavaScript `String`.
* `kotlin.Any` 映射为 JavaScript 的 `Object` (`new Object()`, `{}`, 等等).
* `kotlin.Array` 映射为 JavaScript 的 `Array`.
* Kotlin 集合 (`List`, `Set`, `Map`, 等等) 不会映射为任何特定的 JavaScript 类型.
* `kotlin.Throwable` 映射为 JavaScript 的 Error.
* Kotlin 在 JavaScript 中保留了延迟加载对象的初始化处理.
* Kotlin 在 JavaScript 中没有实现顶级属性的延迟加载初始化处理.

### 基本类型的数组

基本类型的数组使用 JavaScript 的 `TypedArray` 来实现:

* `kotlin.ByteArray`, `-.ShortArray`, `-.IntArray`, `-.FloatArray`, 以及 `-.DoubleArray`
  分别映射为 JavaScript 的 `Int8Array`, `Int16Array`, `Int32Array`, `Float32Array`, 和 `Float64Array`.
* `kotlin.BooleanArray` 映射为 JavaScript 的 `Int8Array`, 并带有属性 `$type$ == "BooleanArray"`
* `kotlin.CharArray` 映射为 JavaScript 的 `UInt16Array`, 并带有属性 `$type$ == "CharArray"`
* `kotlin.LongArray` 映射为 JavaScript 的 `kotlin.Long` 构成的 `Array`, 并带有属性 `$type$ == "LongArray"`.
