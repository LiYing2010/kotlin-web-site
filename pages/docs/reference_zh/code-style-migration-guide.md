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

![代码格式化的不同]({{ url_for('tutorial_img', filename='codestyle-migration/code-formatting-diff.png') }})

在实际使用中, 会有很多代码受到影响, 因此这个变化被认为是一个大的代码风格变更.

## 关于迁移到新的代码风格的讨论

采用一种新的代码风格, 对于一个新的项目来说也许是非常自然的步骤, 因为并没有源代码是使用旧的规则格式化的.
因此从 1.3 版开始, Kotlin IntelliJ Plugin 创建项目时, 默认使用与 Kotlin 编码规约一致的代码格式化规则.

对一个已有的项目改变它的代码格式化规则就是一件费力得多的工作了, 而且应该先在整个开发团队中就此进行讨论.

在已有的项目中修改代码格式带来的主要坏处是, 源代码版本管理系统(VCS)的 blame/annotate 功能会更多地指向无关的提交(commit).
虽然每种源代码版本管理系统都有某种办法可以解决这个问题
(在 IntelliJ IDEA 中可以使用 ["注解前一个版本"](https://www.jetbrains.com/help/idea/investigate-changes.html)),
但是事先考虑一下新的代码风格是不是值得我们耗费这些努力, 还是很重要的.
在源代码版本管理系统中, 将源代码格式化导致的提交与真正有意义的修改区分开来, 对于将来查看代码变更历史有很大帮助.

而且, 对于比较大的开发组来说迁移会更困难, 因为在多个子系统中提交大量文件可能会在个人的开发分支中导致文件合并时的冲突.
虽然每个冲突的解决通常都很简单, 但还是应该事先搞清楚, 是不是存在某个分支正在进行大的功能开发工作.

总的来说, 对于小的项目, 我们建议一次性转换所有文件.

对于中型和大型项目, 决策可能比较困难.
如果你还没有准备好马上更新大量文件, 你可以决定逐个模块进行迁移, 或者只对你开发中修改的文件逐渐迁移.

## 迁移到新的代码风格

可以通过 `Settings → Editor → Code Style → Kotlin` 对话框切换到 Kotlin 编码规约的代码风格.
将 scheme 切换为 *Project*, 然后激活 `Set from... → Predefined Style → Kotlin Style Guide`.

如果要将这些变更共享给项目的所有开发者, 必须把 `.idea/codeStyle` 文件夹提交到源代码版本管理系统.

如果使用外部的编译系统来配置项目, 而且决定不共享 `.idea/codeStyle` 文件夹, 可以通过额外的属性来强制使用 Kotlin 编码规约:

### 对于 Gradle
在项目根目录下的 **gradle.properties** 文件中, 添加 **kotlin.code.style**=**official** 属性, 并把这个文件提交到源代码版本管理系统.

### 对于 Maven
对项目的根 **pom.xml** 文件, 添加 **kotlin.code.style official** 属性.

<div class="sample" markdown="1" theme="idea" mode='xml'>

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

</div>

_警告:_ 设置 **kotlin.code.style** 属性后, 导入项目时可能会修改 IDE 的代码风格 scheme, 并且可能修改 IDE 的代码风格设置.

升级你的代码风格设置之后, 可以在 project 中选择你希望的范围, 然后启动 “Reformat Code” 对话框.

![源代码重格式化对话框]({{ url_for('tutorial_img', filename='codestyle-migration/reformat-code.png') }})


对于各个文件逐渐迁移的情况, 可以激活 *"File is not formatted according to project settings"* 检查器.
这个检查器会高亮标识需要重新格式化的代码.
打开 *"Apply only to modified files"* 选项时, 检查器会只显示修改过的文件中的代码格式化问题.
这些文件很可能就是你将要提交的文件.

## 将旧的代码风格保存到项目中

如果你需要, 可以将 IntelliJ IDEA 的代码风格明确设置为当前项目的代码风格.
首先在 `Settings → Editor → Code Style → Kotlin` 对话框中将 scheme 切换为 *Project*,
然后在 *Load* 标签页的 *"Use defaults from:"* 项目中选择 *"Kotlin obsolete IntelliJ IDEA codestyle"*.

如果要将每个开发者的 `.idea/codeStyle` 文件夹的变更共享给整个开发组, 必须将这个文件夹提交到源代码版本管理系统.
或者, 对于通过 Gradle 或 Maven 配置的项目, 可以使用 **kotlin.code.style**=**obsolete**.
