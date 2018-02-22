---
type: doc
layout: reference
category: "Other"
title: "跨平台项目"
---

# 跨平台项目

> 跨平台项目是 Kotlin 1.2 版中新增的实验性特性. 本文档描述的所有语言特新和工具特性, 在未来的 Kotlin 版本中都有可能发生变更.
{:.note}

Kotlin 的跨平台项目允许你将相同的代码编译到多个目标平台. 目前支持的目标平台是 JVM 和 JS, 未来将会增加支持 Native App.

## 跨平台项目的结构

一个跨平台项目由以下 3 种模块构成:

  * _common_ 模块, 其中包含不依赖于任何平台的代码, 也可以包含与平台相关的 API 声明, 但不包括其实现.
    这些声明代码使得共通的代码依赖于具体平台上的实现代码.
  * _platform_ 模块, 其中包含 _common_ 模块中声明的依赖于平台的 API 在具体平台上的实现代码, 以及其他依赖于平台的代码.
    一个 _platform_ 模块永远对应于一个 _common_ 模块的具体实现.
  * 通常的模块. 这种模块针对特定的平台, 它可以被 _platform_ 模块依赖, 也可以依赖于 _platform_ 模块.

_common_ 模块只能依赖于其他 _common_ 模块, 或依赖于 _common_ 库, 包括 Kotlin 标准库的 _common_ 版(`kotlin-stdlib-common`).
_common_ 模块只包含 Kotlin 代码, 不能包含其他任何语言的代码.

_platform_ 模块可以依赖于任何模块, 或依赖于对象平台上的任何库 (包括 Kotlin/JVM 平台上的 Java 库, 以及 Kotlin/JS 平台上的 JS 库).
针对 Kotlin/JVM 平台的 _platform_ 模块还可以包含 Java 或其他 JVM 语言编写的代码.

编译一个 _common_ 模块会产生一个特殊的 _metadata_ 文件, 其中包含模块内的所有声明.
编译 _platform_ 模块则会为 _platform_ 本身的代码, 以及它实现的 _common_ 模块的代码, 生成针对目标平台的代码(JVM 字节码, 或 JS 源代码).

因此, 每一个跨平台库, 都必须以一组 artifact 的形式发布 - 一个 common.jar, 其中包含共通代码的 _metadata_, 以及针对每个平台的 .jar 文件, 其中包含各个平台的实现代码的编译结果.


## 跨平台项目的设置

在目前的 Kotlin 1.2 版中, 跨平台项目必须使用 Gradle 来编译; 目前还不支持其他编译系统.

要在 IDE 中创建一个新的跨平台项目, 请在 New Project 对话框中选择 "Kotlin" ==> "Kotlin (Multiplatform)" 选项. IDE 会创建一个工程, 其中包含 3 个模块, 1个 _common_ 模块, 以及 2 个 _platform_ 模块, 分别针对 JVM 和 JS 平台. 要添加更多的模块, 请在 New Module 对话框中选择 "Gradle" ==> "Kotlin (Multiplatform)" 选项.

如果你需要手动配置项目, 请按照以下步骤:

  * 将 Kotlin Gradle plugin 添加到编译脚本的 classpath 中: `classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"`
  * 在 _common_ 模块中, 使用 `kotlin-platform-common` plugin
  * 在 _common_ 模块中, 添加 `kotlin-stdlib-common` 依赖
  * 在针对 JVM 和 JS 的 _platform_ 模块中, 分别使用 `kotlin-platform-jvm` 和 `kotlin-platform-js` plugin
  * 在 _platform_ 模块中, 添加对 _common_ 模块的依赖, 依赖 scope 为 `expectedBy`

下面的例子, 是 Kotlin 1.2-Beta 版的一个 _common_ 模块的完整的 `build.gradle` 文件:

``` groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin-platform-common'

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib-common:$kotlin_version"
    testCompile "org.jetbrains.kotlin:kotlin-test-common:$kotlin_version"
}
```

下面的例子是 JVM 平台的 _platform_ 模块的完整的 `build.gradle` 文件.
请注意 `dependencies` 部分的 `expectedBy` 行:

``` groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin-platform-jvm'

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
    expectedBy project(":")
    testCompile "junit:junit:4.12"
    testCompile "org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version"
    testCompile "org.jetbrains.kotlin:kotlin-test:$kotlin_version"
}
```


## 与平台相关的声明

Kotlin 跨平台代码的关键特性之一就是, 允许共通代码依赖到与平台相关的声明.
在其他语言中, 要实现这一点, 通常是在共通代码中创建一系列的接口, 然后在与平台相关的代码中实现这些接口.
但是, 如果你已经有一个库在某个平台上实现了你需要的功能, 而你希望不通过额外的包装直接使用这个库的 API, 这种方式就并不理想了.
而且, 这种方式要求以接口的形式来表达共通声明, 而这并不能满足所有可能的使用场景.

作为一种替代的方案, Kotlin 提供了 _预期声明与实际声明(expected and actual declaration)_ 机制.
通过这种机制, _common_ 模块可以定义 _预期声明(expected declaration)_, 而 _platform_ 模块则提供对应的 _实际声明(actual declaration)_.
为了理解这种机制的工作原理, 我们先来看一个示例程序. 这段代码是一个 _common_ 模块的一部分:

``` kotlin
package org.jetbrains.foo

expect class Foo(bar: String) {
    fun frob()
}

fun main(args: Array<String>) {
    Foo("Hello").frob()
}
```

下面是对应的 JVM 模块:

``` kotlin
package org.jetbrains.foo

actual class Foo actual constructor(val bar: String) {
    actual fun frob() {
        println("Frobbing the $bar")
    }
}
```

上面的示例演示了几个要点:

  * _common_ 模块中的预期声明, 以及与它对应的实际声明, 总是拥有完全相同的完整限定名(fully qualified name).
  * 预期声明使用 `expect` 关键字进行标记; 实际声明使用 `actual` 关键字进行标记.
  * 与预期声明中的任何一个部分对应的实际声明, 都必须标记为 `actual`.
  * 预期声明绝不包含任何实现代码.

注意, 预期声明并不局限于接口和接口的成员.
在上面的示例中, 预期类有一个构造函数, 而且在共通代码中可以直接创建这个类的实例.
你也可以将 `expect` 标记符用在其他声明上, 包括顶层声明, 以及注解:

``` kotlin
// Common
expect fun formatString(source: String, vararg args: Any): String

expect annotation class Test

// JVM
actual fun formatString(source: String, vararg args: Any) =
    String.format(source, args)

actual typealias Test = org.junit.Test
```

编译器会保证 _common_ 模块中的每一个预期声明, 在所有实现这个 _common_ 模块的 _platform_ 模块中, 都存在对应的实际声明, 如果缺少实际声明, 则会报告错误.
IDE 提供了工具, 可以帮助你创建缺少的实际声明.

如果你已经有了一个依赖于平台的库, 希望在共通代码中使用, 同时对其他平台则提供你自己的实现, 这时你可以为已存在的类定义一个类型别名, 以此作为实际声明:

``` kotlin
expect class AtomicRef<V>(value: V) {
  fun get(): V
  fun set(value: V)
  fun getAndSet(value: V): V
  fun compareAndSet(expect: V, update: V): Boolean
}

actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```

## 跨平台测试

我们可以在 common 项目中编写测试程序, 然后让这些测试程序在每一个平台项目中编译并运行.
在 `kotlin.test` 包中提供了 4 个注解, 用来标注 common 代码中的测试程序: `@Test`, `@Ignore`,
`@BeforeTest` 以及 `@AfterTest`.
在 JVM 平台上, 这些注解会被映射为对应的 JUnit 4 注解, 在 JS 平台上, 从 1.1.4 开始也可以使用这些注解, 用来支持 JS 单体测试功能.

要使用这些注解, 你需要在 _common_ 模块中添加对 `kotlin-test-annotations-common` 的依赖,
在 JVM 模块添加对 `kotlin-test-junit` 的依赖, 以及在 JS 模块中添加对 `kotlin-test-js` 的依赖.
