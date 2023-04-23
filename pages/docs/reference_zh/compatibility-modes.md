---
type: doc
layout: reference
category: "Compatibility"
title: "兼容模式"
---

# 兼容模式

最终更新: {{ site.data.releases.latestDocDate }}

当一个大的开发组迁移到一个新的版本时, 某些时候可能会出现一种 "不一致状态", 一部分开发组已经更新, 但其他开发组还没有.
为了避免前一部分开发者编写并提交的代码, 导致其他人无法编译, 我们提供以下命令行选项
(在 IDE 和
[Gradle](gradle/gradle-compiler-options.html)
/
[Maven](maven.html#specifying-compiler-options)
中也可以使用):

- `-language-version X.Y` - Kotlin 语言版本 X.Y 兼容模式, 对这个版本以后的所有语言功能报告错误.
- `-api-version X.Y` - Kotlin API 版本 X.Y 兼容模式, 所有使用 Kotlin 标准库更高版本 API 的代码报告错误(包括编译器生成的代码).

目前, 除最新的稳定版之外, 我们还支持至少 3 个旧的语言和 API 版本的开发.
