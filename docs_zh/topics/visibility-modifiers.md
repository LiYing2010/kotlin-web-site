[//]: # (title: 可见度修饰符)

最终更新: %latestDocDate%

类, 对象, 接口, 构造器, 函数, 属性, 以及属性的设值方法, 都可以使用 *可见度修饰符*.
属性的取值方法永远与属性本身的可见度一致, 因此不需要控制其可见度.

Kotlin 中存在 4 种可见度修饰符: `private`, `protected`, `internal`, 以及 `public`.
默认的可见度为 `public`.

本节中, 我们将介绍这些可见度标识符如何应用于不同范围的不同类型.

## 包 {id="packages"}

函数, 属性, 类, 对象, 接口, 都可以直接在包之内声明为"顶级的(top-level)":

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 如果你不使用可见度修饰符, 默认会使用 `public`, 其含义是, 你声明的东西在任何位置都可以访问.
* 如果你将声明的东西标记为 `private`, 那么它将只在同一个源代码文件内可以访问.
* 如果标记为 `internal`, 那么它将在同一个[模块(module)](#modules)内的任何位置都可以访问.
* 对于顶级(top-level)声明, `protected` 修饰符是无效的.

> 如果一个包中的顶级声明是可见的, 在另一个包中使用它时需要 [导入(import)](packages.md#imports).
>
{style="note"}

示例:

```kotlin
// 文件名: example.kt
package foo

private fun foo() { ... } // 只在 example.kt 文件内可访问

public var bar: Int = 5 // 这个属性在任何地方都可以访问
    private set         // 但它的设值方法只在 example.kt 文件内可以访问

internal val baz = 6    // 在同一个模块(module)内可以访问
```

## 类成员

对于类内部声明的成员:

* `private` 表示这个成员只在这个类(以及它的所有成员)之内可以访问.
* `protected` 表示这个成员的可见度与 `private` 一样, 但它在子类中也可以访问.
* `internal` 表示在 *本模块之内*, 凡是能够访问到这个类的地方, 同时也能访问到这个类的 `internal` 成员.
* `public` 表示凡是能够访问到这个类的地方, 同时也能访问这个类的 `public` 成员.

> 在 Kotlin 中, 外部类(outer class)不能访问其内部类(inner class)的 `private` 成员.
>
{style="note"}

如果你覆盖一个 `protected` 或 `internal` 成员, 并且没有明确指定可见度,
那么覆盖后成员的可见度将与覆盖前的成员一样.

示例:

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // 默认为 public

    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a 不可访问
    // b, c 和 d 可以访问
    // Nested 和 e 可以访问

    override val b = 5   // 'b' 可见度为 protected
    override val c = 7   // 'c' 可见度为 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b 不可访问
    // o.c 和 o.d 可以访问(属于同一模块)
    // Outer.Nested 不可访问, Nested::e 也不可访问
}
```

### 构造器 {id="constructors"}

要指定类的主构造器的可见度, 请使用以下语法:

> 你需要明确添加一个 `constructor` 关键字:
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

这里构造器是 `private` 的. 所有构造器默认都是 `public` 的,
因此使得凡是可以访问到类的地方都可以访问到类的构造器
(因此 一个 `internal` 类的构造器只能在同一个模块内访问).

对于封闭类(Sealed Class), 构造器默认为 `protected` 的.
更多详情请参见 [封闭类(Sealed Class)](sealed-classes.md#constructors).

### 局部声明

局部变量, 局部函数, 以及局部类, 都不能指定可见度修饰符.

## 模块(Module) {id="modules"}

`internal` 修饰符表示这个成员只能在同一个模块内访问.
更确切地说, 一个模块(module)是指一起编译的一组 Kotlin 源代码文件, 例如:

* 一个 IntelliJ IDEA 模块.
* 一个 Maven 工程.
* 一个 Gradle 源代码集(source set) (`test` 源代码集例外, 它可以访问 `main` 中的 `internal` 声明).
* 通过 `<kotlinc>` Ant 任务的一次调用编译的一组文件.
