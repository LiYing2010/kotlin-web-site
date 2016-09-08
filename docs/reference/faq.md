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

Kotlin 设计理念背后的核心价值为它带来了以下特点:

* 互操作性: Kotlin 可以与 Java 完全自由地混合编程,
* 安全性: 针对常见的编程陷阱进行静态检查(比如, 空指针引用), 可以在编译期间就发现这些错误,
* 工具化: 可以使用精确而且功能强大的开发工具, 比如 IDE, 编译工具等等,
* "民主性": 任何开发者都可以使用这个语言的任何部分(没有哪个政策限制语言的某个特性只供程序库开发者使用, 或者只供另一群开发者使用).

### Kotlin 使用什么样的许可证(license)?

Kotlin 是一个开源语言, 使用 Apache 2 OSS License. IntelliJ Plug-in 也是开源的.

Kotlin 的代码目前托管在 GitHub 上, 我们很欢迎大家贡献自己的代码.

### 我在哪里可以得到高分辨率的 Kotlin logo?

可以在[这个地址](https://resources.jetbrains.com/assets/products/kotlin/kotlin_logos.zip)下载 Logo. 压缩包中的 `readme.txt` 文件描述了一些简单的规则, 使用 Logo 时请注意遵守.

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

Kotlin 支持泛型. 它还支持声明处的类型变异(declaration-site variance )和使用处类型变异(usage-site variance). Kotlin 没有通配符类型. 内联函数(Inline function)支持实体化的类型参数(reified type parameter).

### 语句末尾需要分号(semicolon)吗?

不. 分号是可选的.

### 为什么要将类型声明放在右侧?

我们认为这样可以提高代码的可读性. 此外, 这样还有助于实现一些很好的语法功能. 比如, 可以很容易地省略类型声明. Scala 也证明了这种设计没有问题.

### 类型声明放在右侧会不会对开发工具造成不好的影响?

不会. 我们照样可以实现变量名称的自动提示之类的功能.

### Kotlin 可以扩展吗?

我们计划让它变得可扩展, 方法包括: 内联函数, 注解, 类型装载器(type loader).

### 我能将自己的 DSL 嵌入到 Kotlin 中吗?

可以. Kotlin 提供了一些特性可以帮助你: 操作符重载, 通过内联函数实现自定义的控制结构, 使用中缀(infix)语法调用函数, 扩展函数, 注解.

### Kotlin 编译产生的 JavaScript 代码支持的 ECMAScript 级别是多少?

目前是 5.

### JavaScript 后端支持模块系统(module system)吗?

是的. 我们计划至少支持 CommonJS 和 AMD 规范.
