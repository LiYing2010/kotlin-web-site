[//]: # (title: 使用 Dukat 生成外部声明(External Declaration))

最终更新: %latestDocDate%

> Dukat 目前还在 [实验性阶段](/docs/reference_zh/components-stability.html).
> 如果遇到任何问题, 请到报告到 Dukat 的 [问题管理系统](https://github.com/kotlin/dukat/issues).
>
{style="note"}

[Dukat](https://github.com/kotlin/dukat) 是一个正在开发中的工具,
它可以将 TypeScript 声明文件 (`.d.ts`) 自动转换为 Kotlin 的外部声明.
目标是让 JavaScript 生态系统中的各种库, 在 Kotlin 中能够更加便利的, 以类型安全的方式使用,
尽量减少手工编写 JS 库的外部声明和包装的需要.

Kotlin/JS Gradle 插件集成了 Dukat.
启用这个功能时, 会对提供了 TypeScript 定义文件的 npm 依赖项自动生成类型安全的 Kotlin 外部声明.
有两种不同的方式可以选择 Dukat 是否, 以及何时生成声明:
在构建时生成, 或者通过一个 Gradle 任务手工生成.

## 在构建时生成外部声明

`npm` 依赖函数在包名称和版本之后还接收第三个参数: `generateExternals`.
这个参数可以用来控制 Dukat 是否要对一个指定的依赖项生成声明:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
dependencies {
    implementation(npm("decamelize", "4.0.0", generateExternals = true))
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
    implementation(npm('decamelize', '4.0.0', true))
}
```

</div>
</div>

如果你想要使用的依赖项的代码仓库没有提供 TypeScript 定义文件,
你也可以使用 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
仓库提供的类型.
这种情况下请注意, 对 `your-package` 和 `@types/your-package` (使用 `generateExternals = true`)
都需要添加 `npm` 依赖项.

可以在你的 `gradle.properties` 文件中使用 `kotlin.js.generate.externals` 选项, 对所有的 npm 依赖项同时设置生成器的行为.
和通常一样, 单独的明确设置优先度会高于这个全局选项.

## 使用 Gradle 任务手动生成外部声明

如果你希望 Dukat 生成的声明进行完全的控制, 希望进行一些手动的调整, 或者自动生成的外部声明遇到了一些问题,
你也可以对所有的 npm 依赖项手动的启动声明的创建过程, 方法是使用 Gradle 的 `generateExternals` 任务
(使用 multiplatform plugin 时是 `jsGenerateExternals` 任务).
这个任务将会在你的工程根目录下, 名为 `externals` 的目录之下生成声明.
在这目录下, 可以检查生成的代码, 然后复制你需要的部分, 在源代码目录中使用.

对于同一个依赖项, 建议只在你的源代码目录中手动提供外部声明 _或者_ 只在构建时刻自动生成外部声明.
二者同时启用会导致声明解析失败.
