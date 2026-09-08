[//]: # (title: KAPT 编译器 plugin)

<tldr>

* 对于以下情况, 请使用 **KAPT** (Kotlin Annotation Processing Tool):
   * 你有一个 Maven 项目.
   * 你有一个 Gradle 项目, 但所需的 Java 注解处理器还不支持 KSP.
     [参见 KSP 支持的库列表](ksp-overview.md#supported-libraries).
* 对于以下情况, 请使用 **[KSP](ksp-overview.md)**:
   * 你有一个 Gradle 项目, 而且所需的 Java 注解处理器支持 KSP.
   * 你想要创建自己的注解处理器.

</tldr>

KAPT (Kotlin Annotation Processing Tool) 编译器 plugin 允许你在 Kotlin 中使用既有的 Java 注解处理器, 并同时支持 Maven 和 Gradle.
它从 Kotlin 源代码生成桩(stub)文件, 然后在这些桩文件上运行 Java 注解处理器.

这样, 你就可以在 Kotlin 项目中使用基于 Java 的注解处理,
帮助你使用 [MapStruct](https://mapstruct.org/)
和 [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html)
之类的库.

## 在 Gradle 中使用 {id="use-in-gradle"}

要在 Gradle 中使用 KAPT, 请执行以下步骤:

1. 在你的构建脚本文件 `build.gradle(.kts)` 中应用 `kapt` Gradle plugin:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   plugins {
       kotlin("kapt") version "%kotlinVersion%"
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
   }
   ```

   </tab>
   </tabs>

2. 在 `dependencies {}` 代码段中使用 `kapt` 配置来添加对应的依赖:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </tab>
   </tabs>

3. 如果你以前对注解处理器使用过
   [Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config),
   请将使用 `annotationProcessor` 配置的地方替换为 `kapt`. 如果你的工程中包含 Java 类, `kapt` 也会正确地处理这些 Java 类.

   如果你需要对 `androidTest` 或 `test` 源代码使用注解处理器,
   那么与 `kapt` 配置相对应的名称应该是 `kaptAndroidTest` 和 `kaptTest`.
   注意, `kaptAndroidTest` 和 `kaptTest` 从 `kapt` 继承而来,
   因此你只需要提供 `kapt` 的依赖项, 它可以同时用于产品代码和测试代码.

## 注解处理器的参数 {id="annotation-processor-arguments"}

在你的构建脚本文件 `build.gradle(.kts)` 中, 可以使用 `arguments {}` 代码段, 传递参数给注解处理器:

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## 支持 Gradle 编译缓存 {id="gradle-build-cache-support"}

KAPT 注解处理任务默认情况下会 [被 Gradle 缓存](https://guides.gradle.org/using-build-cache/).
但是, 注解处理器可以运行任意代码, 这些代码可能不能可靠的将编译任务的输入文件转换为输出文件, 还可能访问和修改 Gradle 没有追踪的文件.
如果构建中使用的注解处理器不能正确的被 Gradle 缓存, 你可以在构建脚本中指定 `useBuildCache` 属性, 对 KAPT 完全禁用缓存.
这样可以防止对 KAPT 任务使用错误的缓存:

```groovy
kapt {
    useBuildCache = false
}
```

## 改进使用 KAPT 时的构建速度 {id="improve-the-speed-of-builds-that-use-kapt"}

### 并行运行多个 KAPT 任务 {id="run-kapt-tasks-in-parallel"}

为了改进使用 KAPT 时的构建速度, 你可以对 KAPT 任务启用
[Gradle Worker API](https://guides.gradle.org/using-the-worker-api/).
使用 Worker API 可以让 Gradle 并行运行单个项目中的多个独立的注解处理任务, 某些情况下能够显著缩短运行时间.

如果在 Kotlin Gradle plugin 中使用了 [自定义 JDK home](gradle-configure-project.md#gradle-java-toolchains-support) 功能,
KAPT 任务执行器只会使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode).
注意, `kapt.workers.isolation` 属性会被忽略.

如果你想要对 KAPT Worker 进程指定额外的 JVM 参数, 请使用 `KaptWithoutKotlincTask` 的输入参数 `kaptProcessJvmArgs`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</tab>
</tabs>

### 注解处理器的 classloader 缓存 {id="caching-for-annotation-processors-classloaders"}

<primary-label ref="experimental-general"/>

如果连续执行很多 Gradle 任务, 注解处理器的 classloader 缓存功能可以帮助 KAPT 提高运行速度.

要启用这个功能, 可以在你的 `gradle.properties` 文件中使用以下属性:

```properties
# gradle.properties
#
# 正数值会启用缓存功能
# 请在这里指定与使用 KAPT 的模块数相同的数字
kapt.classloaders.cache.size=5

# 为让缓存正确工作, 需要关闭这个设定
kapt.include.compile.classpath=false
```

如果你遇到与注解处理器缓存相关的问题, 可以对这些处理器关闭缓存:

```properties
# 在这里指定注解处理器的完整名称, 可以对这些处理器关闭缓存
kapt.classloaders.cache.disableForProcessors=[注解处理器的完整名称]
```

> 如果你遇到与这个功能相关的任何问题,
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 提供你的反馈.
>
{style="note"}

### 测量注解处理器的性能 {id="measure-performance-of-annotation-processors"}

要得到注解处理器执行时的性能统计, 请使用 `-Kapt-show-processor-timings` plugin 选项.
输出示例:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

你可以使用 plugin 选项
[`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280),
将这个报告输出到一个文件.
以下命令将会运行 KAPT, 并将统计报告输出到 `ap-perf-report.file` 文件:

```bash
kotlinc -cp $MY_CLASSPATH \
-Xplugin=kotlin-annotation-processing-SNAPSHOT.jar -P \
plugin:org.jetbrains.kotlin.kapt3:aptMode=stubsAndApt,\
plugin:org.jetbrains.kotlin.kapt3:apclasspath=processor/build/libs/processor.jar,\
plugin:org.jetbrains.kotlin.kapt3:dumpProcessorTimings=ap-perf-report.file \
-Xplugin=$JAVA_HOME/lib/tools.jar \
-d cli-tests/out \
-no-jdk -no-reflect -no-stdlib -verbose \
sample/src/main/
```

### 测量注解处理器生成的文件数量 {id="measure-the-number-of-files-generated-with-annotation-processors"}

`kapt` Gradle plugin 可以对每个注解处理器统计生成的文件数量.

这个功能可以用于追踪构建过程中是否包含未使用的注解处理器.
你可以使用生成的报告来寻找哪些模块触发了不必要的注解处理器, 然后更新这些模块, 不再触发这些注解处理器.

启用统计报告功能的步骤如下:

1. 在你的 `build.gradle(.kts)` 文件中, 将 `showProcessorStats` 属性值设置为 `true`:

   ```kotlin
   // build.gradle.kts
   kapt {
       showProcessorStats = true
   }
   ```

2. 在你的 `gradle.properties` 文件中, 将 `kapt.verbose` Gradle 属性设置为 `true`:

   ```properties
   # gradle.properties
   kapt.verbose=true
   ```

> 也可以使用 [命令行选项 `verbose`](#use-in-cli) 启用 verbose 输出.
>
{style="note"}

统计结果出现在日志中, 级别为 `info`.
你会看到 `Annotation processor stats:` 行, 之后是每个注解处理器的执行时间统计.
再后面, 是 `Generated files report:` 行, 之后是每个注解处理器生成的文件数量统计.
比如:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

### 排除来自编译类路径的注解处理器 {id="exclude-annotation-processors-from-compile-classpath"}

你可以禁止对 KAPT 处理器路径之外的注解处理器进行自动查找.
这样的效果是, 排除来自编译类路径的不必要的注解处理器.

#### 在 Gradle 中 {id="in-gradle"}

Gradle 使用 [编译回避(Compile Avoidance)](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance),
在项目重新构建时跳过注解处理, 从而改进使用 KAPT 时的增量构建时间.
具体来说, 在以下情况下会跳过注解处理任务:

* 项目的源代码文件没有变化.
* 依赖项目中的变更满足 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 兼容.
  比如说, 变更只发生在方法体之内, 而方法接口没有变更.

但是, 编译回避不能用于编译类路径中发现的注解处理器, 因为其内部实现的变更需要运行注解处理任务, 即使 ABI 没有变化.

因此, 我们不建议使用来自编译类路径的注解处理器.
要从处理中排除这些注解, 请在 `gradle.properties` 文件中添加 `kapt.include.compile.classpath` 属性:

```properties
# gradle.properties
kapt.include.compile.classpath=false
```

将这个选项设置为 `false` 后, 处理器路径 (`kapt*` 配置) 之外的注解处理器依赖项, 将被排除在 KAPT 处理之外.

#### 在 Maven 中 {id="in-maven"}

要排除 KAPT 处理器路径之外的注解处理器, 请在 KAPT plugin 的 `<execution>` 部分, 将 `includeCompileClasspath` 选项设置为 `false`:

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal>
    </goals>
    <configuration>
        <includeCompileClasspath>false</includeCompileClasspath>
        <sourceDirs>...</sourceDirs>
        <annotationProcessorPaths>...</annotationProcessorPaths>
    </configuration>
</execution>
```

或者, 也可以在 `pom.xml` 的 `<properties>` 部分使用 `kapt.include.compile.classpath` 属性:

```xml
<properties>
    <kapt.include.compile.classpath>false</kapt.include.compile.classpath>
</properties>
```

将这个选项设置为 `false` 后, `<annotationProcessorPaths>` 之外的注解处理器, 将被排除在 KAPT 处理之外.

如果未设置 `includeCompileClasspath` 选项, 且 KAPT 在编译类路径中检测到未在处理器路径中明确定义的注解处理器,
你将会看到以下废弃警告:

```none
[WARNING] Annotation processors discovery from compile classpath is deprecated.
Set 'kapt.include.compile.classpath=false' to disable discovery.
```

> 要查看 KAPT 类路径之外的注解处理器列表, 请使用 `--info` 日志级别选项运行构建.
>
{style="tip"}

## 增量式(Incremental)注解处理 {id="incremental-annotation-processing"}

KAPT 默认支持增量式(Incremental)注解处理.
目前, 只有当所有注解处理器都以增量模式使用时, 注解处理才可以增量式运行.

要关闭增量式注解处理, 请在你的 `gradle.properties` 文件添加以下代码:

```properties
kapt.incremental.apt=false
```

注意, 增量式注解处理同时还需要启用
[增量式编译(Incremental Compilation)](gradle-compilation-and-caches.md#incremental-compilation).

## 从父配置(superconfiguration)继承注解处理器 {id="inherit-annotation-processors-from-superconfigurations"}

你可以在一个单独的 Gradle 配置中, 定义注解处理器的一组共通设置, 作为父配置(superconfiguration),
然后对你的子项目扩展这些父配置, 进行更多的 KAPT 相关的配置.

例如, 对一个使用 [MapStruct](https://mapstruct.org/) 的子项目, 在你的 `build.gradle(.kts)` 文件中, 使用下面的配置:

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("org.mapstruct:mapstruct:1.6.3")
    commonAnnotationProcessors("org.mapstruct:mapstruct-processor:1.6.3")
}
```

在这个示例中, `commonAnnotationProcessors` Gradle 配置,
是你想要在所有的项目中使用的, 关于注解处理的共通父配置.
你使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法, 将 `commonAnnotationProcessors` 添加为一个父配置.
KAPT 看到 `commonAnnotationProcessors` Gradle 配置存在对 MapStruct 注解处理器的依赖项.
因此, KAPT 会在它关于注解处理的配置中包含 MapStruct 注解处理器.

## Java 编译器选项 {id="java-compiler-options"}

KAPT 使用 Java 编译器来运行注解处理器.
下面的例子演示如何向 javac 传递任意的参数:

```groovy
kapt {
    javacOptions {
        // 增加注解处理器允许的最大错误数.
        // 默认值为 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 对不存在的类型进行纠正 {id="non-existent-type-correction"}

有些注解处理库(比如 `AutoFactory`), 依赖于类型声明签名中的明确的数据类型.
默认情况下, KAPT 会将所有的未知类型替换为 `NonExistentClass`, 包括编译产生的类的类型信息,
但是你可以修改这种行为. 在 `build.gradle(.kts)` 文件中添加一个选项, 就可以对桩代码中推断错误的数据类型进行修正:

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用 {id="use-in-maven"}

### 自动配置 {id="automatic-configuration"}

你可以通过为 Kotlin Maven plugin 启用 `<extensions>` 选项, 来简化 KAPT 的配置.
这样, 就不需要手动设置 KAPT 的带有目标和源目录的 `<execution>` 部分.

要自动配置 KAPT, 请在 `pom.xml` 构建文件中, 将 `kotlin-maven-plugin` 的 `<extensions>` 选项设置为 `true`:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions>
    <configuration>
        <annotationProcessorPaths>
            <!-- 请在此处指定你的注解处理器 -->
            <annotationProcessorPath>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.6.3</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

关于 `<extensions>` 选项, 详情请参见 [自动配置](maven-configure-project.md#automatic-configuration).

### 手动配置 {id="manual-configuration"}

要在 Kotlin Maven 项目中手动设置 KAPT, 请在 `compile` 执行之前, 添加来自 `kotlin-maven-plugin` 的 `kapt` 目标的执行:

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal>
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- 请在此处指定你的注解处理器 -->
            <annotationProcessorPath>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.6.3</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

### 配置 KAPT 注解处理 {id="configure-kapt-annotation-processing"}

要配置注解处理的级别(level), 请在 `<configuration>` 代码段中将 `aptMode` 设置为下面的值之一:

* `stubs` – 只生成注解处理所需要的桩代码.
* `apt` – 只进行注解处理.
* `stubsAndApt` – (默认值) 生成桩代码, 并运行注解处理.

例如:

```xml
<configuration>
    ...
    <aptMode>stubs</aptMode>
</configuration>
```

## 在 IntelliJ 构建系统中使用 {id="use-in-intellij-build-system"}

IntelliJ IDEA 自有的构建系统不支持 KAPT.
如果你想要重新运行注解处理过程, 请通过 "Maven Projects" 工具栏启动编译过程.

## 在命令行中使用 {id="use-in-cli"}

KAPT 编译器 plugin 随 Kotlin 编译器的二进制发布版一同发布.

编译时, 你可以添加这个 plugin, 方法是使用 kotlinc 的 `Xplugin` 编译选项, 指定它的 JAR 文件路径:

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是这个 plugin 的命令行选项列表:

* `sources` (*必须*): 指定生成的源代码文件的输出路径.
* `classes` (*必须*): 指定生成的 class 文件和资源文件的输出路径.
* `stubs` (*必须*): 指定生成的桩(stub)源代码文件的输出路径. 也可以理解为, 某种临时目录.
* `incrementalData`: 指定生成的桩二进制文件的输出路径.
* `apclasspath` (*可多次指定*): 指定注解处理器的 JAR 文件路径.
  你需要多少个 JAR 文件, 就要指定多少个 `apclasspath` 选项.
* `apoptions`: 传递给注解处理器的选项列表, 使用 base64 编码.
  详情请参见 [AP/javac 选项编码](#ap-javac-options-encoding).
* `javacArguments`: 传递给 javac 编译器的选项列表, 使用 base64 编码.
  详情请参见 [AP/javac 选项编码](#ap-javac-options-encoding).
* `processors`: 注解处理器的全限定类名列表, 多个类名之间以逗号分隔.
  如果指定了这个选项, KAPT 不会在 `apclasspath` 中查找注解处理器.
* `verbose`: 启用详细输出.
* `aptMode` (*必须*)
    * `stubs` – 只生成注解处理所需要的桩代码.
    * `apt` – 只进行注解处理.
    * `stubsAndApt` – 生成桩代码, 并且进行注解处理.
* `correctErrorTypes`: 详情请参见 [对不存在的类型进行纠正](#non-existent-type-correction). 默认关闭.
* `dumpFileReadHistory`: 输出路径, 用于输出每个文件的注解处理过程中使用的类的列表.

plugin 的命令行选项格式是: `-P plugin:<plugin id>:<key>=<value>`. 命令行选项可以重复.

示例:

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## 生成 Kotlin 源代码 {id="generate-kotlin-sources"}

KAPT 可以生成 Kotlin 源代码. 它会将生成的 Kotlin 源代码文件写入到
`processingEnv.options["kapt.kotlin.generated"]`
指定的目录, 这些文件会和主源代码文件一起编译.

注意, 对于生成的 Kotlin 文件, KAPT 不支持多轮处理.

## AP/Javac 选项编码 {id="ap-javac-options-encoding"}

`apoptions` 和 `javacArguments` 命令行选项可以接受一个编码的参数 map.
对参数 map 编码的方法如下:

```kotlin
fun encodeList(options: Map<String, String>): String {
    val os = ByteArrayOutputStream()
    val oos = ObjectOutputStream(os)

    oos.writeInt(options.size)
    for ((key, value) in options.entries) {
        oos.writeUTF(key)
        oos.writeUTF(value)
    }

    oos.flush()
    return Base64.getEncoder().encodeToString(os.toByteArray())
}
```

## 保留 Java 编译器的注解处理器 {id="keep-java-compiler-s-annotation-processors"}

KAPT 默认会运行所有的注解处理器, 并关闭 javac 编译器的注解处理.
但是, 你有可能会需要 javac 的某些注解处理器继续运行 (比如, [Lombok](https://projectlombok.org/)).

在 Gradle 构建脚本文件中, 可以使用 `keepJavacAnnotationProcessors` 选项:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果使用 Maven, 需要明确配置 plugin.
详情请参见 [Lombok 编译器 plugin 的设置示例](lombok.md#using-with-kapt).

## 下一步 {id="whats-next"}

* [学习如何从 KAPT 迁移到 KSP](ksp-kapt-migration.md)
