[//]: # (title: Gradle 与 Kotlin/JVM 入门)

本教程演示如何使用 IntelliJ IDEA 和 Gradle 来创建一个 JVM 控制台应用程序.

开始之前, 首先请下载病安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## 创建项目

1. 在 IntelliJ IDEA 中, 选择 **File** | **New** | **Project**.
2. 在左侧面板中, 选择 **Kotlin**.
3. 输入新项目的名称, 如果需要的话, 修改它的位置.

   > 选择 **Create Git repository** 选项, 可以将新项目添加到版本管理系统.
   > 你也可以在创建项目之后再做.
   >
   {style="tip"}

   ![创建一个控制台应用程序](jvm-new-gradle-project.png){width=700}

4. 选择 **Gradle** 构建系统.
5. 在 **JDK** 列表中, 选择你的项目希望使用的 [JDK](https://www.oracle.com/java/technologies/downloads/).
    * 如果在你的计算机上已经安装了 JDK, 但在 IDE 中没有定义它, 请选择 **Add JDK**, 并指定 JDK home 目录的路径.
    * 如果在你的计算机上还没有安装需要的 JDK, 请选择 **Download JDK**.

6. 选择 **Kotlin** 作为 Gradle DSL.
7. 启用 **Add sample code** 选项, 创建一个文件, 其中包含 `"Hello World!"` 示例程序.

   > 你也可以启用 **Generate code with onboarding tips** 选项, 向你的示例代码添加一些有用的注释.
   >
   {style="tip"}

8. 点击 **Create**.

这样你就成功的创建了 Gradle 项目!

#### 为你的项目指定 Gradle 版本 {initial-collapse-state="collapsed" collapsible="true"}

你可以在 **Advanced Settings** 中为你的项目明确指定 Gradle 版本,
可以使用 Gradle Wrapper, 也可以使用本地安装的 Gradle:

* **使用 Gradle Wrapper:**
  1. 在 **Gradle distribution** 选项列表中, 选择 **Wrapper**.
  2. 取消 **Auto-select** 选择框.
  3. 在 **Gradle version** 选项列表中, 选择你的 Gradle 版本.
* **使用本地安装的 Gradle:**
  1. 在 **Gradle distribution** 选项列表中, 选择 **Local installation**.
  2. 对 **Gradle location**, 请指定你的本地 local Gradle 版本的路径.

   ![高级设置](jvm-new-gradle-project-advanced.png){width=700}

## 查看构建脚本 {id="explore-the-build-script"}

打开 `build.gradle.kts` 文件. 这是 Gradle 的 Kotlin 构建脚本, 包含 Kotlin 相关的 artifact 以及应用程序需要的其他部分:

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // 使用的 Kotlin 版本
}

group = "org.example" // 公司名, 比如, `org.jetbrains`
version = "1.0-SNAPSHOT" // 构建后的 artifact 的版本

repositories { // 依赖项的下载源仓库. 参见 1️⃣
    mavenCentral() // Maven Central Repository. 参见 2️⃣
}

dependencies { // 你想要使用的所有库. 参见 3️⃣
    // 复制你在仓库中找到的依赖项名称
    testImplementation(kotlin("test")) // Kotlin test 库
}

tasks.test { // 参见 4️⃣
    useJUnitPlatform() // 用于测试的 JUnitPlatform. 参见 5️⃣
}
```

* 1️⃣ 参见 [依赖项的下载源仓库](https://docs.gradle.org/current/userguide/declaring_repositories.html).
* 2️⃣ [Maven Central Repository](https://central.sonatype.com/).
  也可以使用 [Google 的 Maven repository](https://maven.google.com/),
  或你的公司的私有仓库.
* 3️⃣ 参见 [声明依赖项](https://docs.gradle.org/current/userguide/declaring_dependencies.html).
* 4️⃣ 参见 [构建任务(Task)](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html).
* 5️⃣ [用于测试的 JUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform).

你可以看到, Gradle 构建文件中还添加了几个 Kotlin 相关的 artifact:

1. 在 `plugins {}` 代码段中, 有 `kotlin("jvm")` artifact.
   这个 plugin 定义项目中使用的 Kotlin 版本.

2. 在 `dependencies {}` 代码段中, 有 `testImplementation(kotlin("test"))`.
   详情请参见 [设置测试库的依赖项](gradle-configure-project.md#set-dependencies-on-test-libraries).

## 运行应用程序

1. 选择 **View** | **Tool Windows** | **Gradle**, 打开 Gradle 窗口:

   ![带有 main fun 的 Main.kt ](jvm-gradle-view-build.png){width=700}

2. 执行 `Tasks\build\` 中的 **build** Gradle 任务. 在 **Build** 窗口中, 会出现 `BUILD SUCCESSFUL` 消息,
   表示 Gradle 成功的构建了应用程序.

3. 在 `src/main/kotlin` 中, 打开 `Main.kt` 文件:
    * `src` 目录包含 Kotlin 源代码文件和资源.
    * `Main.kt` 文件包含示例代码, 打印输出 `Hello World!`.

4. 点击编辑器侧栏中的绿色 **Run** 图标, 然后选择 **Run 'MainKt'**, 运行应用程序.

   ![运行一个控制台应用程序](jvm-run-app-gradle.png){width=350}

你可以在 **Run** 工具窗口看到结果:

![程序运行的输出结果](jvm-output-gradle.png){width=600}

恭喜! 你成功的运行了你的第一个 Kotlin 应用程序.

## 下一步做什么?

学习:
* [Gradle 构建文件属性](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A).
* [针对不同的平台, 设置库的依赖项](gradle-configure-project.md).
* [编译器选项, 以及如何传递编译器选项](gradle-compiler-options.md).
* [增量编译, 缓存, 构建报告, 以及 Kotlin Daemon](gradle-compilation-and-caches.md).
