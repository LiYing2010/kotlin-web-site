---
type: doc
layout: reference
category: "Compatibility"
title: "兼容性"
---

# 兼容性

本节介绍兼容性 Kotlin 不同版本及子系统所保证的兼容性.

## 兼容性术语

所谓兼容性, 就意味着回答以下问题: 对于两个版本的 Kotlin (比如, 1.2 和 1.1.5), 针对其中一个版本编写的代码能够在另一个版本上使用吗? 下表解释了不同版本之间的兼容模式.
注意, 版本数字越小, 代表版本越旧(即使它的发布时间更晚).

- **C** - 完全兼容(Full **C**ompatibility)
  - 语言
    - 没有语法变更 (*同模 bug* \*)
    - 可能增加或删除警告信息/提示信息
  - API (`kotlin-stdlib-*`, `kotlin-reflect-*`)
    - 没有 API 变更
    - 可能增加或删除 `WARNING` 级别的 API 废弃
  - 二进制文件 (ABI, Application Binary Interface)
    - 运行时: 二进制文件可以互换使用
    - 编译: 二进制文件可以互换使用
- **BCLA** - 语言和API向后兼容 (**B**ackward **C**ompatibility for the **L**anguage and **A**PI)
  - 语言
    - 旧版本中废弃的语法, 在新版本中可能被删除
    - 除此之外, 旧版本中能够编译的所有代码, 都能够在新版本中编译 (*同模 bug* \*)
    - 新版本中可能增加新的语法
    - 旧版本中的某些限制, 在新版本中可能撤销
    - 可能增加或删除警告信息/提示信息
  - API (`kotlin-stdlib-*`, `kotlin-reflect-*`)
    - 可能增加新的 API
    - 可能增加或删除 `WARNING` 级别的 API 废弃
    - `WARNING` 级别的 API 废弃, 在新版本中可能提升为 `ERROR` 或 `HIDDEN` 级别
- **BCB** - 二进制文件向后兼容(**B**ackward **C**ompatibility for **B**inaries)
  - 二进制文件 (ABI, Application Binary Interface)
    - 运行时: 凡是旧版本二进制文件能够运行的对方, 都可以使用新版本的二进制文件
    - 新版本编译器: 能够编译为旧版本二进制文件的代码, 都可以编译为新版本二进制文件
    - 旧版本编译器可能不能接受新版本二进制文件 (比如, 有些二进制文件可能用到了更新的语言特性, 或更新的 API)
- **BC** - 完全向后兼容(Full **B**ackward **C**ompatibility)
  - BC = 同时满足 BCLA 和 BCB
