---
type: doc
layout: reference
category:
title: "向 Spring Boot 项目添加数据类"
---

# 向 Spring Boot 项目添加数据类
[//]: # (title: Add a data class to Spring Boot project)
[//]: # (description: Add a Kotlin data class to Spring Boot project.)

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: 252528">
    <tr style="border: none">
        <td>
            这是 <strong>Spring Boot 和 Kotlin 入门</strong> 教程的第 2 部分.
            开始这一部分之前, 请确认你已经完成了前面的步骤:
        </td>
    </tr>
    <tr>
        <td>
        <div style="display: block">
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-1-done.svg" alt="第 1 步" width="20"/> &nbsp;
                <a href="jvm-create-project-with-spring-boot.html">使用 Kotlin 创建 Spring Boot 项目</a>
            </div>
            <br/>

            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-2.svg" alt="第 2 步" width="20"/> &nbsp;
                <strong>向 Spring Boot 项目添加数据类</strong>
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3-todo.svg" alt="第 3 步" width="20"/> &nbsp;
                为 Spring Boot 项目添加数据库支持
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-todo.svg" alt="第 4 步" width="20"/> &nbsp;
                使用 Spring Data CrudRepository 进行数据库访问
            </div>
        </div>
        </td>
    </tr>
</table>

在教程的这个部分, 你将会向应用程序添加更多功能, 并学会 Kotlin 语言的更多功能, 例如数据类.
我们需要修改 `MessageController` 类, 来返回 JSON 格式的应答, 其中包含一组序列化的对象.

## 更新你的应用程序

1. 在 `DemoApplication.kt` 文件中, 创建一个 `Message` 数据类, 包含 2 个属性: `id` 和 `text`:

    ```kotlin
    data class Message(val id: String?, val text: String)
    ```

   `Message` 类将被用来传递数据: 一组序列化后的 `Message` 对象将会组成 JSON 文档, Controller 会对浏览器请求返回这个 JSON 文档.

   ### 数据类 – Message

   Kotlin 中的 [数据类](../data-classes.html) 的主要目的是用来保存数据. 这样的类使用 `data` 关键字进行标记,
   而且从类结构能够得到一些标准的功能和有用的函数.

   在上面的示例中, 你将 `Message` 声明为数据类, 因为它的主要目的是存储数据.

   ### `val` 和 `var` 属性

   [Kotlin 类中的属性](../properties.html) 可以声明为:
   - *可变属性*: 使用 `var` 关键字
   - *只读属性*: 使用 `val` 关键字

   `Message` 类使用 `val` 关键字声明了 2 个属性, `id` 和 `text`.
    编译器会为这些属性自动生成 get 函数.
   在 `Message` 类的实例创建之后, 将无法对这些属性重新赋值.

   ### 可为 Null 的类型 – String?

   Kotlin 提供了 [对可为 Null 的类型的内建支持](../null-safety.html#nullable-types-and-non-nullable-types).
   在 Kotlin 中, 类型系统会区分可以为 `null` 值的引用 (*nullable reference*) 和不可以为 `null` 值的引用(*non-nullable reference*).

   例如, 一个通常的 `String` 类型变量不能保存 `null` 值. 要允许使用 null 值, 你可以将一个变量声明为可为 null 的字符串, 写做 `String?`.

   这里, `Message` 类的 `id` 属性声明为可为 null 的类型.
   因此, 可以对 `id` 传递 `null` 来创建一个 `Message` 类的实例:

    ```kotlin
    Message(null, "Hello!")
    ```

2. 在同一个文件内, 修改 `MessageController` 类的 `index()` 函数, 让它返回 `Message` 对象的 List:

    ```kotlin
    @RestController
    class MessageController {
        @GetMapping("/")
        fun index() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

   ### 集合 – listOf()
   Kotlin 标准库提供了基本的集合类型的实现: Set, List, 和 Map.

   对每个集合类型都存在一对接口:

   * 一个 *只读的* 接口, 提供了访问集合元素的操作.
   * 一个 *可变的* 接口, 扩展了对应的只读接口, 增加了写操作: 添加, 删除, 以及更新集合的元素.

   Kotlin 标准库还提供了对应的工厂函数, 用来创建这些集合的实例.
   
   本教程中, 你使用了 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 函数来创建 `Message` 对象的 List.
   这是用来创建对象的 *只读* List 的工厂函数: 你不能向 List 添加或删除元素.

   如果需要对 List 执行写操作, 请调用 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 函数来创建一个可变的 List 实例.

   ### Trailing comma

   [尾随逗号(Trailing Comma)](../coding-conventions.html#trailing-commas) 是指在一系列元素的 **最终元素** 之后的逗号:

   ```kotlin
   Message("3", "Privet!"),
   ```

   这是 Kotlin 语法中的一个便利的功能, 而且它是可选的 – 不使用尾随逗号, 你的代码也能正常运行.

   在上面的示例中, 创建 `Message` 对象的 List 时, 在 `listOf()` 函数最后的参数之后包括了尾随逗号.

`MessageController` 的应答现在是一个 JSON 文档, 其中包含 `Message` 对象的集合.

> 如果 Jackson 库存在于类路径中, 那么 Spring 应用程序中的所有 Controller 都会默认输出 JSON 格式的应答.
> 由于你 [在 `build.gradle.kts` 文件中指定了 `spring-boot-starter-web` 依赖项](jvm-create-project-with-spring-boot.html#explore-the-project-gradle-build-file), 你会通过 _传递(transitive)_ 依赖项的方式得到 Jackson.
> 因此, 如果 endpoint 返回一个能够被序列化为 JSON 的数据结构, 应用程序就会应答一个 JSON 文档.
{:.note}

下面是 `DemoApplication.kt` 的完整代码:

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping("/")
    fun index() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

data class Message(val id: String?, val text: String)
```

## 运行应用程序

Spring 应用程序已经可以运行了:

1. 再次运行应用程序.

2. 应用程序启动后, 打开以下 URL:

    ```text
    http://localhost:8080
    ```

    你将会看到一个页面, 包含 JSON 格式的 message 集合:

    <img src="/assets/docs/images/spring-boot/messages-in-json-format.png" alt="运行应用程序" width="800"/>

## 下一步

本教程的下一部分中, 你将会向你的项目添加并配置一个数据库, 并发送 HTTP 请求.

**[阅读下一章](jvm-spring-boot-add-db-support.html)**
