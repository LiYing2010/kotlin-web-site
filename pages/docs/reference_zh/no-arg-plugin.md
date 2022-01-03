---
type: doc
layout: reference
category:
title: "No-arg 编译器插件"
---

# No-arg 编译器插件

本页面最终更新: 2022/04/14

对带有指定注解的类, *no-arg* 编译器插件会为它生成一个额外的无参数构造器. 

生成的构造器是合成的(Synthetic), 因此不能在 Java 或 Kotlin 代码中直接调用, 但可以使用反射调用.

这个功能使得 Java Persistence API (JPA) 可以创建类的实例, 即使从 Kotlin 或 Java 的观点看, 它并没有无参数的构造器
(参见 [下文](#jpa-support) 关于 `kotlin-jpa` 插件的介绍).

## Gradle

添加插件, 并指定需要为类生成无参数构造器的注解.

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:{{ site.data.releases.latest.version }}"
    }
}

apply plugin: "kotlin-noarg"
```

或使用 Gradle plugins DSL:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.noarg" version "{{ site.data.releases.latest.version }}"
}
```

然后指定 no-arg 注解:

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

如果你希望插件在合成的(Synthetic)构造器中执行初始化逻辑, 请打开 `invokeInitializers` 选项.
这个选项默认关闭.

```groovy
noArg {
    invokeInitializers = true
}
```

## Maven

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>{{ site.data.releases.latest.version }}</version>

    <configuration>
        <compilerPlugins>
            <!-- 对 JPA 的情况请使用 "jpa" 插件 -->
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- 在合成的(Synthetic)构造器中调用实例的初始化代码 -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>{{ site.data.releases.latest.version }}</version>
        </dependency>
    </dependencies>
</plugin>
```

## JPA 支持

和 `kotlin-spring` 插件封装了 `all-open` 一样, `kotlin-jpa` 也是 `no-arg` 的上层封装.
这个插件自动指定 *no-arg* 注解为 
[`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html),
[`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html),
和 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html).

在 Gradle 中添加这个插件的方法如下: 

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:{{ site.data.releases.latest.version }}"
    }
}

apply plugin: "kotlin-jpa"
```

或使用 Gradle plugins DSL:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.jpa" version "{{ site.data.releases.latest.version }}"
}
```

在 Maven 中, 启用 `jpa` 插件:

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

## 命令行编译器

将插件的 JAR 文件添加到编译器的插件 classpath, 并指定需要处理的注解, 或使用预设定(preset):

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```
