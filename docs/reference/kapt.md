---
type: doc
layout: reference
title: "Using kapt"
---

# Using Kotlin annotation processing tool

Kotlin plugin 支持 _Dagger_ 或 _DBFlow_ 之类的注解处理器. 为了让这些注解处理器与正确处理 Kotlin 类, 需要在你的 `dependencies` 块中使用 `kapt` 设置来添加对应的依赖:

``` groovy
dependencies {
  kapt 'groupId:artifactId:version'
}
```

如果你以前使用过 [android-apt](https://bitbucket.org/hvisser/android-apt) plugin, 请将它从你的 `build.gradle` 文件中删除, 然后将使用 `apt` 设置的地方替换为 `kapt`. 如果你的工程中包含 Java 类, `kapt` 也会正确地处理这些 Java 类. 如果你需要对 `androidTest` 或 `test` 源代码使用注解处理器, 那么与 `kapt` 配置相对应的名称应该是 `kaptAndroidTest` 和 `kaptTest`.

有些注解处理库要求你在源代码中使用自动生成的类. 为了实现这一点, 你需要在 build 文件中添加一些额外的标记, 来打开 _桩(stub)代码生成_ 功能:

``` groovy
kapt {
    generateStubs = true
}
```

注意, 生成桩代码(stub)会使你的编译工程略微变慢, 因此这个功能默认是关闭的. 如果生成的代码只在你的代码中很少的地方使用, 你可以选择替代方案, 用 Java 写一些辅助类(helper class), 然后在你的 Kotlin 中可以 [毫无障碍地调用这些辅助类](java-interop.html).

关于 `kapt` 的更多信息, 请参见 [官方 Blog](http://blog.jetbrains.com/kotlin/2015/06/better-annotation-processing-supporting-stubs-in-kapt/).



The Kotlin plugin supports annotation processors like _Dagger_ or _DBFlow_.
In order for them to work with Kotlin classes, apply the `kotlin-kapt` plugin.

## Gradle configuration

``` groovy
apply plugin: 'kotlin-kapt'
```

Or, starting with Kotlin 1.1.1, you can apply it using the plugins DSL:

``` groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "{{ site.data.releases.latest.version }}"
}
```

Then add the respective dependencies using the `kapt` configuration in your `dependencies` block:

``` groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```

If you previously used the [android-apt](https://bitbucket.org/hvisser/android-apt) plugin, remove it from your `build.gradle` file and replace usages of the `apt` configuration with `kapt`. If your project contains Java classes, `kapt` will also take care of them.

If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named `kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extends `kapt`, so you can just provide the `kapt` dependency and it will be available both for production sources and tests.

Some annotation processors (such as `AutoFactory`) rely on precise types in declaration signatures. By default, Kapt replaces every unknown type (including types for the generated classes) to `NonExistentClass`, but you can change this behavior. Add the additional flag to the `build.gradle` file to enable error type inferring in stubs:

``` groovy
kapt {
    correctErrorTypes = true
}
```

Note that this option is experimental and it is disabled by default.


## Maven configuration (since Kotlin 1.1.2)

Add an execution of the `kapt` goal from kotlin-maven-plugin before `compile`:

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
            <!-- Specify your annotation processors here. -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

You can find a complete sample project showing the use of Kotlin, Maven and Dagger in the
[Kotlin examples repository](https://github.com/JetBrains/kotlin-examples/tree/master/maven/dagger-maven-example).

Please note that kapt is still not supported for IntelliJ IDEA’s own build system. Launch the build from the “Maven Projects” toolbar whenever you want to re-run the annotation processing.
