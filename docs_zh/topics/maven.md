---
type: doc
layout: reference
title: "Maven"
---

# Maven

最终更新: {{ site.data.releases.latestDocDate }}

Maven 是一个构建系统, 你可以使用它来构建和管理基于 Java 的项目.

## 配置并启用插件

`kotlin-maven-plugin` 插件用来在 maven 环境中编译 Kotlin 源代码和模块. 目前只支持 Maven v3.

在你的 `pom.xml` 文件中, 可以通过 `kotlin.version` 属性来指定你希望使用的 Kotlin 版本:

```xml
<properties>
    <kotlin.version>{{ site.data.releases.latest.version }}</kotlin.version>
</properties>
```

要启用 `kotlin-maven-plugin`, 请更新你的 `pom.xml` 文件:

```xml
<plugins>
    <plugin>
        <artifactId>kotlin-maven-plugin</artifactId>
        <groupId>org.jetbrains.kotlin</groupId>
        <version>{{ site.data.releases.latest.version }}</version>
    </plugin>
</plugins>
```

### 使用 JDK 17

要使用 JDK 17, 请在你的 `.mvn/jvm.config` 文件中添加:

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 声明仓库

默认情况下, 所有的 Maven 项目都可以使用 `mavenCentral` 仓库.
要访问其他仓库中的 artifact, 请在 `<repositories>` 元素中为各个仓库指定 ID 和 URL:

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果你在 Gradle 项目中将 `mavenLocal()` 声明为仓库, 你可能会在 Gradle 和 Maven 项目之间切换时遇到问题.
> 详情请参见 [声明仓库](gradle/gradle-configure-project.html#declare-repositories).
> {:.note}

## 设置依赖项

Kotlin 有一个内容广泛的标准库, 可以在你的应用程序中使用.
要在你的项目中使用 Kotlin 标准库, 请在你的 `pom.xml` 文件中添加以下依赖项设置:

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

从 Kotlin 1.8.20 开始, 你可以将上面的整个 `<executions>` 元素替换为 `<extensions>true</extensions>`.
启用 `extensions` 会向你的构建自动添加 `compile`, `test-compile`, `kapt`, 和 `test-kapt` 的 `execution`,
绑定到适当的 [生命周期阶段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html).
如果你需要配置某个 `execution`, 那么需要指定它的 ID.
在下一节中, 您可以找到这样的示例.

> 如果有多个构建插件覆盖了默认的生命周期, 而且你启用了 `extensions` 选项, 
> 那么 `<build>` 节中的最后一个插件拥有生命周期设定优先权.
> 在它之前对生命周期设定的所有修改都会被忽略.
> {:.note}

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
            <extensions>true</extensions> <!-- 你可以设置这个选项, 自动获取有关生命周期的信息 -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- 如果你对 plugin 启用了 extensions, 那么可以省略 <goals> 元素 -->
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
                        <goal>test-compile</goal> <!-- 如果你对 plugin 启用了 extensions, 那么可以省略 <goals> 元素 -->
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
                <!-- 替换 default-compile, 因为它会被 Maven 特别处理 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- 替换 default-testCompile, 因为它会被 Maven 特别处理 -->
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

## 启用增量编译(Incremental compilation)

为了提高编译速度, 你可以启用增量编译模式, 方法是添加 `kotlin.compiler.incremental` 属性:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者, 使用命令行选项 `-Dkotlin.compiler.incremental=true` 来执行你的编译任务.

## 配置注解处理

详情请参见 [`kapt` – 在 Maven 中使用](kapt.html#use-in-maven).

## 创建 JAR 文件

假如要创建一个小的 JAR 文件, 其中只包含你的模块中的代码,
那么请将以下代码添加到你的 Maven `pom.xml` 文件的 `build->plugins` 之下,
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

## 创建自包含的(Self-contained) JAR 文件

要创建一个自包含的 JAR 文件, 其中包含你的模块中的代码, 以及它依赖的库文件,
那么请将以下代码添加到你的 Maven `pom.xml` 文件的 `build->plugins` 之下,
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

编译产生的自包含的 JAR 文件, 可以直接传递给一个 JRE, 然后就可以运行你的应用程序了:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 指定编译器选项

额外的编译器选项和参数, 可以通过 Maven plugin 节点的 `<configuration>` 元素下的标签来设置:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果你想要为你的构建自动添加 executions, 可以添加这个选项 -->
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
        <kotlin.compiler.languageVersion>1.9</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支持的编译选项列表如下:

### JVM 独有的属性

| 名称                | Maven 属性名                       | 描述                                                  | 可以选择的值                                                                                                          | 默认值                                                |
|-------------------|---------------------------------|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `nowarn`          |                                 | 不产生警告信息                                             | true, false                                                                                                     | false                                              |
| `languageVersion` | kotlin.compiler.languageVersion | 指定源代码所兼容的 Kotlin 语言版本                               | "1.3" (已废弃 DEPRECATED), "1.4" (已废弃 DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9", "2.0" (实验性功能), "2.1" (实验性功能) |
| `apiVersion`      | kotlin.compiler.apiVersion      | 只允许使用指定的版本的运行库中的 API                                | "1.3" (已废弃 DEPRECATED), "1.4" (已废弃 DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9", "2.0" (实验性功能), "2.1" (实验性功能) |
| `sourceDirs`      |                                 | 指定编译对象源代码文件所在的目录                                    |                                                                                                                 | 工程的源代码根路径                                          |
| `compilerPlugins` |                                 | 允许使用编译器插件                                           |                                                                                                                 | []                                                 |
| `pluginOptions`   |                                 | 供编译器插件使用的选项                                         |                                                                                                                 | []                                                 |
| `args`            |                                 | 额外的编译器参数                                            |                                                                                                                 | []                                                 |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 指定编译输出的 JVM 字节码的版本                                  | "1.8", "9", "10", ..., "21"                                                                                     | "{{ site.data.releases.defaultJvmTargetVersion }}" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 指定一个自定义的 JDK 路径, 添加到 classpath 内, 替代默认的 JAVA_HOME 值 |                                                                                                                 |                                                    |

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
要对 Kotlin 项目生成文档, 请使用 [Dokka](https://github.com/Kotlin/dokka).
Dokka 支持混合语言的项目, 可以将文档输出为多种格式, 包括标准的 Javadoc 格式.
关于如何在你的 Maven 项目中配置 Dokka, 请参见 [Maven](dokka/runners/dokka-maven.html).

## 启用 OSGi 支持

参见 [如何在你的 Maven 项目中启用 OSGi 支持](kotlin-osgi.html#maven).
