---
type: doc
layout: reference
category:
title: "Kotlin/Native 开发入门 - 使用 Gradle"
---

# Kotlin/Native 开发入门 - 使用 Gradle

本页面最终更新: 2022/04/07

[Gradle](https://gradle.org) 是在 Java, Android, 和其他开发环境中广泛使用的一个构建系统.
Kotlin/Native 和 Multiplatform 的构建默认使用 Gradle.

虽然大多数 IDE, 包括 [IntelliJ IDEA](https://www.jetbrains.com/idea), 都可以生成对应的 Gradle 文件,
但我们还是来看一下如何手工创建, 以便更好的理解它的工作原理.
如果你更希望使用 IDE, 请阅读 [使用 IntelliJ IDEA](native-get-started.html). 

Gradle 支持 2 种构建脚本:

- Groovy 脚本: `build.gradle` 文件
- Kotlin 脚本: `build.gradle.kts` 文件

Groovy 语言是 Gradle 最优先支持的脚本语言, 
它利用这种语言的动态类型能力和运行时功能.
也可以在 Gradle 脚本中使用 Kotlin. 作为一种静态类型语言, 在需要编译和调试错误时, 它与 IDE 配合更好. 

这 2 种语言都可以使用, 我们的示例程序会同时演示这 2 种语言中的用法.

## 创建项目文件 

首先, 创建一个项目目录. 在这个目录内, 创建 Gradle 构建文件 `build.gradle` 或 `build.gradle.kts`,
内容如下:


<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
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
  gradleVersion = "{{ site.data.releases.gradleVersion }}"
  distributionType = Wrapper.DistributionType.BIN
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
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
  gradleVersion = '{{ site.data.releases.gradleVersion }}'
  distributionType = 'BIN'
}
```

</div>
</div>

然后, 在项目目录内创建一个空的 `settings.gradle` 或 `settings.gradle.kts` 文件.

根据目标平台不同, 使用不同的 [函数](../mpp/mpp-supported-platforms.html) 来创建 Kotlin 编译目标,
比如 `macosX64`, `mingwX64`, `linuxX64`, `iosX64`. 函数名称对应于编译你的代码所针对的目标平台. 
这些函数带一个可选的参数, 指定编译目标名称, 在我们的示例中是 `"native"`. 
指定的 _编译目标名称_ 用来生成项目中的源代码路径和任务名称.  

根据一般约定, 所有的源代码放在 `src/<target name>[Main|Test]/kotlin` 文件夹下,
其中 `main` 放置产品代码, `test` 放置测试代码.
`<target name>` 对应于构建文件中指定的编译目标平台(在我们的示例中是 `native`). 

创建一个文件夹 `src/nativeMain/kotlin`, 在其中放置文件 `hello.kt`, 内容如下:

```kotlin
fun main() {
  println("Hello Kotlin/Native!")
}
```

## 构建项目

在项目的根文件夹, 通过以下命令运行构建: 

`gradle nativeBinaries`

这个命令会创建一个文件夹 `build/bin/native`, 其中包含 2 个子文件夹 `debugExecutable` 和 `releaseExecutable`, 分别包含对应的二进制文件.
默认情况下, 二进制文件的名称与项目文件夹相同. 

## 在 IDE 中打开项目

支持 Gradle 的任何 IDE 都可以打开项目.
对于 [IntelliJ IDEA](https://www.jetbrains.com/idea), 只需要打开项目文件夹, 它会自动检测到这是一个 Kotlin/Native 项目. 

## 下一步做什么?

学习如何 [为真正的 Kotlin/Native 项目编写 Gradle 构建脚本](../mpp/mpp-dsl-reference.html).
