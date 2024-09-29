[//]: # (title: Kotlin Gradle plugin 中的编译器选项)

最终更新: %latestDocDate%

Kotlin 的每一个发布版本都包含它所支持的各个编译目标的编译器:
JVM, JavaScript, 以及 [支持的平台的](native-overview.md#target-platforms) 原生二进制文件.

这些编译器会在以下情况下使用:
* 当你对你的 Kotlin 工程按下 __Compile__ 或 __Run__ 按钮时, 由 IDE 使用.
* 当你在控制台或在 IDE 内调用 `gradle build` 命令时, 由 Gradle 使用.
* 当你在控制台或在 IDE 内调用 `mvn compile` 或 `mvn test-compile`, 由 Maven 使用.

你也可以从命令行手动运行 Kotlin 编译器, 详情请参见教程 [使用命令行编译器](command-line.md).

## 如何定义编译器选项 {id="how-to-define-options"}

Kotlin 编译器带有很多选项, 用来定制编译过程.

使用构建脚本, 你可以指定额外的编译选项. 可以通过 Kotlin 编译任务的 `compilerOptions` 属性来添加编译选项.
例如:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
</tabs>

### JVM 目标平台

对于 JVM 目标平台, 编译产品代码的编译任务名为 `compileKotlin`, 编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

Android 项目的编译任务名称, 包含
[构建变体(build variant)](https://developer.android.com/studio/build/build-variants.html)
的名称, 完整名称是 `compile<BuildVariant>Kotlin`,
比如, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

对于 JVM 和 Android 项目, 可以使用项目的 Kotlin 扩展 DSL 来定义选项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleApiVersion%)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        apiVersion = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleApiVersion%
    }
}
```

</tab>
</tabs>

有一些重要的细节需要注意:

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置代码块会相互覆盖. 只有最后出现的 (最下方的) 代码块会起作用.
* `kotlin.compilerOptions` 会配置项目中所有的 Kotlin 编译任务.
* 你可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`
  (或 `tasks.withType<KotlinJvmCompile>().configureEach { }`) 来由覆盖 `kotlin.compilerOptions` DSL 提供的配置.

### JavaScript 目标平台

对于 JavaScript 目标平台, 产品代码的编译任务名是 `compileKotlinJs`, 测试代码的编译任务名是 `compileTestKotlinJs`,
针对自定义源代码集的编译任务名, 是 `compile<Name>KotlinJs`.

要对单个编译任务进行配置, 请使用它的名称. 示例如下:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings.set(true)
    }
}
```

</tab>
</tabs>

注意, 使用 Gradle Kotlin DSL 时, 你应该先从编译工程的 `tasks` 属性得到编译任务.

编译 JavaScript 和 Common 时, 请使用相应的 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型.

### 配置所有的 Kotlin 编译任务

也可以对项目中的所有 Kotlin 编译任务进行配置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</tab>
</tabs>

## 所有的编译器选项

Gradle 任务所支持的选项完整列表如下:

### 共通属性

| 属性名称              | 描述                                           | 可以选择的值                    | 默认值           |
|-------------------|----------------------------------------------|---------------------------|---------------|
| `optIn`           | 配置 [opt-in 编译器参数](opt-in-requirements.md) 列表 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 启用 [渐进编译模式](whatsnew13.md#progressive-mode)   | `true`, `false`           | `false`       |

### JVM 任务独有的属性 {id="attributes-specific-to-jvm"}

| 属性名称                      | 描述                                                                                                                                                       | 可以选择的值                                                                          | 默认值                                                |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------|
| `javaParameters`          | 为 Java 1.8 的方法参数反射功能生成 metadata                                                                                                                          |                                                                                 | false                                              |
| `jvmTarget`               | 指定编译输出的 JVM 字节码的版本                                                                                                                                       | "1.8", "9", "10", ..., "20", "21". 参见 [编译器选项的数据类型](#types-for-compiler-options) | "%defaultJvmTargetVersion%" |
| `noJdk`                   | 不要自动将 Java 运行库包含到 classpath 内                                                                                                                            |                                                                                 | false                                              |
| `jvmTargetValidationMode` | 验证 Kotlin 和 Java 编译任务的 [JVM 编译目标兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks). 适用于 `KotlinCompile` 类型的任务. | `WARNING`, `ERROR`, `INFO`                                                      | `ERROR`                                            |

### JVM, JS, 和 JS DCE 任务支持的共通属性

| 属性名称 | 描述         | 可以选择的值 |默认值 |
|------|-------------------|-----------------|--------------|
| `allWarningsAsErrors` | 把警告作为错误来处理    |  | false |
| `suppressWarnings` | 不产生警告信息    |  | false |
| `verbose` | 输出详细的 log 信息. 只在 [Gradle debug log 级别启用](https://docs.gradle.org/current/userguide/logging.html) 时有效 |  | false |
| `freeCompilerArgs` | 指定额外的编译参数, 可以是多个. 这里也可以使用实验性的 `-X` 参数. 参见 [示例](#example-of-additional-arguments-usage-via-freecompilerargs) |  | [] |

> 在未来的发布版中, 我们将会废弃 `freeCompilerArgs` 属性.
> 如果你希望恢复 Kotlin Gradle DSL 中的某些选项, 请在 Youtrack 中 [提出问题](https://youtrack.jetbrains.com/newissue?project=kt).
>
{style="warning"}

#### 通过 freeCompilerArgs 使用额外参数的示例 {id="example-of-additional-arguments-usage-via-freecompilerargs"}

可以使用 `freeCompilerArgs` 属性来指定额外的 (包括实验性的) 编译器参数.
你可以对这个属性添加单个参数, 也可以是多个参数的列表:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

// 单个实验性参数
compileKotlin.compilerOptions.freeCompilerArgs.add("-Xexport-kdoc")
// 单个额外参数, 可以是 key-value 对
compileKotlin.compilerOptions.freeCompilerArgs.add("-Xno-param-assertions")
// 多个参数的列表
compileKotlin.compilerOptions.freeCompilerArgs.addAll(listOf("-Xno-receiver-assertions", "-Xno-call-assertions"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // 单个实验性参数
        freeCompilerArgs.add("-Xexport-kdoc")
        // 单个额外参数, 可以是 key-value 对
        freeCompilerArgs.add("-Xno-param-assertions")
        // 多个参数的列表
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</tab>
</tabs>

### JVM 和 JS 任务支持的共通属性 {id="attributes-common-to-jvm-and-js"}

| 属性名称              | 描述                   | 可以选择的值                                                                                                   | 默认值 |
|-------------------|----------------------|----------------------------------------------------------------------------------------------------------|-----|
| `apiVersion`      | 只允许使用指定的版本的运行库中的 API | "1.4" (已废弃 DEPRECATED), "1.5" (已废弃 DEPRECATED), "1.6", "1.7", "1.8", "1.9", "2.0" (实验性功能), "2.1" (实验性功能) |     |
| `languageVersion` | 指定源代码所兼容的 Kotlin 版本  | "1.4" (已废弃 DEPRECATED), "1.5" (已废弃 DEPRECATED), "1.6", "1.7", "1.8", "1.9", "2.0" (实验性功能), "2.1" (实验性功能) |     |

#### languageVersion 设置示例 {id="example-of-setting-a-languageversion"}

要设置语言版本, 请使用下面的语法:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
    }
```

