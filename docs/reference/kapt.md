---
type: doc
layout: reference
title: "使用 kapt"
---

# 在 Kotlin 中处理注解

Kotlin 使用 *kapt* 编译器插件来支持注解处理器(参见 [JSR 269](https://jcp.org/en/jsr/detail?id=269)).
注: kapt 是 "Kotlin annotation processing tool" 的缩写

大略地说, 你可以在你的 Kotlin 项目中使用 [Dagger](https://google.github.io/dagger/) 或 [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) 之类的库.

关于如何在你的 Gradle/Maven 编译脚本中使用 *kapt* 插件, 请阅读下文.

## 在 Gradle 中使用

应用 `kotlin-kapt` Gradle plugin:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("kapt") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

你也可以使用 `apply plugin` 语法:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
apply plugin: 'kotlin-kapt'
```

</div>

然后在你的 `dependencies` 块中使用 `kapt` 配置来添加对应的依赖:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    kapt("groupId:artifactId:version")
}
```

</div>
</div>


如果你以前对注解处理器使用过 [Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config), 请将使用 `annotationProcessor` 配置的地方替换为 `kapt`.
如果你的工程中包含 Java 类, `kapt` 也会正确地处理这些 Java 类.

如果你需要对 `androidTest` 或 `test` 源代码使用注解处理器, 那么与 `kapt` 配置相对应的名称应该是 `kaptAndroidTest` 和 `kaptTest`.
注意, `kaptAndroidTest` 和 `kaptTest` 从 `kapt` 继承而来, 因此你只需要提供 `kapt` 的依赖项, 它可以同时用于产品代码和测试代码.

## 注解处理器的参数

可以使用 `arguments {}` 代码段来传递参数给注解处理器:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

</div>

## 支持 Gradle 编译缓存 (从 1.2.20 版开始支持)

kapt 注解处理任务默认情况下不会 [被 Gradle 缓存](https://guides.gradle.org/using-build-cache/).
因为注解处理器可以运行任意代码, 并不一定只是将编译任务的输入文件转换为输出文件, 它还可能访问并修改未被 Gradle 追踪的其他文件.
如果确实需要为 kapt 启用 Gradle 编译缓存, 请将以下代码加入到你的编译脚本中:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kapt {
    useBuildCache = true
}
```

</div>

## Java 编译器选项

Kapt 使用 Java 编译器来运行注解处理器.
下面的例子是, 如何向 javac 传递任意的参数:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kapt {
    javacOptions {
        // 增加注解处理器允许的最大错误数.
        // 默认值为 100.
        option("-Xmaxerrs", 500)
    }
}
```

</div>

## 对不存在的类型进行纠正

有些注解处理库(比如 `AutoFactory`), 依赖于类型声明签名中的明确的数据类型. 默认情况下, Kapt 会将所有的未知类型替换为 `NonExistentClass`, 包括编译产生的类的类型信息,
但是你可以修改这种行为. 在 `build.gradle` 文件中添加一个额外的标记, 就可以对桩代码中推断错误的数据类型进行修正:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kapt {
    correctErrorTypes = true
}
```

</div>

## 在 Maven 中使用

在 `compile` 之前, 执行 kotlin-maven-plugin 中的 `kapt` 目标:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

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

</div>

在 [Kotlin 示例程序库](https://github.com/JetBrains/kotlin-examples/tree/master/maven/dagger-maven-example) 中, 你可以找到一个完整的示例项目, 演示如何使用 Kotlin, Maven 和 Dagger.

请注意, IntelliJ IDEA 自有的编译系统目前还不支持 kapt. 如果你想要重新运行注解处理过程, 请通过 “Maven Projects” 工具栏启动编译过程.


## 在命令行中使用

Kapt 编译器插件随 Kotlin 编译器的二进制发布版一同发布.

编译时, 你可以添加这个插件, 方法是使用 kotlinc 的 `Xplugin` 编译选项, 指定它的 JAR 文件路径:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

</div>

以下是这个插件的命令行选项列表:

* `sources` (*必须*): 指定生成的源代码文件的输出路径.
* `classes` (*必须*): 指定生成的 class 文件和资源文件的输出路径.
* `stubs` (*必须*): 指定生成的桩(stub)源代码文件的输出路径. 也可以理解为, 某种临时目录.
* `incrementalData`: 指定生成的桩二进制文件的输出路径.
* `apclasspath` (*可多次指定*): 指定注解处理器的 JAR 文件路径. 你需要多少个 JAR 文件, 就要指定多少个 `apclasspath` 选项.
* `apoptions`: 传递给注解处理器的选项列表, 使用 base64 编码. 详情请参见 [AP/javac 选项编码](#apjavac-options-encoding).
* `javacArguments`: 传递给 javac 编译器的选项列表, 使用 base64 编码. 详情请参见 [AP/javac 选项编码](#apjavac-options-encoding).
* `processors`: 注解处理器的全限定类名列表, 多个类名之间以逗号分隔. 如果指定了这个选项, kapt 不会在 `apclasspath` 中查找注解处理器.
* `verbose`: 启用详细输出.
* `aptMode` (*必须*)
    * `stubs` – 只生成注解处理所需要的桩代码;
    * `apt` – 只进行注解处理;
    * `stubsAndApt` – 生成桩代码, 并且进行注解处理.
* `correctErrorTypes`: 详情请参见 [下文](#using-in-gradle). 默认关闭.

plugin 的命令行选项格式是: `-P plugin:<plugin id>:<key>=<value>`. 命令行选项可以重复.

示例:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

</div>

## 生成 Kotlin 源代码

Kapt 可以生成 Kotlin 源代码. 它会将生成的 Kotlin 源代码文件写入到 `processingEnv.options["kapt.kotlin.generated"]` 指定的目录, 这些文件会和主源代码文件一起编译.

你可以在 [kotlin 示例](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/kotlin-code-generation) 的 Github 代码库中找到完整的示例.

注意, 对于生成的 Kotlin 文件, Kapt 不支持多轮处理.


## AP/Javac 选项编码

`apoptions` 和 `javacArguments` 命令行选项可以接受一个编码的参数 map.
对参数 map 编码的方法如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>
