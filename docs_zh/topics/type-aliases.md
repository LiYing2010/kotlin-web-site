[//]: # (title: 类型别名)

类型别名可以为已有的类型提供替代的名称.
如果类型名称太长, 你可以指定一个更短的名称, 然后使用新的名称.

这个功能有助于缩短那些很长的泛型类型名称.
比如, 缩短集合类型的名称通常是很吸引人的:

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

你也可以为函数类型指定不同的别名:

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

你也可以为内部类和嵌套类指定新的名称:

```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```

类型别名不会引入新的类型.
类型别名与它对应的真实类型完全等同.
如果你添加一个别名 `typealias Predicate<T>`, 然后在你的代码中使用 `Predicate<Int>`, Kotlin 编译器会把你的代码扩展为 `(Int) -> Boolean`.
因此, 在需要通常的函数类型的地方, 可以使用你定义的类型别名的变量, 反过来也是如此:

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // 打印结果为 "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // 打印结果为 "[1]"
}
```
{kotlin-runnable="true"}

## 嵌套的类型别名 {id="nested-type-aliases"}

<primary-label ref="beta"/>

在 Kotlin 中, 你可以在其他声明之内定义类型别名, 只要不从它们的外部类捕获类型参数:

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

所谓捕获, 是指类型别名引用外部类中定义的类型参数:

```kotlin
class Graph<Node> {
    // 不正确, 因为捕获了 Node 类型
    typealias Path = List<Node>
}
```

为了解决这个问题, 要直接在类型别名中声明类型参数:

```kotlin
class Graph<Node> {
    // 正确, 因为 Node 是一个类型别名参数
    typealias Path<Node> = List<Node>
}
```

嵌套的类型别名可以改进封装性, 减少包层级的混乱, 简化内部实现, 使得代码更加清晰, 更易于维护.

### 嵌套的类型别名的规则 {id="rules-for-nested-type-aliases"}

嵌套的类型别名遵循一些特定的规则, 以确保清晰而且一致的行为:

* 嵌套的类型别名必须遵守现有的类型别名规则.
* 从可见度的角度来说, 别名不能暴露超过它引用的类型所允许的内容.
* 它们的作用域与 [嵌套类](nested-classes.md) 一样.
  你可以在类的内部定义嵌套的类型别名, 它们会隐藏所有同名的父类型别名, 因为它们不会覆盖.
* 嵌套的类型别名可以标注为 `internal` 或 `private`, 来限制它们的可见度.
* Kotlin Multiplatform 的 [`expect/actual` 声明](multiplatform-expect-actual.md) 中不支持嵌套的类型别名.

### 如何启用嵌套的类型别名 {id="how-to-enable-nested-type-aliases"}

要在你的项目中启用嵌套的类型别名, 请在命令行中使用以下编译器选项:

```bash
-Xnested-type-aliases
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```
