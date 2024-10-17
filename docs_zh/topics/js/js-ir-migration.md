[//]: # (title: 将 Kotlin/JS 项目迁移到 IR 编译器)

我们已经用 [基于 IR 的编译器](js-ir-compiler.md) 替代了旧的 Kotlin/JS 编译器,
原因是为了在所有的平台上统一 Kotlin 的行为, 以及能够实现新的 JS 专有的优化, 还有其他一些原因.
关于两种编译器的内部区别, 请参见 Sebastian Aigner 的 Blog
[将我们的 Kotlin/JS 应用程序迁移到新的 IR 编译器](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i).

由于编译器之间的显著区别, 将你的 Kotlin/JS 项目从旧的编译器后端切换到新的,
可能会需要调整你的代码. 本章中, 我们会列举已知的迁移问题, 以及建议的解决方案.

> 关于如何修正迁移期间发生的某些问题, 请安装
> [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) plugin,
> 可以得到有价值的提示.
>
{style="tip"}

注意, 由于我们修正了问题, 或者发现了新的问题, 本向导将来可能会发生变更. 请帮助我们完善这些信息 –
请报告你切换到 IR 编译器时遇到的问题, 提交到我们的问题追踪系统 [YouTrack](https://kotl.in/issue),
或填写这个 [表格](https://surveys.jetbrains.com/s3/ir-be-migration-issue).

## 将 JS 和 React 相关的类和接口转换为外部接口(External Interface)

**`问题`**: 使用 Kotlin 接口和类 (包括数据类), 如果继承自纯 JS 类, 比如 React 的 `State` 和 `Props`,
  可能导致 `ClassCastException` 异常. 出现这样的异常是因为, 编译器试图将这些类的实例象 Kotlin 对象一样使用,
  然而它们实际上来自 JS.

**解决方案**: 将所有继承自纯 JS 类的类和接口转换为 [外部接口(External Interface)](js-interop.md#external-interfaces):

```kotlin
// 替换以下代码
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// 替换为
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
    var name: String
}
```

在 IntelliJ IDEA 中, 你可以使用这些 [结构化查找与替换](https://www.jetbrains.com/help/idea/structural-search-and-replace.html)
模板, 将接口自动标记为 `external`:
* [用于 `State` 的模板](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [用于 `Props` 的模板](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## 将外部接口的属性转换为 var

**问题**: 在 Kotlin/JS 代码中, 外部接口的属性不能为只读(`val`)属性, 因为这些属性的赋值,
只能在使用 `js()` 或 `jso()` (来自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的帮助函数)
创建对象之后:

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解决方案**: 将外部接口的所有属性转换为 `var`:

```kotlin
// 替换以下代码
external interface CustomComponentState : State {
    val name: String
}
```

```kotlin
// 替换为
external interface CustomComponentState : State {
    var name: String
}
```

## 将外部接口中带接受者的函数转换为普通函数

**问题**: 外部声明不能包含带接受者的函数, 比如扩展函数, 或这类函数类型的属性.

**解决方案**: 将这样的函数和属性转换为通常的函数, 将接受者对象添加为一个参数:

```kotlin
// 替换以下代码
external interface ButtonProps : Props {
    var inside: StyledDOMBuilder<BUTTON>.() -> Unit
}
```

```kotlin
external interface ButtonProps : Props {
    var inside: (StyledDOMBuilder<BUTTON>) -> Unit
}
```

## 为与 JS 交互, 创建单纯 JS 对象

**问题**: 实现外部接口的 Kotlin 对象的属性不可 _列举_.
因此不能通过对象属性的遍历得到这些属性, 比如:
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

但属性仍然可以通过名称访问: `obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
    val jsApp = js("{name: 'App1'}") as AppProps // 单纯 JS 对象
    println("Kotlin sees: ${jsApp.name}") // 结果为: "App1"
    println("JSON.stringify sees:" + JSON.stringify(jsApp)) // 结果为: {"name":"App1"} - OK

    val ktApp = AppPropsImpl("App2") // Kotlin 对象
    println("Kotlin sees: ${ktApp.name}") // "App2"
    // JSON 只能得到后端域, 不能得到属性
    println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**解决方案 1**: 使用 `js()` 或 `jso()`
  (来自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的帮助函数)
  创建单纯 JavaScript 对象:

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// 替换以下代码
val ktApp = AppPropsImpl("App1") // Kotlin 对象
```

```kotlin
// 替换为
val jsApp = js("{name: 'App1'}") as AppProps // 或使用 jso {} 函数
```

**解决方案 2**: 使用 `kotlin.js.json()` 创建对象:

```kotlin
// 或者替换为
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 将函数引用上的 toString() 调用替换为 .name

**问题**: 在 IR 后端中, 对函数引用调用 `toString()`不会输出唯一的值.

**解决方案**: 使用 `name` 属性代替 `toString()` 调用.

## 在构建脚本中明确指定 binaries.executable()

**问题**: 编译器不会产生可执行的 `.js` 文件.

可能会发生这样的问题, 因为默认的编译器会默认产生 JavaScript 可执行文件, 但 IR 编译器则需要明确指定.
详情请参见 [Kotlin/JS 项目设置指南](js-project-setup.md#execution-environments).

**解决方案**: 在项目的 `build.gradle(.kts)` 文件中添加 `binaries.executable()`.

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## 关于使用 Kotlin/JS IR 编译器时其他问题的提示

这些提示也许能够帮助你解决在使用 Kotlin/JS IR 编译器的项目中遇到的问题.

### 将外部接口中的 boolean 属性标记为 nullable

**问题**: 当你对外部接口中的 `Boolean` 属性调用 `toString` 时,
你会得到 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` 之类的错误.
JavaScript 将 boolean 变量的 `null` 值或 `undefined` 值当作 `false` 处理.
如果你需要对可能为 `null` 或 `undefined` 的 `Boolean` 值调用 `toString`
(比如, 如果你的代码被 JavaScript 代码调用, 而你无法控制这些 JavaScript 代码),
需要注意这个问题:

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

如果你想要在 Kotlin 中覆盖的函数内(比如, 一个 React `button`), 使用这样的属性, 将会发生 `ClassCastException` 异常:

```kotlin
button {
    attrs {
        autoFocus = props.visible // 这里会发生 ClassCastException 异常
    }
}
```

**解决方案**: 你可以将你的外部接口的 `Boolean` 属性标记为 nullable (`Boolean?`):

```kotlin
// 替换以下代码
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// 替换为
external interface SomeExternal {
    var visible: Boolean?
}
```
