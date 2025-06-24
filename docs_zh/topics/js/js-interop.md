[//]: # (title: 在 Kotlin 中使用 JavaScript 代码)

Kotlin 设计时最优先重视与 Java 平台交互的问题:
Kotlin 代码可以将 Java 类当作 Kotlin 类来使用, Java 代码也可以将 Kotlin 类当作 Java 类来使用.

然而, JavaScript 是一种动态类型的语言, 也就是说它在编译时刻不做类型检查.
通过 [动态类型](dynamic-type.md), 在 Kotlin 中你可以自由地与 JavaScript 交互,
如果你希望完全发挥 Kotlin 类型系统的能力, 你可以为 JavaScript 库创建外部声明,
Kotlin 编译器及相关工具能够正确处理这些外部声明.

## 内联 JavaScript {id="inline-javascript"}

使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函数,
你可以将 JavaScript 代码内联到你的 Kotlin 代码中.
比如:

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

由于 `js` 函数的参数会在编译时解析, 然后原样的("as-is")翻译为 JavaScript 代码, 因此参数必须是字符串常量.
所以, 以下代码是不正确的:

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // 这里会出错
}

fun getTypeof() = "typeof"
```

> 由于 JavaScript 代码是由 Kotlin 编译器解析的, 因此可能不支持所有的 ECMAScript 功能.
> 对于这样的情况, 你可能会遇到编译错误.
>
{style="note"}

注意, 调用 `js()` 返回的值是 [`dynamic`](dynamic-type.md) 类型, 这个类型在编译时不保证任何类型安全性.

## external 修饰符 {id="external-modifier"}

你可以对某个声明使用 `external` 修饰符, 来告诉 Kotlin 它是由纯 JavaScript 编写的.
编译器看到这样的声明后, 它会假定对应的类, 函数, 或属性的实现, 会由外部提供
(由开发者提供, 或由 [npm 依赖项](js-project-setup.md#npm-dependencies)提供),
因此它不会为这个声明生成 JavaScript 代码.
由于同样的原因, `external` 声明不能带有 body 部. 比如:

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}

external val window: Window
```

注意, `external` 修饰符会被内嵌的声明继承下来,
因此, 在示例程序的 `Node` 类的内部, 在成员函数和属性之前没有添加 `external` 标记.

`external` 修饰符只允许用于包级声明. 对于非 `external` 的类, 不允许声明 `external` 的成员.

### 声明类的(静态)成员 {id="declare-static-members-of-a-class"}

在 JavaScript 中, 成员函数可以定义在 prototype 上, 也可以定义在类上:

```javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* 实现代码 */ };
MyClass.prototype.ownMember = function() { /* 实现代码 */ };
```

在 Kotlin 中没有这样的语法. 但是, 在 Kotlin 中有 [`同伴`(companion)](object-declarations.md#companion-objects) 对象.
Kotlin 以特殊的方式处理 `external` 类的同伴对象:
它不是期待一个对象, 而是假设同伴对象的成员在 JavaScript 中是定义在类上的成员函数.
上例中的 `MyClass`, 在 Kotlin 中可以写为:

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 声明可选的参数 {id="declare-optional-parameters"}

如果一个 JavaScript 函数带有可选的参数, 那么编写外部声明时请使用 `definedExternally`.
这个设置会将参数默认值的生成委托给 JavaScript 函数自身:

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

通过这样的外部声明, 你就可以使用一个必须参数和两个可选参数来调用 `myFunWithOptionalArgs` 函数,
其中, 可选参数的默认值将由 `myFunWithOptionalArgs` 函数的 JavaScript 实现负责计算.

### 扩展 JavaScript 类 {id="extend-javascript-classes"}

你可以很容易地扩展 JavaScript 类, 就好像它们是 Kotlin 类一样.
你只需要定义一个 `external open` 类, 然后通过一个非 `external` 类来扩展它. 比如:

```kotlin
open external class Foo {
    open fun run()
    fun stop()
}

class Bar : Foo() {
    override fun run() {
        window.alert("Running!")
    }

    fun restart() {
        window.alert("Restarting")
    }
}
```

但存在以下限制:

- 如果 `external` 基类的函数已存在不同参数签名的重载版本, 那么你就不能在后代类中覆盖这个函数.
- 带默认参数的函数不能覆盖.
- `external` 类不能扩展非 `external` 类.

### external 接口 {id="external-interfaces"}

JavaScript 没有接口的概念. 如果一个函数要求它的参数支持 `foo` 和 `bar` 两个方法,
你只需要传递一个确实带有这些方法的对象.

在严格检查类型的 Kotlin 语言中, 你可以使用接口来表达这种概念:

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

`external` 接口的另一种典型的使用场景, 是用来描述配置信息对象. 比如:

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

    // 等等
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

`external` 接口存在一些限制:

- 它们不可以用在 `is` 检查语句的右侧.
- 它们不可以用作实体化的类型参数(reified type argument).
- 它们不可以用在类的字面值表达式中(比如 `I::class`).
- 使用 `as` 将对象转换为 `external` 接口, 永远会成功.
    转换为 `external` 接口会产生编译期警告 "Unchecked cast to external interface".
    要消除这个警告, 可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 注解.

    IntelliJ IDEA 也能够自动生成 `@Suppress` 注解.
    方法是在编辑器内点击灯泡图标, 或按下 Alt-Enter 快捷键, 打开 intentions 菜单,
    然后点击代码检查信息 "Unchecked cast to external interface" 旁的小箭头.
    在这里, 你可以选择对这个警告进行屏蔽的适用范围, 然后 IDE 会在你的源代码文件中添加对应的注解.

### 类型转换 {id="casts"}

["不安全的" 类型转换操作符](typecasts.md#unsafe-cast-operator) `as`
在转换失败时会抛出 `ClassCastException` 异常,
除此之外, Kotlin/JS 还提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html).
如果使用 `unsafeCast`, 在运行时 _完全不进行任何类型检查_. 比如, 对于下面两个方法:

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

对应的编译结果分别是:

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 相等判断 {id="equality"}

与其他平台相比, Kotlin/JS 的相等判断语义有所不同.

在 Kotlin/JS 中, Kotlin [引用相等](equality.md#referential-equality) 操作符 (`===`)
永远会翻译为 JavaScript 的
[严格相等](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) 操作符 (`===`).

JavaScript `===` 操作符不仅检查两个值相等, 而且检查这两个值的类型也相等:

```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // 在 Kotlin/JS 平台, 输出结果为 'yes'
    // 在其他平台, 输出结果为 'no'
}
```

而且, 在 Kotlin/JS 中, 数值类型 [`Byte`, `Short`, `Int`, `Float`, 和 `Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript)
在运行期都使用 JavaScript 类型 `Number` 表达.
因此, 这 5 种类型的值是无法区分的:

```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // 在 Kotlin/JS 平台, 输出结果为 'true'
    // 在其他平台, 输出结果为 'false'
}
```

> 关于 Kotlin 中的相等判断, 更多详情请参见 [相等判断](equality.md) 文档.
>
{style="tip"}
