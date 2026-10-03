[//]: # (title: 包与导入)

在 Kotlin 项目中, 使用包和导入来组织代码:

* **包** 是一个或多个 Kotlin 文件的容器. 文件通过 `package` 头关联到包.
* **导入** 是一种指令, 让当前文件可以使用其他包中的实体.

## 包头 {id="package-headers"}

源文件可以以包头开始:

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message(val text: String) { /*...*/ }
```

源文件中的所有内容, 例如类和函数, 都属于这个包.
包名称和实体名称组合成它们的完全限定名称(Fully Qualified Name).
在这个示例中:

* `printMessage()` 的完全限定名称是 `org.example.printMessage`.
* `Message` 的完全限定名称是 `org.example.Message`.

如果文件没有包头, 那么它的内容属于根包(Root Package).

## 导入 {id="imports"}

要使用其他包中的文件中的实体, 请使用 `import` 指令.
除了默认导入外, 每个文件还可以声明自己的导入.

### 导入单个实体 {id="import-a-single-entity"}

导入特定实体, 然后就可使用它, 不需要限定名称:

```kotlin
// 可以访问 Message, 不需要限定名称
import org.example.Message

fun main() {
    val message = Message("Hello")
    println(message.text)
}
```

### 导入作用域的内容 {id="import-the-contents-of-a-scope"}

星号导入, 以星号 `*` 结尾, 会导入相应的作用域中的所有命名实体:

```kotlin
// 可以访问 org.example 中的所有内容
import org.example.*

fun main() {
    printMessage()
    val message = Message("Hi")
}
```

如果对一个实体同时使用星号导入和明确导入, 在重载解析时, 明确导入具有更高优先级.

### 使用别名解决名称冲突 {id="resolve-name-clashes-with-aliases"}

如果导入的两个实体具有相同名称, 请使用 `as` 关键字, 在本地对其中一个重新命名:

```kotlin
// Message 指向 org.example.Message
import org.example.Message

// TestMessage 指向 org.test.Message
import org.test.Message as TestMessage

fun main() {
    val a = Message("from example")
    val b = TestMessage("from test")
}
```

### 可以导入的内容 {id="what-you-can-import"}

`import` 关键字不仅限于类. 你可以导入以下任何实体, 无论它们来自包, 类, 对象, 还是枚举:

* 直接在包中声明的顶层函数和属性:
    ```kotlin
    import org.example.printMessage // 顶层函数
    import org.example.VERSION      // 顶层属性
    ```
* [对象声明](object-declarations.md#object-declarations-overview) 中的函数和属性:
    ```kotlin
    import org.example.Config.DEFAULT_TIMEOUT // 对象中的属性
    import org.example.Config.loadSettings    // 对象中的函数
    ```
* [同伴对象](object-declarations.md#companion-objects) 的成员, 通过包含它的类名引用:
    ```kotlin
    import org.example.MyClass.create // 指向 MyClass.Companion.create
    ```
* [枚举常量](enum-classes.md):
    ```kotlin
    import org.example.Color.RED
    import org.example.Color.GREEN
    ```
* 嵌套类:
    ```kotlin
    import org.example.Outer.Nested
    ```

## 默认导入 {id="default-imports"}

Kotlin 默认包含以下导入:

* [kotlin.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/index.html)
* [kotlin.annotation.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/index.html)
* [kotlin.collections.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/index.html)
* [kotlin.comparisons.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/index.html)
* [kotlin.io.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/index.html)
* [kotlin.ranges.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.ranges/index.html)
* [kotlin.sequences.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/index.html)
* [kotlin.text.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/index.html)
* [kotlin.math.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/index.html)

Kotlin 还会根据目标平台额外导入以下包:

* JVM:
  * [java.lang.*](https://docs.oracle.com/javase/8/docs/api/java/lang/package-summary.html)
  * [kotlin.jvm.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/index.html)

* JS:
  * [kotlin.js.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/index.html)

## 可见度与导入 {id="visibility-and-imports"}

能否导入一个实体, 取决于它的 [可见度修饰符](visibility-modifiers.md):

* `public` 实体可以在任何位置导入.
* `internal` 实体只能在同一模块内导入.
* `protected` 实体无法导入.
* 顶层 `private` 实体只能在声明它们的文件中访问.
* 其他 `private` 实体无法导入.
