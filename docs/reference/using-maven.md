---
type: doc
layout: reference
title: "使用 Maven"
description: "This tutorials walks you through different scenarios when using Maven for building applications that contain Kotlin code"
---

# 使用 Maven

## 插件与版本

*kotlin-maven-plugin* 插件用来在 maven 环境中编译 Kotlin 源代码和模块. 目前只支持 Maven v3.

可以通过 *kotlin.version* 变量来指定你希望使用的 Kotlin 版本. 下表是 Kotlin 的 Release 版本名称与版本号之间的对应关系:

<table>
<thead>
<tr>
  <th>Release 版本名</th>
  <th>版本号</th>
</tr>
</thead>
<tbody>
{% for entry in site.data.releases.list %}
<tr>
  <td>{{ entry.milestone }}</td>
  <td>{{ entry.version }}</td>
</tr>
{% endfor %}
</tbody>
</table>


## 依赖

Kotlin 有一个内容广泛的标准库, 可以在你的应用程序中使用. 请在 pom 文件中添加以下依赖设置:

``` xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

## 编译 Kotlin 源代码

要编译 Kotlin 源代码, 请在 <build> 标签内指定源代码目录:

``` xml
<sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
<testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
```

编译源代码时, 需要引用 Kotlin Maven 插件:

``` xml

<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <executions>
        <execution>
            <id>compile</id>
            <goals> <goal>compile</goal> </goals>
        </execution>

        <execution>
            <id>test-compile</id>
            <goals> <goal>test-compile</goal> </goals>
        </execution>
    </executions>
</plugin>
```

## 编译 Kotlin 和 Java 的混合源代码

要编译混合源代码的应用程序, 需要在 Java 编译器之前调用 Kotlin 编译器.
用 Maven 的术语来说就是, kotlin-maven-plugin 应该在 maven-compiler-plugin 之前运行.

为了达到这个目的, 可以将 Kotlin 编译动作移动到比 Java 编译当作更前的 process-sources 步骤(phase)(如果你有更好的解决方法, 欢迎告诉我们):

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <executions>
        <execution>
            <id>compile</id>
            <phase>process-sources</phase>
            <goals> <goal>compile</goal> </goals>
        </execution>

        <execution>
            <id>test-compile</id>
            <phase>process-test-sources</phase>
            <goals> <goal>test-compile</goal> </goals>
        </execution>
    </executions>
</plugin>
```

## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).

## 示例

我们提供了一个 Maven 工程示例, 可以 [通过 GitHub 仓库下载](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip).
