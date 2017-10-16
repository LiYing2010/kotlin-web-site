---
type: doc
layout: reference
title: "使用 kapt"
---

# 使用 Kotlin 注解处理工具(kapt, Kotlin annotation processing tool)

Kotlin plugin 支持 _Dagger_ 或 _DBFlow_ 之类的注解处理器.
为了让这些注解处理器与正确处理 Kotlin 类, 需要应用 `kotlin-kapt` plugin.

## Gradle 配置

``` groovy
apply plugin: 'kotlin-kapt'
```

从 Kotlin 1.1.1 版开始, 你也可以使用 plugin DSL 语法:

``` groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "{{ site.data.releases.latest.version }}"
}
```

然后在你的 `dependencies` 块中使用 `kapt` 配置来添加对应的依赖:

``` groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```


如果你以前使用过 [android-apt](https://bitbucket.org/hvisser/android-apt) plugin, 请将它从你的 `build.gradle` 文件中删除, 然后将使用 `apt` 配置的地方替换为 `kapt`.
如果你的工程中包含 Java 类, `kapt` 也会正确地处理这些 Java 类.

如果你需要对 `androidTest` 或 `test` 源代码使用注解处理器, 那么与 `kapt` 配置相对应的名称应该是 `kaptAndroidTest` 和 `kaptTest`.
注意, `kaptAndroidTest` 和 `kaptTest` 从 `kapt` 继承而来, 因此你只需要提供 `kapt` 的依赖项, 它可以同时用于产品代码和测试代码.

有些注解处理库(比如 `AutoFactory`), 依赖于类型声明签名中的明确的数据类型. 默认情况下, Kapt 会将所有的未知类型替换为 `NonExistentClass`, 包括编译产生的类的类型信息,
但是你可以修改这种行为. 在 `build.gradle` 文件中添加一个额外的标记, 就可以对桩代码中推断错误的数据类型进行修正:

``` groovy
kapt {
    correctErrorTypes = true
}
```

注意, 这个选项还处于实验阶段, 默认是关闭的.


## Maven 配置 (从 Kotlin 1.1.2 版开始支持)

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

在 [Kotlin 示例程序库](https://github.com/JetBrains/kotlin-examples/tree/master/maven/dagger-maven-example) 中, 你可以找到一个完整的示例项目, 演示如何使用 Kotlin, Maven 和 Dagger.

请注意, IntelliJ IDEA 自有的编译系统目前还不支持 kapt. 如果你想要重新运行注解处理过程, 请通过 “Maven Projects” 工具栏启动编译过程.
