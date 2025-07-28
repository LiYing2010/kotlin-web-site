[//]: # (title: 配置 Gradle 项目)

要 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 使用来构建 Kotlin 项目,
你需要向你的构建脚本文件 `build.gradle(.kts)` [添加 Kotlin Gradle plugin](#apply-the-plugin),
并在构建脚本文件中 [配置项目的依赖项](#configure-dependencies).

> 关于构建脚本, 更多内容请参见 [查看构建脚本](get-started-with-jvm-gradle-project.md#explore-the-build-script) 小节.
>
{style="note"}

## 应用(Apply) Kotlin Gradle Plugin {id="apply-the-plugin"}

要应用(Apply) Kotlin Gradle plugin, 请使用 Gradle plugin DSL 的
[`plugins{}` 代码段](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // 请将 `<...>` 替换为与你的编译目标环境匹配的 plugin 名称
    kotlin("<...>") version "%kotlinVersion%"
    // 例如, 如果你的编译目标环境是 JVM:
    // kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // 请将 `<...>` 替换为与你的编译目标环境匹配的 plugin 名称
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // 例如, 如果你的编译目标环境是 JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}
```

</tab>
</tabs>

> Kotlin Gradle plugin (KGP) 和 Kotlin 的版本号一致.
>
{style="note"}

配置你的项目时, 请检查 Kotlin Gradle plugin (KGP) 是否兼容于你的 Gradle 版本.
下表是, Kotlin **完全支持** 的 Gradle 和 Android Gradle plugin (AGP) 最低和最高版本:

| KGP 版本        | Gradle 最低和最高版本                        | AGP 最低和最高版本                                         |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.2.0         | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% |
| 2.1.20-2.1.21 | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         |
| 2.1.0–2.1.10  | 7.6.3–8.10*                           | 7.3.1–8.7.2                                         |
| 2.0.20–2.0.21 | 6.8.3–8.8*                            | 7.1.3–8.5                                           |
| 2.0.0         | 6.8.3–8.5                             | 7.1.3–8.3.1                                         |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                           | 4.2.2–8.1.0                                         |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                           | 4.2.2–7.4.0                                         |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                           | 4.1.3–7.4.0                                         |
| 1.8.0–1.8.11  | 6.8.3–7.3.3                           | 4.1.3–7.2.1                                         |
| 1.7.20–1.7.22 | 6.7.1–7.1.1                           | 3.6.4–7.0.4                                         |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                           | 3.4.3–7.0.2                                         |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                           | 3.4.3–7.0.2                                         |

> Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全兼容 Gradle 8.6 或以下版本.
> 也支持 Gradle 版本 8.7 到 8.10, 但有一个例外: 如果你使用 Kotlin Multiplatform Gradle plugin,
> 在你的跨平台项目中调用 JVM 编译目标中的 `withJava()` 函数时, 可能遇到废弃警告.
> 更多详情请参见 [默认创建的 Java 源代码集](multiplatform-compatibility-guide.md#java-source-sets-created-by-default).
>
{style="warning"}

你也可以使用最新版本之前的 Gradle 和 AGP 版本, 但如果你这样做,
请注意, 你可能会遇到弃用警告, 或者某些新功能可能无法正常工作.

例如, Kotlin Gradle plugin 和 `kotlin-multiplatform` plugin %kotlinVersion%
最低需要 Gradle 版本 %minGradleVersion% 才能编译你的项目.

类似的, 完全支持的最高版本是 %maxGradleVersion%.
这个版本不包含已废弃的 Gradle 方法和属性, 并且支持目前所有的 Gradle 功能特性.

### Kotlin Gradle plugin 在项目中的数据 {id="kotlin-gradle-plugin-data-in-a-project"}

默认情况下, Kotlin Gradle plugin 会将项目相关的数据保存在项目根目录下的 `.kotlin` 目录中.

> 不要将 `.kotlin` 目录提交到版本控制系统.
> 例如, 如果你在使用 Git, 请将 `.kotlin` 添加到你的项目的 `.gitignore` 文件中.
>
{style="warning"}

你可以将以下属性添加到你的项目的 `gradle.properties` 文件, 配置这些行为:

| Gradle 属性                                           | 解释                                                                 |
|-----------------------------------------------------|--------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 配置你的项目数据的保存位置. 默认值: `<project-root-directory>/.kotlin`             |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 控制是否禁止将 Kotlin 数据写到 `.gradle` 目录 (为了与旧版本的 IDEA 保持向后兼容). 默认值: false |

## 编译到 JVM 平台 {id="targeting-the-jvm"}

要编译到 JVM 平台, 需要应用 Kotlin JVM plugin.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

在这段代码中, `version` 必须是写明的字面值, 不能通过其他编译脚本得到.

### Kotlin 源代码与 Java 源代码 {id="kotlin-and-java-sources"}

Kotlin 源代码与 Java 源代码可以保存在相同的目录下, 也可以放在不同的目录下.

默认的约定是使用不同的目录:

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

> 不要将 Java 的 `.java` 文件放在 `src/*/kotlin` 目录中, 因为这样的 `.java` 文件不会被编译.
>
> 你应该改为放在 `src/main/java` 目录中.
>
{style="warning"}

如果不使用默认约定的文件夹结构, 那么需要修改相应的 `sourceSets` 属性:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</tab>
</tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 对相关联的编译任务检查 JVM 编译目标的兼容性 {id="check-for-jvm-target-compatibility-of-related-compile-tasks"}

在构建模块中, 你可能会有多个相互关联的编译任务, 比如:
* `compileKotlin` 与 `compileJava`
* `compileTestKotlin` 与 `compileTestJava`

> `main` 与 `test` 源代码集的编译任务之间没有关联.
>
{style="note"}

对于这种相互关联的编译任务, Kotlin Gradle plugin 会检查 JVM 编译目标的兼容性.
`kotlin` 扩展或任务中的 [`jvmTarget` 属性](gradle-compiler-options.md#attributes-specific-to-jvm)
和 `java` 扩展或任务中的 [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)
如果设置为不同的值, 会导致 JVM 编译目标不兼容.
例如:
`compileKotlin` 任务设置为 `jvmTarget=1.8`,
而 `compileJava` 任务设置为
(或 [继承得到](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension))
`targetCompatibility=15`.

要对整个项目的这个兼容性检查进行配置, 可以在 `gradle.properties` 文件中, 将 `kotlin.jvm.target.validation.mode` 属性设置为以下几个值:

* `error` – plugin 会让构建失败; 对于 Gradle 8.0 以上版本, 这是项目的默认值.
* `warning` – plugin 会输出警告信息; 对于低于 Gradle 8.0 的版本, 这是项目的默认值.
* `ignore` – plugin 会跳过检查, 不输出任何警告信息.

你也可以在你的 `build.gradle(.kts)` 文件中对各个编译任务单独进行配置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</tab>
</tabs>

要避免 JVM 编译目标不兼容, 需要 [配置工具链](#gradle-java-toolchains-support), 或手动对齐(Align) JVM 版本.

#### 如果编译目标之间不兼容, 会发生什么问题 {id="what-can-go-wrong-if-targets-are-incompatible" initial-collapse-state="collapsed" collapsible="true"}

有两种方式对 Kotlin 和 Java 源代码集手动设置 JVM 编译目标:
* 隐含设定, 通过 [设置 Java 工具链](#gradle-java-toolchains-support) 来设置.
* 明确设定, 通过设置 `kotlin` 扩展或任务中的 `jvmTarget` 属性, 以及`java` 扩展或任务中的 `targetCompatibility`.

如果你做以下设置, 就会发生 JVM 编译目标不兼容:
* 对 `jvmTarget` 和 `targetCompatibility` 明确设置不同的版本.
* 使用默认配置, 但你的 JDK 不等于 `1.8`.

如果在你的构建脚本中只有 Kotlin JVM plugin, 并且没有额外设置 JVM 编译目标, 我们来看看这时的默认 JVM 编译目标设置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

构建脚本中没有 `jvmTarget` 值的明确信息, 因此它的默认值为 `null`, 编译器将这个设置翻译为默认值 `1.8`.
`targetCompatibility` 等于当前的 Gradle JDK 版本, 也就是你的 JDK 版本 (除非你使用
[Java 工具链策略](gradle-configure-project.md#gradle-java-toolchains-support)).
假设你的 JDK 版本是 `%jvmLTSVersionSupportedByKotlin%`,
你发布的库文件会 [声明它兼容](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
于 JDK %jvmLTSVersionSupportedByKotlin% 以上版本:
`org.gradle.jvm.version=%jvmLTSVersionSupportedByKotlin%`, 实际上是错误的.
这种情况下, 在你的主项目中, 会需要使用 Java %jvmLTSVersionSupportedByKotlin% 才能添加这个库,
尽管它的字节码版本其实是 `1.8`.
请 [配置工具链](gradle-configure-project.md#gradle-java-toolchains-support) 来解决这个问题.

### Gradle Java 工具链支持 {id="gradle-java-toolchains-support"}

> 给 Android 使用者的警告. 要使用 Gradle 工具链支持, 需要使用 Android Gradle plugin (AGP) 的 8.1.0-alpha09 或更高版本.
>
> Gradle Java 工具链支持只在 AGP 7.4.0 以上版本 [可用](https://issuetracker.google.com/issues/194113162).
> 但是, 由于 [这个问题](https://issuetracker.google.com/issues/260059413),
> AGP 8.1.0-alpha09 以前的版本没有将 `targetCompatibility` 设置为等于工具链的 JDK.
> 如果你在使用低于 8.1.0-alpha09 的版本, 你需要通过 `compileOptions` 来手动配置 `targetCompatibility`.
> 请将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本:
>
> ```kotlin
> android {
>     compileOptions {
>         sourceCompatibility = <MAJOR_JDK_VERSION>
>         targetCompatibility = <MAJOR_JDK_VERSION>
>     }
> }
> ```
>
{style="warning"}

Gradle 6.7 引入了 [Java 工具链支持](https://docs.gradle.org/current/userguide/toolchains.html).
通过这个功能, 你可以:
* 使用与 Gradle 不同的 JDK 和 JRE 来运行编译, 测试, 以及可执行程序.
* 使用还未发布的语言版本编译和测试代码.

通过工具链支持, Gradle 能够自动查找本地的 JDK, 还能安装 Gradle 运行构建时需要的 JDK.
目前 Gradle 自身能够在任何 JDK 上运行, 而且还对依赖于主要 JDK 版本的任务重用 [远程构建缓存功能](gradle-compilation-and-caches.md#gradle-build-cache-support).

Kotlin Gradle plugin 对 Kotlin/JVM 编译任务支持 Java 工具链. JS 和 Native 任务则不会使用工具链.
Kotlin 编译器永远会在运行 Gradle daemon 的 JDK 上运行.
Java 工具链会:
* 为 JVM 编译目标设置 [`-jdk-home` 选项](compiler-reference.md#jdk-home-path).
* 如果用户没有明确设置 `jvmTarget` 选项,
  则将 [`compilerOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 设置为工具链的 JDK 版本.
  如果用户没有配置工具链, 那么 `jvmTarget` 会使用默认值.
  详情请参见 [JVM 编译目标兼容性](#check-for-jvm-target-compatibility-of-related-compile-tasks).
* 设置由任何 Java compile, test 和 javadoc 任务使用的工具链.
* 影响 [`kapt` 任务执行器](kapt.md#run-kapt-tasks-in-parallel) 使用哪个 JDK.

可以使用以下代码来设置工具链. 请将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // 或者使用更简短的写法:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // 例如:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // 或者使用更简短的写法:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // 例如:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
</tabs>

注意, 如果使用 `kotlin` 扩展设置工具链, 也会改变 Java 编译任务的工具链.

你可以通过 `java` 扩展设置工具链, Kotlin 编译任务会使用这个设置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</tab>
</tabs>

如果你使用 Gradle 8.0.2 或更高版本, 你还需要添加一个 [工具链解析器 plugin](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories).
这种 plugin 会管理从哪个仓库下载工具链. 例如, 向你的 `settings.gradle(.kts)` 文件添加以下 plugin:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("%foojayResolver%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '%foojayResolver%'
}
```

</tab>
</tabs>

关于与你的 Gradle 版本对应的 `foojay-resolver-convention` 版本,
请参见 [Gradle 网站](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories).

> 要确认 Gradle 使用哪个工具链, 请使用
> [log 级别 `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)
> 来运行你的 Gradle 构建, 并在输出中查找 `[KOTLIN] Kotlin compilation 'jdkHome' argument:` 开头的字符串.
> 冒号之后的部分就是工具链使用的 JDK 版本.
>
{style="note"}

要为特定的 Task 设置任意的 JDK (甚至本地 JDK), 请使用 [Task DSL](#set-jdk-version-with-the-task-dsl).

详情请参见 [Kotlin plugin 中对 Gradle JVM 工具链的支持](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/).

### 使用 Task DSL 设置 JDK 版本 {id="set-jdk-version-with-the-task-dsl"}

Task DSL 可以对任何实现了 `UsesKotlinJavaToolchain` 接口的任务, 设置任意的 JDK 版本.
目前, 这些任务只有 `KotlinCompile` 和 `KaptTask`.
如果希望 Gradle 搜索主要的 JDK 版本, 请在你的构建脚本中替换 `<MAJOR_JDK_VERSION>` 占位符:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task ->
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
</tabs>

或者你特也可以指定你的本地 JDK 路径, 然后使用这个 JDK 版本替换 `<LOCAL_JDK_VERSION>` 占位符:

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // 这里设置你的 JDK 路径
        JavaVersion.<LOCAL_JDK_VERSION> // 例如, JavaVersion.17
    )
}
```

### 关联编译器任务 {id="associate-compiler-tasks"}

你可以将编译任务 _关联(Associate)_ 在一起, 方法是在编译任务之间设置关联关系, 一个编译需要使用另一个编译的输出.
关联编译器任务会在编译任务之间建立 `internal` 的可见度.

Kotlin 编译器会默认的关联某些编译任务, 比如每个编译目标的 `test` 和 `main` 编译任务.
如果你需要表达你的某个自定义编译任务与其它编译任务相关联, 请创建你自己的编译任务关联.

要让 IDE 支持关联编译任务, 在源代码集之间推断可见度, 请向你的 `build.gradle(.kts)` 添加以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</tab>
</tabs>

在这个例子中, `integrationTest` 编译任务关联到 `main` 编译任务, 可以在功能测试(集成测试)代码中访问 `internal` 对象.

### Java Modules (JPMS) 启用时的配置 {id="configure-with-java-modules-jpms-enabled"}

要让 Kotlin Gradle plugin 与 [Java 模块(Module)](https://www.oracle.com/corporate/features/understanding-java-9-modules.html) 共通工作,
请向你的构建脚本添加以下内容, 并将其中的 `YOUR_MODULE_NAME` 替换为你的 JPMS 模块的引用, 例如,
`org.company.module`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果你使用的 Gradle 版本低于 7.0, 请添加以下 3 行
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // 将编译后的 Kotlin 类提供给 to javac – 需要这样做才能让 Java/Kotlin 混合源代码正常工作
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果你使用的 Gradle 版本低于 7.0, 请添加以下 3 行
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // Provide compiled Kotlin classes to javac – 需要这样做才能让 Java/Kotlin 混合源代码正常工作
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</tab>
</tabs>

> 和通常一样, 请将 `module-info.java` 文件放在 `src/main/java` 目录内.
>
> 对于模块, Kotlin 文件中的包名称应该等于 `module-info.java` 中的包名称,
> 否则会出现构建错误 "package is empty or does not exist".
>
{style="note"}

更多详情请参见:
* [为 Java 模块系统构建模块](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [使用 Java 模块系统构建应用程序](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* ["module" 在 Kotlin 中的意义](visibility-modifiers.md#modules)

### 其他细节 {id="other-details"}

详情请参见 [Kotlin/JVM](jvm-get-started.md).

#### 在编译任务中禁用 artifact {id="disable-use-of-artifact-in-compilation-task"}

在某些罕见的情况下, 你可能会遇到循环依赖错误导致的构建失败.
例如, 你有多个编译任务, 其中一个可以看到另一个的所有内部声明, 并且生成的 artifact 依赖于两个编译任务的输出:

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

要修复这样的循环依赖错误, 我们添加了一个 Gradle 属性: `archivesTaskOutputAsFriendModule`.
这个属性控制在编译任务中是否使用 artifact 作为输入, 并因此决定是否创建任务之间的依赖.

默认情况下, 这个属性设置为 `true`, 追踪任务之间的依赖.
如果你遇到了循环依赖错误, 你可以在编译任务中禁用 artifact, 删除任务之间的依赖, 以避免循环依赖错误.

要在编译任务中禁用 artifact, 请向你的 `gradle.properties` 文件添加以下内容:

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### Kotlin/JVM 编译任务的延迟创建 {id="lazy-kotlin-jvm-task-creation"}

从 Kotlin 1.8.20 开始, Kotlin Gradle plugin 在试运行(dry run)时会注册所有的编译任务, 但不对它们进行配置.

#### 如果编译任务的输出目录不是默认位置 {id="non-default-location-of-compile-tasks-destinationdirectory"}

如果你覆盖了 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 编译任务的 `destinationDirectory` 位置, 请更新你的构建脚本.
在你的 JAR 文件中, 除 `sourceSets.main.outputs` 之外, 你需要明确添加 `sourceSets.main.kotlin.classesDirectories`:

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 编译到多个目标平台 {id="targeting-multiple-platforms"}

编译到 [多个目标平台](multiplatform-dsl-reference.md#targets) 的项目, 称为 [跨平台项目](multiplatform.topic),
需要使用 `kotlin-multiplatform` 插件.

> `kotlin-multiplatform` 插件要求 Gradle %minGradleVersion% 或更高版本.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

详情请参见 [在不同的平台使用 Kotlin Multiplatform](multiplatform.topic) 和
[在 iOS 和 Android 平台使用 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html).

## 编译到 Android 平台 {id="targeting-android"}

建议使用 Android Studio 来创建 Android 应用程序.
详情请参见 [如何使用 Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## 编译到 JavaScript {id="targeting-javascript"}

如果编译目标平台为 JavaScript, 也可以使用 `kotlin-multiplatform` 插件.
详情请阅读 [如何设置 Kotlin/JS 项目](js-project-setup.md):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

### JavaScript 项目的 Kotlin 源代码与 Java 源代码 {id="kotlin-and-java-sources-for-javascript"}

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话).
如果不将源代码分开存放, 请在 `sourceSets{}` 代码段中指定源代码文件夹:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</tab>
</tabs>

## 使用 KotlinBasePlugin 接口触发配置动作 {id="triggering-configuration-actions-with-the-kotlinbaseplugin-interface"}

当任何 Kotlin Gradle plugin (JVM, JS, Multiplatform, Native, 等等) 被适用时, 要触发某些配置动作,
可以使用 `KotlinBasePlugin` 接口, 所有的 Kotlin plugin 都继承了这个接口:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // 在这里配置你的动作
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // 在这里配置你的动作
}
```

</tab>
</tabs>

## 配置依赖项 {id="configure-dependencies"}

如果要添加一个库的依赖, 需要在 source set DSL 中的 `dependencies{}` 代码段内,
设置必要 [类型](#dependency-types) 的依赖项 (比如, `implementation`).

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

或者, 你也可以 [在最顶层设置依赖项](#set-dependencies-at-top-level).

### 依赖项的类型 {id="dependency-types"}

请根据你的需要选择依赖项的类型.

<table>
    <tr>
        <th>类型</th>
        <th>解释</th>
        <th>使用场景</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>编译期和运行期都会使用, 并导出给库的使用者.</td>
        <td>如果在当前模块的公开 API 中使用了一个依赖项中的任何类型, 请使用 <code>api</code> 依赖项.
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>对当前模块的编译期和运行期都会使用, 如果其他模块使用 `implementation` 依赖本模块,
            那么对于其他模块的编译, 这个依赖项不会导出</td>
        <td>
            <p>对于模块的内部逻辑所需要的依赖项, 请使用这种类型.</p>
            <p>如果一个模块是一个终端应用程序(endpoint application), 而且不对外公布(publish),
              那么请使用 <code>implementation</code> 依赖项而不是 <code>api</code> 依赖项.</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>只用来编译当前模块, 在运行期不可用, 在编译其他模块时也不可用.</td>
        <td>如果 API 在运行时存在第三方的实现, 那么可以使用这种依赖项.</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>运行时可用, 但在任何模块的编译期都不可用.</td>
        <td></td>
    </tr>
</table>

### 对标准库的依赖项 {id="dependency-on-the-standard-library"}

对每个源代码集(Source Set), 会自动添加对标准库 (`stdlib`) 的依赖项.
使用的标准库版本与 Kotlin Gradle plugin 版本相同.

对于与平台相关的源代码集, 会使用针对这个平台的标准库, 同时, 对其他源代码集会添加共通的标准库.
Kotlin Gradle plugin 会根据你的 Gradle 构建脚本的 `compilerOptions.jvmTarget` [编译器选项](gradle-compiler-options.md) 设置,
选择适当的 JVM 标准库.

如果明确的声明一个标准库依赖项(比如, 如果你需要使用不同的版本), Kotlin Gradle plugin 不会覆盖你的设置, 也不会添加第二个标准库.

如果你完全不需要标准库, 可以在你的 `gradle.properties` 文件中添加以下 Gradle 属性:

```none
kotlin.stdlib.default.dependency=false
```

#### 传递依赖项的版本对齐 {id="versions-alignment-of-transitive-dependencies"}

从 Kotlin 标准库 1.9.20 版开始, Gradle 使用包含在标准库中的元数据(metadata),
来自动对齐传递依赖项 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 的版本.

如果你添加了 Kotlin 标准库版本 1.8.0 到 1.9.10 之间的依赖项, 例如:
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`,
那么 Kotlin Gradle Plugin 会对传递依赖项 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 使用这个 Kotlin 版本.
这样会避免标准库的不同版本出现重复的类.
详情请参见 [`kotlin-stdlib-jdk7` 与 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](whatsnew18.md#updated-jvm-compilation-target).
你可以在你的 `gradle.properties` 文件中使用 Gradle 属性 `kotlin.stdlib.jdk.variants.version.alignment` 来禁用这个动作:

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### 版本对齐的另一种方法 {id="other-ways-to-align-versions" initial-collapse-state="collapsed" collapsible="true"}

* 如果版本对齐出现了问题, 你可以使用 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 来对齐所有依赖项的版本.
  在你的构建脚本中声明对 `kotlin-bom` 的平台依赖项:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  implementation(platform("org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%"))
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  implementation platform('org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%')
  ```

  </tab>
  </tabs>

* 如果你没有添加某个版本的标准库的依赖项, 但你有两个不同的依赖项, 分别带来 Kotlin 标准库不同旧版本的传递依赖,
  那么你可以对这些传递依赖的库明确指定 `%kotlinVersion%` 版本:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  </tabs>

* 如果你添加了 Kotlin 标准库 `%kotlinVersion%` 的依赖项: `implementation("org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%")`,
  并且使用了旧版本的 (低于 `1.8.0`) Kotlin Gradle plugin, 请更新 Kotlin Gradle plugin, 保持与标准库的版本一致:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  plugins {
      // 请将 `<...>` 替换为 plugin 名称
      kotlin("<...>") version "%kotlinVersion%"
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  plugins {
      // 请将 `<...>` 替换为 plugin 名称
      id "org.jetbrains.kotlin.<...>" version "%kotlinVersion%"
  }
  ```

  </tab>
  </tabs>

* 如果你使用旧版本 (低于 `1.8.0`) 的 `kotlin-stdlib-jdk7`/`kotlin-stdlib-jdk8`, 例如,
  `implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:SOME_OLD_KOTLIN_VERSION")`,
  并且某个依赖项传递依赖到 `kotlin-stdlib:1.8+`,
  [请将你的 `kotlin-stdlib-jdk<7/8>:SOME_OLD_KOTLIN_VERSION`
   替换为
  `kotlin-stdlib-jdk*:%kotlinVersion%`](whatsnew18.md#updated-jvm-compilation-target),
  或者在传递依赖它的库中
  [排除(exclude)](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html#sec:excluding-transitive-deps)
  `kotlin-stdlib:1.8+`:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude(group = "org.jetbrains.kotlin", module = "kotlin-stdlib")
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude group: "org.jetbrains.kotlin", module: "kotlin-stdlib"
      }
  }
  ```

  </tab>
  </tabs>

### 设置对测试库的依赖项 {id="set-dependencies-on-test-libraries"}

对于支持的所有平台, Kotlin 项目的测试可以使用
[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API.
对 `commonTest` 源代码集添加 `kotlin-test` 依赖项,
然后 Gradle plugin 会为每个测试源代码集推断出对应的测试库依赖项.

Kotlin/Native 编译目标已经内建了 `kotlin.test` API 的实现, 不需要额外的测试依赖项.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
             implementation(kotlin("test")) // 这个设置会自动引入对应平台的所有依赖项
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 这个设置会自动引入对应平台的所有依赖项
            }
        }
    }
}
```

</tab>
</tabs>

> 对 Kotlin 模块的依赖项, 可以使用简写, 比如, 对 "org.jetbrains.kotlin:kotlin-test" 的依赖项可以简写为 kotlin("test").
>
{style="note"}

你也可以在任何共通源代码集或平台相关的源代码集中使用 `kotlin-test` 依赖项.

#### kotlin-test 的 JVM 变体 {id="jvm-variants-of-kotlin-test"}

对于 Kotlin/JVM, Gradle 默认使用 JUnit 4. 因此, `kotlin("test")` 依赖项会解析为 JUnit 4 的变体,
名为 `kotlin-test-junit`.

也可以选择使用 JUnit 5 或 TestNG, 方法是在构建脚本的测试任务中调用
[`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
或
[`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG).
下面是一个 Kotlin Multiplatform 项目的示例:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

下面是一个 JVM 项目的示例:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks {
    test {
        useTestNG()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

</tab>
</tabs>

参见 [在 JVM 平台上如何使用 JUnit 测试代码](jvm-test-using-junit.md).

JVM 变体的自动解析有时可能会对你的配置造成一些问题.
这种情况下, 你可以明确指定需要的框架, 并向项目的 `gradle.properties` 文件添加以下内容, 关闭自动解析:

```text
kotlin.test.infer.jvm.variant=false
```

如果你在构建脚本中明确使用了 `kotlin("test")` 的变体, 而且项目的构建脚本出现兼容性冲突问题, 不再正常工作,
请参见 [兼容性指南中的这个问题](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project).

### 设置对 kotlinx 库的依赖项 {id="set-a-dependency-on-a-kotlinx-library"}

如果你使用跨平台的库, 并且需要依赖共用代码, 那么只需要在共用源代码集中一次性设置依赖项.
请使用库的基本 artifact 名(base artifact name), 例如 `kotlinx-coroutines-core` 或 `ktor-client-core`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

如果你需要一个 kotlinx 库的与平台相关的依赖项, 你仍然可以在对应的平台源代码集中使用库的基本 artifact 名(base artifact name):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

### 在最顶层设置依赖项 {id="set-dependencies-at-top-level"}

另一种做法是, 可以在最顶层指定依赖项, 方法是使用 `<sourceSetName><DependencyType>` 格式的配置名称.
对于某些 Gradle 内建的依赖项, 比如 `gradleApi()`, `localGroovy()`, 或 `gradleTestKit()`, 这种方法会很有用,
这些依赖项在 Source Set 依赖项 DSL 中是不能使用的.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}
```

</tab>
</tabs>

## 声明仓库 {id="declare-repositories"}

你可以声明一个可公开访问的仓库, 使用它的 open source 依赖项.
请在 `repositories{}` 代码段中, 设置仓库的名称:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}
```
</tab>
</tabs>

常用的仓库是 [Maven Central](https://central.sonatype.com/) 和 [Google's Maven repository](https://maven.google.com/web/index.html).

> 如果你同时也在使用 Maven 项目, 我们建议不要将 `mavenLocal()` 添加为仓库,
> 因为在 Gradle 和 Maven 项目间切换时, 你可能遇到问题.
> 如果你一定需要添加 `mavenLocal()` 仓库, 请在你的 `repositories{}` 代码段中, 将它添加为最后一个仓库.
> 更多详情请参见 [使用 mavenLocal() 的情况](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:case-for-maven-local).
>
{style="warning"}

如果你需要在多个子项目中声明相同的仓库, 请在你的 `settings.gradle(.kts)` 文件中,
在 `dependencyResolutionManagement{}` 代码段中集中声明仓库:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
</tabs>

在子项目中声明的任何仓库, 都会覆盖集中声明的仓库.
关于如何控制这种行为, 有什么解决办法, 详情请参见 [Gradle 的文档](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration).

## 下一步做什么? {id="what-s-next"}

学习:
* [编译器选项, 以及如何传递编译器选项](gradle-compiler-options.md).
* [增量编译, 缓存, 构建报告, 以及 Kotlin Daemon](gradle-compilation-and-caches.md).
* [Gradle 基本概念与详细信息](https://docs.gradle.org/current/userguide/userguide.html).
* [对 Gradle plugin 变体的支持](gradle-plugin-variants.md).
