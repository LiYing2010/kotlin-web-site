---
type: doc
layout: reference
category:
title: "与 JavaScript 交互"
---

# 与 JavaScript 交互

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin/Wasm 允许你在 Kotlin 中使用 JavaScript 代码, 也允许你在 JavaScript 中使用 Kotlin 代码.

和 [Kotlin/JS](../js/js-overview.html) 一样, Kotlin/Wasm 编译器也具有与 JavaScript 互操作的能力.
如果你熟悉 Kotlin/JS 的互操作能力, 你会注意到 Kotlin/Wasm 的互操作能力与此类似.
然而, 还是存在一些关键的差异需要注意.

> Kotlin/Wasm 功能处于 [Alpha 阶段](../components-stability.html). 它随时有可能变更.
> 请不要将这个功能用于正式产品.
> 希望你能通过我们的 [问题追踪系统](https://kotl.in/issue) 提供你的反馈意见.
{:.note}

## 在 Kotlin 中使用 JavaScript 代码

本节介绍如何在 Kotlin 中使用 JavaScript 代码,
方法是使用 `external` 声明, 带 JavaScript 代码块的函数, 以及 `@JsModule` 注解.

### 外部声明

在 Kotlin 中默认无法使用外部的 JavaScript 代码.
要在 Kotlin 中使用 JavaScript 代码, 你可以使用 `external` 声明来描述它的 API.

#### JavaScript 函数

对于这个 JavaScript 函数: 

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

你可以在 Kotlin 中将它声明为一个 `external` 函数:

```kotlin
external fun greet(name: String)
```

外部函数没有函数体, 你可以象通常的 Kotlin 函数那样调用它:

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 属性

对于这个 JavaScript 全局变量:

```javascript
let globalCounter = 0;
```

你可以在 Kotlin 中使用外部的 `var` 或 `val` 属性声明它:

```kotlin
external var globalCounter: Int
```

这些属性会在外部初始化. 在 Kotlin 代码中, 属性不能带有 `= value` 这样的初始化代码.

#### JavaScript 类

对于这个 JavaScript 类:

```javascript
class Rectangle {
    constructor (height, width) {
        this.height = height;
        this.width = width;
    }

    area () {
        return this.height * this.width;
    }
}
```

你可以在 Kotlin 中将它作为外部类来使用:

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

在 `external` 类之内的所有声明都会隐含的被认为是外部声明.

#### 外部接口

你可以在 Kotlin 中描述 JavaScript 对象的行为.
对于这个 JavaScript 函数和它的返回值:

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

请看在 Kotlin 中如何使用一个 `external interface User` 类型来描述它的行为:

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

外部接口没有运行期的类型信息, 它是只在编译期存在的概念.
因此, 外部接口与通常的接口相比, 存在一些限制:
* 你不能在 `is` 检查的右侧使用外部接口.
* 你不能在类字面值表达式(例如 `User::class`)中使用外部接口.
* 你不能将外部接口用做实体化的类型参数(Reified type parameter).
* 使用 `as` 操作符, 将一个对象类型转换为外部接口时, 永远会成功.

#### 外部对象

对于这些保存在对象中的 JavaScript 变量:

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

你可以在 Kotlin 中将它们作为外部对象来使用:

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 外部的类型层次结构

与通常的类和接口相似, 你可以让外部声明扩展其他的外部类, 实现外部接口.
但是, 你不能在同一个类型层次结构中混合使用外部声明和非外部声明.

### 带有 JavaScript 代码的 Kotlin 函数

你可以定义一个函数, 函数体为 `= js("code")` 形式, 这样就可以将 JavaScript 代码段添加到 Kotlin/Wasm 代码中:

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

如果你想要运行多条 JavaScript 语句组成的代码段, 请将你的代码包含在大括号 `{}` 内, 再放在字符串中:

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

如果你想要返回一个对象, 请在大括号 `{}` 之外加上小括号 `()`:

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm 会对 `js()` 函数调用特殊处理, 而且它的实现存在一些限制:
* `js()` 函数调用的参数必须是字符串字面值.
* `js()` 函数调用必须是函数体中唯一的表达式.
* 只允许在包级(package-level)函数中调用 `js()` 函数.
* 函数的返回值必须明确指定.
* [类型](#type-correspondence) 存在限制, 与 `external fun` 类似.

Kotlin 编译器会生成 JavaScript 文件, 将代码字符串放入函数中, 并将 JavaScript 文件导入为 WebAssembly 格式.
Kotlin 编译器不会验证这些 JavaScript 代码段.
如果存在 JavaScript 语法错误, 这些错误会在你运行 JavaScript 代码时报告.

> `@JsFun` 注解的功能与此类似, 可能会被弃用.
{:.note}

### JavaScript 模块

默认情况下, 外部声明对应于 JavaScript 的全局范围(global scope).
如果你对一个 Kotlin 文件标注 [`@JsModule` 注解](../js/js-modules.html#jsmodule-annotation),
那么这个文件内的所有外部声明都会从指定的模块导入.

请看这个 JavaScript 代码示例:

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

在 Kotlin 中, 使用 `@JsModule` 注解来使用这段 JavaScript 代码:

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

## 在 JavaScript 中使用 Kotlin 代码

本节介绍在 JavaScript 中如何使用你的 Kotlin 代码, 方法是使用 `@JsExport` 注解.

### 带 @JsExport 注解的函数

要让一个 Kotlin/Wasm 函数可以被 JavaScript 代码使用, 请添加 `@JsExport` 注解:

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

在生成的 `.mjs` 模块中, 标注了 `@JsExport` 注解的 Kotlin/Wasm 函数会成为一个 `default` export 上的属性.
然后你就可以在 JavaScript 中使用这个函数:

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

## 类型的对应关系

在与 JavaScript 交互的声明中, Kotlin/Wasm 只允许使用某些类型.
对于使用 `external`, `= js("code")` 或 `@JsExport` 的声明, 这些限制是统一的.

下面是 Kotlin 类型对应的 Javascript 类型:

| Kotlin                         | JavaScript                           |
|--------------------------------|--------------------------------------|
| `Byte`, `Short`, `Int`, `Char` | `Number`                             |
| `Float`, `Double`,             | `Number`                             |
| `Long`,                        | `BigInt`                             |
| `Boolean`,                     | `Boolean`                            |
| `String`,                      | `String`                             |
| 在 return 语句中的 `Unit`           | `undefined`                          |
| 函数类型, 例如 `(String) → Int`      | Function                             |
| `JsAny` 和子类型                   | 任何 JavaScript 值                      |
| `JsReference`                  | 指向 Kotlin 对象的不透明引用(Opaque Reference) |
| 其他类型                           | 不支持                                  |

你也可以使用这些类型的可为 null 的版本.

### JsAny 类型

JavaScript 值在 Kotlin 中使用 `JsAny` 类型和它的子类型来表示.

标准库提供了其中一些类型的表示:
* `kotlin.js` 包:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`
* `org.khronos.webgl` 包:
    * 类型数组, 例如 `Int8Array`
    * WebGL 类型
* `org.w3c.dom.*` 包:
    * DOM API 类型

你也可以声明一个 `external` 接口或类, 创建自定义的 `JsAny` 子类型.

### JsReference 类型

使用 `JsReference` 类型, Kotlin 值可以作为不透明引用(Opaque Reference)传递给 JavaScript.

例如, 如果你想要将这个 Kotlin 类 `User` 公开给 JavaScript:

```kotlin
class User(var name: String)
```

你可以使用 `toJsReference()` 函数来创建 `JsReference<User>`, 并将它返回给 JavaScript:

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

这些引用在 JavaScript 中不能直接使用, 行为就像空的冻结 JavaScript 对象.
要操作这些对象, 你需要将更多函数导出到 JavaScript, 方法是, 使用 `get()` 方法解包这些引用值:

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

你可以在 JavaScript 中创建一个类, 并改变它的名称:

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 类型参数

与 JavaScript 互操作的声明, 可以拥有类型参数, 类型参数的上界(Upper Bound)是 `JsAny` 或它的子类型.
例如:

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 异常处理

Kotlin 的 `try-catch` 表达式不能捕获 JavaScript 的异常.

如果你使用 JavaScript 的 `try-catch` 表达式来捕获 Kotlin/Wasm 的异常,
那么捕获的异常会象是一个普通的 `WebAssembly.Exception`, 没有可以直接访问的错误消息和数据.

## Kotlin/Wasm 互操作功能与 Kotlin/JS 互操作功能的区别

尽管 Kotlin/Wasm 互操作功能与 Kotlin/JS 互操作功能很类似, 但它们还是存在一些关键的差异需要注意:

|                 | **Kotlin/Wasm**                                                                                                                   | **Kotlin/JS**                                                                                                      |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| **外部枚举类型**      | 不支持外部枚举类.                                                                                                                         | 支持外部枚举类.                                                                                                           |
| **类型扩展**        | 不支持非外部类型扩展外部类型.                                                                                                                   | 支持非外部类型.                                                                                                           |
| **`JsName` 注解** | 这个注解时只有对外部声明标注时才有效.                                                                                                               | 可以用来修改通常的非外部声明的名称.                                                                                                 |
| **`js()` 函数**   | 只允许包级(package-level)函数调用 `js("code")` 函数, 而且`js()` 函数调用必须是函数体中唯一的表达式.                                                             | `js("code")` 函数可以在任何地方调用, 并返回一个 `dynamic` 值.                                                                       |
| **模块系统**        | 只支持 ES 模块. 没有类似的 `@JsNonModule` 注解. 会导出为 `default` 对象上的属性. 只允许导出包级函数.                                                             | 支持 ES 模块, 以及其它旧的模块系统. 提供有名称的 ESM 导出. 允许导出类和对象.                                                                     |
| **类型**          | 对所有的互操作性声明 `external`, `= js("code")`, 和 `@JsExport`, 统一适用更严格的类型限制. 只允许使用一部分的 [内建的 Kotlin 类型和 `JsAny` 子类型](#type-correspondence). | 在 `external` 声明中允许使用所有的类型. [在 `@JsExport` 中可以使用限定的类型](../js/js-to-kotlin-interop.html#kotlin-types-in-javascript). |
| **Long**        | 对应于 JavaScript 的 `BigInt` 类型.                                                                                                     | 在 JavaScript 中会成为一个自定义的类.                                                                                          |
| **Arrays**      | 在互操作功能中目前还不直接支持. 你可以改为使用新的 `JsArray` 类型.                                                                                          | 实现为 JavaScript 数组.                                                                                                 |
| **其他类型**        | 需要使用 `JsReference<>` 来将 Kotlin 对象传递给 JavaScript.                                                                                  | 允许在外部声明中使用非外部的 Kotlin 类类型.                                                                                         |
| **异常处理**        | 不能捕获 JavaScript 的异常.                                                                                                              | 能够通过 `Throwable` 类型捕获 JavaScript 的 `Error`. 可以使用 `dynamic` 类型捕获 JavaScript 的任何异常.                                    |
| **动态类型(Dynamic Type)**  | 不支持 `dynamic` 类型. 请改为使用 `JsAny` (参见下面的示例代码).                                                                 | 支持 `dynamic` 类型.                                                                                                   |

> Kotlin/JS 用于互操作的 [动态类型(Dynamic Type)](../js/dynamic-type.html), 使用无类型的, 或松散类型的对象, 在 Kotlin/Wasm 中不支持这个功能.
> 你可以使用 `JsAny` 类型来替代 `dynamic` 类型:
>
> ```kotlin
> // Kotlin/JS
> fun processUser(user: dynamic, age: Int) {
>     // ...
>     user.profile.updateAge(age)
>     // ...
> }
>
> // Kotlin/Wasm
> private fun updateUserAge(user: JsAny, age: Int): Unit =
>     js("{ user.profile.updateAge(age); }")
>
> fun processUser(user: JsAny, age: Int) {
>     // ...
>     updateUserAge(user, age)
>     // ...
> }
> ```
{:.note}
