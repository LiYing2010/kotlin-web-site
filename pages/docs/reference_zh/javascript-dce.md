---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript 死代码剔除工具"
---

# JavaScript 死代码剔除工具(DCE)

Kotlin/JS Gradle 插件包含一个 [_死代码剔除(Dead Code Elimination)_](https://wikipedia.org/wiki/Dead_code_elimination) (_DCE_) 工具.
死代码剔除通常又被称为 _摇树(Tree Shaking)_.
它可以删除未被使用的属性, 函数, 以及类, 减少最终编译输出结果的 JavaScript 代码大小.

有几种情况可以导致代码中存在未被使用的声明:

* 函数可能会被内联, 因此不会被直接调用 (除极少数情况外, 总是会如此).
* 模块使用了一个共享库. 如果没有 DCE, 库中没有被用到的部分仍然会包含在编译输出的 bundle 之内.
  比如, Kotlin 标准库包含了许多函数, 用于操作列表, 数组, 字符序列, 用于 DOM 的适配器, 等等.
  文件大小总计 1.3 MB. 而一个简单的 "Hello, world" 应用程序只需要控制台相关函数, 整个文件只有几 KB.

当构建产品版(production) bundle 时, Kotlin/JS Gradle 插件会自动处理 DCE, 比如, 使用 `browserProductionWebpack` 任务.
开发版(development) 构建任务不会包含 DCE.

## 在 DCE 中排除一部分函数或类声明

有些时候, 即使在你的模块中并没有使用某个函数或类, 但你可能需要在最终输出的 JavaScript 代码中保留它,
比如, 你可能要在客户端 JavaScript 代码中使用它.

要在死代码剔除时保留这些函数或类的声明, 请在 Gradle 构建脚本中添加 `dceTask` 代码段,
并在 `keep` 函数的参数中列出需要保留的函数或类声明.
参数必须是这个声明的完整限定名称, 包含模块名作为前缀, 比如: `moduleName.dot.separated.package.name.declarationName`

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin.target.browser {
    dceTask {
        keep 'myKotlinJSModule.org.example.getName', 'myKotlinJSModule.org.example.User'
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin.target.browser {
    dceTask {
        keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
    }
}
```

</div>
</div>

注意, 在生成的 JavaScript 代码中, 有参数的函数的名称会被 [混淆(mangle)](js-to-kotlin-interop.html#jsname-annotation).
要在 DCE 中保留这些函数, `keep` 的参数中需要使用混淆后的名称.

## 已知的问题: DCE 和 ktor

在 Kotlin {{ site.data.releases.latest.version }} 中,
如果在 Kotlin/JS 项目中使用 [ktor](https://ktor.io/), 会存在一个已知的 [问题](https://github.com/ktorio/ktor/issues/1339).
某些情况下, 你可能遇到类型错误, 比如 `<something> is not a function`,
其中发生问题的函数来自 `io.ktor:ktor-client-js:1.3.0` 或 `io.ktor:ktor-client-core:1.3.0` artifact.
为了避免这个问题, 请添加以下 DCE 配置:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin.target.browser {
    dceTask {
        keep 'ktor-ktor-io.\$\$importsForInline\$\$.ktor-ktor-io.io.ktor.utils.io'
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin.target.browser {
    dceTask {
        keep("ktor-ktor-io.\$\$importsForInline\$\$.ktor-ktor-io.io.ktor.utils.io")
    }
}
```

</div>
</div>
