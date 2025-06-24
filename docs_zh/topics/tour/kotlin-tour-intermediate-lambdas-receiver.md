[//]: # (title: 中级教程: 带接受者的 Lambda 表达式)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3.svg" width="20" alt="Third step" /> <strong>带接受者的 Lambda 表达式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在这一章中, 你将学习在另一种函数类型 Lambda 表达式中如何使用接受者对象,
以及它们如何帮助你创建一个特定领域专用语言(Domain-Specific Language, DSL).

## 带接受者的 Lambda 表达式 {id="lambda-expressions-with-receiver"}

在初学者教程中, 你已经学习了如何使用 [Lambda 表达式](kotlin-tour-functions.md#lambda-expressions). Lambda 表达式也可以带有接受者.
这种情况下, Lambda 表达式能够访问接受者对象的任何成员函数或属性, 而不必每次都明确的指明接受者对象.
没有了这些额外的引用, 你的代码会变得更加易于阅读和维护.

> 带接受者的 Lambda 表达式也叫做带接受者的函数字面值.
>
{style="tip"}

带接受者的 Lambda 表达式的语法与定义函数类型时不同.
首先, 请写下你想要扩展的接受者对象. 之后, 是一个 `.` 号, 之后写下你的函数类型定义的其它部分.
例如:

```kotlin
MutableList<Int>.() -> Unit
```

这个函数类型:

* 接受者类型是 `MutableList<Int>`.
* 括号 `()` 之内没有函数参数.
* 没有返回值: `Unit`.

我们来看看下面的实例, 它扩展 `StringBuilder` 类:

```kotlin
fun main() {
    // 带接受者的 Lambda 表达式定义
    val appendText: StringBuilder.() -> Unit = { append("Hello!") }

    // 使用带接受者的 Lambda 表达式
    val stringBuilder = StringBuilder()
    stringBuilder.appendText()
    println(stringBuilder.toString())
    // 输出结果为: Hello!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

在这个示例中:

* 接受者类型是 `StringBuilder` 类.
* Lambda 表达式的函数类型没有函数参数 `()`, 也没有返回值 `Unit`.
* Lambda 表达式调用 `StringBuilder` 类的 `append()` 成员函数, 使用字符串 `"Hello!"` 作为函数参数.
* 创建了 `StringBuilder` 类的一个实例.
* Lambda 表达式赋值给变量 `appendText`, 并在 `stringBuilder` 实例上调用.
* 使用 `toString()` 函数, `stringBuilder` 实例被转换为字符串, 并通过 `println()` 函数打印输出.

如果你想要创建一个特定领域专用语言(Domain-Specific Language, DSL), 带接受者的 Lambda 表达式会非常有用.
因为你可以访问接受者对象的成员函数和属性, 而不必明确引用接受者, 你的代码会变得更加精简.

为了演示这一点, 我们来考虑一个配置菜单中项目的示例.
我们从一个 `MenuItem` 类和一个 `Menu` 类开始, `Menu` 类包含一个向菜单中添加项目的函数, 名为 `item()`,
以及一个包含所有项目的列表, 名为 `items`:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

我们使用一个带接受者的 Lambda 表达式, 将它作为函数参数 (`init`) 传递给 `menu()` 函数, 这个函数构建一个菜单, 作为开始点.
你会注意到, 这段代码使用了与前面的 `StringBuilder` 类的示例类似的方案:

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // 创建 Menu 类的一个实例
    val menu = Menu(name)
    // 在类实例上调用带接受者的 Lambda 表达式 init()
    menu.init()
    return menu
}
```

现在你可以使用这个 DSL 来配置一个菜单, 并创建一个 `printMenu()` 函数, 将菜单结构打印输出到控制台:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}

fun menu(name: String, init: Menu.() -> Unit): Menu {
    val menu = Menu(name)
    menu.init()
    return menu
}

//sampleStart
fun printMenu(menu: Menu) {
    println("Menu: ${menu.name}")
    menu.items.forEach { println("  Item: ${it.name}") }
}

// 使用 DSL
fun main() {
    // 创建菜单
    val mainMenu = menu("Main Menu") {
        // 向菜单添加项目
        item("Home")
        item("Settings")
        item("Exit")
    }

    // 打印菜单
    printMenu(mainMenu)
    // 输出结果为:
    // Menu: Main Menu
    //   Item: Home
    //   Item: Settings
    //   Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

如你所见, 使用带接受者的 Lambda 表达式 大大的简化了创建你的菜单所需要的代码.
Lambda 表达式不仅仅可以用于设置和创建, 也可以用于配置.
它们普遍用于构建 API, UI 框架, 以及配置构建器的 DSL, 以生成精简的代码, 让你能够更容易的专注于底层代码结构和逻辑.

Kotlin 的生态环境中存在这种设计模式的很多例子, 例如标准库中的 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)
和 [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) 函数.

> 在 Kotlin 中, 带接受者的 Lambda 表达式可以与 **类型安全的构建器** 结合,
> 创建能够在编译期而不是在运行期检测出类型问题的 DSL.
> 详情请参见 [类型安全的构建器](type-safe-builders.md).
>
{style="tip"}

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

你有一个 `fetchData()` 函数, 参数是一个带接受者的 Lambda 表达式.
请更新 Lambda 表达式, 使用 `append()` 函数, 让你的代码的输出成为: `Data received - Processed`.

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        // 请在这里编写你的代码
        // 输出结果为: Data received - Processed
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-1"}

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        append(" - Processed")
        println(this.toString())
        // 输出结果为: Data received - Processed
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-lambda-receivers-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

你有一个 `Button` 类, 以及 `ButtonEvent` 和 `Position` 数据. 请编写代码, 触发 `Button` 类的 `onEvent()`
成员函数, 触发一个 double-click 事件. 你的代码应该打印输出 `"Double click!"`.

```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // 模拟 double-click 事件 (不是 right-click)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // 触发事件回调
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()

    button.onEvent {
        // 请在这里编写你的代码
        // 输出结果为: Double click!
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-2"}

|---|---|
```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // 模拟 double-click 事件 (不是 right-click)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // 触发事件回调
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()
    
    button.onEvent {
        if (!isRightClick && amount == 2) {
            println("Double click!")
            // 输出结果为: Double click!
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-lambda-receivers-solution-2"}

### 习题 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

编写一个函数, 创建一个整数 List 的副本, 其中每个元素增大 1.
请使用已经提供的函数框架, 它使用一个 `incremented` 函数扩展了 `List<Int>`.

```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        // 请在这里编写你的代码
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // 输出结果为: [2, 3, 4]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-3"}

|---|---|
```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        for (n in originalList) add(n + 1)
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // 输出结果为: [2, 3, 4]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-lambda-receivers-solution-3"}

## 下一步

[中级教程: 类与接口](kotlin-tour-intermediate-classes-interfaces.md)
