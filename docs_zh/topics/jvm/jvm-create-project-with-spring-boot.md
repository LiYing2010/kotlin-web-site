[//]: # (title: 使用 Kotlin 创建 Spring Boot 项目)

最终更新: %latestDocDate%

<tldr>
    <p>
        这是 <strong>Spring Boot 和 Kotlin 入门</strong> 教程的第 1 部分:
    </p><br/>
    <p>
        <img src="icon-1.svg" width="20" alt="第 1 步"/> <strong>使用 Kotlin 创建 Spring Boot 项目</strong> <br/>
        <img src="icon-2-todo.svg" width="20" alt="第 2 步"/> 向 Spring Boot 项目添加数据类 <br/>
        <img src="icon-3-todo.svg" width="20" alt="第 3 步"/> 为 Spring Boot 项目添加数据库支持<br/>
        <img src="icon-4-todo.svg" width="20" alt="第 4 步"/> 使用 Spring Data CrudRepository 进行数据库访问<br/>
    </p>
</tldr>

本教程的第 1 部分向你演示如何在 IntelliJ IDEA 中使用 Project Wizard 创建一个 Spring Boot 项目.

## 开始之前的准备

下载并安装 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html) 的最新版.

> 如果你使用的是 IntelliJ IDEA Community Edition 或其他 IDE, 你可以使用 [基于 web 页面的项目生成器](https://start.spring.io) 来生成 Spring Boot 项目.
>
{style="note"}

## 创建 Spring Boot 项目 {id="create-a-spring-boot-project"}

使用 IntelliJ IDEA Ultimate Edition 中的 Project Wizard, 创建新的使用 Kotlin 的 Spring Boot 项目:

> 你也可以使用 [IntelliJ IDEA 和 Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html) 来创建新项目.
>
{style="note"}

1. 在 IntelliJ IDEA 中, 选择 **File** | **New** | **Project**. 
2. 在左侧面板中, 选择 **New Project** | **Spring Initializr**.
3. 在 Project Wizard 窗口中, 指定以下项目和选项:
   
   * **Name**: demo
   * **Language**: Kotlin
   * **Build system**: Gradle
   * **JDK**: Java 17 JDK
     
     > 本教程使用 **Amazon Corretto version 18**.
     >
     {style="note"}
   
   * **Java**: 17

   ![创建 Spring Boot 项目](create-spring-boot-project.png){width=800}

4. 确认填写了所有的项目, 然后点击 **Next**.

5. 选择以下依赖项, 本教程将会需要它们:

   * **Web / Spring Web**
   * **SQL / Spring Data JDBC**
   * **SQL / H2 Database**

   ![设置 Spring Boot 项目](set-up-spring-boot-project.png){width=800}

6. 点击 **Create**, 生成并设置项目.

   > IDE 将会生成并打开新的项目. 可能需要一些时间来下载并导入项目的依赖项.
   >
   {style="tip"}

7. 之后, 你可以在 **Project view** 中看到下面的项目结构:

   ![设置 Spring Boot 项目](spring-boot-project-view.png){width=400}

   生成的 Gradle 项目符合 Maven 的标注目录布局:
   * 在 `main/kotlin` 文件夹下是属于应用程序的包和类.
   * 应用程序的入口点是 `DemoApplication.kt` 文件的 `main()` 方法.

## 查看项目的 Gradle 构建文件 {id="explore-the-project-gradle-build-file" collapsible="true"}

打开 `build.gradle.kts` 文件: 它是 Gradle Kotlin 构建脚本, 包含应用程序需要的依赖项目列表.

Gradle 文件是用于 Spring Boot 的标准内容, 但它也包含必须的 Kotlin 依赖项, 包括 kotlin-spring Gradle plugin – `kotlin("plugin.spring")`.

下面是完整的脚本, 包括各部分和依赖项的解释:

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile // 用于下面的 `KotlinCompile` task

plugins {
    id("org.springframework.boot") version "3.1.2"
    id("io.spring.dependency-management") version "1.1.2"
    kotlin("jvm") version "{{ site.data.releases.latest.version }}" // 使用的 Kotlin 版本
    kotlin("plugin.spring") version "{{ site.data.releases.latest.version }}" // Kotlin Spring plugin
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies { 
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc") 
    implementation("org.springframework.boot:spring-boot-starter-web") 
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin") // Jackson 扩展, 用于在 Kotlin 中使用 JSON
    implementation("org.jetbrains.kotlin:kotlin-reflect") // Kotlin 反射库, 使用 Spring 时需要
    runtimeOnly("com.h2database:h2") 
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> { // `KotlinCompile` task 的设置
    kotlinOptions { // Kotlin 编译器选项
        freeCompilerArgs = listOf("-Xjsr305=strict") // `-Xjsr305=strict` 对 JSR-305 注解启用 strict 模式
        jvmTarget = "17" // 这个选项指定生成的 JVM 字节码的目标版本
    }
}

tasks.withType<Test> { 
    useJUnitPlatform()
}
```

你可以看到, Gradle 构建文件中添加了几个与 Kotlin 相关的库:

1. 在 `plugins` 代码段中, 有 2 个 Kotlin 库:

   * `kotlin("jvm")` – 这个 plugin 定义在项目中使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 编译器 plugin, 用于向 Kotlin 类添加 `open` 修饰符,
     使它们能够与 Spring Framework 中的功能兼容

2. 在 `dependencies` 代码段中, 有几个 Kotlin 相关的模块:

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 这个模块支持Kotlin 类和数据类的序列化和反序列化
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射库

3. 在依赖项之后, 你可以看到 `KotlinCompile` task 配置模块.
   在这里你可以向编译器添加额外的参数, 来启用或禁用某些语言特性.

## 查看生成的 Spring Boot 应用程序

打开 `DemoApplication.kt` 文件:

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

<deflist collapsible="true">
   <def title="声明类 – DemoApplication 类">
      <p>
        在包声明和 import 语句之后, 你可以看到第一个类声明, <code>class DemoApplication</code>.
      </p>
      <p>
        在 Kotlin 中, 如果一个类不包含任何成员 (属性或函数), 你可以直接省略掉类的主体部分 (<code>{}</code>).
      </p>
   </def>
   <def title="@SpringBootApplication 注解">
      <p>
        <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplication 注解</code></a>
        在 Spring Boot 应用程序中是一个很方便的注解.
        它会启用 Spring Boot 的
        <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自动配置</a>,
        <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">组件扫描</a>,
        而且可以对 "应用程序类" 定义额外的配置.".
      </p>
   </def>
   <def title="程序入口点 – main()">
      <p>
        <a href="basic-syntax.md#program-entry-point"><code>main()</code></a> 函数是应用程序的入口点.
      </p>
      <p>
        它声明为在 <code>DemoApplication</code> 类之外的一个
        <a href="functions.md#function-scope">顶层函数</a>.
        <code>main()</code> 函数调用 Spring 的 <code>runApplication(*args)</code> 函数,
        使用 Spring Framework 来启动应用程序.
      </p>
   </def>
   <def title="可变参数 – args: Array&lt;String&gt;">
      <p>
        查看 <code>runApplication()</code> 函数的声明, 你会看到函数的参数标记了
        <a href="functions.md#variable-number-of-arguments-varargs"><code>vararg</code> 修饰符</a>:
        <code>vararg args: String</code>.
        这表示, 你可以向这个函数传递可变数量的字符串参数.
      </p>
   </def>
   <def title="展开(spread)操作符 – (*args)">
      <p>
        <code>args</code> 是 <code>main()</code> 函数的参数, 它声明为一个字符串数组.
        由于存在的是字符串的数组, 而你想要将它的内容传递给函数, 
        请使用展开(spread)操作符 (在数组之前加上星号 <code>*</code>).
      </p>
   </def>
</deflist>


## 创建 Controller

应用程序已经可以运行了, 但我们先来更新它的逻辑.

在 Spring 应用程序中, Controller 用来处理 Web 请求.
在 `DemoApplication.kt` 文件中, 创建 `MessageController` 类, 如下:

```kotlin
@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```

<deflist collapsible="true">
   <def title="@RestController 注解">
      <p>
        你需要告诉 Spring, <code>MessageController</code> 是一个 REST Controller, 因此你应该对它标注 <code>@RestController</code> 注解.
      </p>
      <p>
        这个注解表示这个类将会被组件扫描识别, 因为它和我们的 <code>DemoApplication</code> 类处在相同的包内.
      </p>
   </def>
   <def title="@GetMapping 注解">
      <p>
        <code>@GetMapping</code> 标注 REST Controller 的函数, 它实现了与 HTTP GET 调用对应的 endpoint:
      </p>
      <code style="block" lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code>
   </def>
   <def title="@RequestParam 注解">
      <p>
        函数参数 <code>name</code> 标注了 <code>@RequestParam</code> 注解. 这个注解表示方法参数应该绑定到一个 Web 请求参数.
      </p>
      <p>
        因此, 如果你访问应用程序的根路径, 并提供一个请求名为 "name" 的参数, 例如 <code>/?name=&lt;your-value&gt;</code>,
        这个参数值将会被用做调用 <code>index()</code> 函数时的参数.
      </p>
   </def>
   <def title="单表达式函数 – index()">
      <p>
        由于 <code>index()</code> 函数只包含一条语句, 你可以将它声明为一个
        <a href="functions.md#single-expression-functions">单表达式函数</a>.
      </p>
      <p>
        意思就是说, 大括号可以省略, 函数体直接放在等号 <code>=</code> 之后.
      </p>
   </def>
   <def title="函数返回值的类型推断">
      <p>
        <code>index()</code> 函数没有明确声明返回类型. 编译器会查看等号 <code>=</code> 右侧语句的结果, 以此推断返回类型.
      </p>
      <p>
        <code>Hello, $name!</code> 表达式的类型是 <code>String</code>, 因此函数的返回类型也是 <code>String</code>.
      </p>
   </def>
   <def title="字符串模板 – $name">
      <p>
        <code>Hello, $name!</code> 表达式在 Kotlin 中称为
        <a href="strings.md#string-templates"><i>字符串模板</i></a>.
      </p>
      <p>
        字符串模板是字符串的字面值, 其中包含内嵌的表达式.
      </p>
      <p>
        对于字符串的拼接操作, 这是一个很方便的替代方法.
      </p>
   </def>
</deflist>

> 这些 Spring 注解需要额外的 import 语句:
>
> ```kotlin
> import org.springframework.web.bind.annotation.GetMapping
> import org.springframework.web.bind.annotation.RequestParam
> import org.springframework.web.bind.annotation.RestController
> ```
>
{style="note"}

下面是 `DemoApplication.kt` 的完整代码:

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```
{collapsible="true"}

## 运行应用程序

Spring 应用程序现在可以运行了:

1. 点击 `main()` 方法侧栏中的绿色 Run 图标:

    ![运行 Spring Boot 应用程序](run-spring-boot-application.png){width=706}
    
    > 你也可以在终端窗口运行 `./gradlew bootRun` 命令.
    >
    {style="tip"}

    这样会在你的计算机上启动本地服务器.

2. 应用程序启动后, 请打开以下 URL:

    ```text
    http://localhost:8080?name=John
    ```

    你会看到输出的结果 "Hello, John!":

    ![Spring 应用程序的应答](spring-application-response.png){width=706}

## 下一步

本教程的下一部分中, 你将学习 Kotlin 数据类, 以及如何在你的应用程序中使用.

**[阅读下一章](jvm-spring-boot-add-data-class.md)**
