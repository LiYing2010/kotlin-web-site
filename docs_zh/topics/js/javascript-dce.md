[//]: # (title: JavaScript 死代码剔除工具)

> 死代码剔除 (Dead Code Elimination, DCE) 工具已被废弃. DCE 工具针对旧的 JS 后端, 这个 JS 后端已经废弃了.
> 目前的 [JS IR 后端](#dce-and-javascript-ir-compiler) 本身支持 DCE,
> 而且可以通过 [`@JsExport` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)
> 指定在 DCE 过程中保留哪些 Kotlin 函数和类.
>
{style="warning"}

Kotlin Multiplatform Gradle 插件包含一个 _[死代码剔除(Dead Code Elimination)](https://wikipedia.org/wiki/Dead_code_elimination)_ (_DCE_) 工具.
死代码剔除通常又被称为 _摇树(Tree Shaking)_.
它可以删除未被使用的属性, 函数, 以及类, 减少最终编译输出结果的 JavaScript 代码大小.

有几种情况可以导致代码中存在未被使用的声明:

* 函数可能会被内联, 因此不会被直接调用 (除极少数情况外, 总是会如此).
* 模块使用了一个共享库. 如果没有 DCE, 库中没有被用到的部分仍然会包含在编译输出的 bundle 之内.
  比如, Kotlin 标准库包含了许多函数, 用于操作列表, 数组, 字符序列, 用于 DOM 的适配器, 等等.
  所有这些功能输出为 JavaScript 文件总计需要 1.3 MB.
  而一个简单的 "Hello, world" 应用程序只需要控制台相关函数, 整个文件只有几 KB.

构建 **产品版(production) bundle** 时, Kotlin Multiplatform Gradle 插件会自动处理 DCE,
比如, 使用 `browserProductionWebpack` 任务.
**开发版(development) bundle** 的构建任务(比如 `browserDevelopmentWebpack`) 不会包含 DCE.

## DCE 与 JavaScript IR 编译器

针对 IR 编译器的 DCE 适用方式如下:

* 针对开发环境进行编译时, DCE 会被禁用, 对应于以下 Gradle 任务:
  * `browserDevelopmentRun`
  * `browserDevelopmentWebpack`
  * `nodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 名称中包含 "development" 的其它 Gradle 任务
* 针对产品进行编译时, DCE 会被启用, 对应于以下 Gradle 任务:
  * `browserProductionRun`
  * `browserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  *  名称中包含 "production" 的其它 Gradle 任务

使用 `@JsExport` 注解, 你可以指定一些声明, 让 DCE 将它当作根对待 (因此这些声明会被保留, 不被删除).

## 在 DCE 中排除一部分函数或类声明

有些时候, 即使在你的模块中并没有使用某个函数或类, 但你可能需要在最终输出的 JavaScript 代码中保留它,
比如, 你可能要在客户端 JavaScript 代码中使用它.

要在死代码剔除时保留这些函数或类的声明, 请在 Gradle 构建脚本中添加 `dceTask` 代码段,
并在 `keep` 函数的参数中列出需要保留的函数或类声明.
参数必须是这个声明的完整限定名称, 包含模块名作为前缀, 比如: `moduleName.dot.separated.package.name.declarationName`

> 除非另有设置, 否则在生成的 JavaScript 代码中,
> 函数和模块的名称会被 [混淆(mangle)](js-to-kotlin-interop.md#jsname-annotation).
> 如果要在 DCE 中保持这些函数不被剔除,
> 需要在 `keep` 的参数中使用它们混淆之后出现在生成的 JavaScript 代码中的名称.
>
{style="note"}

```groovy
kotlin {
    js {
        browser {
            dceTask {
                keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
            }
            binaries.executable()
        }
    }
}
```

如果希望保持整个包或模块不被剔除, 可以使用它出现在生成的 JavaScript 代码中的完整限定名称.

> 保持整个包或模块不被剔除, 会阻碍 DCE 删除许多未被使用的声明.
> 因此, 最好逐个选择需要从 DCE 中排除的声明.
>
{style="note"}

## 禁用 DCE {id="disable-dce"}

如果需要完全关闭 DCE 功能, 可以在 `dceTask` 中使用 `devMode` 选项:

```groovy
kotlin {
    js {
        browser {
            dceTask {
                dceOptions.devMode = true
            }
        }
        binaries.executable()
    }
}
```
