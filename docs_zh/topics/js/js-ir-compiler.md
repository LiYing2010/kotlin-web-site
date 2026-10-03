[//]: # (title: Kotlin/JS 编译器功能特性)

Kotlin/JS 编译器包括各种功能特性, 能够改善代码的性能, 尺寸, 以及开发速度.
这个过程贯穿整个编译过程, 它先将 Kotlin 代码转换为中间表达形式 (Intermediate Representation, IR), 然后生成 JavaScript 代码.

## 顶级属性(top-level property)的延迟初始化(Lazy initialization) {id="lazy-initialization-of-top-level-properties"}

为了改善应用程序的启动速度, Kotlin/JS 编译器会对顶级属性(top-level property)进行延迟初始化(Lazy initialization).
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

Kotlin/JS 编译器提供了 _对开发阶段二进制文件的增量编译模式_ , 可以对开发过程提高速度.
在这种模式下, 编译器会在模型层级缓存 Gradle task `compileDevelopmentExecutableKotlinJs` 的结果.
在后续的编译中, 对未修改的源代码文件使用缓存的编译结果, 可以使得编译更快完成, 尤其是在对代码进行少量修改的情况.

增量编译是默认启用的.
如果要对开发阶段二进制文件禁用增量编译, 请向项目的 `gradle.properties` 或 `local.properties` 文件添加以下设置:

```properties
kotlin.incremental.js.ir=false // 默认为 true
```

> 在增量编译模式中, 完整编译通常会变得更慢, 因为需要创建和生成缓存.
>
{style="note"}

## 在产品(Production)模式中对成员名称的极简化(Minification) {id="minification-of-member-names-in-production"}

Kotlin/JS 编译器会使用它的内部信息 关于 你的 Kotlin 类和函数之间的关系, 来实现更加有效的极简化(Minification), 缩短函数, 属性, 和类的名称.
这样可以缩减打包完成的应用程序的大小.

当你使用 [产品(Production)](js-project-setup.md#building-executables) 模式构建你的 Kotlin/JS 应用程序时,
会自动应用这样的极简化处理, 并默认启用.
要关闭对成员名称的极简化处理, 请使用 `-Xir-minimized-member-names` 编译器选项:

```kotlin
kotlin {
    js {
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
