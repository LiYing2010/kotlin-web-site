[//]: # (title: 从命令行运行 KSP)

大多数项目通过 Gradle plugin 使用 KSP, plugin 会在编译期间自动运行 KSP.
你也可以从命令行使用 KSP, 但通常只在与其他构建系统集成, 开发处理器, 测试, 或调试时, 才会这样做.

KSP 是 JVM 应用程序, 因此请从命令行使用 `java` 命令启动 KSP, 并提供类路径和必要参数:

```bash
java -cp <classpath> <mainclass> <options> <processor>
```

| 参数          | 说明                             |
|---------------|----------------------------------|
| `<classpath>` | KSP 运行时 JAR 以及依赖项的路径. |
| `<mainclass>` | 针对特定平台的 KSP 入口之一.     |
| `<options>`   | KSP 命令行选项.                  |
| `<processor>` | 处理器 JAR 的路径.               |

## 类路径 {id="classpath"}

与 Gradle plugin 不同, `java` 命令不会自动解析依赖项. 必须在类路径中提供 KSP 运行时 JAR, 以及它们的依赖项.

从 [KSP 发布页面](https://github.com/google/ksp/releases/tag/%kspVersion%) 下载 `artifacts.zip`.
这个压缩包包含需要的 KSP JAR 文件:

* `symbol-processing-aa-%kspVersion%.jar`

* `symbol-processing-common-deps-%kspVersion%.jar`

* `symbol-processing-api-%kspVersion%.jar`

还必须包含来自 Maven 仓库的以下运行时依赖项:

* [`kotlin-stdlib-%kotlinVersion%.jar`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-stdlib)

* [`kotlinx-coroutines-core-jvm-%coroutinesVersion%.jar`](https://mvnrepository.com/artifact/org.jetbrains.kotlinx/kotlinx-coroutines-core-jvm)

## 主类 {id="main-class"}

由于 KSP 是 JVM 应用程序, 启动时必须指定主类. 对每个支持的平台, KSP 提供了不同的入口:

| 入口类          | 平台                                                          |
|-----------------|---------------------------------------------------------------|
| `KSPJvmMain`    | Kotlin/JVM 和 Android                                         |
| `KSPJsMain`     | Kotlin/JS                                                     |
| `KSPNativeMain` | Kotlin/Native 目标平台, 例如 iOS, macOS, Linux, 以及 Windows. |
| `KSPCommonMain` | Kotlin Multiplatform 项目中的 common 编译任务                 |

使用 `java` 启动 KSP 时, 请指定主类的完全限定名称. 例如:

```bash
java -cp <classpath> com.google.devtools.ksp.cmdline.KSPJvmMain <options> <processor>
```

下面的示例使用 `KSPJvmMain`, 为 JVM 目标运行 KSP:

```bash
java -cp \
    symbol-processing-aa-%kspVersion%.jar:symbol-processing-common-deps-%kspVersion%.jar:symbol-processing-api-%kspVersion%.jar:kotlin-stdlib-2.3.20.jar:kotlinx-coroutines-core-jvm-1.10.2.jar \
    com.google.devtools.ksp.cmdline.KSPJvmMain \
    -language-version=2.0 \
    -api-version=2.0 \
    -jvm-target=11 \
    -module-name=main \
    -source-roots=project_dir/src/kotlin/main \
    -project-base-dir=project_dir/ \
    -output-base-dir=project_dir/build/ \
    -caches-dir=project_dir/build/caches/ \
    -class-output-dir=project_dir/build/out/main/classes \
    -kotlin-output-dir=project_dir/build/out/main/kotlin/ \
    -java-output-dir=project_dir/build/out/main/java/ \
    -resource-output-dir=project_dir/build/out/main/res/ \
    path/to/processor.jar
```

## 选项 {id="options"}

从命令行运行 KSP 时, 需要以下选项:

| 选项                          | 说明                                                                            |
|-------------------------------|---------------------------------------------------------------------------------|
| `-language-version=<version>` | 项目中使用的 [Kotlin 语言版本](compiler-reference.md#language-version-version). |
| `-api-version=<version>`      | [Kotlin API 版本](compiler-reference.md#api-version-version).                   |
| `-jvm-target=<version>`       | 目标 JVM 版本.                                                                  |
| `-module-name=<name>`         | 模块名称.                                                                       |
| `-source-roots=<paths>`       | 源代码根目录. 如果有多个目录, 请用冒号分隔.                                     |
| `-project-base-dir=<path>`    | 项目根目录.                                                                     |
| `-output-base-dir=<path>`     | KSP 输出的根目录.                                                               |
| `-caches-dir=<path>`          | KSP 缓存目录.                                                                   |
| `-java-output-dir=<path>`     | 生成的 Java 文件所在目录.                                                       |
| `-class-output-dir=<path>`    | 生成的 class 文件所在目录.                                                      |
| `-kotlin-output-dir=<path>`   | 生成的 Kotlin 文件所在目录.                                                     |
| `-resource-output-dir=<path>` | 生成的资源文件所在目录.                                                         |
| `<processor>`                 | 处理器类路径.                                                                   |

### 其他有用的选项 {id="other-useful-options"}

* `-libraries=<path>`: 用于解析源文件所引用的依赖项的类路径. 通常是模块的编译类路径.

* `-jdk-home=<path>`: JDK 主目录. 处理器在解析 Java 符号, 以及访问 Java 标准库时使用.

* `-friends=<path>`: 当前模块的友元模块(Friend Module)类路径. 通常是模块的友元类路径.
  详情请参见 [友元模块](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kotlin-compile/friend-paths.html).

> KSP 还支持 `-Dksp.logging` JVM 系统属性, 用于设置日志级别.
> 有效值为 `error`, `warn` 或 `warning`, `info`, 以及 `debug`. 默认值是 `warn`. KSP 会将不支持的值视为 `warn`.
>
{style="tip"}

要查看完整的选项列表, 请运行以下命令:

```bash
java -cp <classpath> <mainclass> -h
```
