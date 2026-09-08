[//]: # (title: 在 JavaScript 中使用 Kotlin 代码)

根据选择的 [JavaScript 模块](js-modules.md) 系统不同, Kotlin/JS 编译器会产生不同的输出.
但通常 Kotlin 编译器会生成通常的 JavaScript 类, 函数, 和属性, 你可以在 JavaScript 代码中自由地使用它们.
但是, 有一些细节问题, 你需要记住.

## 将声明隔离在 plain 模式下的独立 JavaScript 对象内 {id="isolating-declarations-in-a-separate-javascript-object-in-plain-mode"}

如果你将模块类型明确设置为 `plain`, Kotlin 会创建一个对象,
其中包含来自当前模块的所有 Kotlin 声明, 以免破坏全局对象.
因此, 对于模块 `myModule`, 在 JavaScript 中可以通过 `myModule` 对象访问到所有的声明.
比如:

```kotlin
fun foo() = "Hello"
```

这个函数在 JavaScript 中可以这样调用:

```javascript
alert(myModule.foo());
```

如果你将 Kotlin 模块编译为 JavaScript 模块,
比如 [UMD](https://github.com/umdjs/umd) (对 `browser` 和 `nodejs` 编译目标, 这是默认设定),
[ESM](https://tc39.es/ecma262/#sec-modules),
[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules),
或 [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD),
那么不能像上面那样直接调用函数.
这种情况下, 你的声明对外公开时使用的格式将由你选择的 JavaScript 模块系统决定.
比如, 如果使用 UMD, ESM 或 CommonJS, 那么需要这样来调用:

```javascript
alert(require('myModule').foo());
```

关于 JavaScript 模块系统, 详情请参见 [JavaScript 模块(Module)](js-modules.md).

## 包结构 {id="package-structure"}

对于大多数模块系统 (CommonJS, Plain, 和 UMD), Kotlin 会将它的包结构公开到 JavaScript 中.
除非你将你的声明定义在最顶层包中, 否则在 JavaScript 中就必须使用完整限定名来访问你的声明.
比如:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

比如, 如果使用 UMD 或 CommonJS, 那么调用端应该如下:

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

如果模块系统使用 `plain` 模式, 那么调用端应该是:

```javascript
alert(myModule.my.qualified.packagename.foo());
```

当编译目标是 ECMAScript 模块 (ESM) 时, 为了缩小应用程序包的大小, 并匹配 ESM 包的典型布局,
包信息不会被保留.
这种情况下, 通过 ES 模块使用 Kotlin 声明的方式如下:

```javascript
import { foo } from 'myModule';

alert(foo());
```

### `@JsName` 注解 {id="jsname-annotation"}

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
下面的示例会产生一个编译期错误:

```kotlin
@JsName("new C()")   // 此处发生错误
external fun newC()
```

### `@JsExport` 注解 {id="jsexport-annotation"}
<primary-label ref="experimental-general"/>

对一个顶级声明 (比如类, 接口, 或函数) 使用 `@JsExport` 注解, 就可以在 JavaScript 或 TypeScript 中访问 Kotlin 声明.
这个注解会导出所有的嵌套声明, 使用 Kotlin 中给定的名称.

例如, 以下是如何导出一个带有嵌套类和命名同伴对象的 Kotlin 接口:

```kotlin
@JsExport
interface Identity {
     class Metadata(val tag: String)

    companion object Registry {
        val defaultTag = "GUEST"
    }
}
```

目前, `@JsExport` 注解是让你的函数在 Kotlin 中可以使用的唯一方法.

`@JsExport` 注解还可以:

* 在跨平台项目的共通代码中使用. 它只在针对 JavaScript 目标进行编译时才起作用, 并且允许你导出那些平台无关的 Kotlin 声明.
* 与 [`@JsName` 注解](#jsname-annotation) 一起使用, 用来指定生成和导出的函数名称.
  这有助于解决导出中的歧义(比如同名函数的重载(overload)).
* 在文件级别使用 `@file:JsExport`.

#### 支持值类(Value Class)的导出 {id="support-for-value-class-export"}

你可以将 Kotlin 的 [内联的值类](inline-classes.md) 导出为普通的 TypeScript 类.

要导出一个值类, 请在 Kotlin 端使用 `@JsExport` 注解标记它:

```kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

在 TypeScript 端, 它看起来像一个普通的类:

```typescript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com")));
// 输出结果为: "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email")));
// 输出结果为: "Invalid email"
```

### `@JsNoRuntime` 注解 {id="jsnoruntime-annotation"}

你可以使用 `@JsNoRuntime` 注解将 Kotlin 接口导出到 JavaScript/TypeScript.
它允许直接映射为普通的 TypeScript 接口.

要导出一个 Kotlin 接口, 例如从一个 Kotlin Multiplatform 项目中导出, 方法如下:

1. 在共通代码中, 使用 `@JsNoRuntime` 注解标记 Kotlin 接口:

    ```kotlin
    // commonMain
    import kotlin.js.JsNoRuntime

    @JsNoRuntime
    expect interface DataProcessor {
        fun process(data: String): Int
    }
    ```

2. 在你的 JS 专用源代码中, 使用 `@JsNoRuntime` 提供的实际实现:

    ```kotlin
    // jsMain
    import kotlin.js.JsNoRuntime

    @JsNoRuntime
    actual interface DataProcessor {
        actual fun process(data: String): Int
    }
    ```

3. 在 TypeScript 端, 该接口将被映射为普通的 TypeScript 接口:

    ```typescript
    // Generated .d.ts
    export interface DataProcessor {
        process(data: string): number;
    }
    ```

对于 Kotlin Multiplatform 项目, 一般规则如下:

* `expect` 和 `actual` 接口声明都必须使用 `@JsNoRuntime` 注解.
  唯一的例外是 `actual` 端的平台特定代码中的 `external` 实现, 不需要注解.
* 在 `expect` 端的共通代码中, 禁止使用 `external` 接口声明.
  要改为使用带有 `@JsNoRuntime` 注解的普通接口.

使用 `@JsNoRuntime` 导出 Kotlin 接口有一些限制.
以下情况不允许使用这个注解:

* `external` 接口, 因为它们默认已经具有 `@JsNoRuntime` 的行为. 添加它会导致编译器警告.
* `is` 和 `as` 类型检查.
* 使用 [`::class` 语法](js-reflection.md) 的类引用.
* 作为 [实体化的类型参数(Reified type parameter)](inline-functions.md#reified-type-parameters) 传递的接口.

### `@JsStatic` {id="jsstatic"}
<primary-label ref="experimental-general"/>

`@JsStatic` 注解告诉编译器为它指定的声明生成额外的静态方法.
这可以帮助你在 JavaScript 中直接使用你的 Kotlin 代码中的静态成员.

你可以将 `@JsStatic` 注解用于命名对象中定义的函数, 以及在类和接口之内声明的同伴对象中定义的函数.
如果你使用这个注解, 编译器会生成对象的静态方法, 以及对象本身的实例方法.
例如:

```kotlin
// Kotlin 代码
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在, `callStatic()` 函数会成为 JavaScript 中的静态函数, 而 `callNonStatic()` 函数则不是:

```javascript
// JavaScript 代码
C.callStatic();              // 可以工作, 访问静态函数
C.callNonStatic();           // 错误, 在生成的 JavaScript 中不是静态函数
C.Companion.callStatic();    // 实例上的方法会保留
C.Companion.callNonStatic(); // 这是唯一能够调用 callNonStatic() 的方法
```

也可以将 `@JsStatic` 注解用于对象或同伴对象的属性,
这样会将它的 get 方法和 set 方法变成这个对象的静态成员, 或者包含这个同伴对象的类的静态成员.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
请在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 中分享你的反馈意见.

### 使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型 {id="use-bigint-type-to-represent-kotlin-s-long-type"}
<primary-label ref="experimental-general"/>

Kotlin/JS 在编译为现代 JavaScript (ES2020) 时, 使用 JavaScript 内置的 `BigInt` 类型来表示 Kotlin 的 `Long` 值.

要启用对 `BigInt` 类型的支持, 你需要在 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
请在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode) 中分享你的反馈意见.

#### 在导出的声明中使用 `Long` {id="use-long-in-exported-declarations"}

由于 Kotlin 的 `Long` 类型可以编译为 JavaScript 的 `BigInt` 类型, Kotlin/JS 支持将 `Long` 值导出到 JavaScript.

要启用这个功能:

1. 允许在 Kotlin/JS 中导出 `Long`. 请在 `build.gradle(.kts)` 文件的 `freeCompilerArgs` 属性中添加以下编译器选项:

    ```kotlin
    // build.gradle.kts
    kotlin {
        js {
            ...
            compilerOptions {
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2. 启用 `BigInt` 类型. 具体方法请参见 [使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型](#use-bigint-type-to-represent-kotlin-s-long-type).

### 使用 `BigInt64Array` 类型表示 Kotlin 的 `LongArray` 类型 {id="use-bigint64array-type-to-represent-kotlin-s-longarray-type"}
<primary-label ref="experimental-general"/>

Kotlin/JS 在编译为 JavaScript 时, 可以使用 JavaScript 内置的 `BigInt64Array` 类型来表示 Kotlin 的 `LongArray` 值.

要启用对 `BigInt64Array` 类型的支持, 请在 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
请在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中分享你的反馈意见.

## JavaScript 中的 Kotlin 类型 {id="kotlin-types-in-javascript"}

Kotlin 类型在 JavaScript 中映射为以下类型:

| Kotlin 类型                                 | JavaScript 类型             | 注释                                                                             |
|-------------------------------------------|---------------------------|--------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double` | `Number`                  |                                                                                |
| `Char`                                    | `Number`                  | Number 表示字符的编码.                                                                |
| `Long`                                    | `BigInt`                  | 需要配置 [`-Xes-long-as-bigint` 编译器选项](compiler-reference.md#xes-long-as-bigint).  |
| `Boolean`                                 | `Boolean`                 |                                                                                |
| `String`                                  | `String`                  |                                                                                |
| `Array`                                   | `Array`                   |                                                                                |
| `ByteArray`                               | `Int8Array`               |                                                                                |
| `ShortArray`                              | `Int16Array`              |                                                                                |
| `IntArray`                                | `Int32Array`              |                                                                                |
| `CharArray`                               | `UInt16Array`             | 包含属性 `$type$ == "CharArray"`.                                                  |
| `FloatArray`                              | `Float32Array`            |                                                                                |
| `DoubleArray`                             | `Float64Array`            |                                                                                |
| `LongArray`                               | `BigInt64Array`           |                                                                                |
| `BooleanArray`                            | `Int8Array`               | 包含属性 `$type$ == "BooleanArray"`.                                               |
| `List`, `MutableList`                     | `KtList`, `KtMutableList` | 通过 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 导出为 `Array`. |
| `Map`, `MutableMap`                       | `KtMap`, `KtMutableMap`   | 通过 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 导出为 ES2015 `Map`.  |
| `Set`, `MutableSet`                       | `KtSet`, `KtMutableSet`   | 通过 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 导出为 ES2015 `Set`.  |
| `Unit`                                    | Undefined                 | 用作返回类型时可以导出, 用作参数类型时不可以导出.                                                     |
| `Any`                                     | `Object`                  |                                                                                |
| `Throwable`                               | `Error`                   |                                                                                |
| `enum class Type`                         | `Type`                    | 枚举值导出为静态类属性(`Type.ENTRY`).                                                     |
| 可为 Null 的 `Type?`                         | `Type                     | null                                                                           | undefined` |                                                                                               |
| Kotlin 的所有其他类型, 使用 `@JsExport` 标注的类型除外    | 不支持                       | 包含 Kotlin 的 [无符号整数类型](unsigned-integer-types.md).                              |

此外, 还要注意:

* Kotlin 为 `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` 和 `kotlin.Long` 保留了溢出语义.
* Kotlin 在运行时无法区分数值类型(除 `kotlin.Long` 外), 因此以下代码能够正常工作:

  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 在 JavaScript 中保留了延迟加载对象的初始化处理.
