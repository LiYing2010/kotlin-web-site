[//]: # (title: 使用 Kotlin 进行 AI 应用程序开发)

Kotlin 为构建 AI 应用程序提供了现代化而且务实的基础.
支持跨平台使用, 能够与现有的 AI 框架良好集成, 而且支持常用的 AI 开发模式.

> 本章通过 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 代码仓库中的示例,
> 介绍如何在现实世界的 AI 场景中使用 Kotlin.
> 
{style="note"}

## Kotlin AI 代理框架 – Koog {id="kotlin-ai-agentic-framework-koog"}

[Koog](https://koog.ai) 是一个基于 Kotlin 的框架, 用来在本地创建和运行 AI 代理, 不需要外部服务.
Koog 是由 JetBrains 创建的开源代理框架, 帮助开发者在 JVM 生态环境中构建 AI 代理.
它提供了一个纯 Kotlin 的实现来构建智能代理, 这个智能代理能够与工具交互, 处理复杂工作流, 并与用户沟通.

## 更多使用场景 {id="more-use-cases"}

还有很多 Kotlin 能够帮助 AI 开发的其他使用场景.
从将语言模型与后端服务集成, 到构建基于 AI 的用户界面,
这些示例展示了 Kotlin 在各种 AI 应用程序中的丰富功能.

### 检索增强生成(Retrieval-Augmented Generation) {id="retrieval-augmented-generation"}

使用 Kotlin 来构建检索增强生成(Retrieval-Augmented Generation, RAG) 管道,
将语言模型连接到外部信息源, 例如文档, 向量存储, 或 API.
例如:

* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): 一个 Spring Boot 应用程序, 将 Kotlin 标准库文档装载到一个向量存储中, 并且支持基于文档的 Q&A.
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): 一个最小的 RAG 示例, 使用 LangChain4j.

### 基于代理的应用程序 {id="agent-based-applications"}

使用 Kotlin 构建 AI 代理, 它能够使用语言模型和工具进行推理, 计划, 和行动.
例如:

* [`koog`](https://github.com/JetBrains/koog): 演示如何使用 Kotlin 代理框架 Koog 构建 AI 代理.
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): 包含一个使用 LangChain4j 构建的, 简单的使用工具的代理.

### 思考链(Chain Of Thought)提示 {id="chain-of-thought-prompting"}

实现结构化的提示技术, 引导语言模型进行多步骤推理.
例如:

* [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb): 一个 Kotlin Notebook, 演示思考链(Chain Of Thought)和结构化输出.

### 后端服务中的 LLM {id="llms-in-backend-services"}

使用 Kotlin 和 Spring, 将 LLM 集成到业务逻辑或 REST API 中.
例如:

* [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples): 包含分类, 聊天, 和摘要总结的示例.
* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): 演示 LLM 应答与应用程序逻辑的完全集成.

### 带有 AI 的 Multiplatform 用户界面 {id="multiplatform-user-interfaces-with-ai"}

使用 Kotlin 和 Compose Multiplatform, 构建基于 AI 的交互式 UI.
例如:

* [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo): 一个 Desktop UI, 连接到 Claude 和 OpenAI, 并使用 Compose Multiplatform 展现应答.

## 探索示例 {id="explore-examples"}

你可以在 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 代码仓库中探索和运行示例.
每个项目都是独立的. 你可以在构建基于 Kotlin 的 AI 应用程序时, 使用每个项目作为参考或模板.

## 下一步做什么 {id="what-s-next"}

* 完成教程 [构建一个 Kotlin 应用程序, 使用 Spring AI, 基于 Qdrant 中存储的文档回答问题](spring-ai-guide.md),
  学习如何在 IntelliJ IDEA 中使用 Kotlin 和 Spring AI 
* 加入 [Kotlin 社区](https://kotlinlang.org/community/),
  与使用 Kotlin 构建 AI 应用程序的其他开发者联系