- **EXP** - 实验性功能(Experimental feature)
  - 参见 [下文](#experimental-features)
- **NO** - 无兼容性保证(No compatibility guarantees)
  - 我们会尽量保证代码能够平滑迁移, 但不能给出保证
  - 对每个不兼容的子系统, 单独计划其代码迁移

---

\* No changes *同模 bug* (modulo bug) 的意思是指, 如果发现了重要的 bug(比如, 在编译器诊断程序中, 或在其他对方), 修正这个 bug 可能会带来破坏性的变化, 但我们会慎重对待这些变化.

## Kotlin 发布版的兼容性保证

**Kotlin for JVM**:
  - 补丁版本更新(patch version update) (比如 1.1.X) 保证完全兼容;
  - 次版本更新(minor version update) (比如 1.X) 保证向后兼容.

| Kotlin    | 1.0 | 1.0.X | 1.1 | 1.1.X | ... | 2.0 |
|----------:|:---:|:-----:|:---:|:-----:|:---:|:---:|
| **1.0**   | -   | C     | BC  | BC    | ... | ?   |
| **1.0.X** | C   | -     | BC  | BC    | ... | ?
| **1.1**   | BC  | BC    | -   | C     | ... | ?
| **1.1.X** | BC  | BC    | C   | -     | ... | ?
| **...**   | ... | ...   | ... | ...   | ... | ... |
| **2.0**   | ?   | ?     | ?   | ?     | ... | -

**Kotlin for JS**: 从 Kotlin 1.1 版开始, 补丁版本更新和次版本更新都保证语言和 API 向后兼容(BCLA), 但不保证二进制文件向后兼容(BCB).  

| Kotlin    | 1.0.X | 1.1  | 1.1.X | ... | 2.0 |
|----------:|:-----:|:----:|:-----:|:---:|:---:|
| **1.0.X** | -     |  EXP | EXP   | ... | EXP |
| **1.1**   | EXP   |  -   | BCLA  | ... | ?
| **1.1.X** | EXP   | BCLA | -     | ... | ?
| **...**   | ...   | ...  | ...   | ... | ... |
| **2.0**   | EXP   | ?    | ?     | ... | -

**Kotlin Scripts**: 补丁版本更新和次版本更新保证语言和 API 向后兼容(BCLA), 但不保证二进制文件向后兼容(BCB).

## 跨平台兼容性

Kotlin 可以用于多种平台(JVM/Android, JavaScript, 以及即将实现的 native 平台). 每种平台都有它独有的特殊情况(比如, JavaScript 没有适当的整数), 因此我们必须针对性地调整语言. 我们的目标是在合理范围内实现代码的可移植性, 而不要牺牲太多.

每一种平台都会实现某些语言扩展(比如, JVM 上的平台数据类型(platform type), 以及 JavaScript 上的动态数据类型(dynamic type)), 每一种平台也都存在某些限制(比如, JVM 上的方法重载存在某些限制), 但语言的核心部分会保持一致.

标准库提供所有平台上都可用的核心 API, 而且我们努力让这些 API 在每个平台上的功能保持一致. 此外, 标准库还提供了与平台相关的扩展(比如, JVM 上的 `java.io`, JavaScript 上的 `js()`), 还提供了一些 API, 它们可以在各个平台上调用, 但动作不一致(比如 JVM 和 JavaScript 上的正则表达式).    

## 实验性功能

实验性功能, 比如 Kotlin 1.1 中的协程(coroutine), 没有包含在上面列举的兼容模式中. 这类功能需要使用编译选项才不会产生编译警告. 对于补丁版本更新, 实验性功能至少保持向后兼容性, 但对次版本更新, 我们不保证任何兼容性 (如果可能的话, 会提供代码迁移帮助).

| Kotlin    | 1.1 | 1.1.X | 1.2 | 1.2.X |
|----------:|:---:|:-----:|:---:|:-----:|
| **1.1**   | -   | BC    | NO  | NO  
| **1.1.X** | BC  | -     | NO  | NO
| **1.2**   | NO  | NO    | -   | BC
| **1.2.X** | NO  | NO    | BC  | -

## 早期预览版 (EAP, Early Access Preview build)

我们会通过特殊渠道发布早期预览版(EAP, Early Access Preview), 社区的早期使用者可以试用这些早期预览版, 并向我们提供反馈. 这些早期预览版不提供任何兼容性保证 (但我们会在合理的范围内, 尽量保持各个早期预览版之间, 以及早期预览版与正式发布版之间的兼容性). 对这些早期预览版的质量期望也大大低于正式发布版. Beta 测试版也属于这一范围.

**重要注意事项**: 由 1.X 早期预览版(比如, 1.1.0-eap-X)编译的任何二进制文件 **会被正式发布版的编译器拒绝**. 在稳定版正式发布之后, 我们不希望由正式发布之前的版本编译的代码继续存在.
这一点并不影响补丁版本更新的早期预览版(比如, 1.1.3-eap-X), 这种早期预览版会与稳定发布版具有相同的应用程序二进制接口(ABI, Application Binary Interface).

## 兼容模式

当一个大的开发组迁移到一个新的版本时, 如果一些开发者已经更新到新版本, 而其他开发者没有, 可能会出现一种 "不一致状态".
为了防止已更新到新版本的开发者编写并提交其他人无法编译的代码, 我们提供了以下命令行选项 (在 IDE 和 [Gradle](using-gradle.html#compiler-options)/[Maven](using-maven.html#specifying-compiler-options) 中也可以使用):   

- `-language-version X.Y` - 对 Kotlin 语言版本 X.Y 的兼容模式, 对这个版本之后的所有语言特性报告编译错误.
- `-api-version X.Y` - 对 Kotlin API 版本 X.Y c的兼容模式, 对使用这个版本以后的 Kotlin 标准库 API 的所有代码报告编译错误, (包括编译器生成的代码).

## 二进制兼容性的警告

如果你使用新版本的 Kotlin 编译器, 而在 classpath 中使用旧版本的标准库, 或旧版本的反射库, 这种情况可能是工程配置错误的迹象.
为了防止编译时或运行时的意外问题, 我们建议要么将依赖项更新到新版本, 或者明确指定 API 版本 / 语言版本的参数.
否则, 编译器会检测到可能会发生错误, 并报告警告信息.

比如, 假定旧版本 = 1.0, 新版本 = 1.1, 你会看到以下警告信息:

```
Runtime JAR files in the classpath have the version 1.0, which is older than the API version 1.1.
Consider using the runtime of version 1.1, or pass '-api-version 1.0' explicitly to restrict the
available APIs to the runtime of version 1.0.
```

这段警告信息表示你在使用 Kotlin 1.1 版编译器, 而标准库或反射库是 1.0 版. 这个问题可以通过几种不同的方法解决:
* 如果你期望使用 1.1 版标准库的 API, 或依赖于这些 API 的1语言特性, 那么应该将依赖项更新为 1.1 版.
* 如果你期望让你的代码兼容于 1.0 版标准库, 那么应该使用 `-api-version 1.0` 参数.
* 如果你只是升级到 Kotlin 1.1 版, 还未使用新的语法特性 (比如, 可能由于你的开发组中的其他成员还未升级), 那么可以使用 `-language-version 1.0` 参数, 这个参数会将所有的 API 和语言特性限制为使用 1.0 版.

```
Runtime JAR files in the classpath should have the same version. These files were found in the classpath:
    kotlin-reflect.jar (version 1.0)
    kotlin-stdlib.jar (version 1.1)
Consider providing an explicit dependency on kotlin-reflect 1.1 to prevent strange errors
Some runtime JAR files in the classpath have an incompatible version. Consider removing them from the classpath
```

这段警告信息表示你依赖的库版本不一致, 比如, 标准库为 1.1 版, 而反射库为 1.0 版. 为了防止在运行时发生微妙的错误, 我们建议对所有的 Kotlin 库使用相同的版本.
在这个例子中, 应该添加一个对反射库的依赖, 版本明确指定为 1.1.

```
Some JAR files in the classpath have the Kotlin Runtime library bundled into them.
This may cause difficult to debug problems if there's a different version of the Kotlin Runtime library in the classpath.
Consider removing these libraries from the classpath
```

这段警告信息表示在 classpath 中存在一个库, 它不是通过 Gradle/Maven 依赖项的方式依赖到 Kotlin 标准库, 而是在同一个库文件中发布了 Kotlin 标准库(也就是说, 将 Kotlin 标准库 _捆绑_ 在自己内部). 这样的库文件可能会引发错误, 因为标准的编译工具不会将它看作 Kotlin 标准库, 因此依赖项版本解析机制无法正确管理它, 最终导致 classpath 中同时存在同一个库的多个版本. 请联系这类库的作者, 建议他改为使用 Gradle/Maven 依赖项来依赖 Kotlin 标准库.