</tab>
</tabs>

参见 [编译器选项的数据类型](#types-for-compiler-options).

### JS 任务独有的属性

| 属性名称                    | 描述                                                                                                                                        | 可以选择的值                                                                                      | 默认值                                                                 |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `friendModulesDisabled` | 指定是否关闭内部声明的输出                                                                                                                             |                                                                                             | false                                                               |
| `main`                  | 指定执行时是否调用 main 函数                                                                                                                         | "call", "noCall". 参见 [编译器选项的数据类型](#types-for-compiler-options)                              | "call"                                                              |
| `metaInfo`              | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库                                                                                            |                                                                                             | true                                                                |
| `moduleKind`            | 指定编译器生成的 JS 模块类型                                                                                                                          | "umd", "commonjs", "amd", "plain", "es". 参见 [编译器选项的数据类型](#types-for-compiler-options)       | "umd"                                                               |
| `outputFile`            | 指定编译结果输出的 *.js 文件                                                                                                                         |                                                                                             | "\<buildDir>/js/packages/\<project.name>/kotlin/\<project.name>.js" |
| `sourceMap`             | 指定是否生成源代码映射文件(source map)                                                                                                                 |                                                                                             | true                                                                |
| `sourceMapEmbedSources` | 指定是否将源代码文件嵌入到源代码映射文件中                                                                                                                     | "never", "always", "inlining". 参见 [编译器选项的数据类型](#types-for-compiler-options)                 |                                                                     |
| `sourceMapNamesPolicy`  | 将你在 Kotlin 代码中声明的变量和函数名称添加到源代码映射文件中. 详情请参见 [编译器参考文档](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no). | "simple-names", "fully-qualified-names", "no". 参见 [编译器选项的数据类型](#types-for-compiler-options) | "simple-names"                                                      |
| `sourceMapPrefix`       | 对源代码映射文件中的路径添加一个指定的前缀                                                                                                                     |                                                                                             |                                                                     |
| `target`                | 指定生成的 JS 文件 的 ECMA 版本                                                                                                                     | "v5"                                                                                        | "v5"                                                                |
| `typedArrays`           | 将基本类型数组转换为 JS 的有类型数组                                                                                                                      |                                                                                             | true                                                                |

### 编译器选项的数据类型 {id="types-for-compiler-options"}

有些 `compilerOptions` 使用新的数据类型, 而不是旧的 `String` 类型:

| 选项   | 数据类型 | 示例  |
|--------|------|---------|
| `jvmTarget` | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt) | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)` |
| `main` | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)` |
| `moduleKind` | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt) | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)` |
| `sourceMapEmbedSources` | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt) | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy` | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/1.8.20/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt) | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)` |

## 下一步做什么?

学习:
* [增量编译, 缓存, 构建报告, 以及 Kotlin Daemon](gradle-compilation-and-caches.md).
* [Gradle 的基本概念与详细信息](https://docs.gradle.org/current/userguide/userguide.html).
* [对 Gradle plugin 变体的支持](gradle-plugin-variants.md).
