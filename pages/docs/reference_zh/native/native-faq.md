---
type: doc
layout: reference
category: "Native"
title: "FAQ"
---

# Kotlin/Native FAQ

最终更新: {{ site.data.releases.latestDocDate }}

## 我要怎样运行我的程序?

你需要定义一个顶层的函数 `fun main(args: Array<String>)`,
如果你不需要接受命令行参数, 也可以写成 `fun main()`, 请注意不要把这个函数放在包内.
另外, 也可以使用编译器的 `-entry` 选项把任何一个函数指定为程序的入口点,
但这个函数应该接受 `Array<String>` 参数, 或者没有参数, 并且函数返回值类型应该是 `Unit`.

## Kotlin/Native 的内存管理机制是怎样的?

Kotlin/Native 提供一种自动化的内存管理机制, 与 Java 和 Swift 类似.
目前的内存管理器的实现包括, 自动的引用计数器, 以及循环收集器, 可以回收循环引用的垃圾内存.

## 我要怎样创建一个共享库?

可以使用编译器的 `-produce dynamic` 选项, 或在 Gradle 中使用 `binaries.sharedLib()`.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

编译器会产生各平台专有的共享库文件
(对 Linux 环境 `.so` 文件, 对 macOS 环境是 `.dylib` 文件,  对 Windows 环境是 `.dll` 文件),
还会生成一个 C 语言头文件, 用来在 C/C++ 代码中访问你的 Kotlin/Native 程序中的所有 public API.

## 我要怎样创建静态库, 或 object 文件?

可以使用编译器的 `-produce static` 选项, 或在 Gradle 中使用 `binaries.staticLib()`.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

编译器会产生各平台专有的 object 文件(.a 库格式), 以及一个 C 语言头文件,
用来在 C/C++ 代码中访问你的 Kotlin/Native 程序中的所有 public API.

## 我要怎样在企业的网络代理服务器之后运行 Kotlin/Native?

由于 Kotlin/Native 需要下载各平台相关的工具链,
因此你需要对编译器或 `gradlew` 设置 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 选项,
或者通过 `JAVA_OPTS` 环境变量来设置这个选项.

## 我要怎样为我的 Kotlin 框架指定自定义的 Objective-C 前缀?

可以使用编译器的 `-module-name` 选项, 或对应的 Gradle DSL 语句.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</div>
</div>

## 我要怎样改变 iOS 框架的名称?

iOS 框架的默认名称是 `<project name>.framework`.
要使用自定义的名称, 请使用 `baseName` 选项. 这个选项也会设置模块的名称.

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## 我要怎样对我的 Kotlin 框架启用 bitcode?

gradle plugin 默认会将 bitcode 添加到 iOS 编译目标中.
 * 对于 debug 版, gradle plugin 会将 LLVM IR 数据占位器(placeholder)作为标记(marker)嵌入.
 * 对于 release 版, gradle plugin 会将 bitcode 作为数据嵌入.

或者使用编译器参数: `-Xembed-bitcode` (用于 release 版) 和 `-Xembed-bitcode-marker` (用于 debug 版)

使用 Gradle DSL 的设置如下:

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries {
            framework {
                // 使用 "marker" 嵌入 bitcode 标记 (用于 debug 版构建).
                // 使用 "disable" 关闭嵌入.
                embedBitcode("bitcode") // 用于 release 版构建.
            }
        }
    }
}
```

这个选项的效果几乎等于 clang 的 `-fembed-bitcode`/`-fembed-bitcode-marker`
和 swiftc 的 `-embed-bitcode`/`-embed-bitcode-marker`.

## 为什么我会遇到 `InvalidMutabilityException` 异常?

这个异常发生很可能是因为, 你试图修改一个已冻结的对象值.
对象可以明确地转变为冻结状态, 对某个对象调用 `kotlin.native.concurrent.freeze` 函数,
那么只被这个对象访问的其他所有对象子图都会被冻结, 对象也可以隐含的冻结
(也就是, 它只被 `enum` 或全局单子对象访问 - 详情请参见下一个问题).

## 我要怎样让一个单子对象可以被修改?

目前, 单子对象都是不可修改的(也就是, 创建后就被冻结), 而且我们认为让全局状态值不可变更, 通常是比较好的编程方式.
如果处于某些理由, 你需要在这样的对象内包含可变更的状态值, 请在对象上使用 `@konan.ThreadLocal` 注解.
另外, `kotlin.native.concurrent.AtomicReference` 类可以用来在被冻结的对象内,
保存指向不同的冻结对象的指针, 而且可以自动更新这些指针.

## 我要怎样使用还未发布的 Kotlin/Native 版本来编译我的项目?

首先, 请考虑使用 [预览版](../eap.html).

如果你需要更新的开发版, 你可以通过源代码来编译 Kotlin/Native:
clone [Kotlin 代码仓库](https://github.com/JetBrains/kotlin),
然后按照 [这些步骤](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source) 进行编译.
