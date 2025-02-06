[//]: # (title: 向 Spring Boot 项目添加数据类)

<tldr>
    <p>
         这是 <strong>Spring Boot 和 Kotlin 入门</strong> 教程的第 2 部分.
         开始这一部分之前, 请确认你已经完成了前面的步骤:
    </p><br/>
    <p>
         <img src="icon-1-done.svg" width="20" alt="第 1 步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/>
         <img src="icon-2.svg" width="20" alt="第 2 步"/> <strong>向 Spring Boot 项目添加数据类</strong><br/>
         <img src="icon-3-todo.svg" width="20" alt="第 3 步"/> 为 Spring Boot 项目添加数据库支持<br/>
         <img src="icon-4-todo.svg" width="20" alt="第 4 步"/> 使用 Spring Data CrudRepository 进行数据库访问
    </p>
</tldr>

在教程的这个部分, 你将会向应用程序添加更多功能, 并学会 Kotlin 语言的更多功能, 例如数据类.
我们需要修改 `MessageController` 类, 来返回 JSON 格式的应答, 其中包含一组序列化的对象.

## 更新你的应用程序 {id="update-your-application"}

1. 在同一个包中, 创建一个 `Message.kt` 文件, 其中包含一个数据类, 包含 2 个属性: `id` 和 `text`:

    ```kotlin
    // Message.kt
    package demo

    data class Message(val id: String?, val text: String)
    ```

   `Message` 类将被用来传递数据: 一组序列化后的 `Message` 对象将会组成 JSON 文档, Controller 会对浏览器请求返回这个 JSON 文档.

   <deflist collapsible="true">
       <def title="数据类 – Message">
          <p>
            Kotlin 中的 <a href="data-classes.md">数据类</a> 的主要目的是用来保存数据.
            这样的类使用 <code>data</code> 关键字进行标记, 而且从类结构能够得到一些标准的功能和有用的函数.
          </p>
          <p>
            在上面的示例中, 你将 <code>Message</code> 声明为数据类, 因为它的主要目的是存储数据.
          </p>
       </def>
       <def title="val 和 var 属性">
          <p>
            <a href="properties.md">Kotlin 类中的属性</a> 可以声明为:
          </p>
          <list>
             <li><i>可变属性</i>, 使用 <code>var</code> 关键字</li>
             <li><i>只读属性</i>, 使用 <code>val</code> 关键字</li>
          </list>
          <p>
            <code>Message</code> 类使用 <code>val</code> 关键字声明了 2 个属性, <code>id</code> 和 <code>text</code>.
            编译器会为这些属性自动生成 get 函数.
            在 <code>Message</code> 类的实例创建之后, 将无法对这些属性重新赋值.
          </p>
       </def>
       <def title="可为 Null 的类型 – String?">
          <p>
            Kotlin 提供了 <a href="null-safety.md#nullable-types-and-non-nullable-types">对可为 Null 的类型的内建支持</a>.
            在 Kotlin 中, 类型系统会区分可以为 <code>null</code> 值的引用 (<i>nullable references</i>) 和不可以为 <code>null</code> 值的引用 (<i>non-nullable references</i>).<br/>
            例如, 一个通常的 <code>String</code> 类型变量不能保存 <code>null</code> 值.
            要允许使用 null 值, 你可以将一个变量声明为可为 null 的字符串, 写做 <code>String?</code>.
          </p>
          <p>
            这里, <code>Message</code> 类的 <code>id</code> 属性声明为可为 null 的类型.
            因此, 可以对 <code>id</code> 传递 `null` 来创建一个 <code>Message</code> 类的实例:
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
2. 在 `MessageController.kt` 文件中, 将 `index()` 函数改为 `listMessages()` 函数, 返回 `Message` 对象的 List:

    ```kotlin
    // MessageController.kt
    package demo

    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController

    @RestController
    @RequestMapping("/")
    class MessageController {
        @GetMapping
        fun listMessages() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

    <deflist collapsible="true">
       <def title="集合 – listOf()">
          <p>
            Kotlin 标准库提供了基本的集合类型的实现: Set, List, 和 Map.<br/>
            对每个集合类型都存在一对接口:
          </p>
          <list>
              <li>一个 <i>只读</i> 接口, 提供了访问集合元素的操作.</li>
              <li>一个 <i>可变</i> 接口, 扩展了对应的只读接口, 增加了写操作: 添加, 删除, 以及更新集合的元素.</li>
          </list>
          <p>
            Kotlin 标准库还提供了对应的工厂函数, 用来创建这些集合的实例.
          </p>
          <p>
            本教程中, 你使用了
            <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a>
            函数来创建 <code>Message</code> 对象的 List.
            这是用来创建对象的 <i>只读</i> List 的工厂函数: 你不能向 List 添加或删除元素.<br/>
            如果需要对 List 执行写操作, 请调用
            <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a>
            函数来创建一个可变的 List 实例.
          </p>
       </def>
       <def title="尾随逗号(Trailing Comma)">
          <p>
            <a href="coding-conventions.md#trailing-commas">尾随逗号(Trailing Comma)</a> 是指在一系列元素的 <b>最终元素</b> 之后的逗号:
          </p>
          <code-block lang="kotlin">
            Message("3", "Privet!"),
          </code-block>
          <p>
            这是 Kotlin 语法中的一个便利的功能, 而且它是可选的 – 不使用尾随逗号, 你的代码也能正常运行.
          </p>
          <p>
            在上面的示例中, 创建 <code>Message</code> 对象的 List 时, 在 <code>listOf()</code> 函数最后的参数之后包括了尾随逗号.
          </p>
       </def>
    </deflist>

`MessageController` 的应答现在是一个 JSON 文档, 其中包含 `Message` 对象的集合.

> 如果 Jackson 库存在于类路径中, 那么 Spring 应用程序中的所有 Controller 都会默认输出 JSON 格式的应答.
> 由于你 [在 `build.gradle.kts` 文件中指定了 `spring-boot-starter-web` 依赖项](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file), 你会通过 _传递(transitive)_ 依赖项的方式得到 Jackson.
> 因此, 如果 endpoint 返回一个能够被序列化为 JSON 的数据结构, 应用程序就会应答一个 JSON 文档.
>
{style="note"}

下面是 `DemoApplication.kt`, `MessageController.kt`, 以及 `Message.kt` 文件的完整代码:

```kotlin
// DemoApplication.kt
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageController.kt
package demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MessageController {
    @GetMapping
    fun listMessages() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed" collapsible="true"}

## 运行应用程序 {id="run-the-application"}

Spring 应用程序已经可以运行了:

1. 再次运行应用程序.

2. 应用程序启动后, 打开以下 URL:

    ```text
    http://localhost:8080
    ```

    你将会看到一个页面, 包含 JSON 格式的 message 集合:

    ![运行应用程序](messages-in-json-format.png){width=800}

## 下一步 {id="next-step"}

本教程的下一部分中, 你将会向你的项目添加并配置一个数据库, 并发送 HTTP 请求.

**[阅读下一章](jvm-spring-boot-add-db-support.md)**
