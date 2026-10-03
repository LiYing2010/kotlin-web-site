[//]: # (title: 使用 Spring Boot 和 Claude 创建任务管理应用程序)

<web-summary>学习如何使用 Claude 和 Spring Boot 创建 Kotlin 应用程序.</web-summary>

在本教程中, 你将学习如何使用 [Claude](https://claude.com/product/overview) 创建一个用于管理任务的 Kotlin 应用程序.
本教程使用 Spring Boot 管理后端基础设施, 同时由 Claude 规划和开发应用程序.

如果你希望不借助 AI 的帮助来创建应用程序, 可以参考我们的 [使用 Kotlin 和 Spring Boot 创建 Web 应用程序](jvm-get-started-spring-boot.md) 教程.

> 与任何 AI 工具一样, Claude 也可能会出错. 请仔细审查 Claude 的修改, 并只对你信任的代码使用它.
> 关于 Claude 安全策略, 详情请参见 [Claude Code 文档](https://code.claude.com/docs/en/security).
>
{style="note"}

## 设置环境 {id="set-up-the-environment"}

> 本教程通过 JetBrains AI Assistant 使用 Claude, 但你也可以在终端中通过 Claude Code 来完成教程的各个步骤.
>
{style="tip"}

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/).
2. 安装 [JetBrains AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant).
3. 通过以下任何一种方式, 激活 Claude Agent:
   * [使用 JetBrains AI 订阅](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-jbai-subscription)
   * [使用 API Key](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-api-key)
   * [使用 Anthropic Console](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-agent-with-provider-specific-method)

## 创建项目 {id="create-a-project"}

> 你也可以使用 [Spring 的基于 Web 的项目生成器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) 创建 Spring Boot 项目.
>
{style="tip"}

在 IntelliJ IDEA 中创建一个新的 Spring Boot 项目:

1. 在 IntelliJ IDEA 中, 选择 **File** | **New** | **Project**.
2. 在左侧面板中, 选择 **New Project** | **Spring Boot**.
3. 在 **New Project** 窗口中, 指定以下项目和选项:

   * **Name**: task-manager-demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 这个选项指定构建系统和 DSL.
     >
     {style="tip"}

   * **Package name**: org.jetbrains.kotlin.taskmanagerdemo
   * **JDK**: jbr-21
   * **Java**: 17

     > 如果你没有安装这些 Java 和 JDK 版本, 可以从下拉列表中下载.
     >
     {style="tip"}

   ![创建 Spring Boot 项目](create-spring-claude-project.png){width=800}

4. 确认所有项目都已填写, 然后点击 **Next**.
5. 在 **Spring Boot** 项目中, 选择最新稳定版本的 Spring Boot.
6. 选择 **Web | Spring Web** 依赖项.

   ![设置 Spring Boot 项目](spring-claude-dependency.png){width=800}

7. 点击 **Create**, 生成并设置项目.

   IDE 会生成并打开新项目. 下载和导入项目依赖项可能需要一些时间.

## 创建开发计划 {id="create-a-development-plan"}

在你的项目中:

1. 打开 ![AI Chat](toolWindowChat@20x20.svg){width=20} **AI Chat** 工具窗口.
   默认情况下, 会选中 **Chat** 模式. 请选择 **Claude Agent**.

   ![选择 Claude Agent](select-claude-agent.png){width=300}

2. 点击 **Mode: Default** ![操作模式](app-client.expui.general.chevronDownLarge.svg){width=20}{type="joined"}, 然后选择 **Mode: Plan Mode**.
   Claude Agent 现在准备好进行规划而不执行操作了.

   ![选择 Plan Mode](claude-plan-mode.png){width=400}

   > 关于各种操作模式, 详情请参见 [选择操作模式](https://www.jetbrains.com/help/ai-assistant/claude-agent.html#select-operation-mode).
   >
   {style="tip"}

3. 编写一个提示词(prompt), 要求 Claude 创建一个任务管理应用程序.
   提供一些你认为应该包含的内容的详细信息. 例如:

   ```text
   我想创建一个任务管理应用程序, 用于管理任务, 例如购物清单.
   它应该有一个基本的 UI, 包含类别, 截止日期, 优先级, 以及状态跟踪.

   在工作时使用 VCS. 逐步工作, 并在每个阶段创建提交记录, 以便我之后可以审查这些变更.
   ```

   > 关于如何设计提示词的指导, 请参见 [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices).
   >
   {style="tip"}

   Claude 会探索现有的项目结构, 并提出一个计划.

4. 在继续之前, 仔细审查计划. 如果你想做一些修改, 请选择 **No, keep planning**, 并提供你的后续意见.
5. 当你准备好继续时, 在各个 **Yes ...** 选项中, 选择符合你希望对 Claude 变更进行多大程度控制的那一个.

   ![可以开始编码](ready-to-code.png){width=600}

   > 关于不同的选项, 详情请参见 [Claude Code 权限模式](https://code.claude.com/docs/en/best-practices).
   >
   {style="tip"}

6. Claude 退出 **Plan Mode**, 并开始工作. 等待工作完成.

## 审查提交记录 {id="review-the-commits"}

在运行应用程序之前, 请仔细审查生成的变更:

1. 打开 **Git** 工具窗口, 查看提交记录列表.
2. 选择一个提交记录, 并双击每个已修改的文件, 在 IntelliJ IDEA 的并排视图中查看差异.

![并排视图](side-by-side-viewer.png){width=800}

## 运行应用程序 {id="run-the-app"}

如果对变更感到满意, 请运行应用程序:

1. 运行 `bootRun` Gradle 任务, 或在终端中输入以下命令:

   ```bash
   ./gradlew bootRun
   ```

2. 在浏览器中, 打开 localhost URL. 默认地址通常为:

   ```text
   http://localhost:8080
   ```

   现在你应该能看到 Claude 创建的基本 UI.

   ![运行应用程序](run-spring-claude-app.png){width=800}

   > 由于是 Claude 负责设计 UI, 你的 UI 可能与本教程中的版本有所不同.
   >
   {style="tip"}

## 测试应用程序 {id="test-the-app"}

现在应该测试应用程序了.

### 手动测试 UI {id="test-the-ui-manually"}

首先测试 UI 的功能. 尝试一些简单的操作:

1. 创建一个任务, 并测试表单字段.
2. 编辑一个任务, 检查更改是否被保存.
3. 更改任务的状态.
4. 删除一个任务.
5. 更改任务的类别.

如果以上任何操作不能正常工作, 请向 Claude 发送新的提示词, 要求它调查并修复问题.

### 运行单元测试 {id="run-unit-tests"}

Claude 还会自动创建一些测试. 运行以下命令, 检查所有测试是否通过:

   ```bash
   ./gradlew test
   ```

或者, 在 `src/test` 目录中打开一个测试, 然后点击边栏中的运行图标 ![运行图标](app-client.expui.run.run.svg){width=20}.
测试成功会显示 ![运行成功图标](app-client.expui.gutter.runSuccess.svg){width=20}.

如果有任何测试不通过, 请向 Claude 发送新的提示词, 让它调查并修复问题.

## 优化改进 {id="make-refinements"}

初始任务完成后, 你可以进行优化改进.
例如, 让我们改进 UI, 使用户能够直接在列表中编辑任务.

你可以发送类似这样的提示词:

```text
下一步, 允许用户在列表中直接编辑任务.
例如, 让用户点击任务标题, 直接在列表中编辑它,
并且不必离开当前视图就能更新字段, 例如优先级, 截止日期, 或状态.
这个改变应该让应用程序感觉更快速, 使用起来更直观.
```

与之前一样, Claude 会探索现有的项目结构, 并提出一个计划.
接受计划后, 等待 Claude 完成工作, 审查变更, 然后再次运行应用程序.

<img src="make-refinements-claude.gif" alt="使用 Claude 优化改进你的 Spring Boot 应用程序" width="600"/>

恭喜! 你已经使用 Claude, 直接在 IntelliJ IDEA 中规划, 构建, 测试, 并改进了一个 Kotlin Spring Boot 应用程序.

## 下一步做什么? {id="what-s-next"}

* 了解 [](kotlin-ai-skills.md)
* 查看 [结合 Kotlin AI 技能使用 Junie](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html) 教程
