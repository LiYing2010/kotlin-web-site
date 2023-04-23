---
type: doc
layout: reference
category: "Compatibility"
title: "Kotlin 各部分组件的稳定性"
---

# Kotlin 各部分组件的稳定性

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 语言和它的工具集分成很多组件, 比如针对 JVM, JS 和 Native 平台的编译器, 标准库, 大量的相关工具, 等等.
这些组件很多已经正式发布为 **稳定(Stable)** 版本, 也就是说它们会以向后兼容的方式演化,
遵循 _版本升级平滑便利_ 以及 _保证语言的现代化_ 的 [原则](kotlin-evolution.html).
这些稳定组件包括, 比如, Kotlin 针对 JVM 的编译器, 标准库, 协程.

遵循 _反馈循环(Feedback Loop)_ 原则, 出于试用的目的, 我们会向开发者社区提前发布很多功能,
因此很多组件还没有发布为 **稳定(Stable)** 版本.
其中一些功能还处于非常早期的阶段, 另一些已经比较成熟了.
根据各个组件的演化速度不同, 以及使用它们会给使用者带来的风险不同,
我们将这些功能标记为 **实验性(Experimental)**, **Alpha** 或 **Beta** 几种状态.

## 稳定性级别

下面简单介绍这些稳定性级别的含义:

**实验性(Experimental)** 代表 "请只在玩具项目中使用这些功能":
  * 我们只是在实验某些想法, 并且希望某些使用者试用, 并提供意见反馈. 如果这些想法不成功, 我们随时可能抛弃它.

**Alpha** 代表 "使用时风险自负, 将来升级时可能会出现问题":
  * 我们决定将这些想法变成产品, 但它还没有达到最终状态.

**Beta** 代表 "可以使用这些功能, 我们会尽力减少升级时的问题":
  * 功能已经基本完成, 现在使用者的意见反馈非常重要.
  * 但是, 它还没有 100% 完成, 因此还可能发生变化 (包括根据你的意见反馈产生的变化).
  * 为了确保升级顺利, 请注意废弃声明.

我们将 _实验性(Experimental)_, _Alpha_ 和 _Beta_ 统称为 **未稳定(pre-stable)** 级别.

<a name="stable"></a>
**稳定(Stable)** 代表 "即使是在最保守的场景也可以使用这些功能":
  * 功能已开发完毕. 我们会继续改进它, 遵循我们严格的
    [向后兼容(backward compatibility) 规则](https://kotlinfoundation.org/language-committee-guidelines/).

请注意, 稳定性级别并不代表组件会在什么时间发布为稳定版本. 同样, 也不代表组件在正式发布之前会发生多大的变化.
稳定性级别只代表组件会以多快的速度发生变化, 以及将来的版本升级问题会给使用者带来多大的风险.

## Kotlin 组件的 GitHub 徽章 

[GitHub 上的 Kotlin 组织](https://github.com/Kotlin) 存放着很多 Kotlin 相关项目.
有些项目我们在全职投入开发, 其他则只是业余项目.

每个 Kotlin 项目都有 2 个 GitHub 徽章描述它的稳定性和支持状态:

* **稳定性** 状态. 表示每个项目的演化速度, 以及用户使用它时的风险程度.
  稳定性状态与 [Kotlin 语言特性和各组件的稳定性级别](#stability-levels-explained) 完全相符:
    * ![Experimental stability level](https://kotl.in/badges/experimental.svg) 表示 **Experimental** 状态
    * ![Alpha stability level](https://kotl.in/badges/alpha.svg) 表示 **Alpha** 状态
    * ![Beta stability level](https://kotl.in/badges/beta.svg) 表示 **Beta** 状态
    * ![Stable stability level](https://kotl.in/badges/stable.svg) 表示 **Stable** 状态

* **支持** 状态. 表示我们对维护这个项目以及帮助使用者解决相关问题的保证程度.
  对于 JetBrains 的所有产品, 支持级别是一致的.  
  详情请参见 [JetBrains 文档](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub).

## 子组件的稳定性

一个稳定的组件也可以包含实验性的子组件, 比如:
* 稳定的编译器可以包含实验性的功能特性;
* 稳定的 API 可以包含实验性的类或函数;
* 稳定的命令行工具可能包含实验性的参数选项.

我们确保会对这些未稳定的子组件提供正确的文档. 我们也会尽可能警告使用者, 并要求使用者明确同意, 以避免无意中使用到这些未稳定发布的功能.

## Kotlin 各部分组件当前的稳定性

|**组件**|**状态**|**进入这个状态的版本**| **备注**  |
| --- | --- | --- |-------|
| Kotlin/JVM|Stable|1.0|  |
| Kotlin K2 (JVM)|Alpha|1.7|   |
| kotlin 标准库 (JVM)|Stable|1.0|   |
| 协程|Stable|1.3|   |
| kotlin 反射 (JVM)|Beta|1.0|  |
| Kotlin/JS (基于传统后端)|Stable|1.3| 从 1.8.0 开始已废弃, 参见 [IR 迁移指南](js/js-ir-migration.html) |
| Kotlin/JVM (基于 IR)|Stable|1.5|   |
| Kotlin/JS (基于 IR)|Stable|1.8|   |
| Kotlin/Native 运行库|Beta|1.3|    |
| Kotlin/Native 的新内存管理器|Beta|1.7.20| |
| klib 二进制文件|Alpha|1.4|    |
| Kotlin Multiplatform |Beta|1.7.20| |
| Kotlin/Native 与 C 代码和 Objective C 代码的交互|Beta|1.3|   |
| CocoaPods 集成|Beta|1.3|   |
| Android Studio 的 Kotlin Multiplatform Mobile plugin|Alpha|0.3.0| [版本与语言本身的版本不同](multiplatform-mobile/multiplatform-mobile-plugin-releases.html) 
| 期待/实际(expect/actual) 语言功能|Beta|1.2|  |
| KDoc 语法|Stable|1.0|  |
| Dokka|Beta|1.6|   |
| 脚本的语法和语义|Alpha|1.2|   |
| 脚本的内嵌和扩展 API|Beta|1.5 |
| 脚本的 IDE 支持|Experimental|1.2 |
| CLI 脚本|Alpha|1.2 |
| 编译器插件 API|Experimental|1.0|   |
| 序列化编译器插件|Stable|1.4|   |
| 序列化核心库|Stable|1.0.0| 版本与语言本身的版本不同 |
| 内联类(Inline class)|Stable|1.5|  |
| 无符号数运算|Stable|1.5|  |
| 标准库中的契约(Contract)|Stable|1.3|   |
| 用户定义的契约(Contract)|Experimental|1.3|   |
| **所有其他实验性组件, 默认状态**|Experimental|N/A|  |

*[本章节在 1.4 以前的版本参见这个页面](components-stability-pre-1.4.html).*
