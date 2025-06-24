[//]: # (title: Kotlin Gradle plugin 中的编译器选项)

Kotlin 的每一个发布版本都包含它所支持的各个编译目标的编译器:
JVM, JavaScript, 以及 [支持的平台的](native-overview.md#target-platforms) 原生二进制文件.

这些编译器会在以下情况下使用:
* 当你对你的 Kotlin 工程按下 __Compile__ 或 __Run__ 按钮时, 由 IDE 使用.
* 当你在控制台或在 IDE 内调用 `gradle build` 命令时, 由 Gradle 使用.
* 当你在控制台或在 IDE 内调用 `mvn compile` 或 `mvn test-compile`, 由 Maven 使用.

你也可以从命令行手动运行 Kotlin 编译器, 详情请参见教程 [使用命令行编译器](command-line.md).

## 如何定义编译器选项 {id="how-to-define-options"}

Kotlin 编译器带有很多选项, 用来定制编译过程.

Gradle DSL 可以对编译器选项进行全面的配置.
可以用于 [Kotlin Multiplatform](multiplatform-dsl-reference.md) 和 [JVM/Android](#target-the-jvm) 项目.

使用 Gradle DSL, 你可以在构建脚本的 3 个层级配置编译器选项:
* **[扩展层级(Extension Level)](#extension-level)**, 在 `kotlin {}` 代码块之内, 用于所有的编译目标和共用源代码集.
* **[编译目标层级(Target Level)](#target-level)**, 在特定的编译目标的代码块之内.
* **[编译单元层级(Compilation Unit Level)](#compilation-unit-level),** 通常在特定的编译任务之内.

![Kotlin 编译器选项层级](compiler-options-levels.svg){width=700}

更高层级中的设置会被成为更低层级中的约定(默认)设置:

* 在扩展层级中设置的编译器选项会成为编译目标层级选项的默认值, 包括共用源代码集,
  例如 `commonMain`, `nativeMain`, 和 `commonTest`.
* 在编译目标层级中设置的编译器选项会成为编译单元(task)层级选项的默认值,
  例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` task.

反过来, 更低层级中的设置会覆盖更高层级中的相关设置:

* Task 层级编译器的选项会覆盖编译目标层级或扩展层级的相关配置.
* 编译目标层级的编译器选项会覆盖扩展层级的相关配置.

要查找编译时使用了编译器参数的哪个层级, 请使用 `DEBUG` 级别的 Gradle [logging](https://docs.gradle.org/current/userguide/logging.html).
对于 JVM 和 JS/WASM task, 请在 log 中查找 `"Kotlin compiler args:"` 字符串;
对于 Native task, 请查找 `"Arguments ="` 字符串.

> 如果你是第 3 方 plugin 的开发者, 最好在项目层级适用你的配置, 以免发生配置覆盖的问题.
> 你可以使用新的 [Kotlin plugin DSL 扩展类型](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions) 来实现.
> 建议你对这些配置编写明确的文档.
>
{style="tip"}

### 扩展层级(Extension Level) {id="extension-level"}

可以在最顶层的 `compilerOptions {}` 代码块之内,
对所有编译目标和共用源代码集配置共通的编译器选项:

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

### 编译目标层级(Target Level) {id="target-level"}

可以在 `target {}` 代码块内的 `compilerOptions {}` 代码块之内,
对 JVM/Android 编译目标配置编译器选项:

```kotlin
kotlin {
    target {
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin Multiplatform 项目中, 可以在特定的编译目标之内配置编译器选项.
例如, `jvm { compilerOptions {}}`.
详情请参见 [Multiplatform Gradle DSL 参考文档](multiplatform-dsl-reference.md).

### 编译单元层级(Compilation Unit Level) {id="compilation-unit-level"}

可以在 task 配置内的 `compilerOptions {}` 代码块之内,
对特定的编译单元或 task 配置编译器选项:

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

你也可以通过 `KotlinCompilation` 在编译单元层级访问并配置编译器选项:

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {

                }
            }
        }
    }
}
```

如果你想要配置 JVM/Android 和 [Kotlin Multiplatform](multiplatform-dsl-reference.md) 之外的编译目标 plugin,
请使用对应的 Kotlin 编译 task 的 `compilerOptions {}` 属性.
下面的示例演示在 Kotlin 和 Groovy DSL 中如何设置这个配置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
</tabs>

## JVM 目标平台 {id="target-the-jvm"}

[如上文所述](#how-to-define-options), 你可以对你的 JVM/Android 项目在扩展, 编译目标, 和编译单元层级(任务)定义编译器选项.

对于 JVM 目标平台, 编译产品代码的默认编译任务名为 `compileKotlin`, 编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

要查看 Android 编译任务列表, 你可以在终端中运行 `gradlew tasks --all` 命令,
并在 `Other tasks` 组中查找 `compile*Kotlin` task 名.

有一些重要的细节需要注意:

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置代码块会相互覆盖. 只有最后出现的 (最下方的) 代码块会起作用.
* `kotlin.compilerOptions` 会配置项目中所有的 Kotlin 编译任务.
* 你可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`
  (或 `tasks.withType<KotlinJvmCompile>().configureEach { }`) 来由覆盖 `kotlin.compilerOptions` DSL 提供的配置.

## JavaScript 目标平台 {id="target-javascript"}

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
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

注意, 使用 Gradle Kotlin DSL 时, 你应该先从编译工程的 `tasks` 属性得到编译任务.

编译 JavaScript 和 Common 时, 请使用相应的 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型.

你可以查看 JavaScript 编译任务的列表, 方法是在终端中运行 `gradlew tasks --all` 命令,
并搜索 `Other tasks` 组中的 `compile*KotlinJS` task 名称.

## 所有的 Kotlin 编译任务 {id="all-kotlin-compilation-tasks"}

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

## 所有的编译器选项 {id="all-compiler-options"}

Gradle 编译器所支持的选项完整列表如下:

### 共通属性 {id="common-attributes"}

| 属性名称              | 描述                                                                                  | 可以选择的值                    | 默认值           |
|-------------------|-------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | 配置 [opt-in 编译器参数](opt-in-requirements.md) 列表                                        | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 启用 [渐进编译模式](whatsnew13.md#progressive-mode)                                         | `true`, `false`           | `false`       |
| `extraWarnings`   | 启用 [额外的声明, 表达式, 和类型编译器检查](whatsnew21.md#extra-compiler-checks), 如果检查结果为 true, 会产生警告 | `true`, `false`           | `false`       |

### JVM 任务独有的属性 {id="attributes-specific-to-jvm"}

| 属性名称                      | 描述                                                                                                                                                        | 可以选择的值                                                                          | 默认值                         |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 为 Java 1.8 的方法参数反射功能生成 metadata                                                                                                                           |                                                                                 | false                       |
| `jvmTarget`               | 指定编译输出的 JVM 字节码的版本                                                                                                                                        | "1.8", "9", "10", ..., "22", "23". 参见 [编译器选项的数据类型](#types-for-compiler-options) | "%defaultJvmTargetVersion%" |
| `noJdk`                   | 不要自动将 Java 运行库包含到 classpath 内                                                                                                                             |                                                                                 | false                       |
| `jvmTargetValidationMode` | 验证 Kotlin 和 Java 编译任务的 [JVM 编译目标兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks). 适用于 `KotlinCompile` 类型的任务. | `WARNING`, `ERROR`, `IGNORE`                                                    | `ERROR`                     |

### JVM, 和 JavaScript 任务支持的共通属性 {id="attributes-common-to-jvm-and-javascript"}

| 属性名称                  | 描述                                                                                                          | 可以选择的值                                    | 默认值   |
|-----------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------|-------|
| `allWarningsAsErrors` | 把警告作为错误来处理                                                                                                  |                                           | false |
| `suppressWarnings`    | 不产生警告信息                                                                                                     |                                           | false |
| `verbose`             | 输出详细的 log 信息. 只在 [Gradle debug log 级别启用](https://docs.gradle.org/current/userguide/logging.html) 时有效        |                                           | false |
| `freeCompilerArgs`    | 指定额外的编译参数, 可以是多个. 这里也可以使用实验性的 `-X` 参数. 参见 [示例](#example-of-additional-arguments-usage-via-freecompilerargs) |                                           | []    |
| `apiVersion`          | 只允许使用指定的版本的运行库中的 API                                                                                        | "1.8", "1.9", "2.0", "2.1", "2.2" (实验性功能) |       |
| `languageVersion`     | 指定源代码所兼容的 Kotlin 版本                                                                                         | "1.8", "1.9", "2.0", "2.1", "2.2" (实验性功能) |       |

> 在未来的发布版中, 我们将会废弃 `freeCompilerArgs` 属性.
> 如果你希望恢复 Kotlin Gradle DSL 中的某些选项, 请在 Youtrack 中 [提出问题](https://youtrack.jetbrains.com/newissue?project=kt).
>
{style="warning"}

#### 通过 freeCompilerArgs 使用额外参数的示例 {id="example-of-additional-arguments-usage-via-freecompilerargs" initial-collapse-state="collapsed" collapsible="true"}

可以使用 `freeCompilerArgs` 属性来指定额外的 (包括实验性的) 编译器参数.
你可以对这个属性添加单个参数, 也可以是多个参数的列表:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // 指定 Kotlin API 和 JVM 编译目标的版本
        apiVersion.set(KotlinVersion.%gradleLanguageVersion%)
        jvmTarget.set(JvmTarget.JVM_1_8)

        // 单个实验性参数
        freeCompilerArgs.add("-Xexport-kdoc")

        // 单个额外参数
        freeCompilerArgs.add("-Xno-param-assertions")

        // 多个参数的列表
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // 指定 Kotlin API 和 JVM 编译目标的版本
        apiVersion = KotlinVersion.%gradleLanguageVersion%
        jvmTarget = JvmTarget.JVM_1_8

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

> `freeCompilerArgs` 属性可以在 [扩展](#extension-level), [编译目标](#target-level),
> 和 [编译单元(task)](#compilation-unit-level) 层级中使用.
>
{style="tip"}

#### 设置 languageVersion 的示例 {id="example-of-setting-languageversion"}

要设置语言版本, 请使用下面的语法:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%)
    }
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

### JavaScript 任务独有的属性 {id="attributes-specific-to-javascript"}

| 属性名称                    | 描述                                                                                                                                        | 可以选择的值                                                                                                                                                                        | 默认值                                |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 指定是否关闭内部声明的输出                                                                                                                             |                                                                                                                                                                               | `false`                            |
| `main`                  | 指定执行时是否调用 main 函数                                                                                                                         | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                     | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind`            | 指定编译器生成的 JS 模块类型                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                   | `null`                             |
| `sourceMap`             | 指定是否生成源代码映射文件(source map)                                                                                                                 |                                                                                                                                                                               | `false`                            |
| `sourceMapEmbedSources` | 指定是否将源代码文件嵌入到源代码映射文件中                                                                                                                     | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS`    | `null`                             |
| `sourceMapNamesPolicy`  | 将你在 Kotlin 代码中声明的变量和函数名称添加到源代码映射文件中. 详情请参见 [编译器参考文档](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no) | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                             |
| `sourceMapPrefix`       | 对源代码映射文件中的路径添加一个指定的前缀                                                                                                                     |                                                                                                                                                                               | `null`                             |
| `target`                | 指定生成的 JS 文件 的 ECMA 版本                                                                                                                     | `"es5"`, `"es2015"`                                                                                                                                                           | `"es5"`                            |
| `useEsClasses`          | Let generated JavaScript code use ES2015 classes. Enabled by default in case of ES2015 target usage                                       |                                                                                                                                                                               | `null`                             |

### 编译器选项的数据类型 {id="types-for-compiler-options"}

有些 `compilerOptions` 使用新的数据类型, 而不是旧的 `String` 类型:

| 选项                                 | 数据类型                                                                                                                                                                                                              | 示例                                                                                                   |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 下一步做什么? {id="what-s-next"}

学习:
* [Kotlin Multiplatform DSL 参考文档](multiplatform-dsl-reference.md).
* [增量编译, 缓存, 构建报告, 以及 Kotlin Daemon](gradle-compilation-and-caches.md).
* [Gradle 的基本概念与详细信息](https://docs.gradle.org/current/userguide/userguide.html).
* [对 Gradle plugin 变体的支持](gradle-plugin-variants.md).
