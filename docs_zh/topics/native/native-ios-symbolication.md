[//]: # (title: 符号化(Symbolicate) iOS 崩溃报告(Crash Report))

最终更新: %latestDocDate%

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

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
</tabs>

在 IntelliJ IDEA 或 AppCode 模板创建的项目中,
这些 `.dSYM` bundle 之后会被 Xcode 自动发现.

## 从 bitcode 重新构建时, 将框架(Framework)设置为静态

将 Kotlin 产生的框架从 bitcode 重新构建时, 会使得原来的 `.dSYM` 失效.
如果是在本地重新构建, 请注意, 符号化崩溃报告时一定要使用更新后的 `.dSYM`.

如果重新构建在 App Store 端进行, 那么重新构建的 *动态(dynamic)* 框架的 `.dSYM` 似乎会被抛弃,
而且无法从 App Store 下载.
这种情况下, 可能需要将框架设置为静态.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</tab>
</tabs>
