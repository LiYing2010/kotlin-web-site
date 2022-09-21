---
type: doc
layout: reference
category: "Compatibility"
title: "兼容模式"
---

# 兼容模式

最终更新: {{ site.data.releases.latestDocDate }}

当一个大的开发组迁移到一个新的版本时, 某些时候可能会出现一种 "不一致状态", 一部分开发组已经更新, 而其他开发组还没有.
为了避免前一部分开发者编写并提交的代码, 导致其他人无法编译, 我们提供以下命令行选项
(在 IDE 和
[Gradle](gradle.html#compiler-options)
/
[Maven](maven.html#specifying-compiler-options)
中也可以使用):

- `-language-version X.Y` - Kotlin 语言版本 X.Y 兼容模式, 对这个版本以后的所有语言功能报告错误.
- `-api-version X.Y` - Kotlin API 版本 X.Y 兼容模式, 所有使用 Kotlin 标准库更高版本 API 的代码报告错误(包括编译器生成的代码).

*下文中, 我们使用 OV 表示 "旧版本(Older Version)", 使用 NV 表示 "新版本(Newer Version)".* 

## 二进制兼容性警告

如果你使用 NV Kotlin 编译器, 但 classpath 中存在的是 OV 标准库或 OV 反射库, 可以说明项目配置不正确.
为了防止编译期或运行期的未知问题, 我们建议, 要么将依赖项更新到 NV, 要么明确指定 API 版本 / 语言版本参数.
否则编译器会检测到可能发生错误, 并报告警告.

比如, 如果 OV 为 1.0, NV 为 1.1, 你会看到以下警告之一:

```text
Runtime JAR files in the classpath have the version 1.0, which is older than the API version 1.1. 
Consider using the runtime of version 1.1, or pass '-api-version 1.0' explicitly to restrict the 
available APIs to the runtime of version 1.0.
```

这个警告的意思是说, 你在使用 Kotlin 编译器 1.1 , 但标准库或反射库版本为 1.0.
这个问题可以通过几种不同的方式解决:
* 如果你期望使用 1.1 标准库中的 API, 或依赖于这些 API 的语言功能, 你应该将依赖项更新到版本 1.1.
* 如果你希望保持你的代码兼容 1.0 标准库, 你可以使用编译器参数 `-api-version 1.0`.
* 如果你已经更新到了 Kotlin 1.1, 但仍然无法使用新的语言功能(比如, 由于你开发组中的某些成员还没有更新),
  你可以使用编译器参数 `-language-version 1.0`, 它会将所有的 API 和语言功能限制为 1.0.

```text
Runtime JAR files in the classpath should have the same version. These files were found in the classpath:
    kotlin-reflect.jar (version 1.0)
    kotlin-stdlib.jar (version 1.1)
Consider providing an explicit dependency on kotlin-reflect 1.1 to prevent strange errors
Some runtime JAR files in the classpath have an incompatible version. Consider removing them from the classpath
```

这个警告的意思是说, 你的一个库依赖项的版本不同, 比如标准库 为 1.1, 反射库为 1.0.
为了防止运行期的细微错误, 我们建议你对所有的 Kotlin 库使用相同的版本.
对于这个错误, 请考虑为 反射库 1.1版添加明确的依赖项.

```text
Some JAR files in the classpath have the Kotlin Runtime library bundled into them.
This may cause difficult to debug problems if there's a different version of the Kotlin Runtime library in the classpath.
Consider removing these libraries from the classpath
```

这个警告的意思是说, classpath 中有一个库, 没有以 Gradle/Maven 依赖项的方式依赖 Kotlin 标准库,
但在随着这个库的 artifact 内发布了 Kotlin 标准库(也就是说. 其中 _捆绑(bundle)_ 了 Kotlin 标准库).
这样的库可能导致问题, 因为标准构建工具不会将它看作是 Kotlin 标准库, 因此它不会适用于依赖项版本解析机制,
最终可能在 classpath 中出现同一个库的多个版本.
请联系这个库的作者, 并建议改为使用 Gradle/Maven 依赖项.
