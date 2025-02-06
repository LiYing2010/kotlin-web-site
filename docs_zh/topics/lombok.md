[//]: # (title: Lombok 编译器插件)

> Lombok 编译器插件是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-7112) 提供你的反馈意见.
>
{style="warning"}

使用 Kotlin Lombok 编译器插件, 可以在 Java/Kotlin 混合代码的同一模块内, 在 Kotlin 代码中生成并使用 Java 代码中的 Lombok 声明.
如果你从另一个模块调用这样的声明, 那么你不需要使用这个插件来编译这个模块.

Lombok 编译器插件不能代替 [Lombok](https://projectlombok.org/), 但它能够在 Java/Kotlin 混合代码的模块中帮助 Lombok 正确工作.
因此, 使用这个插件时, 你还是需要象通常那样配置 Lombok.
详情请参见 [如何配置 Lombok 编译器插件](#using-the-lombok-configuration-file).

## 支持的注解 {id="supported-annotations"}

插件支持以下注解:
* `@Getter`, `@Setter`
* `@Builder`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我们还在继续改进这个插件. 关于当前的开发状态, 请参见
[Lombok 编译器插件的 README 文件](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok).

目前, 我们没有支持 `@SuperBuilder` 和 `@Tolerate` 注解的计划.
但如果你在 YouTrack 投票支持
[@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder)
和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)
, 我们可以考虑增加这个功能.

> 如果在 Kotlin 代码中使用 Lombok 注解, Kotlin 编译器会忽略这些注解.
>
{style="note"}

## Gradle {id="gradle"}

在 `build.gradle(.kts)` 文件中添加 `kotlin-plugin-lombok` Gradle 插件:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.lombok") version "%kotlinVersion%"
    id("io.freefair.lombok") version "8.10"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '8.10'
}
```

</tab>
</tabs>

详情请参见 [关于 Lombok 编译器插件使用方法的测试用示例项目](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt).

### 使用 Lombok 配置文件 {id="using-the-lombok-configuration-file"}

如果要使用 [Lombok 配置文件](https://projectlombok.org/features/configuration) `lombok.config`,
你需要设置文件路径, 让插件能够找到它.
路径必须是从模块目录开始的相对路径.
例如, 向你的 `build.gradle(.kts)` 文件添加以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">


```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</tab>
</tabs>

详情请参见 [关于 Lombok 编译器插件和 `lombok.config` 使用方法的测试用示例项目](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig).

## Maven {id="maven"}

要使用 Lombok 编译器插件, 请在 `compilerPlugins` 部分添加插件 `lombok`,
并在 `dependencies` 部分添加依赖项 `kotlin-maven-lombok`.
如果需要使用 [Lombok 配置文件](https://projectlombok.org/features/configuration) `lombok.config`,
请在 `pluginOptions` 部分将它的路径提供给插件. 在 `pom.xml` 文件添加以下内容:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <compilerPlugins>
            <plugin>lombok</plugin>
        </compilerPlugins>
        <pluginOptions>
            <option>lombok:config=${project.basedir}/lombok.config</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-lombok</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</plugin>
```

详情请参见 [关于 Lombok 编译器插件和 `lombok.config` 使用方法的测试用示例项目](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt).

## 和 kapt 一起使用 {id="using-with-kapt"}

默认情况下, [kapt](kapt.md) 编译器插件 运行所有的注解处理器, 并禁止 javac 的注解处理.
要和 kapt 一起运行 [Lombok](https://projectlombok.org/), 请设置 kapt, 允许 javac 的注解处理器继续工作.

如果你使用 Gradle, 请向 `build.gradle(.kts)` 文件添加以下选项:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

如果使用 Maven, 请使用以下设置, 通过 Java 的编译器启动 Lombok:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <annotationProcessorPath>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

如果注解处理器不依赖于 Lombok 生成的代码, Lombok 编译器插件可以和 [kapt](kapt.md) 一起正确工作.

请参见同时使用 kapt 和 Lombok 编译器插件的测试用示例项目:
* 使用 [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt).
* 使用 [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

## 命令行编译器 {id="command-line-compiler"}

在 Kotlin 编译器的二进制文件发布版中可以找到 Lombok 编译器插件的 JAR 文件.
你可以使用 kotlinc 的 `Xplugin` 选项, 指定插件的 JAR 文件路径来加载这个插件:

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

如果你想要使用 `lombok.config` 文件, 请将以下代码中的 `<PATH_TO_CONFIG_FILE>` 替换为你的 `lombok.config` 文件的路径:

```bash
# 插件选项的格式是: "-P plugin:<plugin id>:<key>=<value>".
# 选项可以重复.

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```
