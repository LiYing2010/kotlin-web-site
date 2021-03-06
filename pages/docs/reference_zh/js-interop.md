---
type: doc
layout: reference
category: "JavaScript"
title: "在 Kotlin 中调用 JavaScript"
---

# 在 Kotlin 中调用 JavaScript

Kotlin 设计时最优先重视与 Java 平台交互的问题:
Kotlin 代码可以将 Java 类当作 Kotlin 类来使用, Java 代码也可以将 Kotlin 类当作 Java 类来使用.

然而, JavaScript 是一种动态类型的语言, 也就是说它在编译时刻不做类型检查.
通过 [动态类型](dynamic-type.html), 在 Kotlin 中你可以自由地与 JavaScript 交互,
如果你希望完全发挥 Kotlin 类型系统的能力, 你可以为 JavaScript 库创建外部声明,
Kotlin 编译器及相关工具能够正确处理这些外部声明.

如果 npm 依赖项提供了类型信息(TypeScript / `d.ts`),
有一个实验性的工具程序 [Dukat](js-external-declarations-with-dukat), 能够自动创建 Kotlin 外部声明.

## 内联 JavaScript

使用 [`js("...")`](/api/latest/jvm/stdlib/kotlin.js/js.html) 函数, 你可以将 JavaScript 代码内联到你的 Kotlin 代码中.
比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```
</div>

由于 `js` 函数的参数会在编译时解析, 然后原样的("as-is")翻译为 JavaScript 代码, 因此参数必须是字符串常量.
所以, 以下代码是不正确的:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // 这里会出错
}
fun getTypeof() = "typeof"
```
</div>

注意, 调用 `js()` 返回的值是 [`dynamic`](dynamic-type.html) 类型, 这个类型在编译时不保证任何类型安全性.

## `external` 修饰符

你可以对某个声明使用 `external` 修饰符, 来告诉 Kotlin 它是由纯 JavaScript 编写的.
编译器看到这样的声明后, 它会假定对应的类, 函数, 或属性的实现, 会由外部提供
(由开发者提供, 或由 [npm 依赖项](js-project-setup.html#npm-dependencies)提供),
因此它不会为这个声明生成 JavaScript 代码.
由于同样的原因, `external` 声明不能带有 body 部. 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

注意, `external` 修饰符会被内嵌的声明继承下来,
因此, 在示例程序的 `Node` 类的内部, 我们不需要在成员函数和属性之前添加 `external` 标记.

`external` 修饰符只允许用于包级声明. 对于非 `external` 的类, 不允许声明 `external` 的成员.


### 声明类的(静态)成员

在 JavaScript 中, 成员函数可以定义在 prototype 上, 也可以定义在类上:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* 实现代码 */ };
MyClass.prototype.ownMember = function() { /* 实现代码 */ };
```
</div>

在 Kotlin 中没有这样的语法. 但是, 在 Kotlin 中有 [`同伴`(companion)](object-declarations.html#companion-objects) 对象.
Kotlin 以特殊的方式处理 `external` 类的同伴对象: 它不是期待一个对象, 而是假设同伴对象的成员在 JavaScript 中是定义在类上的成员函数.
上例中的 `MyClass`, 在 Kotlin 中可以写为:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```
</div>


### 声明可选的参数

如果一个 JavaScript 函数带有可选的参数, 那么编写外部声明时请使用 `definedExternally`.
这个设置会将参数默认值的生成委托给 JavaScript 函数自身:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```
</div>

通过这样的外部声明, 你就可以使用一个必须参数和两个可选参数来调用 `myFunWithOptionalArgs` 函数,
其中, 可选参数的默认值将由 `myFunWithOptionalArgs` 函数的 JavaScript 实现负责计算.


### 扩展 JavaScript 类

你可以很容易地扩展 JavaScript 类, 就好像它们是 Kotlin 类一样.
你只需要定义一个 `external open` 类, 然后通过一个非 `external` 类来扩展它. 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
open external class Foo {
    open fun run()
    fun stop()
}

class Bar: Foo() {
    override fun run() {
        window.alert("Running!")
    }

    fun restart() {
        window.alert("Restarting")
    }
}
```
</div>

但存在以下限制:

- 如果 `external` 基类的函数已存在不同参数签名的重载版本, 那么你就不能在后代类中覆盖这个函数.
- 带默认参数的函数不能覆盖.
- `external` 类不能扩展非 `external` 类.


### `external` 接口

JavaScript 没有接口的概念. 如果一个函数要求它的参数支持 `foo` 和 `bar` 两个方法,
你只需要传递一个确实带有这些方法的对象.

在严格检查类型的 Kotlin 语言中, 你可以使用接口来表达这种概念:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```
</div>

`external` 接口的另一种典型的使用场景, 是用来描述配置信息对象. 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
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
</div>

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


### 类型转换
["不安全的" 类型转换操作符](typecasts.html#unsafe-cast-operator) `as`
在转换失败时会抛出 `ClassCastException` 异常,
除此之外, Kotlin/JS 还提供了 [`unsafeCast<T>()`](/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html).
如果使用 `unsafeCast`, 在运行时 _完全不进行任何类型检查_. 比如, 对于下面两个方法:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```
</div>

对应的编译结果分别是:
<div class="sample" markdown="1" theme="idea" mode="java">

``` javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

</div>
