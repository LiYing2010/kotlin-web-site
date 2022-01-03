---
type: doc
layout: reference
category: "Classes and Objects"
title: "封闭类(Sealed Class)"
---

# 封闭类(Sealed Class)

本页面最终更新: 2022/01/10

_封闭_ 类和接口用来表示对类阶层的限制, 可以对类的继承关系进行更多的控制.
一个封闭类的所有的直接子类在编译时刻就能够确定. 在包含封闭类的模块编译完成之后, 不可能再出现其他子类.
比如, 第三方使用者不能在他们的代码中扩展你的封闭类.
因此, 封闭类的所有实例都只能是很有限的一些类型之一, 这些可能的类型在这个类被编译时就能够确定.

对于封闭接口和它们的实现类也是如此: 在含有封闭接口的模块编译完成之后, 就不可能再出现新的实现类.

某种程度上, 封闭类很象 [枚举类(`enum`)](enum-classes.html) 类: 枚举类型的值也是有限的,
但每个枚举常数都只存在 _单个实例_, 而封闭类的子类可以存在 _多个_ 实例, 每个实例都可以包含它自己的状态数据.

比如, 我们开考虑一下一个库的 API. 希望包含一个错误类, 以便类的使用者处理库可能抛出的错误.
这种错误类的继承阶层包含在公开 API 可见的接口或抽象类,
那么就不能禁止使用者的代码实现这些接口或扩展这些抽象类.
但是, 库又不能预知在它外部定义的错误类, 因此库象它自己定义的类那样处理这些外部定义的类.
如果将错误类的继承阶层封闭起来, 库的作者就能够确定的知道所有可能的错误类型, 并且能够确定以后不会出现其他错误类型.

要声明一个封闭类或接口, 请在类名之前添加 `sealed` 限定符:

```kotlin
sealed interface Error

sealed class IOError(): Error

class FileReadError(val f: File): IOError()
class DatabaseError(val source: DataSource): IOError()

object RuntimeError : Error
```

封闭类本身是 [抽象(abstract)类](classes.html#abstract-classes), 不能直接生成它的实例, 它也能拥有 `abstract` 成员.

封闭类的构造器的 [可见度](visibility-modifiers.html) 必须是: `protected` (默认值) 或 `private`:

```kotlin
sealed class IOError {
    constructor() { /*...*/ } // 默认可见度为 protected
    private constructor(description: String): this() { /*...*/ } // 也可以设置为 private
    // public constructor(code: Int): this() {} // 错误: 不允许为 public 和 internal
}
```

## 直接子类的声明位置

封闭类和接口的直接子类必须定义在同一个包之内. 可以是顶级位置, 也可以嵌套在任意多的其他有名称的类, 有名称的接口, 或有名称的对象之内.
子类可以设置为任意的 [可见度](visibility-modifiers.html), 只要它们符合 Kotlin 中通常的类继承规则.

封闭类的子类 必须拥有一个适当的限定名称. 不能是局部对象或匿名对象.

> `enum` 类不能扩展封闭类 (也不能扩展任何其他类), 但它们可以实现封闭接口.
{:.note}

这些限制不适用于非直接子类. 如果封闭的类一个直接子类没有标记为封闭,
那么它可以按照其修饰符允许的方式任意的扩展:

```kotlin
sealed interface Error // 只在同一个模块的同一个包内存在实现类

sealed class IOError(): Error // 只在同一个模块的同一个包内扩展这个类
open class CustomError(): Error // 可以在这个类可见的任何地方扩展这个类
```

### 跨平台项目中的继承

在 [跨平台项目](mpp/mpp-intro.html)中还存在一种继承限制: 封闭类的直接子类必须放在同一个源代码集(source set)内.
这个限制适用于没有使用 [`expect` 和 `actual` 修饰符](mpp/mpp-connect-to-apis.html) 的封闭类.

如果封闭类声明为共通源代码集(common source set)中的 `expect`, 并且在平台相关的代码集内拥有 `actual` 实现类,
那么 `expect` 和 `actual` 的版本在各自的源代码集内都可以拥有子类.
此外, 如果你使用 [层级结构(hierarchical structure)](mpp/mpp-share-on-platforms.html#share-code-on-similar-platforms),
你可以在 `expect` 和 `actual` 声明之间的任何源代码集内创建子类.

更多详情请参见 [跨平台项目的层级结构(hierarchical structure)](mpp/mpp-share-on-platforms.html#share-code-on-similar-platforms).

## 封闭类与 `when` 表达式

封闭类的主要好处是体现在 [`when`](control-flow.html#when-expression) 表达式中的使用场景.
如果能够确保 `when` 的分支已经覆盖了所有可能的情况, 你可以不必添加 `else` 分支.
但是, 这种用法只适用于将 `when` 用作表达式(使用它的返回值)的情况, 而不是用作语句的情况:

```kotlin
fun log(e: Error) = when(e) {
    is FileReadError -> { println("Error while reading file ${e.file}") }
    is DatabaseError -> { println("Error while reading from database ${e.source}") }
    RuntimeError ->  { println("Runtime error") }
    // 不需要 `else` 分支, 因为已经覆盖了所有的可能情况
}
```

> 在跨平台项目的共通代码中, 使用 [`expect`](mpp/mpp-connect-to-apis.html) 封闭类的 `when` 表达式仍然需要 `else` 分支.
> 这是因为在共通代码中, 无法确定各平台实现中的 `actual` 子类.
{:.note}
