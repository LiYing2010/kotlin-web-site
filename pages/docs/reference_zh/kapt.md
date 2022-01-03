---
type: doc
layout: reference
title: "使用 kapt"
---

# 使用 kapt

本页面最终更新: 2022/02/25

> kapt 已进入维护模式. 我们会继续保证它兼容最新版的 Kotlin 和 Java, 但不会再实现新的功能特性.
> 请改用 [Kotlin 符号处理(Symbol Processing) API (KSP)](ksp/ksp-overview.html) 来处理注解.
> 详情请参见 [KSP 支持的注解库列表](ksp/ksp-overview.html#supported-libraries).
{:.warning}

Kotlin 使用 *kapt* 编译器插件来支持注解处理器(参见 [JSR 269](https://jcp.org/en/jsr/detail?id=269)).
注: kapt 是 "Kotlin annotation processing tool" 的缩写

简单地说, 你可以在 Kotlin 项目中使用
[Dagger](https://google.github.io/dagger/)
或
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html)
之类的库.

关于如何在你的 Gradle/Maven 编译脚本中使用 *kapt* 插件, 请阅读下文.

## 在 Gradle 中使用

应用 `kotlin-kapt` Gradle plugin:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("kapt") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

你也可以使用 `apply plugin` 语法:

```groovy
apply plugin: 'kotlin-kapt'
```

然后在你的 `dependencies` 块中使用 `kapt` 配置来添加对应的依赖:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    kapt("groupId:artifactId:version")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```

</div>
</div>

如果你以前对注解处理器使用过
[Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config),
请将使用 `annotationProcessor` 配置的地方替换为 `kapt`. 如果你的工程中包含 Java 类, `kapt` 也会正确地处理这些 Java 类.

如果你需要对 `androidTest` 或 `test` 源代码使用注解处理器,
那么与 `kapt` 配置相对应的名称应该是 `kaptAndroidTest` 和 `kaptTest`.
注意, `kaptAndroidTest` 和 `kaptTest` 从 `kapt` 继承而来,
因此你只需要提供 `kapt` 的依赖项, 它可以同时用于产品代码和测试代码.

## 注解处理器的参数

可以使用 `arguments {}` 代码段来传递参数给注解处理器:

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## 支持 Gradle 编译缓存

kapt 注解处理任务默认情况下不会 [被 Gradle 缓存](https://guides.gradle.org/using-build-cache/).
因为注解处理器可以运行任意代码, 并不一定只是将编译任务的输入文件转换为输出文件, 它还可能访问并修改未被 Gradle 追踪的其他文件.
如果确实需要为 kapt 启用 Gradle 编译缓存, 请将以下代码加入到你的编译脚本中:

```groovy
kapt {
    useBuildCache = false
}
```

## 改进使用 kapt 时的构建速度

### 并行运行多个 KAPT 任务

为了改进使用 kapt 时的构建速度, 你可以对 kapt 任务启用
[Gradle worker API](https://guides.gradle.org/using-the-worker-api/).
使用 worker API 可以让 Gradle 并行运行单个项目中的多个独立的注解处理任务, 某些情况下能够显著缩短运行时间.
但是, 使用 Gradle worker API 运行 kapt, 可能由于并行执行多个任务, 而导致内存消耗量增加.

要使用 Gradle worker API 来并行运行 kapt 任务, 请在你的 `gradle.properties` 文件中添加以下内容:

```
kapt.use.worker.api=true
```

如果在 Kotlin Gradle 插件中使用了 [自定义 JDK home](gradle.html#set-custom-jdk-home) 功能,
kapt 任务执行器只会使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode).
注意, `kapt.workers.isolation` 属性会被忽略.

### 注解处理器的 classloader 缓存

> 在 kapt 中, 注解处理器的 classloader 缓存是 [试验性功能](components-stability.html).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-28901) 提供你的反馈意见.
{:.warning}

如果连续执行很多 Gradle 任务, 注解处理器的 classloader 缓存功能可以帮助 kapt 提高运行速度.

要启用这个功能, 可以在你的 `gradle.properties` 文件中使用以下属性:

```properties
# 正数值会启用缓存功能
# 请在这里指定与使用 kapt 的模块数相同的数字
kapt.classloaders.cache.size=5

# 为让缓存正确工作, 需要关闭这个设定
kapt.include.compile.classpath=false
```

如果你遇到与注解处理器缓存相关的问题, 可以对这些处理器关闭缓存:

```properties
# 在这里指定注解处理器的完整名称, 可以对这些处理器关闭缓存
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

## 对 KAPT 使用编译回避功能

为了改进使用 kapt 时的增量构建次数, 可以使用 Gradle 的
[编译回避(compile avoidance) 功能](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance).
启用编译回避时, Gradle 可以在重新构建项目时跳过注解处理任务. 具体来说, 在以下情况下会跳过注解处理任务:

* 项目的源代码文件没有变化.
* 依赖项目中的变更满足 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 兼容.
  比如说, 变更只发生在方法体之内, 而方法接口没有变更.

但是, 编译回避不能用于编译类路径中发现的注解处理器, 因为它们的 _任何变更_ 都需要运行注解处理任务.

要使用编译回避模式运行 kapt, 你需要:
* 对 `kapt*` 配置手工添加注解处理器依赖项目, 具体方法参见 [上文](#using-in-gradle).
* 不要在编译类路径中查找注解处理器, 方法是在你的 `gradle.properties` 文件中添加以下代码:

```
kapt.include.compile.classpath=false
```

## 增量式(Incremental)注解处理

kapt 支持增量式(Incremental)注解处理, 这个功能默认启用.
目前, 只有当所有注解处理器都以增量模式使用时, 注解处理才可以增量式运行.

要关闭增量式注解处理, 请在你的 `gradle.properties` 文件添加以下代码:

```
kapt.incremental.apt=false
```

注意, 增量式注解处理同时还需要启用
[增量式编译(Incremental Compilation)](gradle.html#incremental-compilation).

## Java 编译器选项

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

## 对不存在的类型进行纠正

有些注解处理库(比如 `AutoFactory`), 依赖于类型声明签名中的明确的数据类型.
默认情况下, kapt 会将所有的未知类型替换为 `NonExistentClass`, 包括编译产生的类的类型信息,
但是你可以修改这种行为. 在 `build.gradle` 文件中添加一个选项, 就可以对桩代码中推断错误的数据类型进行修正:

```groovy
kapt {
    correctErrorTypes = true
}
```

## 在 Maven 中使用

在 `compile` 之前, 执行 kotlin-maven-plugin 中的 `kapt` 目标:

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
            <!-- 请在此处指定你的注解处理器. -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

请注意, IntelliJ IDEA 自有的编译系统目前还不支持 kapt.
如果你想要重新运行注解处理过程, 请通过 “Maven Projects” 工具栏启动编译过程.

## 在命令行中使用

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
    * `stubs` – 只生成注解处理所需要的桩代码;
    * `apt` – 只进行注解处理;
    * `stubsAndApt` – 生成桩代码, 并且进行注解处理.
* `correctErrorTypes`: 详情请参见 [下文](#using-in-gradle). 默认关闭.

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

## 生成 Kotlin 源代码

kapt 可以生成 Kotlin 源代码. 它会将生成的 Kotlin 源代码文件写入到
`processingEnv.options["kapt.kotlin.generated"]`
指定的目录, 这些文件会和主源代码文件一起编译.

注意, 对于生成的 Kotlin 文件, kapt 不支持多轮处理.


## AP/Javac 选项编码

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

## 保留 Java 编译器的注解处理器

kapt 默认会运行所有的注解处理器, 并关闭 javac 编译器的注解处理.
但是, 你有可能会需要 javac 的某些注解处理器继续运行 (比如, [Lombok](https://projectlombok.org/)).

在 Gradle 构建脚本文件中, 可以使用 `keepJavacAnnotationProcessors` 选项:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果使用 Maven, 需要指定具体的 plugin 设置.
详情请参见 [Lombok 编译器插件的设置示例](lombok.html#using-with-kapt).
