---
type: doc
layout: reference
category:
title: "教程 - 使用 Spring Boot 创建有数据库的 RESTful Web 服务"
---

# 教程 - 使用 Spring Boot 创建有数据库的 RESTful Web 服务

最终更新: {{ site.data.releases.latestDocDate }}

本教程带领你使用 Spring Boot 创建一个简单的应用程序, 并添加数据库来存储信息.

在这个教程中, 你将会:
* 创建一个带 HTTP Endpoint 的应用程序
* 学习如何返回一个 JSON 格式的数据对象列表
* 创建一个数据库来存储对象
* 使用 Endpoint 来写入和读取数据库对象

你可以下载并查看 [完成后的项目](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1),
或者观看这个教程的一个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gf-kjD2ZmZk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## 开始之前的准备

下载并安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 的最新版.

## 创建项目

使用 Spring Initializr 创建一个新的项目:

> 你可以也使用 [IntelliJ IDEA 和 Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html) 创建一个新的项目
{:.note}

1. 打开 [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2). 这个链接会打开一个页面, 其中已经预填好了这个教程的项目设置.
   这个项目使用 **Gradle**, **Kotlin**, **Spring Web**, **Spring Data JDBC**, 和 **H2 Database**:

   <img src="/assets/docs/images/tutorials/spring-boot-restful/spring-boot-create-project-with-initializr.png" alt="使用 Spring Initializr 创建一个新的项目" width="800"/>

2. 点击屏幕下方的 **GENERATE** 按钮. Spring Initializr 会使用指定的设置生成项目. 然后自动开始下载.

3. 解包 **.zip** 文件, 并在 IntelliJ IDEA 中打开它.

   项目结构如下:
   <img src="/assets/docs/images/tutorials/spring-boot-restful/spring-boot-project-structure.png" alt="Spring Boot 项目 结构" width="350"/>

   在应用程序的 `main/kotlin` 文件夹之下有一些包和类. 应用程序的入口是 `DemoApplication.kt` 文件的 `main()` 方法.

## 查看项目构建文件

打开 `build.gradle.kts` 文件.

这是 Gradle Kotlin 构建脚本, 其中包含应用程序需要的一系列依赖项.

