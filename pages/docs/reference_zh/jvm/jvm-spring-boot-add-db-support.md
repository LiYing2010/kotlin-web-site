---
type: doc
layout: reference
category:
title: "为 Spring Boot 项目添加数据库支持"
---

# 为 Spring Boot 项目添加数据库支持
[//]: # (title: Add database support for Spring Boot project)
[//]: # (description: Add a database support for Sprint Boot project written in Kotlin using JDBC template.)

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: 252528">
    <tr style="border: none">
        <td>
            这是 <strong>Spring Boot 和 Kotlin 入门</strong> 教程的第 3 部分.
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
                <img src="/assets/docs/images/icons/icon-2-done.svg" alt="第 2 步" width="20"/> &nbsp;
                <a href="jvm-spring-boot-add-data-class.html">向 Spring Boot 项目添加数据类</a>
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3.svg" alt="第 3 步" width="20"/> &nbsp;
                <strong>为 Spring Boot 项目添加数据库支持</strong>
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

在教程的这个部分, 你将会使用 JDBC 向你的项目添加并配置一个数据库. 在 JVM 应用程序中, 你要使用 JDBC 来操作数据库.
为了方便, Spring Framework 提供了 `JdbcTemplate` 类, 简化 JDBC 的使用, 并帮助避免常见的错误.

## 添加数据库支持

在使用 Spring Framework 的应用程序中, 通常的做法是在所谓的 _服务(Service)_ 层实现数据库访问逻辑 – 这是实现业务逻辑的地方.
在 Spring 中, 你需要使用 `@Service` 注解来标注类, 表示类属于应用程序的服务层.
在这个应用程序中, 你将会创建 `MessageService` 类来实现这个目的.

在 `DemoApplication.kt` 文件中, 创建 `MessageService` 类, 如下:

```kotlin
import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate

@Service
class MessageService(val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message){
        db.update("insert into messages values ( ?, ? )",
           message.id, message.text)
    }
}
```

### 构造器参数与依赖注入 – (val db: JdbcTemplate)

Kotlin 中的类可以拥有一个主构造器, 以及一个或多个 [次级构造器(secondary constructor)](../classes.html#secondary-constructors).
*主构造器* 是类头部的一部分, 位于类名称以及可选的类型参数之后.
在我们的例子中, 构造器是 `(val db: JdbcTemplate)`.

`val db: JdbcTemplate` 是构造器的参数:

```kotlin
@Service
class MessageService(val db: JdbcTemplate)
```

### 尾缀 Lambda 表达式(Trailing Lambda) 与 SAM 转换

`findMessages()` 函数调用 `JdbcTemplate` 类的 `query()` 函数. `query()` 函数接受 2 个参数:
一个 SQL 查询, 类型为字符串, 以及一个回调, 将每一行查询结果转换为对象:

```sql
db.query("...", RowMapper { ... } )
```

`RowMapper` 接口只声明了一个方法, 因此可以使用 Lambda 表达式来实现它, 省略接口名称.
Kotlin 编译器知道表达式需要转换成的接口, 因为你将它用作函数调用的一个参数.
这个功能称为 [Kotlin 中的SAM 转换](java-interop.html#sam-conversions):

```sql
db.query("...", { ... } )
```      

在 SAM 转换之后, query 函数得到 2 个参数: 首先是一个 String, 后面是一个 Lambda 表达式.
根据 Kotlin 的习惯, 如果一个函数的最后一个参数是一个函数, 那么传递给这个参数的 Lambda 表达式可以放在括号之外.
这样的语法称为 [尾缀 Lambda 表达式(Trailing Lambda)](../lambdas.html#passing-trailing-lambdas):

```sql
db.query("...") { ... }
```

### 对未使用的 Lambda 表达式参数使用下划线

对于带有多个参数的 Lambda 表达式, 你可以使用下划线 `_` 符号来代替你不需要使用的参数的名称.

因此, query 函数调用的最终语法如下:

```kotlin
db.query("select * from messages") { response, _ ->
    Message(response.getString("id"), response.getString("text"))
}
```

## 更新 MessageController 类

更新 `MessageController` 来使用新的 `MessageService` 类:

```kotlin
@RestController
class MessageController(val service: MessageService) {
    @GetMapping("/")
    fun index(): List<Message> = service.findMessages()

    @PostMapping("/")
    fun post(@RequestBody message: Message) {
       service.save(message)
    }
}

```

### @PostMapping 注解
负责处理 HTTP POST 请求的方法需要标注 `@PostMapping` 注解.
为了将 HTTP 请求 Body 部的 JSON 内容转换为对象, 你需要对方法参数使用 `@RequestBody` 注解.
由于 Jackson 库存在于应用程序的类路径中, 这个转换能够自动完成.

## 更新 MessageService 类

`Message` 类的 `id` 声明为可为 null 的字符串:

```kotlin
data class Message(val id: String?, val text: String)
```

但是, 将 `null` 作为 `id` 值保存到数据库是不正确的: 你需要恰当的处理这样的情况.  

更新你的代码, 在将 message 保存到时数据库, 如果 `id` 为 `null`, 生成新的值:

```kotlin
@Service
class MessageService(val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message){
        val id = message.id ?: UUID.randomUUID().toString()
        db.update("insert into messages values ( ?, ? )",
                  id, message.text)
    } 
}
```

### Elvis 操作符 – ?:
代码 `message.id ?: UUID.randomUUID().toString()` 使用了 [Elvis 操作符 (if-not-null-else 的缩写) `?:`](../null-safety.html#elvis-operator).
如果 `?:` 左侧的表达式不是 `null`, Elvis 操作符会返回这个表达式的值; 否则, 它返回右侧表达式的值.
注意, 右侧表达式只有在左侧表达式为 `null` 的情况下才会计算.


应用程序代码已经可以访问数据库了. 现在需要配置数据源.

## 配置数据库

在应用程序中配置数据库:

1. 在 `src/main/resources` 目录中创建 `schema.sql` 文件. 它将会保存数据库对象的定义:

   <img src="/assets/docs/images/spring-boot/create-database-schema.png" alt="创建数据库 Schema" width="400"/>

2. 更新 `src/main/resources/schema.sql` 文件, 内容如下:

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   它创建 `messages` 表, 包含 2 个列: `id` 和 `text`. 表结构与 `Message` 类一致.

3. 打开 `src/main/resources` 文件夹内的 `application.properties` 文件, 添加以下应用程序属性:

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   这些设置会为 Spring Boot 应用程序启用数据库.
   关于完整的应用程序属性列表, 请参见 [Spring 文档](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html).

## 通过 HTTP 请求, 向数据库添加 message

你应该使用一个 HTTP 客户端来访问前面创建的 Endpoint. 在 IntelliJ IDEA 中, 请使用内嵌的 HTTP Client:

1. 运行应用程序. 应用程序启动之后, 你可以执行 POST 请求来向数据库存储消息.
   创建 `requests.http` 文件, 并添加以下 HTTP 请求:

   ```http_request
   ### Post "Hello!"
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

   ### 得到所有的 message
   GET http://localhost:8080/
   ```

2. 执行所有的 POST 请求. 使用请求声明侧栏中的绿色 **Run** 图标.
   这些请求会将消息写入到数据库:

   ![执行 POST 请求]({{ url_for('asset', path='docs/images/spring-boot/execute-post-requests.png') }})

3. 执行 GET 请求, 并在 **Run** 工具窗口查看结果:

   ![执行 GET 请求]({{ url_for('asset', path='docs/images/spring-boot/execute-get-requests.png') }})

### 执行请求的其它方式

你也可以使用任何其它的 HTTP Client, 或 cURL 命令行工具.
比如, 在终端中运行以下命令, 得到同样的结果:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 通过 id 获取 message

为应用程序增加新的功能, 通过 id 来获取单个的 message.

1. 在 `MessageService` 类中, 添加新的函数 `findMessageById(id: String)`, 通过 id 来获取单个的 message:

    ```kotlin
    import org.springframework.jdbc.core.query
    
    @Service
    class MessageService(val db: JdbcTemplate) {
    
        fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun findMessageById(id: String): List<Message> = db.query("select * from messages where id = ?", id) { response, _ ->
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun save(message: Message) {
            val id = message.id ?: UUID.randomUUID().toString()
            db.update("insert into messages values ( ?, ? )", 
                      id, message.text)
        }
    }
    ```
   
   > 通过 id 来获取 message 的 `query()` 函数是由 Spring Framework 提供的一个 [Kotlin 扩展函数](../extensions.html#extension-functions),
   > 如上面的代码所示, 它需要一个额外的 import 语句.
   {:.note}

2. 向 `MessageController` 类添加新的 `index(...)` 函数, 参数是 `id`:

    ```kotlin
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
    ```

   ### 从 context 路径得到值

   Spring Framework 会从 context 路径得到 message 的 `id` 值, 因为你对新函数标注了 `@GetMapping("/{id}")` 注解.
   通过对函数参数标注 `@PathVariable` 注解, 你告诉 Spring Framework 使用得到的值作为函数参数. 新函数会调用 `MessageService` 来通过 id 取得单个 message.

   ### vararg 参数在参数列表中的位置

   `query()` 函数接受 3 个参数:
   * SQL 查询字符串, 它执行时需要一个参数
   * `id`, 类型为字符串的参数
   * `RowMapper` 实例, 由 Lambda 表达式实现

   `query()` 函数的第 2 个参数声明为 *不定数量参数* (`vararg`). 在 Kotlin 中, 不定数量参数的位置并不要求是在参数列表的最后.

## 运行应用程序

Spring 应用程序已经可以运行了:

1. 再次运行应用程序.

2. 打开 `requests.http` 文件, 添加新的 GET 请求:

    ```http_request
    ### 根据 id 得到 message
    GET http://localhost:8080/id
    ```

3. 执行 GET 请求, 从数据库得到所有的 message.

4. 在 **Run** 工具窗口, 复制某个 message 的 id, 并添加到请求中, 例如:

    ```http_request
    ### 根据 id 得到 message
    GET http://localhost:8080/f16c1d2e-08dc-455c-abfe-68440229b84f
    ```
    
    > 请使用你的 message 的真实 id, 不要使用上面例子中的值.
    {:.note}

5. 执行 GET 请求, 并在 **Run** 工具窗口中查看结果:

    <img src="/assets/docs/images/spring-boot/retrieve-message-by-its-id.png" alt="根据 id 得到 message" width="706"/>

## 下一步

本教程的最后部分会向你演示, 如何使用更加流行的数据库操作方式 Spring Data. 

**[阅读下一章](jvm-spring-boot-using-crudrepository.html)**

### 获得 Kotlin 语言导航地图

得到你个人的语言导航地图, 它可以帮助你浏览 Kotlin 的功能特性, 并追踪你学习语言的进度.
我们还会向你发送语言小提示, 以及与 Spring 一起使用 Kotlin 的有用资料.

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="/assets/docs/images/spring-boot/get-kotlin-language-map.png" alt="得到 Kotlin 语言导航地图" width="700"/>
</a>

> 在这个页面中, 需要提供你的 EMail 地址, 然后才能收到这些资料.
{:.note}
