---
type: doc
layout: reference
title: "Maven"
---

# Maven

最终更新: {{ site.data.releases.latestDocDate }}

## 插件与版本

*kotlin-maven-plugin* 插件用来在 maven 环境中编译 Kotlin 源代码和模块. 目前只支持 Maven v3.

可以通过 *kotlin.version* 变量来指定你希望使用的 Kotlin 版本:

```xml
<properties>
    <kotlin.version>{{ site.data.releases.latest.version }}</kotlin.version>
</properties>
```

## 依赖

Kotlin 有一个内容广泛的标准库, 可以在你的应用程序中使用.
要在你的项目中使用 Kotlin 标准库, 请在 pom 文件中添加以下依赖设置:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果你的编译目标平台是 JDK 7 或 8
> * 对于 Kotlin 1.8 以前版本, 请使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`.
> * 对于 Kotlin 1.2 以前版本, 请使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`.
{:.note}

如果你的项目使用了
[Kotlin 反射功能](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html),
或测试功能, 那么还需要添加相应的依赖.
反射功能库的 artifact ID 是 `kotlin-reflect`,
测试功能库的 artifact ID 是 `kotlin-test` 和 `kotlin-test-junit`.

## 编译纯 Kotlin 源代码

要编译 Kotlin 源代码, 请在 `<build>` 标签内指定源代码目录:

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

编译源代码时, 需要引用 Kotlin Maven 插件:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 编译 Kotlin 与 Java 的混合源代码

要编译同时包含 Kotlin 与 Java 源代码的项目, 需要在 Java 编译器之前调用 Kotlin 编译器.
用 Maven 的术语来说就是, `kotlin-maven-plugin` 应该在 `maven-compiler-plugin` 之前运行.
也就是说, 在你的 `pom.xml` 文件中, `kotlin` plugin 要放在 `maven-compiler-plugin` 之前,
如下例:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
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
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 增量编译(Incremental compilation)

为了提高编译速度, 你可以打开 Maven 的增量编译模式,
方法是定义 `kotlin.compiler.incremental` 属性:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者, 使用命令行选项 `-Dkotlin.compiler.incremental=true` 来执行你的编译任务.

## 注解处理

详情请参见 [Kotlin 注解处理工具](kapt.html) (`kapt`).

## Jar 文件

假如要创建一个小的 Jar 文件, 其中只包含你的模块中的代码,
那么请将以下代码添加到你的 Maven pom.xml 文件的 `build->plugins` 之下,
其中的 `main.class` 是一个属性, 指向 Kotlin 或 Java 的 main class:

```xml
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

要创建一个自包含的 Jar 文件, 其中包含你的模块中的代码, 以及它依赖的库文件,
那么请将以下代码添加到你的 Maven pom.xml 文件的 `build->plugins` 之下,
其中的 `main.class` 是一个属性, 指向 Kotlin 或 Java 的 main class:

```xml
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

## 指定编译选项

额外的编译器选项和参数, 可以通过 Maven plugin 节点的 `<configuration>` 元素下的标签来设置:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 关闭警告信息 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 对 JSR-305 注解使用 strict 模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

很多编译器选项也可以通过属性来设置:

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>1.0</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支持的编译选项列表如下:

### JVM 和 JS 支持的共通属性

|  名称 |  Maven 属性名  |    描述     |   可以选择的值    |    默认值     |
|------|---------------|-------------|-----------------|--------------|
| `nowarn` | | 不产生警告信息 | true, false | false |
| `languageVersion` | kotlin.compiler.languageVersion | 指定源代码所兼容的 Kotlin 语言版本 | "1.3" (已废弃 DEPRECATED), "1.4" (已废弃 DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9" (实验性功能) |
| `apiVersion` | kotlin.compiler.apiVersion | 只允许使用指定的版本的运行库中的 API | "1.3" (已废弃 DEPRECATED), "1.4" (已废弃 DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9" (实验性功能) |
| `sourceDirs` | | 指定编译对象源代码文件所在的目录 | | 工程的源代码根路径
| `compilerPlugins` | | 允许使用编译器插件 | | []
| `pluginOptions` | | 供编译器插件使用的选项 | | []
| `args` | | 额外的编译器参数 | | []

### JVM 独有的属性

|  名称 |  Maven 属性名  |    描述     |   可以选择的值    |    默认值     |
|------|---------------|-------------|-----------------|--------------|
| `jvmTarget` | `kotlin.compiler.jvmTarget` | 指定编译输出的 JVM 字节码的版本 | "1.8", "9", "10", ..., "19" | "{{ site.data.releases.defaultJvmTargetVersion }}" |
| `jdkHome` | `kotlin.compiler.jdkHome` | 指定一个自定义的 JDK 路径, 添加到 classpath 内, 替代默认的 JAVA_HOME 值 | | |

### JS 独有的属性

|  名称 |  Maven 属性名  |    描述     |   可以选择的值    |    默认值     |
|------|---------------|-------------|-----------------|--------------|
| `outputFile` | | 指定编译输出的 *.js 文件路径 | | |
| `metaInfo` |  | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库 | true, false | true
| `sourceMap` | | 指定是否生成源代码映射文件(source map) | true, false | false
| `sourceMapEmbedSources` | | 指定是否将源代码文件嵌入到源代码映射文件中 | "never", "always", "inlining" | "inlining" |
| `sourceMapPrefix` | | 对源代码映射文件中的路径添加前缀 |  |  |
| `moduleKind` | | 指定编译器生成的 JS 模块类型 | "umd", "commonjs", "amd", "plain" | "umd"

## 使用 BOM

要使用 Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms),
请添加 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依赖项:

```xml
<dependencyManagement>
  <dependencies>  
    <dependency>
      <groupId>org.jetbrains.kotlin</groupId>
      <artifactId>kotlin-bom</artifactId>
      <version>{{ site.data.releases.latest.version }}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

## 生成文档

标准的 Javadoc 生成 plugin (`maven-javadoc-plugin`) 不支持 Kotlin 源代码.
要对 Kotlin 项目生成文档, 请使用 [Dokka](https://github.com/Kotlin/dokka);
相关的配置方法, 请参见 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-maven-plugin).
Dokka 支持混合语言的项目, 可以将文档输出为多种格式, 包括标准的 Javadoc 格式.

## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).
