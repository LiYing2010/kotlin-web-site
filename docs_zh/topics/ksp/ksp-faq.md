[//]: # (title: KSP FAQ)

最终更新: %latestDocDate%

### 为什么需要使用 KSP? {id="why-ksp"}

KSP 相比 [kapt](kapt.md) 具有很多优点:
* 更快.
* 对于 Kotlin 使用者来说 API 更加流畅.
* 对生成的 Kotlin 源代码支持 [多轮(Multiple Round)处理](ksp-multi-round.md).
* 设计时考虑了跨平台兼容性.

### 为什么 KSP 比 kapt 更快? {id="why-is-ksp-faster-than-kapt"}

kapt 必须分析并解析所有的类型引用, 才能生成 Java 桩代码(stub), 而 KSP 只在需要的时候才解析类型引用.
将一些处理代理到 javac 也需要消耗时间.

此外, 与仅仅隔离和聚集相比, KSP 的 [增量处理(Incremental Processing)模型](ksp-incremental.md) 拥有更细的粒度.
可以有更多的机会避免重新处理所有信息. 而且, 由于 KSP 动态追踪符号的解析, 一个源代码文件的变更不太容易影响到其他文件, 因此需要处理的源代码文件比较少.
这是 kapt 无法做到的, 因为它将处理代理给 javac.

### KSP 是 Kotlin 专有的吗? {id="is-ksp-kotlin-specific"}

KSP 也能处理 Java 源代码. API 是统一的, 也就是说, 当你解析 Java 类和 Kotlin 类时, 在 KSP 中会得到统一的数据结构.

### 如何更新 KSP? {id="how-to-upgrade-ksp"}

KSP 由 API 和实现构成. API 很少改变, 并且会保持向后兼容: 会出现新的接口, 但旧的接口不会改变.
实现则绑定到特定的编译器版本. 在每次新版本发布时, 支持的编译器版本都会改变.

处理器只依赖于 API, 因此不会绑定到编译器版本.
但是, 处理器的使用者在他们的项目中升级编译器版本时, 也需要升级 KSP 版本.
否则, 会出现以下错误:

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 处理器的使用者不需要更新处理器的版本, 因为处理器只依赖于 API.
>
{style="note"}

比如, 某个处理器在 KSP 1.0.1 中发布并测试, 这个 KSP 版本严格绑定到 Kotlin 1.6.0.
要让这个处理器在在 Kotlin 1.6.20 中工作, 你只需要将 KSP 升级到为 Kotlin 1.6.20 构建的某个版本(比如, KSP 1.1.0).

### 我可以在旧版本的 Kotlin 编译器中使用新版本的 KSP 实现吗? {id="can-i-use-a-newer-ksp-implementation-with-an-older-kotlin-compiler"}

如果语言版本相同, Kotlin 编译器应该支持向后兼容.
大多数情况下 Kotlin 编译器只是小版本的升级.
如果你需要新版本的 KSP 实现, 请对应的升级 Kotlin 编译器.

### KSP 的更新频度如何? {id="how-often-do-you-update-ksp"}

KSP 尽可能的遵循 [语义化版本(Semantic Versioning)](https://semver.org/).
对于 KSP 版本 `major.minor.patch`,
* `major` 表示不兼容的 API 变更. 这部分的版本更新, 没有预定的时间表.
* `minor` 表示新的功能特性. 这部分的版本更新, 大约每季度一次.
* `patch` 表示bug 修正, 以及支持新的 Kotlin 发布版. 这部分的版本更新, 大约每月一次.

通常在 Kotlin 新版本发布之后, 几天之内会发布对应的 KSP 版本, 包括 [预发布版 (Beta 或 RC)](eap.md).

### 除 Kotlin 之外, 是否还有其它的库版本要求? {id="besides-kotlin-are-there-other-version-requirements-for-libraries"}

以下是库/基础设施的版本要求:
* Android Gradle Plugin 4.1.0+
* Gradle 6.5+

### KSP 未来的发展路线图如何? {id="what-is-ksp-s-future-roadmap"}

我们有以下计划:
* 支持 [新的 Kotlin 编译器](roadmap.md)
* 改进对跨平台项目的支持. 比如, 一部分编译目标上运行 KSP / 在多个编译目标之间共用计算结果.
* 性能改进. 需要进行很多优化工作!
* 不断修正 bug.

如果你有什么想法想要讨论, 欢迎通过 [#Kotlin Slack 的 ksp 频道](https://kotlinlang.slack.com/archives/C013BA8EQSE) 与我们联络
([得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
也欢迎提交 [GitHub issue 或 Feature Request](https://github.com/google/ksp/issues) 或 Pull Request!
