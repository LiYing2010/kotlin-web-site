[//]: # (title: 与 JavaScript 交互)

Kotlin/Wasm 允许你在 Kotlin 中使用 JavaScript 代码, 也允许你在 JavaScript 中使用 Kotlin 代码.

和 [Kotlin/JS](js-overview.md) 一样, Kotlin/Wasm 编译器也具有与 JavaScript 互操作的能力.
如果你熟悉 Kotlin/JS 的互操作能力, 你会注意到 Kotlin/Wasm 的互操作能力与此类似.
然而, 还是存在一些关键的差异需要注意.

> Kotlin/Wasm 功能处于 [Alpha 阶段](components-stability.md). 它随时有可能变更.
> 请不要将这个功能用于正式产品.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 提供你的反馈意见.
>
{style="note"}

## 在 Kotlin 中使用 JavaScript 代码 {id="use-javascript-code-in-kotlin"}

本节介绍如何在 Kotlin 中使用 JavaScript 代码,
方法是使用 `external` 声明, 带 JavaScript 代码块的函数, 以及 `@JsModule` 注解.

### 外部声明 {id="external-declarations"}

在 Kotlin 中默认无法使用外部的 JavaScript 代码.
要在 Kotlin 中使用 JavaScript 代码, 你可以使用 `external` 声明来描述它的 API.

#### JavaScript 函数 {id="javascript-functions"}

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

#### JavaScript 属性 {id="javascript-properties"}

对于这个 JavaScript 全局变量:

```javascript
let globalCounter = 0;
```

你可以在 Kotlin 中使用外部的 `var` 或 `val` 属性声明它:

```kotlin
external var globalCounter: Int
```

这些属性会在外部初始化. 在 Kotlin 代码中, 属性不能带有 `= value` 这样的初始化代码.

#### JavaScript 类 {id="javascript-classes"}

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

#### 外部接口 {id="external-interfaces"}

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

#### 外部对象 {id="external-objects"}

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

#### 外部的类型层次结构 {id="external-type-hierarchy"}

与通常的类和接口相似, 你可以让外部声明扩展其他的外部类, 实现外部接口.
但是, 你不能在同一个类型层次结构中混合使用外部声明和非外部声明.

### 带有 JavaScript 代码的 Kotlin 函数 {id="kotlin-functions-with-javascript-code"}

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
>
{style="note"}

### JavaScript 模块 {id="javascript-modules"}

默认情况下, 外部声明对应于 JavaScript 的全局范围(global scope).
如果你对一个 Kotlin 文件标注 [`@JsModule` 注解](js-modules.md#jsmodule-annotation),
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

### 数组互操作性 {id="array-interoperability"}

你可以将 JavaScript 的 `JsArray<T>` 复制到 Kotlin 的原生 `Array` 或 `List` 类型; 反过来也是如此,
你可以将这些 Kotlin 类型复制到 `JsArray<T>`.

要将 `JsArray<T>` 转换为 `Array<T>`, 或做反向的转换, 请使用 [适配器函数](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt).

下面是一个泛型类型之间转换的示例:

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// 使用 .toJsArray() 将 List 或 Array 转换为 JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// 使用 .toArray() 和 .toList() 转换回 Kotlin 类型
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

类似的转换器函数可以将类型数组转换为等价的 Kotlin 类型 (例如, `IntArray` 和 `Int32Array`).
更多详细信息和具体实现, 请参见 [`kotlinx-browser` 代码仓库]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt).

下面是一个类型数组之间转换的示例:

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // 使用 .toInt32Array() 将 Kotlin 的 IntArray 转换为 JavaScript 的 Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // 使用 toIntArray() 将 JavaScript 的 Int32Array 转换回 Kotlin 的 IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## 在 JavaScript 中使用 Kotlin 代码 {id="use-kotlin-code-in-javascript"}

本节介绍在 JavaScript 中如何使用你的 Kotlin 代码, 方法是使用 `@JsExport` 注解.

### 带 @JsExport 注解的函数 {id="functions-with-the-jsexport-annotation"}

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

Kotlin/Wasm 编译器能够通过你的 Kotlin 代码中的任何 `@JsExport` 声明生成 TypeScript 定义.
这些定义能够被 IDE 和 JavaScript 工具使用, 提供代码自动完成, 帮助类型检查,
使得在 JavaScript 和 TypeScript 中可以更加容易的使用 Kotlin 代码.

Kotlin/Wasm 编译器会收集所有标注了 `@JsExport` 注解的顶层函数, 并自动在一个 `.d.ts` 文件中生成 TypeScript 定义.

要生成 TypeScript 定义, 请在你的 `build.gradle.kts` 文件的 `wasmJs{}` 代码块中, 添加 `generateTypeScriptDefinitions()` 函数:

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

> Kotlin/Wasm 的 TypeScript 声明文件生成功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
>
{style="warning"}

## 类型的对应关系 {id="type-correspondence"}

在与 JavaScript 交互的声明中, Kotlin/Wasm 只允许使用某些类型.
对于使用 `external`, `= js("code")` 或 `@JsExport` 的声明, 这些限制是统一的.

下面是 Kotlin 类型对应的 Javascript 类型:

| Kotlin                                                     | JavaScript                           |
|------------------------------------------------------------|--------------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                             |
| `Float`, `Double`,                                         | `Number`                             |
| `Long`, `ULong`,                                           | `BigInt`                             |
| `Boolean`,                                                 | `Boolean`                            |
| `String`,                                                  | `String`                             |
| 在 return 语句中的 `Unit`                                       | `undefined`                          |
| 函数类型, 例如 `(String) -> Int`                                 | Function                             |
| `JsAny` 和子类型                                               | 任何 JavaScript 值                      |
| `JsReference`                                              | 指向 Kotlin 对象的不透明引用(Opaque Reference) |
| 其他类型                                                       | 不支持                                  |

你也可以使用这些类型的可为 null 的版本.

### JsAny 类型 {id="jsany-type"}

JavaScript 值在 Kotlin 中使用 `JsAny` 类型和它的子类型来表示.

Kotlin/Wasm 标准库提供了其中一些类型的表示:
* `kotlin.js` 包:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`

你也可以声明一个 `external` 接口或类, 创建自定义的 `JsAny` 子类型.

### JsReference 类型 {id="jsreference-type"}

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

### 类型参数 {id="type-parameters"}

与 JavaScript 互操作的声明, 可以拥有类型参数, 类型参数的上界(Upper Bound)是 `JsAny` 或它的子类型.
例如:

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 异常处理 {id="exception-handling"}

你可以使用 Kotlin 的 `try-catch` 表达式捕获 JavaScript 的异常.
但是, 在 Kotlin/Wasm 中默认不能访问被抛出的值的详细信息.

你可以配置 `JsException` 类型, 让它包含来自 JavaScript 的原始错误消息和栈追踪(Stack Trace)信息.
方法是向你的 `build.gradle.kts` 文件添加以下编译器选项:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

这个行为依赖于 `WebAssembly.JSTag` API, 这个 API 只能在特定的浏览器中使用:

* **Chrome:** 从版本 115 开始支持
* **Firefox:** 从版本 129 开始支持
* **Safari:** 目前还不支持

下面的示例演示这个行为:

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // 输出结果为: SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // 输出结果为: Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // 输出结果为: Stacktrace:

        // 打印输出完整的 JavaScript 栈追踪
        e.printStackTrace()
    }
}
```

启用 `-Xwasm-attach-js-exception` 编译器选项后, `JsException` 类型会提供来自 JavaScript 错误的详细信息.
如果不启用这个编译器选项, `JsException` 只包含粗略的信息, 表示在运行 JavaScript 代码时抛出了异常.

如果你使用 JavaScript 的 `try-catch` 表达式来捕获 Kotlin/Wasm 的异常,
那么捕获的异常会象是一个普通的 `WebAssembly.Exception`, 没有可以直接访问的错误消息和数据.

## Kotlin/Wasm 互操作功能与 Kotlin/JS 互操作功能的区别 {id="kotlin-wasm-and-kotlin-js-interoperability-differences"}

尽管 Kotlin/Wasm 互操作功能与 Kotlin/JS 互操作功能很类似, 但它们还是存在一些关键的差异需要注意:

|                        | **Kotlin/Wasm**                                                                                                                   | **Kotlin/JS**                                                                                              |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| **外部枚举类型**             | 不支持外部枚举类.                                                                                                                         | 支持外部枚举类.                                                                                                   |
| **类型扩展**               | 不支持非外部类型扩展外部类型.                                                                                                                   | 支持非外部类型.                                                                                                   |
| **`JsName` 注解**        | 这个注解时只有对外部声明标注时才有效.                                                                                                               | 可以用来修改通常的非外部声明的名称.                                                                                         |
| **`js()` 函数**          | 只允许包级(package-level)函数调用 `js("code")` 函数, 而且`js()` 函数调用必须是函数体中唯一的表达式.                                                             | `js("code")` 函数可以在任何地方调用, 并返回一个 `dynamic` 值.                                                               |
| **模块系统**               | 只支持 ES 模块. 没有类似的 `@JsNonModule` 注解. 会导出为 `default` 对象上的属性. 只允许导出包级函数.                                                             | 支持 ES 模块, 以及其它旧的模块系统. 提供有名称的 ESM 导出. 允许导出类和对象.                                                             |
| **类型**                 | 对所有的互操作性声明 `external`, `= js("code")`, 和 `@JsExport`, 统一适用更严格的类型限制. 只允许使用一部分的 [内建的 Kotlin 类型和 `JsAny` 子类型](#type-correspondence). | 在 `external` 声明中允许使用所有的类型. [在 `@JsExport` 中可以使用限定的类型](js-to-kotlin-interop.md#kotlin-types-in-javascript). |
| **Long**               | 对应于 JavaScript 的 `BigInt` 类型.                                                                                                     | 在 JavaScript 中会成为一个自定义的类.                                                                                  |
| **Arrays**             | 在互操作功能中目前还不直接支持. 你可以改为使用新的 `JsArray` 类型.                                                                                          | 实现为 JavaScript 数组.                                                                                         |
| **其他类型**               | 需要使用 `JsReference<>` 来将 Kotlin 对象传递给 JavaScript.                                                                                  | 允许在外部声明中使用非外部的 Kotlin 类类型.                                                                                 |
| **异常处理**               | 能够使用 `JsException` 和 `Throwable` 类型捕获 JavaScript 的任何异常.                                                                           | 能够通过 `Throwable` 类型捕获 JavaScript 的 `Error`. 能够使用 `dynamic` 类型捕获 JavaScript 的任何异常.                          |
| **动态类型(Dynamic Type)** | 不支持 `dynamic` 类型. 请改为使用 `JsAny` (参见下面的示例代码).                                                                                      | 支持 `dynamic` 类型.                                                                                           |

> Kotlin/JS 用于互操作的 [动态类型(Dynamic Type)](dynamic-type.md), 使用无类型的, 或松散类型的对象, 在 Kotlin/Wasm 中不支持这个功能.
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
>
{style="note"}

## Web 相关的浏览器 API {id="web-related-browser-apis"}

[`kotlinx-browser` 库](https://github.com/kotlin/kotlinx-browser) 是一个独立的库,
提供 JavaScript 的浏览器 API, 包括:
* `org.khronos.webgl` 包:
  * 类型数组, 例如 `Int8Array`.
  * WebGL 类型.
* `org.w3c.dom.*` 包:
  * DOM API 类型.
* `kotlinx.browser` 包:
  * DOM API 全局对象, 例如 `window` 和 `document`.

要使用 `kotlinx-browser` 库中的声明, 请在你的项目的构建脚本文件中将它添加为一个依赖项:

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```
