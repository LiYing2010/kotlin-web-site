[//]: # (title: Kotlin 各部分组件的稳定性)

Kotlin 语言和它的工具集分成很多组件, 比如针对 JVM, JS 和 Native 平台的编译器, 标准库, 大量的相关工具, 等等.
这些组件很多已经正式发布为 **稳定(Stable)** 版本, 也就是说它们会以向后兼容的方式演化,
遵循 [_版本升级平滑便利_ 和 _保证语言的现代化_ 的原则](kotlin-evolution-principles.md).

遵循 _反馈循环(Feedback Loop)_ 原则, 出于试用的目的, 我们会向开发者社区提前发布很多功能,
因此很多组件还没有发布为 **稳定(Stable)** 版本.
其中一些功能还处于非常早期的阶段, 另一些已经比较成熟了.
根据各个组件的演化速度不同, 以及使用它们给使用者带来的风险程度不同,
我们将这些功能标记为 **实验性(Experimental)**, **Alpha** 或 **Beta** 几种状态.

## 稳定性级别 {id="stability-levels-explained"}

下面简单介绍这些稳定性级别的含义:

**实验性(Experimental)** 代表 "请只在玩具项目中使用这些功能":
  * 我们只是在实验某些想法, 并且希望某些使用者试用, 并提供意见反馈. 如果这些想法不成功, 我们随时可能抛弃它.

**Alpha** 代表 "使用时风险自负, 将来升级时可能会出现问题":
  * 我们打算将这些想法变成产品, 但它还没有达到最终状态.

**Beta** 代表 "可以使用这些功能, 我们会尽力减少升级时的问题":
  * 功能已经基本完成, 现在使用者的意见反馈非常重要.
  * 但是, 它还没有 100% 完成, 因此还可能发生变化 (包括根据你的意见反馈产生的变化).
  * 为了确保升级顺利, 请注意废弃声明.

我们将 _实验性(Experimental)_, _Alpha_ 和 _Beta_ 统称为 **未稳定(pre-stable)** 级别.

<a name="stable"/>

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
  详情请参见 [JetBrains 的开源文档](https://github.com/JetBrains#jetbrains-on-github).

## 子组件的稳定性

一个稳定的组件也可以包含实验性的子组件, 比如:
* 稳定的编译器可以包含实验性的功能特性;
* 稳定的 API 可以包含实验性的类或函数;
* 稳定的命令行工具可能包含实验性的参数选项.

我们确保会对这些还未 **稳定** 的子组件提供正确的文档.
我们也会尽可能警告使用者, 并要求使用者明确同意, 以避免无意中使用到这些未稳定发布的功能.

## Kotlin 各部分组件当前的稳定性

> 默认情况下, 所有的新组件都是实验性(Experimental)状态.
>
{style="note"}

### Kotlin 编译器

| **组件**                                                              | **状态** | **进入这个状态的版本** | **备注** |
|---------------------------------------------------------------------|--------|---------------|--------|
| Kotlin/JVM                                                          | Stable | 1.0.0         |        |
| Kotlin/Native                                                       | Stable | 1.9.0         |        |
| Kotlin/JS                                                           | Stable | 1.3.0         |        |
| Kotlin/Wasm                                                         | Alpha  | 1.9.20        |        |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable |               |        |

### 核心编译器插件

| **组件**                                           | **状态**       | **进入这个状态的版本** | **备注** |
|--------------------------------------------------|--------------|---------------|--------|
| [All-open](all-open-plugin.md)                   | Stable       | 1.3.0         |        |
| [No-arg](no-arg-plugin.md)                       | Stable       | 1.3.0         |        |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       | 1.3.0         |        |
| [kapt](kapt.md)                                  | Stable       | 1.3.0         |        |
| [Lombok](lombok.md)                              | Experimental | 1.5.20        |        |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0         |        |

### Kotlin 库

| **组件**                | **状态** | **进入这个状态的版本** | **备注** |
|-----------------------|--------|---------------|--------|
| kotlin-stdlib (JVM)   | Stable | 1.0.0         |        |
| kotlinx-coroutines    | Stable | 1.3.0         |        |
| kotlinx-serialization | Stable | 1.0.0         |        |
| kotlin-reflect (JVM)  | Beta   | 1.0.0         |        |
| kotlinx-datetime      | Alpha  | 0.2.0         |        |
| kotlinx-io            | Alpha  | 0.2.0         |        |

### Kotlin Multiplatform

| **组件**                                       | **状态** | **进入这个状态的版本** | **备注**                                           |
|----------------------------------------------|--------|---------------|--------------------------------------------------|
| Kotlin Multiplatform                         | Stable | 1.9.20        |                                                  |
| Android Studio 的 Kotlin Multiplatform plugin | Beta   | 0.8.0         | [版本与语言本身的版本不同](multiplatform-plugin-releases.md) |

### Kotlin/Native

| **组件**                              | **状态** | **进入这个状态的版本** | **备注**                    |
|-------------------------------------|--------|---------------|---------------------------|
| Kotlin/Native Runtime               | Stable | 1.9.20        |                           |
| Kotlin/Native 与 C 和 Objective-C 的交互 | Beta   | 1.3.0         |                           |
| klib 二进制文件                          | Stable | 1.9.20        | 不包含 cinterop klib 库, 参见下文 |
| cinterop klib 二进制文件                 | Beta   | 1.3.0         |                           |
| CocoaPods 集成                        | Stable | 1.9.20        |                           |

> 关于 Kotlin/Native 支持的编译目标, 详情请参见 [](native-target-support.md).

### 语言工具

| **组件**      | **状态** | **进入这个状态的版本** | **备注**                           |
|-------------|--------|---------------|----------------------------------|
| 脚本的语法与语义    | Alpha  | 1.2.0         |                                  |
| 脚本内嵌与扩展 API | Beta   | 1.5.0         |                                  |
| 脚本 的 IDE 支持 | Beta   |               | 从 IntelliJ IDEA 2023.1 及更高版本开始可用 |
| CLI 脚本      | Alpha  | 1.2.0         |                                  |

## 语言功能与设计提案

关于语言功能与新的设计提案, 请参见 [](kotlin-language-features-and-proposals.md).
