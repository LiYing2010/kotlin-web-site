[//]: # (title: kapt 编译器插件)

> kapt 已进入维护模式. 我们会继续保证它兼容最新版的 Kotlin 和 Java, 但不会再实现新的功能特性.
> 请改用 [Kotlin 符号处理(Symbol Processing) API (KSP)](ksp-overview.md) 来处理注解.
> 详情请参见 [KSP 支持的注解库列表](ksp-overview.md#supported-libraries).
>
{style="warning"}

Kotlin 使用 _kapt_ 编译器插件来支持注解处理器(参见 [JSR 269](https://jcp.org/en/jsr/detail?id=269)).
译注: kapt 是 "Kotlin annotation processing tool" 的缩写

简单地说, 你可以在 Kotlin 项目中使用
[Dagger](https://google.github.io/dagger/)
或
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html)
之类的库.

关于如何在你的 Gradle/Maven 编译脚本中使用 *kapt* 插件, 请阅读下文.

## 在 Gradle 中使用 {id="use-in-gradle"}

执行以下步骤:
1. 应用 `kotlin-kapt` Gradle plugin:

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

2. 在你的 `dependencies` 块中使用 `kapt` 配置来添加对应的依赖:

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

## 试用 Kotlin K2 编译器 {id="try-kotlin-k2-compiler"}

> kapt 编译器插件对 K2 编译器的支持是 [实验性功能](components-stability.md).
> 需要使用者同意(Opt-in) (详情见下文),
> 你应该只为评估和试验目的来使用这个功能.
>
{style="warning"}

从 Kotlin 1.9.20 开始, 你可以对 [K2 编译器](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/) 试用 kapt 编译器插件,
K2 编译器带来了性能改进和很多其它优点. 要在你的 Gradle 项目中使用 K2 编译器, 请在你的 `gradle.properties` 文件中添加以下选项:

```kotlin
kapt.use.k2=true
```

如果你使用的是 Maven 构建系统, 请更新你的 `pom.xml` 文件:

```xml
<configuration>
    ...
    <args>
        <arg>-Xuse-k2-kapt</arg>
    </args>
</configuration>
```

> 要在你的 Maven 项目中启用 kapt plugin, 请参见 [](#use-in-maven).
>
{style="tip"}

如果你在对 K2 编译器使用 kapt 插件时遇到任何问题, 请报告到我们的 [问题追踪系统](http://kotl.in/issue).

## 注解处理器的参数 {id="annotation-processor-arguments"}

可以使用 `arguments {}` 代码段来传递参数给注解处理器:

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## 支持 Gradle 编译缓存 {id="gradle-build-cache-support"}

kapt 注解处理任务默认情况下不会 [被 Gradle 缓存](https://guides.gradle.org/using-build-cache/).
因为注解处理器可以运行任意代码, 并不一定只是将编译任务的输入文件转换为输出文件, 它还可能访问并修改未被 Gradle 追踪的其他文件.
如果确实需要为 kapt 启用 Gradle 编译缓存, 请将以下代码加入到你的编译脚本中:

```groovy
kapt {
    useBuildCache = false
}
```

## 改进使用 kapt 时的构建速度 {id="improve-the-speed-of-builds-that-use-kapt"}

### 并行运行多个 KAPT 任务 {id="run-kapt-tasks-in-parallel"}

为了改进使用 kapt 时的构建速度, 你可以对 kapt 任务启用
[Gradle Worker API](https://guides.gradle.org/using-the-worker-api/).
使用 Worker API 可以让 Gradle 并行运行单个项目中的多个独立的注解处理任务, 某些情况下能够显著缩短运行时间.

如果在 Kotlin Gradle 插件中使用了 [自定义 JDK home](gradle-configure-project.md#gradle-java-toolchains-support) 功能,
kapt 任务执行器只会使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode).
注意, `kapt.workers.isolation` 属性会被忽略.

如果你想要对 kapt worker 进程指定额外的 JVM 参数, 请使用 `KaptWithoutKotlincTask` 的输入参数 `kaptProcessJvmArgs`:

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

> 在 kapt 中, 注解处理器的 classloader 缓存是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-28901) 提供你的反馈意见.
>
{style="warning"}

如果连续执行很多 Gradle 任务, 注解处理器的 classloader 缓存功能可以帮助 kapt 提高运行速度.

要启用这个功能, 可以在你的 `gradle.properties` 文件中使用以下属性:

```none
# 正数值会启用缓存功能
# 请在这里指定与使用 kapt 的模块数相同的数字
kapt.classloaders.cache.size=5

# 为让缓存正确工作, 需要关闭这个设定
kapt.include.compile.classpath=false
```

如果你遇到与注解处理器缓存相关的问题, 可以对这些处理器关闭缓存:

```none
# 在这里指定注解处理器的完整名称, 可以对这些处理器关闭缓存
kapt.classloaders.cache.disableForProcessors=[注解处理器的完整名称]
```

### 测量注解处理器的性能 {id="measure-performance-of-annotation-processors"}

可以使用 `-Kapt-show-processor-timings` plugin 选项得到注解处理器执行时的性能统计.
输出示例:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

你可以使用 plugin 选项
[`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280),
将这个报告输出到一个文件.
以下命令将会运行 kapt, 并将统计报告输出到 `ap-perf-report.file` 文件:

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

`kotlin-kapt` Gradle plugin 可以对每个注解处理器统计生成的文件数量.

这个功能可以用于追踪构建过程中是否存在未使用的注解处理器.
你可以使用生成的报告来寻找哪些模块触发了不必要的注解处理器, 然后更新这些模块, 不再触发这些注解处理器.

使用以下步骤启用这个统计功能:
* 在你的 `build.gradle(.kts)` 文件中, 将 `showProcessorStats` flag 设置为 `true`:

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在你的 `gradle.properties` 文件中, 将 `kapt.verbose` Gradle 属性设置为 `true`:

  ```none
  kapt.verbose=true
  ```

> 也可以使用 [命令行选项 `verbose`](#use-in-cli) 启用 verbose 输出.
>
{style="note"}

统计结果将出现在日志中, 级别为 `info`.
你将会看到 `Annotation processor stats:` 行, 之后是每个注解处理器的执行时间统计.
再后面, 将是 `Generated files report:` 行, 之后是每个注解处理器生成的文件数量统计.
比如:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## 对 KAPT 使用编译回避功能 {id="compile-avoidance-for-kapt"}

为了改进使用 kapt 时的增量构建次数, 可以使用 Gradle 的
[编译回避(compile avoidance) 功能](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance).
启用编译回避时, Gradle 可以在重新构建项目时跳过注解处理任务. 具体来说, 在以下情况下会跳过注解处理任务:

* 项目的源代码文件没有变化.
* 依赖项目中的变更满足 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 兼容.
  比如说, 变更只发生在方法体之内, 而方法接口没有变更.

但是, 编译回避不能用于编译类路径中发现的注解处理器, 因为它们的 _任何变更_ 都需要运行注解处理任务.

要使用编译回避模式运行 kapt, 你需要:
* 对 `kapt*` 配置手工添加注解处理器依赖项目, 具体方法参见 [上文](#use-in-gradle).
* 不要在编译类路径中查找注解处理器, 方法是在你的 `gradle.properties` 文件中添加以下代码:

```none
kapt.include.compile.classpath=false
```

## 增量式(Incremental)注解处理 {id="incremental-annotation-processing"}

kapt 支持增量式(Incremental)注解处理, 这个功能默认启用.
目前, 只有当所有注解处理器都以增量模式使用时, 注解处理才可以增量式运行.

要关闭增量式注解处理, 请在你的 `gradle.properties` 文件添加以下代码:

```none
kapt.incremental.apt=false
```

注意, 增量式注解处理同时还需要启用
[增量式编译(Incremental Compilation)](gradle-compilation-and-caches.md#incremental-compilation).

## 从父配置(superconfiguration)继承注解处理器 {id="inherit-annotation-processors-from-superconfigurations"}

你可以在一个单独的 Gradle 配置中, 定义注解处理器的一组共通设置, 作为父配置(superconfiguration),
然后对你的子项目扩展这些父配置, 进行更多的 kapt 相关的配置.

例如, 对一个使用 [Dagger](https://dagger.dev/) 的子项目, 在你的 `build.gradle(.kts)` 文件中, 使用下面的配置:

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在这个示例中, `commonAnnotationProcessors` Gradle 配置,
是你想要在所有的项目中使用的, 关于注解处理的共通父配置.
你使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法, 将 `commonAnnotationProcessors` 添加为一个父配置.
kapt 看到 `commonAnnotationProcessors` Gradle 配置存在对 Dagger 注解处理器的依赖项.
因此, kapt 会在它关于注解处理的配置中包含 Dagger 注解处理器.

## Java 编译器选项 {id="java-compiler-options"}

kapt 使用 Java 编译器来运行注解处理器.
下面的例子是, 如何向 javac 传递任意的参数:

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
默认情况下, kapt 会将所有的未知类型替换为 `NonExistentClass`, 包括编译产生的类的类型信息,
但是你可以修改这种行为. 在 `build.gradle(.kts)` 文件中添加一个选项, 就可以对桩代码中推断错误的数据类型进行修正:

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用 {id="use-in-maven"}

在 `compile` 之前, 执行 kotlin-maven-plugin 中的 `kapt` 目标:

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal>
        <!-- 如果你对 kapt plugin 启用了扩展(extension), 那么可以省略 <goals> 元素 -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- 请在此处指定你的注解处理器 -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

要配置注解处理的级别(level), 请在 `<configuration>` 代码段中将 `aptMode` 设置为下面的值之一:

* `stubs` – 只生成注解处理所需要的桩代码.
* `apt` – 只允许注解处理.
* `stubsAndApt` – (默认值) 生成桩代码, 并运行注解处理.

例如:

```xml
<configuration>
    ...
    <aptMode>stubs</aptMode>
</configuration>
```

要对 K2 编译器启用 kapt plugin, 请添加 `-Xuse-k2-kapt` 编译器选项:

```xml
<configuration>
    ...
    <args>
        <arg>-Xuse-k2-kapt</arg>
    </args>
</configuration>
```

## 在 IntelliJ 构建系统中使用 {id="use-in-intellij-build-system"}

IntelliJ IDEA 自有的构建系统不支持 kapt.
如果你想要重新运行注解处理过程, 请通过 "Maven Projects" 工具栏启动编译过程.

## 在命令行中使用 {id="use-in-cli"}

kapt 编译器插件随 Kotlin 编译器的二进制发布版一同发布.

编译时, 你可以添加这个插件, 方法是使用 kotlinc 的 `Xplugin` 编译选项, 指定它的 JAR 文件路径:

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

以下是这个插件的命令行选项列表:

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
  如果指定了这个选项, kapt 不会在 `apclasspath` 中查找注解处理器.
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

kapt 可以生成 Kotlin 源代码. 它会将生成的 Kotlin 源代码文件写入到
`processingEnv.options["kapt.kotlin.generated"]`
指定的目录, 这些文件会和主源代码文件一起编译.

注意, 对于生成的 Kotlin 文件, kapt 不支持多轮处理.

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

kapt 默认会运行所有的注解处理器, 并关闭 javac 编译器的注解处理.
但是, 你有可能会需要 javac 的某些注解处理器继续运行 (比如, [Lombok](https://projectlombok.org/)).

在 Gradle 构建脚本文件中, 可以使用 `keepJavacAnnotationProcessors` 选项:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果使用 Maven, 需要指定具体的 plugin 设置.
详情请参见 [Lombok 编译器插件的设置示例](lombok.md#using-with-kapt).
