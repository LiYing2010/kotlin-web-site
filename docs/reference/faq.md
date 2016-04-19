---
type: doc
layout: reference
category: FAQ
title: FAQ
---

# FAQ

## 常见问题

### 什么是 Kotlin?

Kotlin 是一种针对 JVM 和 JavaScript 环境的静态类型语言. 它是一种面向软件产业实际应用的通用语言.

Kotlin 的开发者是 JetBrains 公司的一个团队, 但它是开源的, 而且还有 JetBrains 公司之外的贡献者.

### 为什么要开发一种新的语言?

在 JetBrains 公司, 我们已经在 Java 平台上进行了很多年的开发工作, 而且我们很了解 Java 的优点.
但是, 我们也认识到 Java 语言存在着一些问题, 而且由于向后兼容性的限制, 导致这些问题很难甚至不可能得到解决. 我们知道 Java 还会长期存在下去, 但我们相信, 假如开发一种针对 JVM 平台的静态类型的新语言, 丢掉那些历史遗留的包袱, 加上开发者们长期渴望的功能, 那么开发社区将会因此大大受益.


这个项目背后的主要涉及目标是:

* 创建一个与 Java 兼容的语言,
* 编译速度至少要与 Java 一样快,
* 新语言要比 Java 更加安全, 也就是说, 要对软件开发中的常见问题进行静态检查, 比如对空指针的访问问题,
* 新语言要比 Java 更简洁, 要支持变量类型推断, 高阶函数(闭包), 扩展函数, 代码混合(mixin), 委托(first-class delegation), 等等;
* 此外, 将新语言的表达能力控制在实用的程度(参见上文)(译注: 这里似乎应该是参见 "与 Scala 比较" 小节), 让它比最成熟的竞争者 – Scala - 更加简单.

### Kotlin 使用什么样的许可证(license)?

Kotlin 是一个开源语言, 使用 Apache 2 OSS License. IntelliJ Plug-in 也是开源的.

Kotlin 的代码目前托管在 GitHub 上, 我们很欢迎大家贡献自己的代码.


### Kotlin 与 Java 兼容吗?

是的. 编译器将会输出 Java 字节码. Kotlin 可以调用 Java, 反过来 Java 也可以调用 Kotlin. 请参见 [与 Java 的互操作性](java-interop.html).

### 运行 Kotlin 代码需要的最低 Java 版本是多少?

Kotlin 编译产生的字节码兼容 Java 6 或更高版本. 因此 Kotlin 可以用于 Android 之类的环境, Android 目前支持的最高版本是 Java 6.

### 有针对 Kotlin 的开发工具吗?

是的. 有一个开源的 IntelliJ IDEA plugin, 使用 Apache 2 License. 在 IntelliJ IDEA 的 [免费的 OSS Community 版和 Ultimate 版](http://www.jetbrains.com/idea/features/editions_comparison_matrix.html) 中都可以使用 Kotlin.

### 有 Eclipse 环境的工具吗?

是的. 关于安装方法, 请参照 [教程](/docs/tutorials/getting-started-eclipse.html).

### 有不依赖 IDE 环境的独立的(standalone)编译器吗?

是的. 你可以在 [GitHub 上的 Release 页面]({{site.data.releases.latest.url}}) 下载独立的编译器, 以及其他构建工具.

### Kotlin 是函数式语言吗(Functional Language)?

Kotlin 是面向对象的语言. 但是它支持高阶函数, Lambda 表达式, 以及顶级(top-level)函数. 此外, Kotlin 的标准库中还存在函数式语言中常见的大量元素(比如 map, flatMap, reduce, 等等.). 而且, 关于函数式语言, 并没有一个清晰的定义, 所以我们并能说 Kotlin 是一种函数式语言.

### Kotlin 支持泛型吗?

Kotlin 支持泛型. 它还支持声明处的类型变异(declaration-site variance )和使用处类型变异(usage-site variance). 而且 Kotlin 没有通配符类型. 内联函数(Inline function)支持实体化的类型参数(reified type parameter).

### 语句末尾需要分号(semicolon)吗?

不. 分号是可选的.

### 需要大括号(curly brace)吗?

是的.

### 为什么要将类型声明放在右侧?

我们认为这样可以提高代码的可读性. 此外, 这样还有助于实现一些很好的语法功能. 比如, 可以很容易地省略类型声明. Scala 也证明了这种设计没有问题.

### 类型声明放在右侧会不会对开发工具造成不好的影响?

不会. 我们照样可以实现变量名称的自动提示之类的功能.

### Kotlin 可以扩展吗?

我们计划让它变得可扩展, 方法包括: 内联函数, 注解, 类型装载器(type loader).

### 我能将自己的 DSL 嵌入到 Kotlin 中吗?

可以. Kotlin 提供了一些特性可以帮助你: 操作符重载, 通过内联函数实现自定义的控制结构, 使用中缀(infix)语法调用函数, 扩展函数, 注解, 以及语言引用(language quotation).

### JavaScript 支持的 ECMAScript 级别是多少?

目前是 5.

### JavaScript 后端支持模块系统(module system)吗?

是的. 我们计划提供 CommonJS 和 AMD 支持.


