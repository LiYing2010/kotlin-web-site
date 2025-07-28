[//]: # (title: 使用 IR 编译器)

Kotlin/JS IR 编译器后端是 Kotlin/JS 的主要创新方向, 并为以后的技术发展探索道路.

Kotlin/JS IR 编译器后端不是从 Kotlin 源代码直接生成 JavaScript 代码, 而是使用一种新方案.
Kotlin 源代码首先转换为
[Kotlin 中间代码(intermediate representation, IR)](whatsnew14.md#unified-backends-and-extensibility),
然后再编译为 JavaScript.
对于 Kotlin/JS, 这种方案可以实现更加积极的优化, 并能够改进以前的编译器中出现的许多重要问题,
比如, 生成的代码大小(通过 [死代码清除(Dead Code Elimination, DCE)](#dead-code-elimination)), 以及 JavaScript 和 TypeScript 生态环境的交互能力, 等等.

从 Kotlin 1.4.0 开始, 可以通过 Kotlin Multiplatform Gradle 插件使用 IR 编译器后端.
要在你的项目中启用它, 需要在你的 Gradle 构建脚本中, 向 `js` 函数传递一个编译器类型参数:

```groovy
kotlin {
    js(IR) { // 或者: LEGACY, BOTH
        // ...
        binaries.executable() // 不兼容 BOTH, 详情请见下文
    }
}
```

* `IR` 对 Kotlin/JS 使用新的 IR 编译器后端.
* `LEGACY` 使用旧的编译器后端.
* `BOTH` 编译项目时使用新的 IR 编译器以及默认的编译器后端.
  主要用于 [编写同时兼容于两种后端的库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility).

> 从 Kotlin 1.8.0 开始, 旧的编译器后端已被废弃. 从 Kotlin 1.9.0 开始, 使用 `LEGACY` 或 `BOTH` 编译器类型会发生错误.
>
{style="warning"}

编译器类型也可以在 `gradle.properties` 文件中通过 `kotlin.js.compiler=ir` 来设置.
但是这个设置会被 `build.gradle(.kts)` 中的任何设置覆盖.

## 顶级属性(top-level property)的延迟初始化(Lazy initialization) {id="lazy-initialization-of-top-level-properties"}

为了改善应用程序的启动速度, Kotlin/JS IR 编译器会对顶级属性(top-level property)进行延迟初始化(Lazy initialization).
通过这种方式, 应用程序启动时不会初始化它的代码中的全部顶级属性.
而只会初始化在启动阶段需要的那些顶级属性;
其他属性的初始化会被延迟, 直到使用它们的代码真正被执行时才会生成属性值.

```kotlin
val a = run {
    val result = // 假设这里是一段计算密集的代码
    println(result)
    result
} // 属性值直到初次使用时才会计算
```

如果由于某些原因你需要(在应用程序启动阶段)提早初始化一个属性, 可以对它标注
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/)
注解.

## 对开发阶段二进制文件进行增量编译 {id="incremental-compilation-for-development-binaries"}

JS IR 编译器提供了 _对开发阶段二进制文件的增量编译模式_ , 可以对开发过程提高速度.
在这种模式下, 编译器会在模型层级缓存 Gradle task `compileDevelopmentExecutableKotlinJs` 的结果.
在后续的编译中, 对未修改的源代码文件使用缓存的编译结果, 可以使得编译更快完成, 尤其是在对代码进行少量修改的情况.

增量编译是默认启用的.
如果要对开发阶段二进制文件禁用增量编译, 请向项目的 `gradle.properties` 或 `local.properties` 文件添加以下设置:

```none
kotlin.incremental.js.ir=false // 默认为 true
```

> 在增量编译模式中, 完整编译通常会变得更慢, 因为需要创建和生成缓存.
>
{style="note"}

## 输出模式 {id="output-mode"}

你可以选择让 JS IR 编译器在你的项目中如何输出 `.js` 文件:

* **对每个模块输出 `.js` 文件**. 默认情况下, JS 编译器的编译结果是对项目的每个模块输出单独的 `.js` 文件.
* **对每个项目输出 `.js` 文件**. 你也可以将整个项目编译为单个 `.js` 文件, 方法是向 `gradle.properties` 添加以下设置:

  ```none
  kotlin.js.ir.output.granularity=whole-program // 默认值是 'per-module'
  ```

* **对每个文件输出 `.js` 文件**. 你也可以设置更加细粒度的输出, 为每个 Kotlin 文件生成 1 个 JavaScript 文件
  (如果 Kotlin 文件包含导出的声明, 则会生成 2 个 JavaScript 文件). 启用这个模式的方法如下:

  1. 向你的构建文件, 添加 `useEsModules()` 函数, 支持 ECMAScript 模块:

     ```kotlin
     // build.gradle.kts
     kotlin {
         js(IR) {
             useEsModules() // 启用 ES2015 模块
             browser()
         }
     }
     ```

     或者, 你也可以使用 `es2015` [编译目标](js-project-setup.md#support-for-es2015-features),
     在你的项目中支持 ES2015 功能.

  2. 使用 `-Xir-per-file` 编译器选项, 或者更新你的 `gradle.properties` 文件, 如下:

     ```none
     # gradle.properties
     kotlin.js.ir.output.granularity=per-file // 默认值是 'per-module'
     ```

## 在产品(Production)模式中对成员名称的极简化(Minification) {id="minification-of-member-names-in-production"}

Kotlin/JS IR 编译器会使用它的内部信息 关于 你的 Kotlin 类和函数之间的关系, 来实现更加有效的极简化(Minification), 缩短函数, 属性, 和类的名称.
这样可以缩减打包完成的应用程序的大小.

当你使用 [产品(Production)](js-project-setup.md#building-executables) 模式构建你的 Kotlin/JS 应用程序时,
会自动应用这样的极简化处理, 并默认启用.
要关闭对成员名称的极简化处理, 请使用 `-Xir-minimized-member-names` 编译器选项:

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## 死代码清除(Dead Code Elimination, DCE) {id="dead-code-elimination"}

[死代码清除(Dead Code Elimination, DCE)](https://wikipedia.org/wiki/Dead_code_elimination)
可以删除未被使用的属性, 函数, 以及类, 减少最终编译输出结果的 JavaScript 代码大小.

有几种情况可以导致代码中存在未被使用的声明, 例如:

* 函数可能会被内联, 因此不会被直接调用 (除极少数情况外, 总是会如此).
* 模块使用了一个共享库. 如果没有 DCE, 库中没有被用到的部分仍然会包含在编译输出的 bundle 之内.
  例如, Kotlin 标准库包含了许多函数, 用于操作列表, 数组, 字符序列, 用于 DOM 的适配器, 等等.
  所有这些功能输出为 JavaScript 文件总计需要 1.3 MB.
  而一个简单的 "Hello, world" 应用程序只需要控制台相关函数, 整个文件只有几 KB.

在 Kotlin/JS 编译器中, 会自动处理 DCE:

* 在 _development_ 打包任务中, DCE 会被禁用, 对应于以下 Gradle 任务:

    * `jsBrowserDevelopmentRun`
    * `jsBrowserDevelopmentWebpack`
    * `jsNodeDevelopmentRun`
    * `compileDevelopmentExecutableKotlinJs`
    * `compileDevelopmentLibraryKotlinJs`
    * 名称中包含 "development" 的其它 Gradle 任务

* 在构建 _production_ bundle 时, DCE 会被启用, 对应于以下 Gradle 任务:

    * `jsBrowserProductionRun`
    * `jsBrowserProductionWebpack`
    * `compileProductionExecutableKotlinJs`
    * `compileProductionLibraryKotlinJs`
    * 名称中包含 "production" 的其它 Gradle 任务

使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解,
你可以指定一些声明, 让 DCE 将它当作根对待 (因此这些声明会被保留, 不被删除).

## 预览功能: 生成 TypeScript 声明文件 (d.ts) {id="preview-generation-of-typescript-declaration-files-d-ts"}

> 生成 TypeScript 声明文件 (`d.ts`)功能还处于 [实验阶段](components-stability.md).
> 它随时有可能变更或被删除.
> 使用这个功能需要明确要求使用者同意(详情请见下文), 而且你应该只用来进行功能评估, 不要用在你的正式产品中.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 提供你的反馈意见.
>
{style="warning"}

Kotlin/JS IR 编译器能够从你的 Kotlin 代码生成 TypeScript 定义.
在开发混合 App(hybrid app)时, JavaScript 工具和 IDE 可以使用这些定义, 来提供代码自动完成, 支持静态分析,
使得在 JavaScript 和 TypeScript 项目中包含 Kotlin 代码变得更加便利.

如果你的项目输出可执行文件 (`binaries.executable()`), Kotlin/JS IR 编译器会收集所有标注了
[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解的顶级声明,
并自动在一个 `.d.ts` 文件中生成 TypeScript 定义.

如果你想要生成 TypeScript 定义, 你需要在 Gradle 构建文件中明确进行配置.
请在你的 `build.gradle.kts` 文件的 [`js` 小节](js-project-setup.md#execution-environments) 中添加 `generateTypeScriptDefinitions()`.
例如:

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

这些声明位于 `build/js/packages/<package_name>/kotlin` 目录中, 与相应的未经 webpack 处理的 JavaScript 代码在一起.

## IR 编译器目前的限制 {id="current-limitations-of-the-ir-compiler"}

新的 IR 编译器后端的一个重要变化是与默认后端之间 **没有二进制兼容性**.
使用新的 IR 编译器后端创建的库, 会使用 [`klib` 格式](native-libraries.md#library-format), 在默认后端中将无法使用.
同时, 使用旧编译器创建的库, 就是一个包含 `js` 文件的 `jar`, 也不能在 IR 后端中使用.

如果你希望在你的项目中使用 IR 编译器后端, 那么需要 **将所有的 Kotlin 依赖项升级到支持这个新后端的版本**.
JetBrains 针对 Kotlin/JS 平台, 对 Kotlin 1.4+ 版本发布的库,
已经包含了使用新的 IR 编译器后端所需要的全部 artifact.

**如果你是库的开发者**, 希望为现在的编译器后端和新的 IR 编译器后端同时提供兼容性,
请阅读 [针对 IR 编译器编写库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility) 小节.

与默认后端相比, IR 编译器后端还存在一些差异. 试用新的后端时, 需要知道存在这些可能的问题.

* 有些 **库依赖于默认后端的独有的特性**, 比如 `kotlin-wrappers`, 可能会出现一些问题.
  你可以通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 跟踪这个问题的调查结果和进展.
* 默认情况下, IR 后端 **完全不会让 Kotlin 声明在 JavaScript 中可见**.
  要让 JavaScript 可以访问 Kotlin 声明, 这些声明 **必须** 添加
  [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解.

## 将既有的项目迁移到 IR 编译器 {id="migrating-existing-projects-to-the-ir-compiler"}

由于两种 Kotlin/JS 编译器的接口签名的不同, 要让你的 Kotlin/JS 代码能由 IR 编译器来编译,
可能需要你修改部分代码.
关于如何将既有的 Kotlin/JS 工程迁移到 IR 编译器, 请参见
[Kotlin/JS IR 编译器 迁移向导](js-ir-migration.md).

## 针对 IR 编译器开发向后兼容的库 {id="authoring-libraries-for-the-ir-compiler-with-backwards-compatibility"}

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
