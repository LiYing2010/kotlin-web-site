[//]: # (title: 为你的 Maven 项目配置 Kotlin 编译器)

`kotlin-maven-plugin` 允许你为 Maven 项目配置 Kotlin 编译器.
你可以指定编译器选项, 选择执行策略, 并启用增量编译.

## 指定编译器选项 {id="specify-compiler-options"}

你可以在 Kotlin Maven plugin 节点的 `<configuration>` 部分, 以元素的形式指定编译器的额外选项和参数:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果你希望向构建中自动添加执行项, 请设置为 true -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn> <!-- 禁止警告 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 为 JSR-305 注解启用 strict 模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

很多选项也可以通过属性来配置:

```xml
<project>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支持以下属性:

### JVM 专用属性 {id="attributes-specific-to-jvm"}

| 名称                | 属性名称                              | 说明                                                                                        | 可选的值                                             | 默认值                         |
|-------------------|-----------------------------------|-------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                   | 不生成警告                                                                                     | true, false                                      | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | 与指定的 Kotlin 版本保持源代码级兼容                                                                    | "2.0", "2.1", "2.2", "2.3", "2.4", "2.5" (试验性功能) |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 只允许使用从指定版本开始提供的内置库的声明                                                                     | "2.0", "2.1", "2.2", "2.3", "2.4", "2.5" (试验性功能) |                             |
| `sourceDirs`      |                                   | 包含需要编译的源代码文件的目录                                                                           |                                                  | 项目的源代码根目录                   |
| `compilerPlugins` |                                   | 启用的编译器 plugin                                                                             |                                                  | []                          |
| `pluginOptions`   |                                   | 编译器 plugin 的选项                                                                            |                                                  | []                          |
| `args`            |                                   | 额外的编译器参数                                                                                  |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | 生成的字节码的目标 JVM 版本. 只控制输出的字节码版本, 不限制你的代码可以使用哪些 JDK API.                                     | "1.8", "9", "10", ..., "26"                      | "%defaultJvmTargetVersion%" |
| `jdkRelease`      | `kotlin.compiler.jdkRelease`      | 目标 JVM 版本. 控制字节码版本, 并将可用的 API 限制为指定的 JDK 版本, 防止意外使用更新的 API. 等同于 Java 的 `--release` 编译器选项. | "1.8", "9", "10", ..., "26"                      |                             |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | 将指定位置的自定义 JDK 添加到 classpath 中, 替换默认的 `JAVA_HOME`                                          |                                                  |                             |
| `jdkToolchain`    | `kotlin.compiler.jdkToolchain`    | 设置工具链中要使用的 JDK 版本. 只影响 Kotlin 编译                                                          |                                                  |

## 选择执行策略 {id="choose-execution-strategy"}

<snippet id="maven-configure-execution-strategy">

默认情况下, Maven 使用 Kotlin Daemon 编译器执行策略.
要切换到 "in process" 策略, 请在你的 `pom.xml` 文件中设置以下属性:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

</snippet>

关于不同执行策略的更多信息, 请参见 [编译器执行策略](compiler-execution-strategy.md).

## 启用增量编译 {id="enable-incremental-compilation"}

为了加快构建速度, 你可以添加 `kotlin.compiler.incremental` 属性, 启用增量编译:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者, 也可以使用 `-Dkotlin.compiler.incremental=true` 选项来运行构建.

## 下一步做什么? {id="what-s-next"}

[打包你的项目](maven-compile-package.md)
