[//]: # (title: Kotlin AI 技能(Skill))
[//]: # (description: 了解 Kotlin AI 技能(Skill)是什么, 它们如何帮助 AI 代理(Agent), 以及在哪里可以找到可用的技能.)

Kotlin AI 技能(Skill)是可复用的指令, 帮助 AI 代理(Agent)更加可靠地执行 Kotlin 特定的任务.

技能(Skill)为 AI 代理(Agent)提供开始执行任务之前所需要的上下文.
例如, 技能可以指向相关的 API, 定义前提条件, 或提供逐步的工作流指导.

Kotlin AI 技能帮助代理产生更准确的结果, 并减少你自己解释任务所花费的时间.
对于开发团队, 技能还为常见任务提供了共用的框架, 使每个成员都能获得一致的结果.

<a href="https://github.com/Kotlin/kotlin-agent-skills"><img src="kotlin-ai-skills.svg" alt="探索 Kotlin AI 技能" type="block"/></a>

Kotlin AI 技能遵循 [Agent 技能标准](https://agentskills.io/home),
因此你可以将它们与兼容的 AI 代理一起使用, 例如 [Junie](https://www.jetbrains.com/junie/), Claude Code, OpenAI Codex, Google Gemini,
以及 GitHub Copilot.

## 支持的工作流(Workflow) {id="supported-workflows"}

你可以将 Kotlin AI 技能用于不同的 Kotlin 特定场景.
以下示例演示 AI 技能可以帮助你完成的一些任务.

### 将 Java 源代码文件转换为 Kotlin {id="convert-java-source-files-to-kotlin"}

如果你希望将 Java 源代码文件转换为符合惯用法的 Kotlin 代码, 同时保留同样的行为, 并使用 Kotlin 特定的编码规约,
请使用 [kotlin-tooling-java-to-kotlin](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin) 技能.

关于这种使用场景, 详情请参见 [](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin).

### 将包含 Android 应用程序的跨平台项目迁移到使用 AGP 9 {id="migrate-multiplatform-projects-with-android-apps-to-use-agp-9"}

如果你的 Kotlin Multiplatform 项目需要迁移到 AGP 9, 并且你希望 AI 代理执行需要的项目变更和 Gradle 配置变更,
请使用 [kotlin-tooling-agp9-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) 技能.

关于这种使用场景, 详情请参见 [将包含 Android 应用的 Multiplatform 项目升级为使用 AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html).

### 将 Multiplatform 项目从 CocoaPods 迁移到 SwiftPM 依赖项 {id="migrate-multiplatform-projects-from-cocoapods-to-swiftpm-dependencies"}

如果你的 Kotlin Multiplatform 项目使用 CocoaPods 进行 iOS 集成, 并且你希望 AI 代理将设置迁移到 SwiftPM,
请使用 [kotlin-tooling-cocoapods-spm-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration) 技能.

关于这种使用场景, 详情请参见 [将 Multiplatform 项目从 CocoaPods 迁移到 SwiftPM 依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html).

## 获取支持 {id="get-support"}

如果你有问题或遇到困难, 请在 ![Slack](slack.svg){width=25}{type="joined"} Slack 中寻求帮助: [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
并在 `#ai` 频道中分享你的使用体验.
