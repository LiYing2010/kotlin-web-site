---
type: doc
layout: reference
category: "JavaScript"
title: "在 Kotlin 中调用 JavaScript"
---

# 在 Kotlin 中调用 JavaScript

Kotlin 设计时很重视与 Java 平台交互的问题.
Kotlin 代码可以将 Java 类当作 Kotlin 类来使用, Java 代码也可以将 Kotlin 类当作 Java 类来使用.
然而, JavaScript 是一种动态类型的语言, 因此它在编译时刻不做类型检查.
通过使用 [动态类型](dynamic-type.html), 在 Kotlin 中你可以自由地与 JavaScript 交互,
但如果你希望完全发挥 Kotlin 类型系统的能力, 你可以为 JavaScript 库创建 Kotlin 头文件.


## 内联 JavaScript

使用 [js("...")](/api/latest/jvm/stdlib/kotlin.js/js.html) 函数, 你可以将 JavaScript 代码内联到你的 Kotlin 代码中.
比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```
</div>

`js` 函数的参数必须是字符串常量. 因此, 以下代码是不正确的:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // 这里会出错
}
fun getTypeof() = "typeof"
```
</div>


## `external` 修饰符

你可以对某个声明使用 `external` 修饰符, 来告诉 Kotlin 它是由纯 JavaScript 编写的.
编译器看到这样的声明后, 它会假定对应的类, 函数, 或属性的实现, 会由开发者提供, 因此它不会为这个声明生成 JavaScript 代码.
也就是说, 你应该省略 `external` 声明的 body 部. 比如:

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
也就是说, 在 `Node` 类的内部, 我们不需要在成员函数和属性之前添加 `external` 标记.

`external` 修饰符只允许用于包级声明. 对于非 `external` 的类, 不允许声明 `external` 的成员.


### 声明类的(静态)成员

在 JavaScript 中, 成员函数可以定义在 prototype 上, 也可以定义在类上. 也就是:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* 实现代码 */ };
MyClass.prototype.ownMember = function() { /* 实现代码 */ };
```
</div>

在 Kotlin 中没有这样的语法. 但是, 在 Kotlin 中有 `同伴`(companion) 对象.
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

`external` 函数可以拥有可选的参数.
JavaScript 实现代码中具体如何为这些可选参数计算默认值, 对 Kotlin 是不可知的,
因此在 Kotlin 中, 我们无法使用通常的语法来定义这样的参数.
应该使用如下语法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
external fun myFunWithOptionalArgs(x: Int,
    y: String = definedExternally,
    z: Long = definedExternally)
```
</div>

这样, 你就可以使用一个必须参数和两个可选参数(其默认值由某些 JavaScript 代码计算得到)来调用 `myFunWithOptionalArgs` 函数.


### 扩展 JavaScript 类

你可以很容易地扩展 JavaScript 类, 就好像它们是 Kotlin 类一样.
你只需要定义一个 `external` 类, 然后通过非 `external` 类来扩展它. 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
external open class HTMLElement : Element() {
    /* 成员定义 */
}

class CustomElement : HTMLElement() {
    fun foo() {
        alert("bar")
    }
}
```
</div>

但存在以下限制:

1. 如果 `external` 基类的函数已存在不同参数签名的重载版本, 那么你就不能在后代类中覆盖这个函数.
2. 带默认参数的函数不能覆盖.

注意, 你不能使用 `external` 类来扩展非 `external` 类.


### `external` 接口

JavaScript 没有接口的概念. 如果一个函数要求它的参数支持 `foo` 和 `bar` 方法, 你只需要传递一个确实带有这些方法的对象.
在严格检查类型的 Kotlin 语言中, 你可以使用接口来表达这种概念, 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```
</div>

`external` 接口的另一种使用场景, 是用来描述配置信息对象. 比如:

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

1. 它们不可以用在 `is` 检查语句的右侧.
2. 使用 `as` 将对象转换为 `external` 接口, 永远会成功 (并且在编译期间产生一个警告).
3. 它们不可以用作实体化的类型参数(reified type argument).
4. 它们不可以用在类的字面值表达式中(也就是 `I::class`).
