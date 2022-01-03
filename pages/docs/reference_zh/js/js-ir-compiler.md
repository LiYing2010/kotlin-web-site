---
type: doc
layout: reference
category: "JavaScript"
title: "使用 IR 编译器"
---
# 使用 Kotlin/JS IR 编译器

本页面最终更新: 2022/01/10

> Kotlin/JS IR 编译器目前的稳定级别是 _[Beta](/docs/reference_zh/components-stability.html)_.
> 它已经基本稳定, 但未来可能会需要手动进行代码迁移.
> 我们会尽力减少开发者进行的代码变更.
{:.warning}

Kotlin/JS IR 编译器后端是 Kotlin/JS 的主要创新方向, 并为以后的技术发展探索道路.

Kotlin/JS IR 编译器后端不是从 Kotlin 源代码直接生成 JavaScript 代码, 而是使用一种新方案.
Kotlin 源代码首先转换为
[Kotlin 中间代码(intermediate representation, IR)](whatsnew14.html#unified-backends-and-extensibility),
然后再编译为 JavaScript.
对于 Kotlin/JS, 这种方案可以实现更加积极的优化, 并能够改进以前的编译器中出现的许多重要问题,
比如, 生成的代码大小(通过死代码清除), 以及 JavaScript 和 TypeScript 生态环境的交互能力, 等等.

从 Kotlin 1.4.0 开始, 可以通过 Kotlin/JS Gradle 插件使用 IR 编译器后端.
要在你的项目中启用它, 需要在你的 Gradle 构建脚本中, 向 `js` 函数传递一个编译器类型参数:

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // 或者: LEGACY, BOTH
        // ...
        binaries.executable() // 不兼容 BOTH, 详情请见下文
    }
}
```

- `IR` 对 Kotlin/JS 使用新的 IR 编译器后端.
- `LEGACY` 使用默认的编译器后端.
- `BOTH` 编译项目时使用新的 IR 编译器以及默认的编译器后端.
  主要用于 [编写同时兼容于两种后端的库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility).

编译器类型也可以在 `gradle.properties` 文件中通过 `kotlin.js.compiler=ir` 来设置.
但是这个设置会被 `build.gradle(.kts)` 中的任何设置覆盖.

## 忽略编译错误

> _忽略编译错误_ 模式还处于 [实验阶段](/docs/reference_zh/components-stability.html).
> 它随时有可能变更或被删除.
> 使用这个功能需要明确要求使用者同意(详情请见下文), 而且你应该只用来进行功能评估, 不要用在你的正式产品中.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
{:.warning}

Kotlin/JS IR 编译器提供了一个在默认的编译器后端中没有的新编译模式 – _忽略编译错误_ 模式.
在这个模式下, 即使代码包含错误, 你也可以试用你的应用程序.
比如, 你可能在进行一个非常复杂的代码重构时, 或者在编写系统的某一部分, 与发生编译错误的另一部分完全无关.

在这个新的编译器模式下, 编译器会忽略所有的错误代码. 因此, 你可以运行应用程序, 并试用与错误代码无关的那部分功能.
如果你试图运行那些存在编译错误的代码, 那么将会发生运行期异常.

要忽略你代码中的编译错误, 可以选择两种错误宽容策略:
- `SEMANTIC`. 编译器会接受语法正确但语义上无意义的代码.
    比如, 将数值赋值给字符串变量 (类型不匹配).
- `SYNTAX`. 编译器会接受任何代码, 即使包含语法错误.
    无论你编写什么样的代码, 编译器都会尝试生成可执行的代码.

作为一个试验性的功能, 忽略编译错误需要使用者同意(Opt-in).
要开始这个模式, 需要添加 `-Xerror-tolerance-policy={SEMANTIC|SYNTAX}` 编译器选项:

```kotlin
kotlin {
   js(IR) {
       compilations.all {
           compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xerror-tolerance-policy=SYNTAX")
       }
   }
}
```

## 顶级属性(top-level property)的延迟初始化(Lazy initialization)

> 顶级属性延迟初始化功能还处于 [实验阶段](/docs/reference_zh/components-stability.html).
> 它随时有可能变更或被删除.
> 使用这个功能需要明确要求使用者同意(详情请见下文), 而且你应该只用来进行功能评估, 不要用在你的正式产品中.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-44320) 提供你的反馈意见.
{:.warning}

为了改善应用程序的启动速度, Kotlin/JS IR 编译器提供了一个选项, 可以对顶级属性(top-level property)进行延迟初始化(Lazy initialization).
通过这种方式, 应用程序启动时不会初始化它的代码中的全部顶级属性.
而只会初始化在启动阶段需要的那些顶级属性;
其他属性的初始化会被延迟, 直到使用它们的代码真正被执行时才会生成属性值.

顶级属性的延迟初始化还是一种实验性功能, 因此需要明确要求使用者同意.
要使用这个功能, 要在使用 JS IR 编译器编译代码时, 添加 `-Xir-property-lazy-initialization` 选项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
```kotlin
tasks.withType<Kotlin2JsCompile> {
   kotlinOptions {
     freeCompilerArgs += "-Xir-property-lazy-initialization"
   }
}
```
</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
```groovy
tasks.withType(Kotlin2JsCompile) {
   kotlinOptions {
     freeCompilerArgs += "-Xir-property-lazy-initialization"
   }
}
```
</div>
</div>

## 预览: 生成 TypeScript 声明文件 (d.ts)

> 生成 TypeScript 声明文件 (`d.ts`)功能还处于 [实验阶段](/docs/reference_zh/components-stability.html).
> 它随时有可能变更或被删除.
> 使用这个功能需要明确要求使用者同意(详情请见下文), 而且你应该只用来进行功能评估, 不要用在你的正式产品中.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 提供你的反馈意见.
{:.warning}

Kotlin/JS IR 编译器能够从你的 Kotlin 代码生成 TypeScript 定义.
在开发混合 app(hybrid app)时, JavaScript 工具和 IDE 可以使用这些定义, 来提供代码自动完成, 支持静态分析,
使得在 JavaScript 和 TypeScript 项目中包含 Kotlin 代码变得更加便利.

在输出可执行文件(`binaries.executable()`)的项目中, 标注了 [`@JsExport`](js-to-kotlin-interop.html#jsexport-annotation) 注解的顶级声明会生成一个 `.d.ts`文件,
其中包含导出的 Kotlin 声明对应的 TypeScript 定义.
这些声明位于 `build/js/packages/<package_name>/kotlin`, 与相应的未经 webpack 处理的 JavaScript 代码在一起.

## IR 编译器目前的限制

新的 IR 编译器后端的一个重要变化是与默认后端之间 **没有二进制兼容性**.
对于 Kotlin/JS 来说, 两种后端之间没有兼容性意味着,
使用新的 IR 编译器后端创建的库, 在默认后端中将无法使用, 反过来也是如此.

如果你希望在你的项目中使用 IR 编译器后端, 那么需要 **将所有的 Kotlin 依赖项升级到支持这个新后端的版本**.
JetBrains 针对 Kotlin/JS 平台, 对 Kotlin 1.4+ 版本发布的库,
已经包含了使用新的 IR 编译器后端所需要的全部 artifact.

**如果你是库的开发者**, 希望为现在的编译器后端和新的 IR 编译器后端同时提供兼容性,
请阅读 [针对 IR 编译器编写库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility) 小节.

与默认后端相比, IR 编译器后端还存在一些差异. 试用新的后端时, 需要知道存在这些可能的问题.

- 有些 **库依赖于默认后端的独有的特性**, 比如 `kotlin-wrappers`, 可能会出现一些问题. 你可以通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 跟踪这个问题的调查结果和进展.
- 默认情况下, IR 后端 **完全不会让 Kotlin 声明在 JavaScript 中可见**. 要让 JavaScript 可以访问 Kotlin 声明, 这些声明 **必须** 添加 [`@JsExport`](js-to-kotlin-interop.html#jsexport-annotation) 注解.


## 将既有的项目迁移到 IR 编译器

由于两种 Kotlin/JS 编译器的接口签名的不同, 要让你的 Kotlin/JS 代码能由 IR 编译器来编译,
可能需要你修改部分代码.
关于如何将既有的 Kotlin/JS 工程迁移到 IR 编译器, 请参见
[Kotlin/JS IR 编译器 迁移向导](js-ir-migration.html).

## 针对 IR 编译器开发向后兼容的库

如果你是库的维护者, 希望同时兼容默认后端和新的 IR 编译器后端, 有一种编译器选择设置可以让你对两种后端都创建 artifact,
因此可以支持下一代 Kotlin 编译器, 同时又对你的既有用户保持兼容性.
这就是所谓的 `both` 模式, 可以在 `gradle.properties` 文件中通过 `kotlin.js.compiler=both` 来启用,
或者, 也可以在 `build.gradle(.kts)` 文件的 `js` 代码块之内, 设置为项目独有的选项:

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

使用 `both` 模式时, 从你的源代码构建库时, IR 编译器后端和默认编译器后端都会被使用(如同它的名称所指的那样).
也就是说, Kotlin IR 的  `klib` 文件, 以及默认编译器的 `jar` 文件都会生成.
当发布到相同的 Maven 路径时, Gradle 会根据使用场景自动选择正确的 artifact – 对旧的编译器是 `js`, 对新的编译器是 `klib`.
因此对于使用两种编译器后端中的任何一个的项目, 你都可以编译并发布你的库.
