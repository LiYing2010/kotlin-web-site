---
type: doc
layout: reference
category: Tools
title: "编码规约"
---

# 代码风格迁移指南


## Kotlin 编码规约与 IntelliJ IDEA 源代码格式化

关于如何编写符合 Kotlin 习惯的代码, [Kotlin 编码规约](coding-conventions.html) 讲到了很多方面的内容,
其中还包括一些代码格式化方面的建议, 以便提高 Kotlin 代码的可读性.

不幸的是, 在本文档发布之前很长时间, IntelliJ IDEA 内建的源代码格式化工具就已经开始工作了, 因此它目前默认的设置与现在推荐的代码格式化规则存在一些不同.

符合逻辑的做法似乎是切换 IntelliJ IDEA 默认设置, 消除这些不一致, 让格式化规则与 Kotlin 编码规约保持一致.
但是这就意味着, Kotlin plugin 安装的那一刻, 所有现存的 Kotlin 项目都会使用新的代码风格.
这并不是我们更新 Kotlin plugin 时期待的结果, 对不对?

所以我们制定了下面的迁移计划:

* 从 Kotlin 1.3 开始, 默认启用官方的代码风格格式化设置, 而且只用于新项目 (旧的格式化设置可以手工启用)
* 既有项目的作者可以选择迁移到 Kotlin 编码规约
* 既有项目的作者可以在某个项目内明确指定使用旧的代码风格格式化设置 (这样, 将来切换到默认设置时项目不会受影响)
* 在 Kotlin 1.4 中切换到默认的格式化设置, 并使它与 Kotlin 编码规约一致

## "Kotlin 编码规约" 与 "IntelliJ IDEA 默认代码风格" 之间的不同

最大的变化就是连续缩进规则. 使用双倍缩进来表示一个多行的表达式在前一行还未结束, 这是很好的.
这是一个非常简单而且非常通行的规则, 但是这样格式化之后, 有些 Kotlin 构造器看起来会有点奇怪.
在 Kotlin 编码规约中推荐使用单倍缩进, 而以前会强制使用很长的连续缩进.

![代码格式化的不同](/kotlin/assets/images/tutorials/codestyle-migration/code-formatting-diff.png)

在实际使用中, 很有很多代码受到影响, 因此这个变化被认为是一个大的代码风格变更.

## 关于迁移到新的代码风格的讨论

A new code style adoption might be a very natural process if it starts with a new project, when there's no code formatted in the old way. That is why starting from version 1.3, the Kotlin IntelliJ Plugin creates new projects with formatting from the Code Conventions document which is enabled by default.

Changing formatting in an existing project is a far more demanding task, and should probably be started with discussing all the caveats with the team.

The main disadvantage of changing the code style in an existing project is that the blame/annotate VCS feature will point to irrelevant commits more often. While each VCS has some kind of way to deal with this problem (["Annotate Previous Revision"](https://www.jetbrains.com/help/idea/investigate-changes.html) can be used in IntelliJ IDEA), it's important to decide if a new style is worth all the effort. The practice of separating reformatting commits from meaningful changes can help a lot with later investigations.

Also migrating can be harder for larger teams because committing a lot of files in several subsystems may produce merging conflicts in personal branches. And while each conflict resolution is usually trivial, it's still wise to know if there are large feature branches currently in work.

In general, for small projects, we recommend converting all the files at once.

For medium and large projects the decision may be tough. If you are not ready to update many files right away you may decide to migrate module by module, or continue with gradual migration for modified files only.

## Migration to a new code style

Switching to the Kotlin Coding Conventions code style can be done in `Settings → Editor → Code Style → Kotlin`
dialog. Switch scheme to *Project* and activate `Set from... → Predefined Style → Kotlin Style Guide`.

In order to share those changes for all project developers `.idea/codeStyle` folder have to be committed to VCS.

If an external build system is used for configuring the project, and it's been decided not to share `.idea/codeStyle` folder, Kotlin Coding Conventions can be forced with an additional property:

### In Gradle
Add **kotlin.code.style**=**official** property to the **gradle.properties** file at the project root and commit the file to VCS.

### In Maven
Add **kotlin.code.style official** property to root **pom.xml** project file.

<div class="sample" markdown="1" theme="idea" mode='xml'>

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

</div>

_Warning:_ having the **kotlin.code.style** option set may modify the code style scheme during a project import and may change the code style settings.

After updating your code style settings, activate “Reformat Code” in the project view on the desired scope.

![源代码重格式化对话框](/kotlin/assets/images/tutorials/codestyle-migration/reformat-code.png)


For a gradual migration, it's possible to enable the *"File is not formatted according to project settings"* inspection. It will highlight the places that should be reformatted. After enabling the *"Apply only to modified files"* option, inspection will show formatting problems only in modified files. Such files are probably going to be committed soon anyway.

## Store old code style in project

It's always possible to explicitly set the IntelliJ IDEA code style as the correct code style for the project. To do so please switch to the *Project* scheme in `Settings → Editor → Code Style → Kotlin` and select *"Kotlin obsolete IntelliJ IDEA codestyle"* in the *"Use defaults from:"* on the *Load* tab.

In order to share the changes across the project developers `.idea/codeStyle` folder, it has to be committed to VCS. Alternatively **kotlin.code.style**=**obsolete** can be used for projects configured with Gradle or Maven.
