[//]: # (title: 使用 Spring Data CrudRepository 进行数据库访问)
[//]: # (description: 在 Kotlin 编写的 Spring Boot 项目中使用 Spring Data.)

最终更新: %latestDocDate%

<tldr>
    <p>
        这是 <strong>Spring Boot 和 Kotlin 入门</strong> 教程的最后部分.
        开始这一部分之前, 请确认你已经完成了前面的步骤:
    </p><br/>
    <p>
        <img src="icon-1-done.svg" width="20" alt="第 1 步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第 2 步"/> <a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 项目添加数据类</a><br/>
        <img src="icon-3-done.svg" width="20" alt="第 3 步"/> <a href="jvm-spring-boot-add-db-support.md">为 Spring Boot 项目添加数据库支持</a><br/>
        <img src="icon-4.svg" width="20" alt="第 4 步"/> <strong>使用 Spring Data CrudRepository 进行数据库访问</strong>
    </p>
</tldr>

在这一章中, 你将会迁移服务层, 使用 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)
`CrudRepository` 进行数据库访问, 而不是原来的 `JdbcTemplate` .
_CrudRepository_ 是一个 Spring Data 接口, 可以指定类型的仓库进行通常的 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 操作.
它提供了一些现成的方法来操作数据库.

## 更新你的应用程序

首先, 你需要调整 `Message` 类, 来配合 `CrudRepository` API:

1. 向 `Message` 类添加 `@Table` 注解, 声明它与数据库表的映射关系.
   在 `id` 属性之前添加 `@Id` 注解.

    > 这些注解也需要额外的 import.
    >
    {style="note"}

    ```kotlin
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table

    @Table("MESSAGES")
    data class Message(@Id var id: String?, val text: String)
    ```

   除了添加这些注解之外, 你还需要让 `id` 成为可变属性 (`var`), 因为在将新对象插入到数据库时 `CrudRepository` 需要如此.

2. 为`CrudRepository` 声明一个接口, 它负责操作 `Message` 数据类:

    ```kotlin
    import org.springframework.data.repository.CrudRepository

    interface MessageRepository : CrudRepository<Message, String>
    ```

3. 更新 `MessageService` 类. 它现在调用 `MessageRepository`, 而不是执行 SQL 查询:

    ```kotlin
    import java.util.*

    @Service
    class MessageService(val db: MessageRepository) {
        fun findMessages(): List<Message> = db.findAll().toList()

        fun findMessageById(id: String): List<Message> = db.findById(id).toList()

        fun save(message: Message) {
            db.save(message)
        }

        fun <T : Any> Optional<out T>.toList(): List<T> =
            if (isPresent) listOf(get()) else emptyList()
    }
    ```

    <deflist collapsible="true">
       <def title="扩展函数">
          <p>
            <code>CrudRepository</code> 接口中 <code>findById()</code> 函数的返回类型是 <code>Optional</code> 类的实例.
            但是, 从代码统一的角度来说, 返回一个包含单个 message 的 <code>List</code> 会更加方便.
            要做到这一点, 如果 <code>Optional</code> 中有值, 你需要解包这个值, 并返回一个包含这个值的 List.
            这部分功能可以实现为 <code>Optional</code> 类型的一个 <a href="extensions.md#extension-functions">扩展函数</a>.
          </p>
          <p>
            在上面的代码中, <code>Optional&lt;out T&gt;.toList()</code>, <code>.toList()</code> 是 <code>Optional</code> 的扩展函数.
            使用扩展函数, 你可以向任何类添加额外的函数, 当你想要扩展某些库中的类的功能时, 这样会非常有用.
          </p>
       </def>
       <def title="CrudRepository save() 函数">
          <p>
            <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">这个函数的工作方式</a> 是假定新的对象在数据库中没有 id.
            因此, 对 insertion 操作, id <b>需要为 null</b>.
          </p>
          <p>
            如果 id 不是 <i>null</i>, <code>CrudRepository</code> 假定对象在数据库中已经存在, 并且这是一个 <i>update</i> 操作, 而不是 <i>insert</i> 操作.
            在 insert 操作之后, <code>id</code> 会由数据库生成, 并反过来赋值给 <code>Message</code> 实例.
            这就是 <code>id</code> 属性需要使用 <code>var</code> 关键字来声明的原因.
          </p>
       </def>
    </deflist>

4. 更新 messages 表定义, 对 insert 的对象生成 id. 由于 `id` 是一个字符串, 你可以使用 `RANDOM_UUID()` 函数来生成默认的 id 值:

    ```sql
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5. 更新 `src/main/resources` 文件夹中的 `application.properties` 文件内的数据库名称:

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

下面是 `DemoApplication.kt` 的完整代码:

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.util.*


@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController(val service: MessageService) {
    @GetMapping("/")
    fun index(): List<Message> = service.findMessages()

    @GetMapping("/{id}")
    fun index(@PathVariable id: String): List<Message> =
        service.findMessageById(id)

    @PostMapping("/")
    fun post(@RequestBody message: Message) {
        service.save(message)
    }
}

interface MessageRepository : CrudRepository<Message, String>

@Table("MESSAGES")
data class Message(@Id var id: String?, val text: String)

@Service
class MessageService(val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): List<Message> = db.findById(id).toList()

    fun save(message: Message) {
        db.save(message)
    }

    fun <T : Any> Optional<out T>.toList(): List<T> =
        if (isPresent) listOf(get()) else emptyList()
}
```
{collapsible="true"}

## 运行应用程序

应用程序可以在此运行了.
通过将 `JdbcTemplate` 替换为 `CrudRepository`, 功能并没有变更, 因此应用程序应该和以前相同的方式运行.

## 下一步做什么

得到你个人的语言导航地图, 它可以帮助你浏览 Kotlin 的功能特性, 并追踪你学习语言的进度:

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="get-kotlin-language-map.png" width="700" alt="得到 Kotlin 语言导航地图"/>
</a>

* 学习如何 [在 Kotlin 中调用 Java 代码](java-interop.md) 和 [在 Java 中调用 Kotlin 代码](java-to-kotlin-interop.md).
* 学习如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 将既有的 Java 代码转换为 Kotlin.
* 阅读我们的 Java 代码向 Kotlin 迁移指南:
  * [Java 和 Kotlin 中的字符串](java-to-kotlin-idioms-strings.md).
  * [Java 和 Kotlin 中的集合(Collection)](java-to-kotlin-collections-guide.md).
  * [Java 和 Kotlin 中的可空性(Nullability)](java-to-kotlin-nullability-guide.md).
