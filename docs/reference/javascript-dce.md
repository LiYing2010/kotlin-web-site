---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript 死代码剔除工具"
---

# JavaScript DCE

从 1.1.4 版开始, Kotlin/JS 包含了一个死代码剔除(DCE, dead code elimination)工具.
这个工具可以从生成的 JS 中剔除未被使用的属性, 函数, 以及类.
有几种情况可以导致代码中存在未被使用的声明:

* 函数可能会被内联, 因此不会被直接调用 (除极少数情况外, 总是会如此).
* 你使用了一个共享库, 其中提供的函数远远超过你实际需要的.
  比如, Kotlin 标准库(`kotlin.js`) 包含了许多函数, 用于操作列表, 数组, 字符序列, 用于 DOM 的适配器, 等等, 文件大小总计 1.3 MB.
  而一个简单的 "Hello, world" 应用程序只需要控制台相关函数, 整个文件只有几 KB.

死代码剔除通常也叫做 'tree shaking'.


## 如何使用

目前可以通过 Gradle 使用 DCE 工具.

要激活 DCE 工具, 请将以下内容添加到 `build.gradle`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
apply plugin: 'kotlin-dce-js'
```
</div>

注意, 如果你正在使用多工程编译, 那么应该将这个 plugin 用在主工程上, 主工程就是你的应用程序入口.

默认情况下, 编译输出的 JavaScript 文件集 (你的应用程序加上所有的依赖项) 会位于 `$BUILD_DIR/min/` 路径下, 其中 `$BUILD_DIR` 是编译产生的 JavaScript 的输出路径(通常为, `build/classes/main`).


### 配置

要对主代码集配置 DCE, 你可以使用 `runDceKotlinJs` 编译任务(其他的源代码集对应的编译任务名为 `runDce<sourceSetName>KotlinJs`).

有时你会在 JavaScript 中直接使用 Kotlin 声明, 然而这个声明被 DCE 工具消除了. 你可能会希望保留这个声明.
为了实现这个目的, 你可以在 `build.gradle` 中使用以下语法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
runDceKotlinJs.keep "declarationToKeep"[, "declarationToKeep", ...]
```
</div>

其中 `declarationToKeep` 的语法如下:

```
moduleName.dot.separated.package.name.declarationName
```

比如, 假设一个名为 `kotlin-js-example` 的模块, 其中包含名为 `org.jetbrains.kotlin.examples` 的包, 包中包含一个名为 `toKeep` 的函数,
这时, 请使用以下声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
runDceKotlinJs.keep "kotlin-js-example_main.org.jetbrains.kotlin.examples.toKeep"
```
</div>

注意, 如果你的函数有参数, 那么函数名会被混淆,因此在 keep 命令中应该使用混淆后的函数名.

### 开发模式

运行 DCE 会导致每次编译时都消耗一些额外的时间, 而且在开发过程中我们并不在意编译输出的结果文件大小.
因此在开发过程中, 可以对 DCE 编译任务指定 `dceOptions.devMode` 选项, 让 DCE 工具跳过死代码剔除处理, 以便缩短编译时间.

比如, 如果想要对 `main` 源代码集按照某种自定义的条件来禁用 DCE 处理, 并且对 `test` 源代码始终禁用 DCE, 那么可以在编译脚本中加入以下设置:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
runDceKotlinJs.dceOptions.devMode = isDevMode
runDceTestKotlinJs.dceOptions.devMode = true
```
</div>

# 示例

[这里](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/js-dce) 是一个完整的示例, 演示如何集成 DCE 和 webpack, 将 Kotlin 代码编译产生一个尺寸很小的 JavaScript bundle.


## 注意事项

* 在 Kotlin 1.1.x 版中, DCE 工具是一个 *实验性* 功能.
 这并不代表我们会删除它, 也不代表它不能用于生产环境. 而是说, 将来我们可能改变配置参数的名称, 默认值, 等等.
* 目前, 如果你的工程是一个共享库, 你不应该使用 DCE 工具.
  只有当你在开发一个应用程序(可能使用到标准库)时, 才应该使用它.
   理由是: DCE 不知道库的哪部分代码会被用户的应用程序使用到.
* DCE 不会通过删除不必要的空格, 缩短标识符名称等手段, 对你的代码进行最小化(丑化(uglification))处理.
  要完成这种任务, 你应该使用既有的工具, 比如 UglifyJS (https://github.com/mishoo/UglifyJS2), 或 Google Closure Compiler (https://developers.google.com/closure/compiler/).