Gradle 文件是 Spring Boot 的标准构建脚本, 但还包含必须的 Kotlin 依赖项, 包括 [kotlin-spring](../all-open-plugin.html#spring-support) Gradle plugin.

## 查看 Spring Boot 应用程序

打开 `DemoApplication.kt` 文件:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

注意, Kotlin 应用程序文件与 Java 应用程序文件不同:
* Spring Boot 会查找 public static `main()` 方法,
  而 Kotlin 应用程序则使用一个定义在 `DemoApplication` 类之外的 [顶级(Top-Level)函数](../functions.html#function-scope).
* `DemoApplication` 类没有定义为 `open`, 因为 [kotlin-spring](../all-open-plugin.html#spring-support) plugin 会自动进行转换.

## 创建一个数据类和一个 Controller

要创建一个 Endpoint, 请向你的项目添加一个 [数据类](../data-classes.html) 和一个 Controller:

1. 在 `DemoApplication.kt` 文件中, 创建一个 `Message` 数据类, 包括 2 个属性: `id` 和 `text`:

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 在同一个文件中, 创建一个 `MessageResource` 类, 它负责相应请求, 并返回一个 JSON 文档, 包含一组 `Message` 对象:

   ```kotlin
   @RestController
   class MessageResource {
       @GetMapping("/")
       fun index(): List<Message> = listOf(
           Message("1", "Hello!"),
           Message("2", "Bonjour!"),
           Message("3", "Privet!"),
       )
   }
   ```

`DemoApplication.kt` 的完整代码如下:

```kotlin
package demo

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
class MessageResource {
    @GetMapping("/")
    fun index(): List<Message> = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

data class Message(val id: String?, val text: String)
```

## 运行应用程序

应用程序现在可以运行了:

1. 点击 `main()` 方法侧栏中的绿色 **Run** 图标, 或者使用 **Alt+Enter** 快捷键在 IntelliJ IDEA 中启动 launch 菜单:

   <img src="/assets/docs/images/tutorials/spring-boot-restful/spring-boot-run-the-application.png" alt="运行应用程序" width="800"/>

   > 你也可以在终端运行 `./gradlew bootRun` 命令.
   {:.note}

2. 应用程序启动后, 请打开以下 URL: [http://localhost:8080](http://localhost:8080).

   你会看到一个页面, 其中包含 JSON 格式的一组消息:

   ![应用程序输出]({{ url_for('asset', path='docs/images/tutorials/spring-boot-restful/spring-boot-output.png') }})

## 添加数据库支持

要在你的应用程序中使用数据库, 首先请创建 2 个 Endpoint: 一个存储消息, 另一个获取消息:

1. 向 `Message` 类添加 `@Table` 注解, 声明它映射到一个数据库表. 在 `id` 之前添加 `@Id` 注解.
   这些注解还需要添加一些导入:

   ```kotlin
   import org.springframework.data.annotation.Id
   import org.springframework.data.relational.core.mapping.Table
  
   @Table("MESSAGES")
   data class Message(@Id val id: String?, val text: String)
   ```

2. 使用 [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 访问数据库:

   ```kotlin
   import org.springframework.data.jdbc.repository.query.Query
   import org.springframework.data.repository.CrudRepository
  
   interface MessageRepository : CrudRepository<Message, String>{
  
       @Query("select * from messages")
       fun findMessages(): List<Message>
   }
   ```

   当你在一个 `MessageRepository` 的实例上调用 `findMessages()` 方法时, 它会执行相应的数据库查询:

   ```sql
   select * from messages
   ```

   这个查询获取一个列表, 其中包含数据库表中所有的 `Message` 对象.

3. 创建 `MessageService` 类:

   ```kotlin
   import org.springframework.stereotype.Service
  
   @Service
   class MessageService(val db: MessageRepository) {

       fun findMessages(): List<Message> = db.findMessages()

       fun post(message: Message){
           db.save(message)
       }
   }
   ```

   这个类包含 2 个方法:
   * `post()` 将一个新的 `Message` 对象写入到数据库
   * `findMessages()` 从数据库得到所有的 `Message` 

4. 更新 `MessageResource` 类:

   ```kotlin
   import org.springframework.web.bind.annotation.RequestBody
   import org.springframework.web.bind.annotation.PostMapping
  
  
   @RestController
   class MessageResource(val service: MessageService) {
       @GetMapping("/")
       fun index(): List<Message> = service.findMessages()
  
       @PostMapping("/")
       fun post(@RequestBody message: Message) {
           service.post(message)
       }
   }
   ```

   现在它使用 `MessageService` 来访问数据库.

## 配置数据库

在应用程序中配置数据库:

1. 在 `src/main/resources` 内创建一个名为 `sql` 的新文件夹, 在这个文件夹内创建 `schema.sql` 文件. 它用来保存数据库定义:

   <img src="/assets/docs/images/tutorials/spring-boot-restful/spring-boot-sql-scheme.png" alt="创建一个新文件夹" width="300"/>

2. 更新 `src/main/resources/sql/schema.sql` 文件, 内容如下:

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   它创建 `messages` 表, 包含 2 个字段: `id` 和 `text`. 表结构与 `Message` 类一致.

3. 打开 `src/main/resources` 文件夹内的 `application.properties` 文件, 添加以下应用程序属性:

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   这些设置会为 Spring Boot 应用程序启用数据库.
   关于完整的应用程序属性列表, 请参见 [Spring 文档](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html).

## 执行 HTTP 请求

你应该使用一个 HTTP 客户端来访问前面创建的 Endpoint. 在 IntelliJ IDEA 中, 你可以使用内嵌的 [HTTP Client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html):

1. 运行应用程序. 应用程序启动之后, 你可以执行 POST 请求来向数据库存储消息.

2. 创建 `requests.http` 文件, 并添加以下 HTTP 请求:

   ```http_request
   ### Post 'Hello!"
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Hello!"
   }
  
   ### Post "Bonjour!"
  
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Bonjour!"
   }
  
   ### Post "Privet!"
  
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Privet!"
   }
  
   ### 得到所有的消息
   GET http://localhost:8080/
   ```

3. 执行所有的 POST 请求. 使用请求声明侧栏中的绿色 **Run** 图标.
   这些请求会将消息写入到数据库.

   ![运行 HTTP POST 请求]({{ url_for('asset', path='docs/images/tutorials/spring-boot-restful/spring-boot-run-http-request.png') }})
   ![]()

4. 执行 GET 请求, 并在 **Run** 工具窗口中查看结果:

   ![运行 HTTP GET 请求]({{ url_for('asset', path='docs/images/tutorials/spring-boot-restful/spring-boot-output-2.png') }})

### 执行请求的其它方式

你也可以使用任何其它的 HTTP Client, 或 cURL 命令行工具. 比如, 你可以在终端中运行以下命令, 得到同样的结果:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 下一步

得到你个人的语言导航地图, 它可以帮助你浏览 Kotlin 的功能特性, 并追踪你学习语言的进度.
我们还会向你发送语言小提示, 以及与 Spring 一起使用 Kotlin 的有用资料.

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="/assets/docs/images/spring-boot/get-kotlin-language-map.png" alt="得到 Kotlin 语言导航地图" width="700"/>
</a>

> 在这个页面中, 需要提供你的 EMail 地址, 然后才能收到这些资料.
{:.note}

### 参考资料

关于更多教程, 请查看 Spring 网站:

* [使用 Spring Boot 和 Kotlin创建 Web 应用程序](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [使用 Spring Boot, Kotlin 协程(Coroutine) 和 RSocket](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)
