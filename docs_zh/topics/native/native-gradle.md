[//]: # (title: Kotlin/Native 开发入门 - 使用 Gradle)

[Gradle](https://gradle.org) 是在 Java, Android, 和其他开发环境中广泛使用的一个构建系统.
Kotlin/Native 和 Multiplatform 的构建默认使用 Gradle.

虽然大多数 IDE, 包括 [IntelliJ IDEA](https://www.jetbrains.com/idea), 都可以生成需要的 Gradle 文件,
但本教程还是介绍如何手工创建, 以便更好的理解工作原理.

开始之前, 请安装 [Gradle](https://gradle.org/install/) 的最新版本.

> 如果你更希望使用 IDE, 请阅读教程 [使用 IntelliJ IDEA](native-get-started.md).
>
{style="note"}

## 创建项目文件

1. 创建一个项目目录. 在这个目录内, 创建 Gradle 构建文件 `build.gradle(.kts)`, 内容如下:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosX64("native") { // 用于 macOS 环境
        // linuxX64("native") // 用于 Linux 环境
        // mingwX64("native") // 用于 Windows 环境
            binaries {
                executable()
            }
        }
    }

    tasks.withType<Wrapper> {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    // build.gradle
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosX64('native') { // 用于 macOS 环境
        // linuxX64('native') // 用于 Linux 环境
        // mingwX64('native') // 用于 Windows 环境
            binaries {
                executable()
            }
        }
    }

    wrapper {
        gradleVersion = '%gradleVersion%'
        distributionType = 'BIN'
    }
    ```

    </tab>
    </tabs>

   你可以使用各种 [预定义编译目标](native-target-support.md),
   比如 `macosX64`, `mingwX64`, `linuxX64`, `iosX64`,
   来定义对应的编译目标平台. 预定义的名称描述了编译你的代码所针对的目标平台.
   这些预定义编译目标接受一个可选的参数, 表示编译目标名称, 在这个例子中是 `native`.
   编译目标名称用来在项目中生成源代码路径和 Gradle task 名称.

2. 在项目目录内创建一个空的 `settings.gradle` 或 `settings.gradle.kts` 文件.

3. 创建一个目录 `src/nativeMain/kotlin`, 在其中创建文件 `hello.kt`, 内容如下:

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

    根据一般约定, 所有的源代码放在 `src/<target name>[Main|Test]/kotlin` 目录下,
    其中 `main` 放置产品代码, `test` 放置测试代码.
    `<target name>` 对应于构建文件中指定的编译目标平台(在我们的示例中是 `native`).

现在你可以构建你的项目并运行应用程序了.

## 构建并运行应用程序

1. 在项目的根目录, 通过以下命令运行构建:

   ```bash
   gradle nativeBinaries
   ```

   这个命令会创建 `build/bin/native` 目录, 其中包含 2 个子目录: `debugExecutable` 和 `releaseExecutable`. 分别包含对应的二进制文件.

   默认情况下, 二进制文件的名称与项目目录相同.

2. 要运行项目, 请执行以下命令:

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

   终端会输出 "Hello, Kotlin/Native!".

## 在 IDE 中打开项目

现在你可以在支持 Gradle 的任何 IDE 中打开你的项目. 如果你使用 IntelliJ IDEA:

1. 选择 **File** | **Open...**.
2. 选择项目目录, 并点击 **Open**.
   IntelliJ IDEA 会自动检测到这是一个 Kotlin/Native 项目.

> 如果你的项目发生任何问题, IntelliJ IDEA 会在 **Build** 页面显示错误信息.
>
{style="note"}

## 下一步做什么?

学习如何 [为真正的 Kotlin/Native 项目编写 Gradle 构建脚本](multiplatform-dsl-reference.md).
