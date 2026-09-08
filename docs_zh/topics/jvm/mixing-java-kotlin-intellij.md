[//]: # (title: 教程 - 向 Java 项目添加 Kotlin)

<web-summary>将 Kotlin 集成到现有的 Java 项目中 - 配置 Maven 或 Gradle 构建文件, 组织源代码文件, 并在 IntelliJ IDEA 中将 Java 代码转换为 Kotlin.</web-summary>

Kotlin 与 Java 完全兼容互通, 因此你可以将 Kotlin 逐步引入到现有的 Java 项目中, 而不需要重写所有内容.

在这篇教程中, 你将学习如何:

* 设置 Maven 或 Gradle 构建工具, 编译 Java 和 Kotlin 代码.
* 在项目目录中组织 Java 和 Kotlin 源代码文件.
* 使用 IntelliJ IDEA 将 Java 文件转换为 Kotlin.

> 你可以使用任何现有的 Java 项目来完成本教程, 也可以克隆我们的公开 [示例项目](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete),
> 其中已经设置好了 Maven 和 Gradle 构建文件.
>
> 你也可以使用我们 [已准备好的技能](https://github.com/Kotlin/kotlin-agent-skills/blob/main/skills/kotlin-tooling-java-to-kotlin/SKILL.md),
> 将转换工作交给你选择的 AI Agent 来完成. 请注意, AI 处理的结果并不完全可预测.
>
{style="tip"}

## 项目配置 {id="project-configuration"}

要向 Java 项目添加 Kotlin, 你需要根据所使用的构建工具, 将项目配置为同时使用 Kotlin 和 Java.

项目配置确保 Kotlin 和 Java 代码都能正确编译, 并且可以无缝地相互引用.

### Maven {id="maven"}

> 从 **IntelliJ IDEA 2025.3** 开始, 当你向基于 Maven 的 Java 项目添加第一个 Kotlin 文件时,
> IDE 会自动更新你的 `pom.xml` 文件, 添加 Kotlin Maven plugin 和标准的依赖项.
> 你仍然可以手动配置, 自定义版本或构建阶段.
>
{style="note"}

要在 Maven 项目中同时使用 Kotlin 和 Java, 请在 `pom.xml` 文件中应用 Kotlin Maven plugin, 并添加 Kotlin 依赖项:

1. 在 `<properties>` 部分, 添加 Kotlin 版本属性:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. 在 `<dependencies>` 部分, 向 `<plugins>` 部分添加所需的依赖项:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,55"}

3. 在 `<build><plugins>` 部分, 添加 Kotlin plugin:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="57-58,95-96,99-107"}

   在 Kotlin Maven plugin 中启用 `<extensions>true</extensions>` 有助于:

   * 向项目自动添加 `kotlin-stdlib` 依赖项.
   * 配置执行阶段, 先编译 Kotlin, 然后编译 Java.
   * 在 Java 代码中引用 Kotlin 代码, 或者相反.
   * 自动将 JVM 目标版本与 Java 编译器版本对齐.

   使用带有 extensions 的 Kotlin Maven plugin 时, 不需要在 `<build><pluginManagement>` 部分单独配置 `maven-compiler-plugin`.

4. 在 IDE 中重新加载 Maven 项目.
5. 运行测试, 验证配置:

    ```bash
    ./mvnw clean test
    ```

### Gradle {id="gradle"}

要在 Gradle 项目中同时使用 Kotlin 和 Java, 请在 `build.gradle.kts` 文件中应用 Kotlin JVM plugin, 并添加 Kotlin 依赖项:

1. 在 `plugins {}` 代码块中, 添加 Kotlin JVM plugin:

    ```kotlin
    plugins {
        // 其他 plugin
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2. 设置 JVM 工具链版本, 与你的 Java 版本匹配:

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   这个设置会确保 Kotlin 使用与 Java 代码相同的 JDK 版本.

3. 在 `dependencies {}` 代码块中, 添加 `kotlin("test")` 库, 这个库提供 Kotlin 测试工具并与 JUnit 集成:

    ```kotlin
    dependencies {
        // 其他依赖项

        testImplementation(kotlin("test"))
        // 其他测试依赖项
    }
    ```

4. 在 IDE 中重新加载 Gradle 项目.
5. 运行测试, 验证配置:

    ```bash
    ./gradlew clean test
    ```

## 项目结构 {id="project-structure"}

通过这种配置, 你可以在同一个源代码目录中混合使用 Java 和 Kotlin 文件:

```none
src/
  ├── main/
  │    ├── java/          # Java 和 Kotlin 生产代码
  │    └── kotlin/        # 额外的 Kotlin 生产代码(可选)
  └── test/
       ├── java/          # Java 和 Kotlin 测试代码
       └── kotlin/        # 额外的 Kotlin 测试代码(可选)
```

你可以手动创建这些目录, 也可以在添加第一个 Kotlin 文件时让 IntelliJ IDEA 自动创建.

Kotlin 插件会自动识别 `src/main/java` 和 `src/test/java` 目录,
因此你可以将 `.kt` 和 `.java` 文件放在同一目录中.

## 将 Java 文件转换为 Kotlin {id="convert-java-files-to-kotlin"}

Kotlin plugin 还附带了一个 Java 到 Kotlin 的转换器(_J2K_), 可以将 Java 文件自动转换为 Kotlin.
要对文件使用 J2K, 请在其右键菜单中, 或在 IntelliJ IDEA 的 **Code** 菜单中,
点击 **Convert Java File to Kotlin File**.

![将 Java 文件转换为 Kotlin](convert-java-to-kotlin.png){width=500}

虽然转换器并不能保证完全正确, 但它能很好地将大多数样板代码从 Java 转换为 Kotlin.
但是, 有时仍然需要一些手动调整.

## 探索编译器 plugin {id="explore-compiler-plugins" initial-collapse-state="collapsed" collapsible="true"}

如果你有一个更加复杂的项目, 使用了 [Spring](https://spring.io/) 或 Java Persistence API (JPA),
你可以使用 Kotlin 编译器 plugin, 这些 plugin 会自动使 Kotlin 的语言特性适应框架的要求, 减少样板代码:

* **[`all-open`](all-open-plugin.md)** plugin,
  在使用特定注解时会自动使类及其成员变为 `open`.
  这对于 Spring 等要求类为非 final 的框架特别有用.

  对于 Spring, 你可以使用专用的 [`kotlin-spring`](all-open-plugin.md#spring-support) plugin, 它是 `all-open` 的封装.
  它会自动指定 Spring 注解.
* **[`no-arg`](no-arg-plugin.md)** plugin,
  为带有特定注解的类生成额外的无参数构造器.
  让 JPA 能够实例化那些原本没有默认构造器的类.

  你也可以使用 [`kotlin-jpa`](no-arg-plugin.md#jpa-support) plugin, 它是 `no-arg` 的封装.
  它会自动指定 no-arg 注解.
* **[`power-assert`](power-assert.md)** plugin,
  为断言提供包含上下文信息的详细失败消息, 改善调试体验.
  它会显示中间值, 帮助你理解测试失败的原因.

## 下一步 {id="next-step"}

在 Java 项目中开始使用 Kotlin 最简单的方法, 是先添加 Kotlin 测试:

[向你的 Java 项目添加第一个 Kotlin 测试](jvm-test-using-junit.md)

### 参见 {id="see-also"}

* [Kotlin 与 Java 互操作的详细文档](java-to-kotlin-interop.md)
* [Maven 构建配置参考](maven.md)
