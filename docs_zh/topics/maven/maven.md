[//]: # (title: Maven)

Maven 是一个构建系统, 帮助你管理纯 Kotlin 项目, 或 Kotlin/Java 混合项目, 并自动化构建过程.
它适用于基于 JVM 的项目, 能够下载需要的的依赖项, 编译并打包你的代码.
关于 Maven 的基础知识和详细信息, 请参见 [Maven](https://maven.apache.org/) 网站.

使用 Kotlin Maven 项目时, 一般的工作流程如下:

1. [配置你的 Java 或 Kotlin 项目](maven-configure-project.md).
2. [声明仓库](maven-set-dependencies.md#declare-repositories).
3. [设置项目的依赖项](maven-set-dependencies.md).
4. [配置 Kotlin 编译器](maven-kotlin-compiler.md).
5. [打包你的应用程序](maven-compile-package.md).

你也可以遵照我们的逐步教程来开始:

* [配置 Java 项目以使用 Kotlin](mixing-java-kotlin-intellij.md)
* [使用 Kotlin 和 JUnit 测试你的 Java Maven 项目](jvm-test-using-junit.md)

> 你可以查看我们的公开 [示例项目](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete),
> 这个示例已经为 Kotlin/Java 混合项目设置好了 Maven 和 Gradle 两种构建文件.
>
{style="tip"}

## 下一步做什么? {id="what-s-next"}

* **改善调试体验**, 使用 [`power-assert` plugin](power-assert.md#maven).
* **测量测试覆盖率并生成测试报告**, 使用 [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/).
* **配置注解处理**, 使用 [`kapt` plugin](kapt.md#use-in-maven).
* **生成文档**, 使用 [Dokka 文档引擎](dokka-maven.md).
  它支持混合语言的项目, 可以生成多种格式的输出, 包括标准的 Javadoc.
* **启用 OSGi 支持**, 添加 [`kotlin-osgi-bundle`](kotlin-osgi.md#maven).
