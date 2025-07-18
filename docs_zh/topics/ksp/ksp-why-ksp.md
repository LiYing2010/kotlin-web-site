[//]: # (title: 为什么使用 KSP)

编译器插件是强大的元编程(Metaprogramming)工具, 能够大大增强你编写代码的方式.
编译器插件直接将编译器作为库来调用, 分析并修改输入的程序. 这些插件还能够为各种用途生成输出.
比如, 它们能够生成样板代码(Boilerplate Code), 它们甚至还能对使用了特殊标记的程序元素生成完整的实现, 比如 `Parcelable`.
插件还有很多很多其他用途, 甚至可以用于实现并精密调节(fine-tune)语言没有直接提供的那些功能特性.

尽管编译器插件很强大, 这种能力也带来了代价. 要编写即使是最简单的插件, 你也需要编译器相关的背景知识, 还需要对你的编译器的实现细节有一定程度的了解.
另一个实际问题是, 插件经常与特定的编译器版本紧密结合,
因此每次你想要支持编译器的新版本时, 你可能都需要更新你的插件.

## KSP 使得创建轻量的编译器插件更加容易 {id="ksp-makes-creating-lightweight-compiler-plugins-easier"}

KSP 的设计意图是隐藏编译器的变更, 对使用它的处理器尽量减少维护工作量.
KSP 的设计目的是不要与 JVM 紧密结合, 因此将来它能够更加容易的应用到其他平台.
KSP 的设计目的还包括减少构建时间. 对于某些处理器, 比如 [Glide](https://github.com/bumptech/glide),
与 kapt 相比, KSP 减少了完全编译时间最高达到 25%.

KSP 本身作为一个编译器插件实现. Google 的 Maven 仓库中有一些预构建的包, 你可以下载使用, 不需要自己构建项目.

## 与 kotlinc 编译器插件比较 {id="comparison-to-kotlinc-compiler-plugins"}

`kotlinc` 编译器插件能访问编译器中的几乎所有功能, 因此有极强的功能和灵活性.
但是, 由于这些插件可能潜在的依赖于编译器中的任何功能, 因此它们对编译器的变更很敏感, 需要频繁的维护.
这些插件还需要深入的理解 `kotlinc` 的实现, 因此学习曲线会很陡.

KSP 的目标是通过一组完善定义的 API 来隐藏编译器的大多数变更, 尽管编译器甚至 Kotlin 语言的大的变更仍然需要公开给 API 使用者.

KSP 希望提供 API, 牺牲性能来提高简易性, 以此实现通常的使用场景. 它的能力只是通常的 `kotlinc` 插件的一小部分.
比如, `kotlinc` 能够计算表达式和语句, 甚至还能够修改代码, 而 KSP 则不可以.

尽管编写 `kotlinc` 插件可能很有趣, 但也会耗费很多时间.
如果你不打算学习 `kotlinc` 的实现, 也不需要修改源代码, 或者读取表达式, KSP 可能更适合你的需要.

## 与反射(Reflection)比较 {id="comparison-to-reflection"}

KSP 的 API 与 `kotlin.reflect` 类似. 主要差别是, KSP 中的类型引用需要明确的解析.
这是二者不使用共同的接口的原因之一.

## 与 kapt 比较 {id="comparison-to-kapt"}

[kapt](kapt.md) 是一个出色的解决方案, 它使得大量的 Java 注解处理器能够直接用于 Kotlin 程序.
KSP 相比 kapt 的主要优势是, 提高了构建性能, 没有与 JVM 紧密结合, 更符合 Kotlin 惯用法的 API, 以及能够理解 Kotlin 专有的符号.

为了不加修改的直接运行 Java 注解处理器, kapt 将 Kotlin 代码编译为 Java 桩代码(stub), 其中保留了 Java 注解处理器关注的信息.
为了创建这些桩代码, kapt 需要解析 Kotlin 程序中的所有符号.
桩代码生成占据了 `kotlinc` 完整分析过程的大约 1/3, `kotlinc` 的代码生成过程也是如此.
对于很多注解处理器, 这个过程比处理器本身耗费的时间要长很多.
比如, Glide 只会分析使用了预定义注解的, 非常少量的类, 它的代码生成非常快速. 几乎所有的构建开销都发生在桩代码生成阶段.
切换到 KSP 可以立即减少编译器消耗时间的 25%.

为了性能评估, 我们用 KSP 实现了一个
[简化版本](https://github.com/google/ksp/releases/download/1.4.10-dev-experimental-20200924/miniGlide.zip)
的 [Glide](https://github.com/bumptech/glide),
让它为 [Tachiyomi](https://github.com/tachiyomiorg) 项目生成代码.
在我们的测试设备上, 尽管项目的 Kotlin 全体编译时间是 21.55 秒,
但 kapt 生成代码耗费了 8.67 秒, 而我们的 KSP 实现生成代码只耗费 1.15 秒.

与 kapt 不同, KSP 中的处理器不会以 Java 的方式看待输入程序.
API 对 Kotlin 来说更加自然, 尤其是对于 Kotlin 专有的功能, 比如顶层函数. 由于 KSP 不会象 kapt 那样将处理代理给 `javac`,
因此它不会依赖于 JVM 专有的行为, 并且将来有可能用于其它平台.

## 限制 {id="limitations"}

尽管 KSP 想要成为一个适用于大多数使用场景的简单解决方案, 但它与其它插件解决方案相比, 还是进行了一些折中.
KSP 的目标不包括以下功能:

* 计算源代码中表达式层的信息.
* 修改源代码.
* 100% 兼容 Java 注解处理 API.
