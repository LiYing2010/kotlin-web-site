[//]: # (title: 可调试性)

本章介绍关于可调试性需要注意的问题.

## 永远要提供 toString() 方法

为了便于调试, 要为你引入的每个类添加 `toString()` 方法的实现, 即使是对内部类也是如此.
如果 `toString()` 是契约(Contract) 的一部分, 那么要提供明确的文档说明.

下面的代码是图形建模代码简化后的例子:

```kotlin
class Vector2D(val x: Int, val y: Int)

fun main() {
    val result = (1..20).map { Vector2D(it, it) }
    println(result)
}
```

这段代码的输出没什么用处:

```none
[Vector2D@27bc2616, Vector2D@3941a79c, Vector2D@506e1b77,...]
```

Debug Tool 窗口中提供的信息也没什么用处:

<img src="vector-objects-in-debug.png" alt="在 Debug Tool 窗口中 Vector 对象的输出" width="500"/>

为了让日志和调试信息更加易于阅读, 请添加一个简单的 `toString()` 实现, 如下:

```kotlin
override fun toString(): String =
    "Vector2D(x=$x, y=$y)"
```

改善后的输出如下:

```none
[Vector2D(x=1, y=1), Vector2D(x=2, y=2), Vector2D(x=3, y=3), ...
```

<img src="improved-output-of-vector-objects-in-debug.png" alt="在 Debug Tool 窗口中 Vector 对象的改善后的输出" width="500"/>

> 使用 [数据类](data-classes.md) 看起来好像很不错, 因为它们自动带有 `toString()` 方法.
> 在本向导的 [向后兼容性(Backward Compatibility)](jvm-api-guidelines-backward-compatibility.md) 章节中,
> 你会学习 [为什么不应该这样做](jvm-api-guidelines-backward-compatibility.md#don-t-use-data-classes-in-an-api).
>
{style="note"}

即使你认为这个类不会在任何地方打印输出, 也应该考虑实现 `toString()`,
因为它可能会以意想不到的方式提供帮助.
例如, 在 [构建器](https://en.wikipedia.org/wiki/Builder_pattern#:~:text=The%20builder%20pattern%20is%20a,Gang%20of%20Four%20design%20patterns) 之内, 能够看到构建器目前的状态可能会非常重要.

```kotlin
class Person(
    val name: String?,
    val age: Int?,
    val children: List<Person>
) {
    override fun toString(): String =
        "Person(name=$name, age=$age, children=$children)"
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()
    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
        children.add(person(personBuilder))
    }
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person {
    val builder = PersonBuilder()
    builder.personBuilder()
    return Person(builder.name, builder.age, builder.children)
}
```

上面的代码预期的使用方式是:

<img src="breakpoint-for-person.png" alt="Person DSL 和断点的使用方式" width="500"/>

如果你在第一个 `child` 的右大括号之后的行设置断点 (如上图所示),
你会在 Debug Output 中看到一个无意义的字符串:

<img src="debug-person-builder.png" alt="PersonBuilder 调试时的结果" width="500"/>

如果你添加一个简单的 `toString()` 实现, 如下:

```kotlin
override fun toString(): String =
    "PersonBuilder(name=$name, age=$age, children=$children)"
```

调试信息会变得更加清晰:

<img src="debug-person-builder-improved.png" alt="PersonBuilder 改善后的调试结果" width="700"/>

你还能立即看到哪些域变量已被设置, 哪些还没有设置.

> 在 `toString()` 中暴露域变量时要小心, 因为很容易导致 `StackOverflowException`.
> 例如, 如果 `children` 引用到了 parent, 可能会造成循环引用.
> 而且, 暴露 List 和 Map 时也要小心, 因为 `toString()` 可能会展开一个非常深层的嵌套结构.
>
{style="warning"}

## 下一步做什么?

学习 API 的 [向后兼容性(Backward Compatibility)](jvm-api-guidelines-backward-compatibility.md).
