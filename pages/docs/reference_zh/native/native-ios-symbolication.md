---
type: doc
layout: reference
category: "Native"
title: "符号化(Symbolicate) iOS 崩溃报告(Crash Report)"
---

# 符号化(Symbolicate) iOS 崩溃报告

本页面最终更新: 2021/09/08

要对 iOS 应用程序的崩溃进行调试, 有时需要分析崩溃报告.
关于崩溃报告的详情, 请参见
[Apple 文档](https://developer.apple.com/library/archive/technotes/tn2151/_index.html).

崩溃报告通常需要经过符号化(symbolication), 才能供人类正确阅读:
符号化会将机器码地址转换为适合人阅读的源代码位置.
本文将介绍使用 Kotlin 开发 iOS 应用程序时, 符号化崩溃报告的一些具体细节.

## 对 release 版的 Kotlin 二进制文件产生 .dSYM 文件

要符号化 Kotlin 代码中的地址(比如, 得到调用栈各层分别对应的 Kotlin 源代码),
需要使用 Kotlin 代码的 `.dSYM` bundle.

默认情况下, 在 Darwin 平台上, 对 release版的(也就是, 优化过的) 二进制文件, Kotlin/Native 编译器会产生 `.dSYM` 文件.
这个选项可以使用编译器参数 `-Xadd-light-debug=disable` 来关闭.
同时, 对于其他平台, 这个选项默认是关闭的. 如果需要打开, 请使用编译器选项 `-Xadd-light-debug=enable`.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</div>
</div>

在 IntelliJ IDEA 或 AppCode 模板创建的项目中,
这些 `.dSYM` bundle 之后会被 Xcode 自动发现.

## 从 bitcode 重新构建时, 将框架(Framework)设置为静态

将 Kotlin 产生的框架从 bitcode 重新构建时, 会使得原来的 `.dSYM` 失效.
如果是在本地重新构建, 请注意, 符号化崩溃报告时一定要使用更新后的 `.dSYM`.

如果重新构建在 App Store 端进行, 那么重新构建的 *动态(dynamic)* 框架的 `.dSYM` 似乎会被抛弃,
而且无法从 App Store 下载.
这种情况下, 可能需要将框架设置为静态.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</div>
</div>


## 对内联的(inlined) 栈层次(stack frame) 解码(Decode)

Xcode 对调用栈中的内联函数(inlined function)调用似乎不能正确解码
(不仅 Kotlin `inline` 函数如此, 而且包括在机器码优化过程中被内联的函数).
因此调用栈中的某些元素的信息可能会丢失.
如果发生这样的情况, 请考虑使用 `lldb` 来处理已经被 Xcode 符号化过的崩溃报告,
比如:

```bash
$ lldb -b -o "script import lldb.macosx" -o "crashlog file.crash"
```

这个命令会输出额外处理过的崩溃报告, 并且包含内联的调用栈元素.

更多详情请参见 [LLDB 文档](https://lldb.llvm.org/use/symbolication.html).
