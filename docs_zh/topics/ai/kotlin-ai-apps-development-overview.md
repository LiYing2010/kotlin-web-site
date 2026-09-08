[//]: # (title: 使用 Kotlin 进行 AI 应用程序开发)

<web-summary>学习 Koog 如何帮助你使用 Kotlin 构建 AI 应用程序.</web-summary>

Kotlin 为构建 AI 应用程序提供了现代化而且务实的基础.
它可以跨平台使用, 能够与现有的 AI 框架良好集成, 而且支持常用的 AI 开发模式.

## Koog {id="koog"}

[Koog](https://koog.ai) 是 JetBrains 开发的开源框架, 用于构建从简单到复杂的 AI 代理.
它提供了跨平台支持, Spring Boot 和 Ktor 集成, 符合惯用法的 DSL, 以及可以立即使用的生产级功能特性.

### 用少数几行代码创建一个简单的代理 {id="create-a-simple-agent-in-a-few-lines"}

```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            // 使用 Anthropic, Google, OpenRouter, 或其他任何提供商
            executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```

<a href="https://docs.koog.ai/quickstart/"><img src="get-started-with-koog.svg" width="700" alt="Get started with Koog" style="block"/></a>

### 主要功能特性 {id="key-features"}

* **支持跨平台开发**.
  支持跨平台, 可以为 JVM, JavaScript, WebAssembly, Android, 以及 iOS 开发代理应用程序.
* **可靠性与容错性**.
  通过内置的重试机制, Koog 让开发者能够处理故障, 例如超时, 或工具错误等等.
  代理持久化能力, 能够恢复完整的代理状态机, 而不只是恢复对话消息.
* **内置的历史压缩技术, 用于长上下文**.
  Koog 提供了高级策略, 压缩和管理长时间运行的对话, 无需额外设置.
* **企业级集成**.
  Koog 与流行的 JVM 框架集成, 例如 [Spring Boot](https://spring.io/projects/spring-boot) 和 [Ktor](https://ktor.io).
* **使用 OpenTelemetry 导出器的可观测性**.
  Koog 提供立即可用的, 与流行的可观测性提供商(如 W&B Weave 和 Langfuse)的集成功能, 用于监控和调试 AI 应用程序.
* **LLM 切换和无缝的历史适配(History Adaptation)**.
  Koog 允许在任何时刻切换到不同的 LLM 和新的工具集, 不会丢失现有的对话历史.
  它还支持在多个 LLM 提供商之间路由, 包括 OpenAI, Anthropic, Google 等等.
  你可以通过 Koog 与 Ollama 的集成, 使用本地模型在本地运行代理.
* **与 JVM 和 Kotlin 应用程序集成**.
  Koog 为 JVM 和 Kotlin 开发者提供了符合惯用法的, 类型安全的 DSL.
* **Model Context Protocol (MCP) 集成**.
  Koog 支持在代理中使用 MCP 工具.
* **知识检索与记忆**.
  通过嵌入, 排序的文档存储, 以及共用代理记忆,   Koog 自身能够主动的在不同的对话之间保留知识.
* **流式处理能力**.
  Koog 通过流式支持和并行工具调用, 让开发者能够实时处理响应.

### 从哪里开始 {id="where-to-start"}

* 阅读 [概述](https://docs.koog.ai/), 探索 Koog 的功能.
* 使用 [快速入门指南](https://docs.koog.ai/quickstart/), 构建你的第一个 Koog 代理.
* 阅读 [Koog 发布说明](https://github.com/JetBrains/koog/releases), 查看最新更新.
* 学习 [示例](https://docs.koog.ai/examples/).

## Model Context Protocol (MCP) Kotlin SDK {id="model-context-protocol-mcp-kotlin-sdk"}

[MCP Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 是 Model Context Protocol 的 Kotlin Multiplatform 实现.
这个 SDK 让开发者能够使用 Kotlin 构建 AI 应用程序, 并在 JVM, WebAssembly, 和 iOS 平台, 与 LLM 接口集成.

使用 MCP Kotlin SDK, 你能够:

* 将上下文处理与 LLM 交互分离, 以结构化和标准化的方式向 LLM 提供上下文.
* 构建 MCP 客户端, 使用来自既有服务器的资源.
* 创建 MCP 服务器, 向 LLM 公开提示词, 工具和资源.
* 使用标准通信传输方式, 例如 stdio, SSE, 和 WebSocket.
* 处理所有 MCP 协议消息和生命周期事件.

## 探索 AI 应用程序的其他场景 {id="explore-other-ai-powered-application-scenarios"}

得益于与 Java 的无缝互操作性, 和 Kotlin Multiplatform 功能,
你可以将 Kotlin 与成熟的 AI SDK 和框架结合, 构建后端和桌面/移动端 UI,
并采用各种模式, 例如 RAG 和基于代理的工作流.

> 你可以在 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 代码仓库中, 查看和运行示例.
> 每个项目都是独立的. 你可以使用各个项目作为参考或模板, 构建基于 Kotlin 的 AI 应用程序.

### 连接主要的模型提供商 {id="connect-to-major-model-providers"}

使用 Kotlin 连接主要的模型提供商, 例如 OpenAI, Anthropic, Google 等等:

* [OpenAI](https://github.com/openai/openai-java) —
  OpenAI API 的官方 Java SDK. 涵盖响应和对话, 图像, 以及音频.
* [Anthropic (Claude)](https://github.com/anthropics/anthropic-sdk-java) —
  Claude Messages API 的官方 Java SDK. 包含与 Vertex AI 和 Bedrock 集成的模块.
* [Google AI (Gemini / Vertex AI)](https://github.com/googleapis/java-genai) —
  官方 Java SDK, 使用单一客户端, 能够在 Gemini API 和 Vertex AI 之间切换.
* [Azure OpenAI](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) —
  Azure OpenAI 服务的官方 Java 客户端. 支持对话补全和嵌入.
* [AWS Bedrock](https://github.com/aws/aws-sdk-kotlin) —
  调用基础模型的官方 SDK. 包含 Kotlin SDK 和 Java SDK, 用于 Bedrock 和 Bedrock Runtime.

### 创建 RAG 管道和基于代理的应用程序 {id="create-rag-pipelines-and-agent-based-apps"}

* [Spring AI](https://github.com/spring-projects/spring-ai) —
  多提供商抽象, 用于提示词, 对话, 嵌入, 工具与函数调用, 以及向量存储.
* [LangChain4j](https://docs.langchain4j.dev/tutorials/kotlin/) —
  带有 Kotlin 扩展的 JVM 工具包, 用于提示词, 工具, 检索增强生成(Retrieval-Augmented Generation, RAG)管道, 以及代理.

## 下一步 {id="whats-next"}

* 完成教程 [使用 Spring AI 创建一个回答问题的 Kotlin 应用程序](spring-ai-guide.md),
  学习如何在 IntelliJ IDEA 中使用 Kotlin 和 Spring AI
* 加入 [Kotlin 开发社区](https://kotlinlang.org/community/),
  与使用 Kotlin 构建 AI 应用程序的其他开发者联系
* 学习 [](kotlin-ai-skills.md)
