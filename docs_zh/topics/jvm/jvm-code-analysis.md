[//]: # (title: Kotlin 项目中的代码质量工具)

<web-summary>学习如何在 Kotlin 后端项目中集成代码质量工具, 例如 ktlint, detekt, SonarQube, SonarCloud 和 Kover.</web-summary>

代码质量工具可以帮助你强制执行编码标准, 尽早发现错误, 测量测试覆盖率, 并维护整个 Kotlin 项目的代码质量.
本指南介绍如何将常用工具集成到使用 Maven 或 Gradle 的后端项目中, 例如
[ktlint](https://ktlint.github.io/ktlint/latest/),
[detekt](https://detekt.dev/),
[SonarQube](https://www.sonarsource.com/products/sonarqube/),
[SonarCloud](https://www.sonarsource.com/products/sonarcloud/),
以及 [Kover](https://kotlin.github.io/kotlinx-kover/).

## 使用 ktlint 进行代码格式化 {id="code-formatting-with-ktlint"}

[ktlint](https://github.com/ktlint/ktlint) 是一个 Kotlin 代码检查和格式化工具,
不需要需额外的配置, 即可强制执行 Kotlin 官方的 [编码规范](coding-conventions.md).

ktlint 会检查各种代码规则, 例如缩进, 操作符周围的空格, import 顺序, 以及尾随逗号.
如果发现违反规则的代码, 构建会失败, 并通过错误消息显示对应的文件和行号.
除了报告违规之外, ktlint 还能自动修复简单的问题.

要在项目中集成 ktlint, 请执行以下步骤:

1. 在构建文件中添加插件:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>com.github.gantsign.maven</groupId>
       <artifactId>ktlint-maven-plugin</artifactId>
       <version>3.7.1</version>
       <executions>
           <execution>
               <id>check</id>
               <goals>
                   <goal>check</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.jlleitschuh.gradle.ktlint") version "12.3.0"
   }
   ```

   </tab>
   </tabs>

2. 运行代码检查工具, 检查代码风格:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn ktlint:check
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew ktlintCheck
   ```

   </tab>
   </tabs>

3. (可选) 也可以在项目的根目录中添加 `.editorconfig` 文件, 自定义规则.
   例如, 允许通配符 import, 并禁用尾随逗号检查:

   ```ini
   [*.{kt,kts}]
   ij_kotlin_imports_layout = *
   ktlint_standard_trailing-comma-on-call-site = disabled
   ktlint_standard_trailing-comma-on-declaration-site = disabled
   ```

   默认情况下, ktlint 遵循 Kotlin 的官方编码规范. 如果你更喜欢与 Kotlin 规范有明显差异的
   [Android Kotlin 风格指南](https://developer.android.com/kotlin/style-guide),
   请在 `.editorconfig` 文件中, 将代码风格设置为 `android_studio`:

   ```ini
   [*.{kt,kts}]
   ktlint_code_style = android_studio
   ```

4. 要自动修复格式问题, 请运行:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn ktlint:format
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew ktlintFormat
   ```

   </tab>
   </tabs>

关于可用的功能和规则, 详情请参见 [ktlint 文档](https://github.com/ktlint/ktlint/tree/master/documentation).

## 使用 detekt 进行代码分析 {id="code-analysis-with-detekt"}

[detekt](https://github.com/detekt/detekt) 是一个 Kotlin 静态代码分析工具, 能够检测代码异味, 复杂度问题, 以及潜在的错误.

要在项目中集成 detekt, 请执行以下步骤:

1. 在构建文件中添加插件:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>com.github.ozsie</groupId>
       <artifactId>detekt-maven-plugin</artifactId>
       <version>1.23.8</version>
       <executions>
           <execution>
               <phase>verify</phase>
               <goals>
                   <goal>check</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("io.gitlab.arturbosch.detekt") version "1.23.8"
   }
   ```

   </tab>
   </tabs>

2. 生成默认的 `detekt.yml` [配置文件](https://detekt.dev/docs/introduction/configurations):

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn detekt:generate-config
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew detektGenerateConfig
   ```

   </tab>
   </tabs>

3. 打开 `detekt.yml` 文件, 对生成的文件中的规则进行定制. 例如:

   ```yaml
   complexity:
       LongMethod:
           threshold: 50
   style:
       MagicNumber:
           active: false
   ```

4. 在构建文件中引用配置文件, 让 detekt 应用新的规则:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>com.github.ozsie</groupId>
       <artifactId>detekt-maven-plugin</artifactId>
       <version>1.23.8</version>
       <configuration>
           <config>detekt.yml</config>
           <report>
               <report>txt:reports/detekt.txt</report>
               <report>xml:reports/detekt.xml</report>
           </report>
       </configuration>
       <executions>
           <execution>
               <phase>verify</phase>
               <goals>
                   <goal>check</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   detekt {
       toolVersion = "1.23.8"
       config.setFrom(file("config/detekt/detekt.yml"))
       buildUponDefaultConfig = true
   }
   ```

   </tab>
   </tabs>

5. 运行代码分析:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn detekt:check
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew detekt
   ```

   </tab>
   </tabs>

detekt 会生成报告, 列出所有违反规则的代码, 严重程度, 文件位置, 以及问题说明.
默认情况下, Gradle 将报告输出到项目根目录下的 `build/reports/detekt` 目录, Maven 输出到 `reports/detekt` 目录.

详情请参见 detekt 的 [Gradle 文档](https://detekt.dev/docs/intro) 和 [Maven 文档](https://github.com/Ozsie/detekt-maven-plugin).

## 使用 SonarSource 进行代码质量检查 {id="code-quality-with-sonarsource"}

SonarSource 的 [SonarQube](https://github.com/SonarSource/sonarqube) 和 [SonarCloud](https://github.com/marketplace/sonarcloud)
为 Kotlin 项目提供深入的静态分析, 包括通过 Web 仪表板进行 bug 检测, 漏洞扫描, 以及代码覆盖率跟踪.

要使用 SonarQube 分析项目, 请执行以下步骤:

1. 在构建文件中添加插件:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>org.sonarsource.scanner.maven</groupId>
       <artifactId>sonar-maven-plugin</artifactId>
       <version>5.7.0.6970</version>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.sonarqube") version "6.2.0.5505"
   }

   sonar {
       properties {
           property("sonar.projectKey", "my-project")
           property("sonar.host.url", "http://localhost:9000")
       }
   }
   ```

   </tab>
   </tabs>

2. (可选) 配置分析属性. 例如, 要让构建等待品质门禁(Quality Gate)的结果, 并在未通过品质门禁检测时让构建失败,
   请添加 `sonar.qualitygate.wait` 属性:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify sonar:sonar \
       -Dsonar.qualitygate.wait=true \
       -Dsonar.projectKey=my-project \
       -Dsonar.host.url=http://localhost:9000 \
       -Dsonar.token=YOUR_TOKEN
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   sonar {
       properties {
           property("sonar.qualitygate.wait", "true")
       }
   }
   ```

   </tab>
   </tabs>

   > 品质门禁规则 (例如, 最低覆盖率阈值, 以及允许的问题数量)
   > 在 SonarQube 或 SonarCloud 的 Web 界面的 **Quality Gates** 中定义, 而不是在构建文件中定义.
   >
   {style="note"}

3. 在 SonarQube 服务器上运行分析:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify sonar:sonar \
       -Dsonar.projectKey=my-project \
       -Dsonar.host.url=http://localhost:9000 \
       -Dsonar.token=YOUR_TOKEN
   ```

   对于 SonarCloud, 请将主机 URL 替换为 `https://sonarcloud.io`, 并提供你的组织密钥:

   ```bash
   mvn verify sonar:sonar \
       -Dsonar.projectKey=my-project \
       -Dsonar.organization=my-org \
       -Dsonar.host.url=https://sonarcloud.io \
       -Dsonar.token=YOUR_TOKEN
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   要运行分析, 请使用 `sonar` 任务, 并提供身份验证 token:

   ```bash
   ./gradlew sonar \
       -Dsonar.token=YOUR_TOKEN
   ```

   默认情况下, 分析会针对本地 SonarQube 服务器运行. 要使用 SonarCloud, 请更新 `build.gradle.kts` 中的 `sonar {}` 代码块,
   将主机 URL 设为 `https://sonarcloud.io`, 并添加组织密钥:

   ```kotlin
   sonar {
       properties {
           property("sonar.projectKey", "example-project")
           property("sonar.organization", "example-org")
           property("sonar.host.url", "https://sonarcloud.io")
       }
   }
   ```

   </tab>
   </tabs>

4. 打开 SonarQube 或 SonarCloud 仪表板查看结果.
   仪表板会根据类型 (bug, 漏洞, 代码异味) 和严重程度, 对问题分组显示.

详情请参见 [SonarSource 文档](https://docs.sonarsource.com/).

## 使用 Kover 测量代码覆盖率 {id="code-coverage-with-kover"}

[Kover](https://github.com/Kotlin/kotlinx-kover) 是 JetBrains 官方的 Kotlin 代码覆盖率工具.
它会测量代码中哪些行和分支被测试覆盖, 并生成供人类阅读的报告.

与 [JaCoCo](https://github.com/jacoco/jacoco) 不同, Kover 能正确理解 Kotlin 特有的结构, 例如内联函数, 数据类,
因此它能报告更准确的覆盖率数字, 不会由于编译器生成的字节码而产生误报.

要在项目中集成 Kover, 请执行以下步骤:

1. 在构建文件中添加插件:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>org.jetbrains.kotlinx</groupId>
       <artifactId>kover-maven-plugin</artifactId>
       <version>0.9.8</version>
       <executions>
           <execution>
               <id>instr</id>
               <goals>
                   <goal>instrumentation</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-verify</id>
               <goals>
                  <goal>verify</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-report-xml</id>
               <goals>
                   <goal>report-xml</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-report-html</id>
               <goals>
                   <goal>report-html</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.jetbrains.kotlinx.kover") version "0.9.8"
   }
   ```

   </tab>
   </tabs>

2. 运行测试, 收集覆盖率数据, 并生成报告:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew koverVerify koverHtmlReport
   ```

   </tab>
   </tabs>

3. 打开 HTML 报告, 报告生成在 `target/site/kover/html/` 目录下 (对于 Gradle 项目, 生成在 `build/reports/kover/html/` 目录下),
   逐行查看覆盖率.
4. (可选) 要强制执行最低覆盖率阈值, 在不满足条件时使构建失败, 可以在构建文件中添加覆盖率验证的配置.
   例如:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <configuration>
       <!-- 创建新的覆盖率验证规则 -->
       <rules>
           <rule>
               <bounds>
                   <bound>
                       <minValue>50</minValue>
                       <coverageUnits>LINE</coverageUnits>
                       <aggregationForGroup>COVERED_PERCENTAGE</aggregationForGroup>
                   </bound>
               </bounds>
           </rule>
       </rules>
   </configuration>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   // 添加 `kover` 配置代码块
   import kotlinx.kover.gradle.plugin.dsl.*

   kover {
       reports {
           total {
               log {
                   aggregationForGroup = AggregationType.COVERED_PERCENTAGE
                   coverageUnits = CoverageUnit.LINE
               }
               verify {
                   rule {
                       minBound(50)
                   }
               }
           }
       }
   }
   ```

   </tab>
   </tabs>

关于配置验证规则, 详情请参见 Kover 的 [Maven 文档](https://kotlin.github.io/kotlinx-kover/maven-plugin/)
和 [Gradle 文档](https://kotlin.github.io/kotlinx-kover/gradle-plugin/).

## 其他工具 {id="other-tools"}

除了 ktlint, detekt, SonarQube, SonarCloud 和 Kover 之外, 也可以尝试其他工具, 来提升 Kotlin 代码质量:

| 工具                                      | 说明                                                                                              |
|-------------------------------------------|---------------------------------------------------------------------------------------------------|
| [CodeQL](https://codeql.github.com/docs/) | GitHub 提供的语义代码分析引擎. 支持 Kotlin, 并可与 GitHub Actions 集成, 自动发现安全漏洞.         |
| [Semgrep](https://semgrep.dev/docs/)      | 快速, 轻量的静态分析工具, 支持自定义规则. 可以用来在 Kotlin 代码中强制执行代码模式, 或检测反模式. |
| [PMD](https://docs.pmd-code.org/latest/)  | 支持 Kotlin 的源代码分析工具 (通过 CPD 复制粘贴检测器), 可以发现常见的编程缺陷和重复代码.         |

## 下一步做什么 {id="what-s-next"}

* [在 Maven 项目中运行测试](jvm-test-maven.md)
* [使用 Maven 配置 Kotlin 项目](maven-configure-project.md)
