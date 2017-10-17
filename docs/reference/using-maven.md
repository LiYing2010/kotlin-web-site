---
type: doc
layout: reference
title: "使用 Maven"
description: "This tutorials walks you through different scenarios when using Maven for building applications that contain Kotlin code"
---

# 使用 Maven

## 插件与版本

*kotlin-maven-plugin* 插件用来在 maven 环境中编译 Kotlin 源代码和模块. 目前只支持 Maven v3.

可以通过 *kotlin.version* 变量来指定你希望使用的 Kotlin 版本:

``` xml
<properties>
    <kotlin.version>{{ site.data.releases.latest.version }}</kotlin.version>
</properties>
```

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

如果你的编译目标平台是 JDK 7 或 JDK 8, 你可以使用 Kotlin 标准库的扩展版本, 其中包含了针对 JDK 新版本中新增 API 的额外的扩展函数.
请使用 `kotlin-stdlib-jre7` or `kotlin-stdlib-jre8` 依赖(根据你的 JDK 版本决定), 而不是通常的 `kotlin-stdlib`.

如果你的项目使用了 [Kotlin 反射功能](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html), 或测试功能, 那么还需要添加相应的依赖.
反射功能库的 artifact ID 是 `kotlin-reflect`, 测试功能库的 artifact ID 是 `kotlin-test` 和 `kotlin-test-junit`.

## 编译 Kotlin 源代码

要编译 Kotlin 源代码, 请在 `<build>` 标签内指定源代码目录:

``` xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

编译源代码时, 需要引用 Kotlin Maven 插件:

``` xml
<build>
    <plugins>
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
    </plugins>
</build>
```

## 编译 Kotlin 和 Java 的混合源代码

要编译混合源代码的应用程序, 需要在 Java 编译器之前调用 Kotlin 编译器.
用 Maven 的术语来说就是, kotlin-maven-plugin 应该在 maven-compiler-plugin 之前运行, 也就是说, 在你的 pom.xml 文件中, kotlin plugin 要放在 maven-compiler-plugin 之前, 如下例:

``` xml
<build>
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>compile</id>
                    <goals> <goal>compile</goal> </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> <goal>test-compile</goal> </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <!-- 替换 default-compile, 因为它会被 maven 特别处理 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- 替换 default-testCompile, 因为它会被 maven 特别处理 -->
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals> <goal>compile</goal> </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals> <goal>testCompile</goal> </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
## 增量编译(Incremental compilation)

为了提高编译速度, 你可以打开 Maven 的增量编译模式(从 Kotlin 1.1.2 版开始支持).
方法是定义 `kotlin.compiler.incremental` 属性:

``` xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者, 使用命令行选项 `-Dkotlin.compiler.incremental=true` 来执行你的编译任务.

## 处理注解

详情请参见 [Kotlin 注解处理工具](kapt.html) (`kapt`).

## Jar 文件

假如要创建一个小的 Jar 文件, 其中只包含你的模块中的代码, 那么请将以下代码添加到你的 Maven pom.xml 文件的 `build->plugins` 之下,
其中的 `main.class` 是一个属性, 指向 Kotlin 或 Java 的 main class:

``` xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 自包含的(Self-contained) Jar 文件

要创建一个自包含的 Jar 文件, 其中包含你的模块中的代码, 以及它依赖的库文件, 那么请将以下代码添加到你的 Maven pom.xml 文件的 `build->plugins` 之下,
其中的 `main.class` 是一个属性, 指向 Kotlin 或 Java 的 main class:

``` xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>2.6</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

编译产生的自包含的 Jar 文件, 可以直接传递给一个 JRE, 然后就可以运行你的应用程序了:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 编译到 JavaScript

为了编译到 JavaScript, 你需要将 `compile` 的目标设置为 `js` 和 `test-js`:

``` xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <executions>
        <execution>
            <id>compile</id>
            <phase>compile</phase>
            <goals>
                <goal>js</goal>
            </goals>
        </execution>
        <execution>
            <id>test-compile</id>
            <phase>test-compile</phase>
            <goals>
                <goal>test-js</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

此外还需要修改标准库的依赖项:

``` xml
<groupId>org.jetbrains.kotlin</groupId>
<artifactId>kotlin-stdlib-js</artifactId>
<version>${kotlin.version}</version>
```

要支持单元测试, 还需要添加 `kotlin-test-js` 依赖项.

更多详细信息, 请参见教程: [使用 Maven 编译 Kotlin 和 JavaScript 入门](/docs/tutorials/javascript/getting-started-maven/getting-started-with-maven.html).

## 指定编译选项

额外的编译器选项, 可以通过 Maven plugin 节点的 `<configuration>` 元素下的标签来设置:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 关闭警告信息 -->
    </configuration>
</plugin>
```

很多编译器选项也可以通过属性来设置:

``` xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>1.0</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支持的编译选项列表如下:

### JVM 和 JS 支持的共通属性

| 名称 | Maven 属性名 | 描述 | 可以选择的值 |默认值 |
|------|---------------|-------------|-----------------|--------------|
| nowarn | | 不产生警告信息 | true, false | false |
| languageVersion | kotlin.compiler.languageVersion | 指定源代码所兼容的 Kotlin 语言版本 | "1.0", "1.1" | "1.1"
| apiVersion | kotlin.compiler.apiVersion | 只允许使用指定的版本的运行库中的 API | "1.0", "1.1" | "1.1"
| sourceDirs | | 指定编译对象源代码文件所在的目录 | | The project source roots
| compilerPlugins | | 允许使用 [编译器插件](compiler-plugins.html)  | | []
| pluginOptions | | 供编译器插件使用的选项 | | []
| args | | 额外的编译器参数 | | []


### JVM 独有的属性

| 名称 | Maven 属性名 | 描述 | 可以选择的值 |默认值 |
|------|---------------|-------------|-----------------|--------------|
| jvmTarget | kotlin.compiler.jvmTarget | 指定编译输出的 JVM 字节码的版本 | "1.6", "1.8" | "1.6" |
| jdkHome | kotlin.compiler.jdkHome | 如果 JDK home 目录路径与默认的 JAVA_HOME 值不一致, 这个参数可以指定 JDK home 目录路径, 这个路径将被添加到 classpath 内 | | |

### JS 独有的属性

| 名称 | Maven 属性名 | 描述 | 可以选择的值 |默认值 |
|------|---------------|-------------|-----------------|--------------|
| outputFile | | 指定输出文件的路径 | | |
| metaInfo |  | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库 | true, false | true
| sourceMap | | 指定是否生成源代码映射文件(source map) | true, false | false
| sourceMapEmbedSources | | 指定是否将源代码文件嵌入到源代码映射文件中 | "never", "always", "inlining" | "inlining" |
| sourceMapPrefix | | 指定源代码映射文件中的路径前缀 |  |  |
| moduleKind | | 指定编译器生成的模块类型 | "plain", "amd", "commonjs", "umd" | "plain"

## 生成文档

标准的 JavaDoc 生成 plugin (`maven-javadoc-plugin`) 不支持 Kotlin 源代码.
要对 Kotlin 项目生成文档, 请使用 [Dokka](https://github.com/Kotlin/dokka);
相关的配置方法, 请参见 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-maven-plugin).
Dokka 支持混合语言的项目, 可以将文档输出为多种格式, 包括标准的 JavaDoc 格式.

## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).

## 示例

我们提供了一个 Maven 工程示例, 可以 [通过 GitHub 仓库下载](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip).
