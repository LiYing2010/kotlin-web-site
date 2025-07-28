[//]: # (title: 教程 - 构建 Kotlin 应用程序, 使用 Spring AI, 根据存储在 Qdrant 中的文档回答问题)

在这篇教程中, 你将学习如何构建一个 Kotlin 应用程序, 它使用 [Spring AI](https://spring.io/projects/spring-ai) 连接到一个 LLM,
在向量数据库(Vector Database)中存储文档, 并使用这些文档中的上下文来回答问题.

在这篇教程中, 你将会使用以下工具:

* [Spring Boot](https://spring.io/projects/spring-boot): 作为配置和运行 Web 应用程序的基础.
* [Spring AI](https://spring.io/projects/spring-ai): 用来与 LLM 交互, 并执行基于上下文的检索.
* [IntelliJ IDEA](https://www.jetbrains.com/idea/): 用来生成项目, 并实现应用程序逻辑.
* [Qdrant](https://qdrant.tech/): 作为向量数据库(Vector Database), 用于相似性搜索(Similarity Search).
* [Docker](https://www.docker.com/): 用来在本地运行 Qdrant.
* [OpenAI](https://platform.openai.com): 作为 LLM 提供者.

## 开始前的准备工作 {id="before-you-start"}

1. 下载并安装最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html).

    > 如果你使用 IntelliJ IDEA Community Edition, 或其它 IDE, 那么可以使用
   > [基于 Web 的项目生成器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)
   > 来生成 Spring Boot 项目.
    >
    {style="tip"}

2. 在 [OpenAI 平台](https://platform.openai.com/api-keys) 创建一个 OpenAI API key, 用于访问 API.
3. 安装 [Docker](https://www.docker.com/), 用来在本地运行 Qdrant 向量数据库.
4. 安装 Docker 之后, 打开你的终端, 运行以下命令启动容器:

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## 创建项目 {id="create-the-project"}

> 作为替代, 你可以使用 [Spring Boot 基于 Web 的项目生成器](https://start.spring.io/) 来生成你的项目.
>
{style="note"}

在 IntelliJ IDEA Ultimate Edition 中创建一个新的 Spring Boot 项目:

1. 在 IntelliJ IDEA 中, 选择 **File** | **New** | **Project**.
2. 在左侧面板中, 选择 **New Project** | **Spring Boot**.
3. 在 **New Project** 窗口中, 指定以下项目和选项:

    * **Name**: springAIDemo
    * **Language**: Kotlin
    * **Type**: Gradle - Kotlin

      > 这个选项指定构建系统和 DSL.
      >
      {style="tip"}

    * **Package name**: com.example.springaidemo
    * **JDK**: Java JDK

      > 本教程使用 **Oracle OpenJDK 21.0.1 版本**.
      > 如果你没有安装 JDK, 可以从下拉列表中下载.
      >
      {style="note"}

    * **Java**: 17

      > 如果你没有安装 Java 17, 可以从 JDK 下拉列表中下载.
      >
      {style="tip"}

   ![创建 Spring Boot 项目](create-spring-ai-project.png){width=800}

4. 确定你指定了所有的项目, 然后点击 **Next**.
5. 在 **Spring Boot** 项目中, 选择最新的 Spring Boot 稳定版.

6. 选择本教程需要的以下依赖项:

    * **Web | Spring Web**
    * **AI | OpenAI**
    * **SQL | Qdrant Vector Database**

   ![设置 Spring Boot 项目](spring-ai-dependencies.png){width=800}

7. 点击 **Create**, 生成并设置项目.

   > IDE 会生成并打开一个新的项目. 可能会耗费一些时间来下载并导入项目依赖项.
   >
   {style="tip"}

完成之后, 你会在 **Project view** 中看到以下结构:

![Spring Boot 项目视图](spring-ai-project-view.png){width=400}

生成的 Gradle 项目对应 Maven 的标准目录布局:

* `main/kotlin` 目录下存放属于应用程序的包和类.
* 应用程序的入口点是 `SpringAiDemoApplication.kt` 文件的 `main()` 方法.


## 更新项目配置 {id="update-the-project-configuration"}

1. 更新你的 `build.gradle.kts` Gradle 构建文件, 内容如下:

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // 其它 plugin
    }
   ```

2. 将 `springAiVersion` 设置为 `1.0.0`:

   ```kotlin
   extra["springAiVersion"] = "1.0.0"
   ```

3. 点击 **Sync Gradle Changes** 按钮, 同步 Gradle 文件.
4. 更新你的 `src/main/resources/application.properties` 文件, 内容如下:

   ```properties
   # OpenAI
   spring.ai.openai.api-key=YOUR_OPENAI_API_KEY
   spring.ai.openai.chat.options.model=gpt-4o-mini
   spring.ai.openai.embedding.options.model=text-embedding-ada-002
   # Qdrant
   spring.ai.vectorstore.qdrant.host=localhost
   spring.ai.vectorstore.qdrant.port=6334
   spring.ai.vectorstore.qdrant.collection-name=kotlinDocs
   spring.ai.vectorstore.qdrant.initialize-schema=true
   ```
   
   > 将你的 OpenAI API key 设置到 `spring.ai.openai.api-key` 属性.
   >
   {style="note"}

5. 运行 `SpringAiDemoApplication.kt` 文件, 启动 Spring Boot 应用程序.
   应用程序开始运行后, 在你的浏览器中打开 [Qdrant collections](http://localhost:6333/dashboard#/collections) 页面, 查看结果:

   ![Qdrant collections](qdrant-collections.png){width=700}

## 创建一个 controller, 装载和检索文档 {id="create-a-controller-to-load-and-search-documents"}

创建一个 Spring `@RestController` 来检索文档, 并存储到 Qdrant 集合中:

1. 在 `src/main/kotlin/org/example/springaidemo` 目录中, 创建一个新的文件, 名为 `KotlinSTDController.kt`, 并添加以下代码:

    ```kotlin
    package org.example.springaidemo

    // 导入需要的 Spring 类和工具类
    import org.slf4j.LoggerFactory
    import org.springframework.ai.document.Document
    import org.springframework.ai.vectorstore.SearchRequest
    import org.springframework.ai.vectorstore.VectorStore
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RequestParam
    import org.springframework.web.bind.annotation.RestController
    import org.springframework.web.client.RestTemplate
    import kotlin.uuid.ExperimentalUuidApi
    import kotlin.uuid.Uuid

    @RestController
    @RequestMapping("/kotlin")
    class KotlinSTDController(
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    ) {
        private val logger = LoggerFactory.getLogger(this::class.java)

        @OptIn(ExperimentalUuidApi::class)
        @PostMapping("/load-docs")
        fun load() {
            // 从 Kotlin 文档装载文档列表
            val kotlinStdTopics = listOf(
                "collections-overview", "constructing-collections", "iterators", "ranges", "sequences",
                "collection-operations", "collection-transformations", "collection-filtering", "collection-plus-minus",
                "collection-grouping", "collection-parts", "collection-elements", "collection-ordering",
                "collection-aggregate", "collection-write", "list-operations", "set-operations",
                "map-operations", "read-standard-input", "opt-in-requirements", "scope-functions", "time-measurement",
            )
            // 文档的 Base URL
            val url = "https://raw.githubusercontent.com/JetBrains/kotlin-web-site/refs/heads/master/docs/topics/"
            // 从 URL 检索各个文档, 并添加到向量数据库
            kotlinStdTopics.forEach { topic ->
                val data = restTemplate.getForObject("$url$topic.md", String::class.java)
                data?.let { it ->
                    val doc = Document.builder()
                        // 使用随机的 UUID 构建文档
                        .id(Uuid.random().toString())
                        .text(it)
                        .metadata("topic", topic)
                        .build()
                    vectorStore.add(listOf(doc))
                    logger.info("Document $topic loaded.")
                } ?: logger.warn("Failed to load document for topic: $topic")
            }
        }

        @GetMapping("docs")
        fun query(
            @RequestParam query: String = "operations, filtering, and transformations",
            @RequestParam topK: Int = 2
        ): List<Document>? {
            val searchRequest = SearchRequest.builder()
                .query(query)
                .topK(topK)
                .build()
            val results = vectorStore.similaritySearch(searchRequest)
            logger.info("Found ${results?.size ?: 0} documents for query: '$query'")
            return results
        }
    }
    ```
   {collapsible="true"}

2. 更新 `SpringAiDemoApplication.kt` 文件, 声明一个 `RestTemplate` bean:

   ```kotlin
   package org.example.springaidemo

   import org.springframework.boot.autoconfigure.SpringBootApplication
   import org.springframework.boot.runApplication
   import org.springframework.context.annotation.Bean
   import org.springframework.web.client.RestTemplate
   
   @SpringBootApplication
   class SpringAiDemoApplication {
       @Bean
       fun restTemplate(): RestTemplate = RestTemplate()
   }
   
   fun main(args: Array<String>) {
       runApplication<SpringAiDemoApplication>(*args)
   }
   ```
   {collapsible="true"}

3. 运行应用程序.
4. 在终端中, 向 `/kotlin/load-docs` 端点发送一个 POST 请求, 装载文档:

   ```bash
   curl -X POST http://localhost:8080/kotlin/load-docs
   ```

5. 文档装载完成后, 你就可以使用 GET 请求检索文档了:

   ```Bash
   curl -X GET http://localhost:8080/kotlin/docs
   ```

   ![GET 请求的结果](spring-ai-get-results.png){width="700"}

> 你也可以在 [Qdrant 集合](http://localhost:6333/dashboard#/collections) 页面查看结果.
>
{style="tip"}

## 实现一个 AI 对话端点 {id="implement-an-ai-chat-endpoint"}

文档装载完成后, 最后一步是添加一个端点, 通过 Spring AI 的 检索增强生成(Retrieval-Augmented Generation, RAG) 功能, 使用 Qdrant 中的文档回答问题:

1. 打开 `KotlinSTDController.kt` 文件, 导入以下类:

   ```kotlin
   import org.springframework.ai.chat.client.ChatClient
   import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor
   import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor
   import org.springframework.ai.chat.prompt.Prompt
   import org.springframework.ai.chat.prompt.PromptTemplate
   import org.springframework.web.bind.annotation.RequestBody
   ```

2. 定义一个 `ChatRequest` 数据类:

   ```kotlin
   // 表示对话查询的请求内容
   data class ChatRequest(val query: String, val topK: Int = 3)
   ```

3. 向 controller 的构造器参数添加 `ChatClient.Builder`:

   ```kotlin
   class KotlinSTDController(
       private val chatClientBuilder: ChatClient.Builder,
       private val restTemplate: RestTemplate,
       private val vectorStore: VectorStore,
   )
   ```

4. 在 controller 类中, 创建一个 `ChatClient` 实例:

   ```kotlin
   // 构建 chat client, 带有简单的日志功能 advisor
   private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
   ```

5. 在你的 `KotlinSTDController.kt` 文件的最下方, 添加一个新的 `chatAsk()` 端点, 包含以下逻辑:

   ```kotlin
   @PostMapping("/chat/ask")
   fun chatAsk(@RequestBody request: ChatRequest): String? {
       // 定义带有占位符的提示模板
       val promptTemplate = PromptTemplate(
           """
           {query}.
           Please provide a concise answer based on the "Kotlin standard library" documentation.
       """.trimIndent()
       )

       // 使用实际的值替换占位符, 创建提示
       val prompt: Prompt =
           promptTemplate.create(mapOf("query" to request.query))

       // 配置检索 advisor, 使用相关文档扩充查询
       val retrievalAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
           .searchRequest(
               SearchRequest.builder()
                   .similarityThreshold(0.7)
                   .topK(request.topK)
                   .build()
           )
           .promptTemplate(promptTemplate)
           .build()

       // 使用检索 advisor 将提示发送到 LLM, 并获取获取生成的内容
       val response = chatClient.prompt(prompt)
           .advisors(retrievalAdvisor)
           .call()
           .content()
       logger.info("Chat response generated for query: '${request.query}'")
       return response
   }
   ```

6. 运行应用程序.
7. 在终端中, 发送向新的端点一个 POST 请求, 查看结果:

   ```bash
   curl -X POST "http://localhost:8080/kotlin/chat/ask" \
        -H "Content-Type: application/json" \
        -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
   ```

   ![OpenAI 回答 to chat 请求](open-ai-chat-endpoint.png){width="700"}

恭喜你! 你现在有了一个 Kotlin 应用程序, 它连接到 OpenAI, 并使用从 Qdrant 中存储的文档检索到的上下文来回答问题.
尝试以下使用不同的查询, 或者导入其它文档, 看看还能实现些什么.

你可以在 [Spring AI demo GitHub 代码仓库](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo) 中查看完整的项目,
或者在 [Kotlin AI 示例](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master) 中查看其它 Spring AI 示例.
