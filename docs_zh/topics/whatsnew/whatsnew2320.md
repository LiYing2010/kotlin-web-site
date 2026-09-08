[//]: # (title: Kotlin 2.3.20 中的新功能)

<show-structure depth="2"/>

<web-summary>阅读 Kotlin 2.3.20 发布说明, 包括新的语言功能特性, Kotlin Multiplatform, JVM, Native, JS, 和 Wasm 的更新, 以及对 Gradle 和 Maven 的构建工具支持.</web-summary>

_[发布日期: 2026/03/16](releases.md#release-history)_

<tldr>
    <p>关于 bug 修复版本 2.3.21, 详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.3.21">changelog</a></p>
</tldr>

Kotlin 2.3.20 已经发布了! 以下是它的一些最重要的功能:

* **Gradle**: [兼容 Gradle 9.3.0](#compatibility-with-gradle-9-3-0), 以及 [Kotlin/JVM 编译默认使用 BTA](#kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**: [简化 Kotlin 项目的设置](#simplified-setup-for-kotlin-projects)
* **Kotlin 编译器 plugin**: [Lombok 进入 Alpha 阶段](#lombok-is-now-alpha), 以及 [`kotlin.plugin.jpa` plugin 中的 JPA 支持的改进](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **语言**: [支持基于名称的解构声明](#name-based-destructuring)
* **标准库**: [新 API, 用于创建 `Map.Entry` 的不可变副本](#new-api-for-creating-immutable-copies-of-map-entry)
* **Kotlin/Native**: [C 和 Objective-C 库的新的互操作模式](#new-interoperability-mode-for-c-or-objective-c-libraries)

> 关于 Kotlin 的发布周期, 详情请参见 [Kotlin 发布过程](releases.md).
>
{style="tip"}

## 升级到 Kotlin 2.3.20 {id="update-to-kotlin-2-3-20"}

Kotlin 的最新版本已包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 的最新版本中.

要升级到新的 Kotlin 版本, 请确保你的 IDE 已更新到最新版本, 并在构建脚本中 [修改 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 为 2.3.20.

## 新功能特性 {id="new-stable-features"}
<primary-label ref="stable"/>

以下功能特性在这个发布版中进入 [稳定版](components-stability.md#stability-levels-explained):

<snippet id="simplified-setup-for-kotlin-projects-content">

<var name="id1" value="simplified-setup-for-kotlin-projects"/>

<var name="id2" value="simplified-setup-for-kotlin-projects-how-to-enable"/>

### 简化 Kotlin 项目的设置 {id="%id1%"}
<secondary-label ref="maven"/>

Kotlin 2.3.20 使在 Maven 项目中设置 Kotlin 变得更加容易.
Kotlin 现在支持自动配置源代码根目录和 Kotlin 标准库.

使用新的配置方式, 当你使用 Maven 构建系统创建新的 Kotlin 项目, 或将 Kotlin 引入到已有的 Java Maven 项目时,
不需要在 POM 构建文件中手动指定源代码根路径, 也不需要添加 `kotlin-stdlib` 依赖项.

#### 如何启用 {id="%id2%"}

在你的 `pom.xml` 文件中, 向 Kotlin Maven plugin 的 `<build><plugins>` 节, 添加 `<extensions>true</extensions>`:

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinVersion%</version>
             <extensions>true</extensions> <!-- 添加这个扩展 -->
         </plugin>
    </plugins>
</build>
```

`<extensions>` 选项的新功能包括:

* 如果 `src/main/kotlin` 和 `src/test/kotlin` 目录已经存在, 但在 plugin 配置中没有指定, 则将它们注册为源代码根目录.
* 如果没有明确定义 `kotlin-stdlib` 依赖项, 则自动添加它.

你也可以选择关闭 Kotlin 标准库的自动添加. 方法是, 在 `<properties>` 节中添加以下内容:

```xml
<project>
    <properties>
        <!-- 通过属性禁用智能默认设置 -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</project>
```

请注意, 这个属性不仅会禁用标准库的自动添加, 还会禁用源代码根路径的注册.
`<extensions>` 的其他功能不受影响.

关于配置 Kotlin Maven 项目, 详情请参见 [配置 Maven 项目](maven-configure-project.md).

</snippet>

## 新功能特性 {id="new-experimental-features"}
<primary-label ref="experimental-exp"/>

这个发布版包含以下还未稳定的功能特性.
包括 [Beta](components-stability.md#stability-levels-explained),
[Alpha](components-stability.md#stability-levels-explained),
以及 [实验性](components-stability.md#stability-levels-explained) 状态的功能特性:

* [编译器: Lombok 进入 Alpha 阶段](#lombok-is-now-alpha)
* [语言: 基于名称的解构](#name-based-destructuring)
* [标准库: 新 API, 用于创建 `Map.Entry` 的不可变副本](#new-api-for-creating-immutable-copies-of-map-entry)
* [Kotlin/Native: C 或 Objective-C 库的新的互操作模式](#new-interoperability-mode-for-c-or-objective-c-libraries)

<snippet id="lombok-is-now-alpha-content">

<var name="id3" value="lombok-is-now-alpha"/>

### Lombok 进入 Alpha 阶段 {id="%id3%"}
<primary-label ref="alpha"/>
<secondary-label ref="compiler"/>

Kotlin 1.5.20 引入了实验性的 [Lombok 编译器 plugin](lombok.md),
通过它, 你可以在混合了 Kotlin 和 Java 代码的模块中生成和使用 [Java 的 Lombok 声明](https://projectlombok.org/).

在 2.3.20 中, Lombok 编译器 plugin 已升级为 [Alpha 版](components-stability.md#stability-levels-explained),
因为我们计划让这个功能达到可以用于生产的状态, 但仍在开发中.

</snippet>

<snippet id="name-based-destructuring-content">

<var name="id4" value="name-based-destructuring"/>

<var name="id5" value="name-based-destructuring-how-to-enable"/>

### 基于名称的解构 {id="%id4%"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin 2.3.20 引入了 *基于名称的解构声明*,
它将变量与属性名称匹配, 而不是依赖基于位置的 `componentN()` 函数.

之前, [解构声明](destructuring-declarations.md) 使用基于位置的解构:

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    val (email, username) = user

    println(email)
    // 输出结果为: alice

    println(username)
    // 输出结果为: alice@example.com
}
```
{kotlin-runnable="true"}

在这个示例中, 由于解构依赖于 `componentN()` 函数的顺序, `email` 得到了 `username` 的值, 而 `username` 得到了 `email` 的值.

从 Kotlin 2.3.20 开始, 你可以使用基于名称的解构, 它会让各个变量通过名称引用属性:

```kotlin
fun main() {
    val user = User("alice", "alice@example.com")

    // 使用明确形式的基于名称的解构
    (val mail = email, val name = username) = user

    println(name)
    // 输出结果为: alice

    println(mail)
    // 输出结果为: alice@example.com
}
```

基于名称的解构是 [实验性功能](components-stability.md#stability-levels-explained).
你可以使用 `-Xname-based-destructuring` 编译器选项, 控制编译器如何解释解构声明.

这个选项有以下几种模式:

* `only-syntax`: 启用基于名称的解构的明确调用形式, 不改变既有的解构声明的行为.
* `name-mismatch`: 当对数据类使用基于位置的解构时, 如果使用的变量名称与属性名称不匹配, 报告警告.
* `complete`: 启用基于名称的解构的圆括号简写形式, 并且通过方括号语法, 继续支持基于位置的解构.

如果你使用 `complete` 模式, 使用圆括号简写形式的解构语法, 将变量与属性名称匹配, 而不是依赖位置:

```kotlin
val (email, username) = user
```

#### 如何启用 {id="%id5%"}

要在你的项目中使用基于名称的解构, 请在构建配置文件中添加编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=only-syntax")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xname-based-destructuring=only-syntax</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

对基于名称的解构表示使用者同意(Opt-in), 还会引入方括号的新语法, 表示基于位置的解构:

```kotlin
// 使用明确形式的基于位置的解构
val [username, email] = user
```

我们计划将解构声明逐渐迁移到默认使用基于名称的匹配, 同时保留基于位置的解构, 使用新的方括号语法.

详情请参见这个功能特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md).

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-19627) 中提供你的反馈意见.

</snippet>

<snippet id="new-api-for-creating-immutable-copies-of-map-entry-content">

<var name="id6" value="new-api-for-creating-immutable-copies-of-map-entry"/>

### 新 API, 用于创建 `Map.Entry` 的不可变副本 {id="%id6%"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin 2.3.20 引入了 `Map.Entry.copy()` 扩展函数, 用于创建 [`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/) 的不可变副本.
这个函数能够复制从 [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html) 获取的条目,
实现在修改 Map 后重用这些条目.

`Map.Entry.copy()` 是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解或编译器选项:

```bash
-opt-in=kotlin.ExperimentalStdlibApi
```

下面的示例, 使用 `Map.Entry.copy()` 从可变的 Map 中删除条目:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val map = mutableMapOf(1 to 1, 2 to 2, 3 to 3, 4 to 4)

    val toRemove = map.entries
        .filter { it.key % 2 == 0 }
        .map { it.copy() }

    map.entries.removeAll(toRemove)

    println("map = $map")
    // 输出结果为: map = {1=1, 3=3}
}
```

</snippet>

<snippet id="new-interoperability-mode-for-c-or-objective-c-libraries-content">

<var name="id7" value="new-interoperability-mode-for-c-or-objective-c-libraries"/>

<var name="id8" value="new-interoperability-mode-for-c-or-objective-c-libraries-how-to-enable"/>

<var name="id9" value="new-interoperability-mode-for-c-or-objective-c-libraries-report-your-results"/>

### C 或 Objective-C 库的新的互操作模式 {id="%id7%"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="native"/>

如果你在 Kotlin Multiplatform (KMP) 库或应用程序中使用 C 或 Objective-C 库,
我们邀请你测试新的互操作模式, 并反馈你的结果.

通常, Kotlin/Native 支持将 C 和 Objective-C 库导入 Kotlin.
但是, 对于 KMP 库, 这个功能目前 [受到](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)
与旧版编译器版本的 KMP 兼容性问题影响.

也就是说, 如果你发布了用某个 Kotlin 版本编译的 KMP 库,
导入 C 或 Objective-C 库可能会导致, 无法在使用较早 Kotlin 版本的项目中使用这个 Kotlin 库.

为了解决这个和其他问题, Kotlin 团队一直在修订互操作的底层机制.
从 Kotlin 2.3.20 开始, 你可以通过编译器选项尝试新的模式.

#### 如何启用 {id="%id8%"}

1. 在你的 Gradle 构建文件中, 检查是否有 `cinterops {}` 代码块或 `pod()` 依赖项.
   如果存在, 说明你的项目使用了 C 或 Objective-C 库.

2. 确保你的项目使用 `2.3.20` 或更高版本.
3. 在同一构建文件中, 向 cinterop 工具调用添加 `-Xccall-mode` 编译器选项:

   ```kotlin
   kotlin {
       targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
           compilations.configureEach {
               cinterops.configureEach {
                   extraOpts += listOf("-Xccall-mode", "direct")
               }
           }
       }
   }
   ```

4. 像往常一样构建和测试你的项目, 例如运行单元测试, 应用程序等.
   也可以使用 `--continue` 选项, 让 Gradle 在发生失败后继续执行任务, 这样能够一次找到更多问题.

> 目前还 **不要** 发布使用新的互操作模式编译的库, 因为它仍然是 [实验性功能](components-stability.md#stability-levels-explained).
>
{style="warning"}

#### 报告你的试用结果 {id="%id9%"}

新的互操作模式在大多数情况下应该是即插即用的替代品.
我们计划最终默认启用它. 但要实现这一目标, 我们需要确保它尽可能正常工作, 并在广泛的项目上进行测试, 因为:

* 新模式中尚不支持某些 C 和 Objective-C 声明 (主要是由于兼容性问题).
  我们希望更好地了解这个问题在真实项目中的影响, 并相应地确定未来步骤的优先级.
* 可能存在 bug 或我们没有考虑到的情况.
  测试具有众多交互功能的语言是很困难的, 而测试不同语言之间的交互 (每种语言都有独特的功能集) 则更加困难.

请帮助我们检查真实项目, 并找出具有挑战性的情况.
无论你是否遇到问题, 请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-83218) 的评论中分享你的试用结果.

</snippet>

## 语言 {id="language"}

Kotlin 2.3.20 添加了基于名称的解构声明, 将变量与属性名称匹配, 而不是依赖位置.
它还引入了对带有上下文参数的声明的重载解析的变更.

### 对上下文参数重载解析的变更 {id="changes-to-overload-resolution-for-context-parameters"}
<secondary-label ref="language"/>

Kotlin 2.3.20 引入了对带有上下文参数的声明的重载解析的变更.

之前, 在重载解析时, 会将带有上下文参数的声明视为比没有上下文参数的声明更具体.

从 Kotlin 2.3.20 开始, 这个规则不再适用, 重载的选择更加统一.
因此, 之前能够解析的调用现在会出现歧义, 如果重载只存在上下文参数不同, 会导致编译错误.
在这种情况下, 编译器会警告潜在的歧义.

下面是一个示例:

```kotlin
class Logger {
    fun info(msg: String) = println("INFO: $msg")
}

fun saveUser(id: Int) {
    println("Saving user $id (no logger)")
}

// 报告警告: 上下文声明被遮蔽
context(logger: Logger)
fun saveUser(id: Int) {
    logger.info("Saving user $id")
}

fun main() {
    val logger = Logger()

    context(logger) {
        // 在 2.3.20 中会报告歧义错误
        saveUser(1)
    }
}
```

此外, Kotlin 2.3.20 将 `kotlin.context` 重载的数量从 22 个减少到 6 个,
以减少解析和代码补全时过多的重载候选项.

<include from="whatsnew2320.md" element-id="name-based-destructuring-content">
<var name="id4" value="language-name-based-destructuring"/>
<var name="id5" value="language-name-based-destructuring-how-to-enable"/>
</include>

## 标准库 {id="standard-library"}

Kotlin 2.3.20 的标准库包含了一项新的实验性功能.

<include from="whatsnew2320.md" element-id="new-api-for-creating-immutable-copies-of-map-entry-content">
<var name="id6" value="standard-library-new-api-for-creating-immutable-copies-of-map-entry"/>
</include>

## Kotlin 编译器 plugin {id="kotlin-compiler-plugins"}

Kotlin 2.3.20 为 Lombok 和 `kotlin.plugin.jpa` 编译器 plugin 带来了重要更新.

### `kotlin.plugin.jpa` plugin 中的 JPA 支持的改进 {id="improved-jpa-support-in-the-kotlin-plugin-jpa-plugin"}
<secondary-label ref="compiler"/>

`kotlin.plugin.jpa` plugin 现在除了应用现有的 [`no-arg`](no-arg-plugin.md) 编译器 plugin 外,
还会自动应用 [`all-open`](all-open-plugin.md) 编译器 plugin, 这个 plugin 带有新添加的内建的 JPA 预设.

之前, 使用 `kotlin("plugin.jpa")` 只启用 `no-arg` plugin, 带有 JPA 预设.

在这个发布版中, 我们改进了 `kotlin.plugin.jpa` 预设, 使 `all-open` plugin 自动配置.
这可以确保延迟关联(Lazy Association)能够按预期工作, 而不会导致预先加载, 并触发额外的查询.

从 Kotlin 2.3.20 开始:

* `all-open` 编译器 plugin 提供 JPA 预设.
* Gradle `org.jetbrains.kotlin.plugin.jpa` plugin 自动应用 `org.jetbrains.kotlin.plugin.all-open` plugin, 启用 JPA 预设.
* [Maven JPA 设置](no-arg-plugin.md#jpa-support) 默认使用 `all-open`, 启用 JPA 预设. (IntelliJ IDEA 中的支持从 2026.1 开始提供.)
* Maven 依赖项 `org.jetbrains.kotlin:kotlin-maven-noarg` 现在隐含的包含 `org.jetbrains.kotlin:kotlin-maven-allopen`,
  因此你不再需要在 `<plugin><dependencies>` 代码块中明确的添加它.

因此, 使用以下注解标注的 JPA 实体, 会自动被视为 `open`, 并获得无参数的构造函数, 不需要额外的配置:

* `javax.persistence.Entity`
* `javax.persistence.Embeddable`
* `javax.persistence.MappedSuperclass`
* `jakarta.persistence.Entity`
* `jakarta.persistence.Embeddable`
* `jakarta.persistence.MappedSuperclass`

这个变更简化了构建配置, 并改善了在 Kotlin 中使用 JPA 框架的开箱即用体验.

> 即将发布的 [IntelliJ IDEA 2026.1](https://www.jetbrains.com/idea/whatsnew/) 在项目中设置 Kotlin 时会自动配置 `kotlin.plugin.jpa` plugin.
> IDE 提供了快速修复, 可以添加 plugin, 并删除冗余的无参数构造函数声明.
>
{style="tip"}

<include from="whatsnew2320.md" element-id="lombok-is-now-alpha-content">
<var name="id3" value="compiler-lombok-is-now-alpha"/>
</include>

## Kotlin/JVM {id="kotlin-jvm"}

Kotlin 2.3.20 对 Java 互操作性进行了几项改进.
编译器现在能够识别用于可否为 null 检查的 Vert.x `@Nullable` 注解.
这个版本还添加了对 Java `@Unmodifiable` 和 `@UnmodifiableView` 注解的支持,
在 Kotlin 中将标注的集合视为只读.

### 支持 Vert.x `@Nullable` 注解 {id="support-for-vert-x-nullable-annotation"}
<secondary-label ref="jvm"/>

Kotlin 2.3.20 添加了对 [`io.vertx.codegen.annotations.Nullable`](https://www.javadoc.io/doc/io.vertx/vertx-codegen/3.5.0/io/vertx/codegen/annotations/Nullable.html) 注解的支持.
编译器现在能够识别这个注解, 并默认将可否为 null 检查不匹配的情况报告为警告.

要执行严格的可否为 null 检查, 并将这些警告升级为错误, 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnullability-annotations=@io.vertx.codegen.annotations:strict")
    }
}
```
</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xnullability-annotations=@io.vertx.codegen.annotations:strict</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```
</tab>
</tabs>

### 支持 Java 不可修改集合注解 {id="support-for-java-unmodifiable-collection-annotations"}
<secondary-label ref="jvm"/>

Kotlin 2.3.20 添加了对 [`org.jetbrains.annotations.Unmodifiable`](https://javadoc.io/doc/org.jetbrains/annotations/20.1.0/org/jetbrains/annotations/Unmodifiable.html)
和 [`org.jetbrains.annotations.UnmodifiableView`](https://javadoc.io/doc/org.jetbrains/annotations/24.0.1/org/jetbrains/annotations/UnmodifiableView.html)
Java 注解的支持.

从 Kotlin 2.3.20 开始, 从 Java 声明返回的集合, 如果标注了这些注解, 在 Kotlin 中会被视为只读.
将它们赋值给可变集合类型会导致类型不匹配警告.
这个警告计划在 Kotlin 2.5.0 中升级为错误.

下面是一个示例:

```java
// Java
public class Java {
    public static @UnmodifiableView List<Object> unmodifiableView() {
        return List.of();
    }

    public static @Unmodifiable List<Object> unmodifiable() {
        return List.of();
    }
}
```

```kotlin
// Kotlin

fun main() {
    // 报告警告: Java 类型不匹配
    val mutableView: MutableList<Any> = Java.unmodifiableView()
    val mutableCopy: MutableList<Any> = Java.unmodifiable()
}
```

## Kotlin/Native {id="kotlin-native"}

Kotlin 2.3.20 引入了 C 和 Objective-C 库新的实验性的互操作模式, 交叉编译检查器,
以及在 Kotlin/Native 项目中禁用编译缓存的新 DSL.

### 交叉编译检查器 {id="cross-compilation-checker"}
<secondary-label ref="native"/>

Kotlin 2.3.20 引入了一种方法来确定是否支持给定目标的交叉编译.
这个功能对于跟踪编译任务状态的第三方 plugin 可能很有用.

通常, Kotlin/Native 允许交叉编译, 也就是说, 任何支持的主机都可以为支持的编译目标生成 `.klib` artifact.
但是, 如果你的项目使用 [cinterop 依赖项](native-c-interop.md), 仍然不能为 Apple 编译目标生成 artifact.

新的 `crossCompilationSupported` API 现在检查是否支持交叉编译: 编译目标应该由主机管理器启用,
并且编译目标的所有编译都不应该使用 cinterop 依赖项. 这个检查器默认启用.

关于支持的编译目标和主机, 详情请参见 [Kotlin/Native 文档](native-target-support.md).

### 禁用编译缓存的新 DSL {id="new-dsl-for-disabling-compilation-cache"}
<secondary-label ref="native"/>

Kotlin 2.3.20 附带了在 Kotlin/Native 项目中禁用编译缓存的新 DSL.
它的目的是, 使禁用缓存这一决定更加审慎而且明确.

由于禁用缓存会使 Kotlin/Native 构建显著变慢, 因此应该只在临时的和特殊的情况下使用.
由于这个原因, 现在禁用缓存与特定的 Kotlin 版本绑定, 并且必须附带说明理由 (以此作为一种文档).

如果你确实需要在项目中禁用编译缓存, 请更新 Gradle 构建文件中的 `binaries {}` 代码块, 如下:

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach {
        // 指定你的二进制类型
        it.binaries.framework {
            baseName = "CacheKind"
            isStatic = true

            // 使用新的 DSL 禁用缓存
            disableNativeCache(
                 version = DisableCacheInKotlinVersion.2_3_0,
                 reason = "Cache bug",
                 issue = URI("https://youtrack.com/YY-1111")
            )
        }
    }
}
```

* `version` — 禁用编译缓存的 Kotlin 版本.
* `reason` (必填) — 禁用编译缓存的理由.
* `issue` (可选) — 你的 bug 跟踪系统中, 对应问题的 URL.

新 DSL 替代了已废弃的 `kotlin.native.cacheKind` Gradle 属性.
你可以安全地从 `gradle.properties` 文件中删除它.

关于改善编译时间的更多技巧, 请参见 [Kotlin/Native 文档](native-improving-compilation-time.md).

<include from="whatsnew2320.md" element-id="new-interoperability-mode-for-c-or-objective-c-libraries-content">
<var name="id7" value="native-new-interoperability-mode-for-c-or-objective-c-libraries"/>
<var name="id8" value="native-new-interoperability-mode-for-c-or-objective-c-libraries-how-to-enable"/>
<var name="id9" value="native-new-interoperability-mode-for-c-or-objective-c-libraries-report-your-results"/>
</include>

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin 2.3.20 改善了字符串操作的性能, 编译时间, 以及内存使用.
它还添加了对实验性 `@nativeInvoke` 注解的支持, 这个注解让你能够像调用 JavaScript 函数一样调用 Kotlin 对象或类.

### 字符串性能改善 {id="improved-string-performance"}
<secondary-label ref="wasm"/>

Kotlin/Wasm 现在对 `kotlin.String` 值的操作使用 JS String 内置函数.
这样, 在支持 JavaScript 引擎字符串优化提案的浏览器和 Wasm 运行环境中, Kotlin/Wasm 能够利用这个特性 .
这个优化适用于字符串拼接, 插值, `StringBuilder.append()`, 以及数字到字符串转换等操作.

改善后的结果是:

* 目标基准测试中, 字符串插值速度提升高达 4.6 倍.
* [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app) 构建中, Wasm 二进制文件大小减少约 5%.
* 所有 Wasm 基准测试的中位数, 提升约 1%.
* 在频繁执行追加操作的负载场景中, `StringBuilder.append()` 和 `kotlin.String` 实例拼接, 速度提升至少 20%.

### 编译时间改善和内存优化 {id="improved-compilation-time-and-memory-optimizations"}
<secondary-label ref="wasm"/>

Kotlin 2.3.20 添加了编译器改善, 能够显著减少编译期间的内存消耗, 尤其是在大型项目中.
这些优化还改善了增量构建的性能.

在我们的测试中, 我们观察到干净构建的时间改善了 65%, 增量构建时间改善了 21%.

### 支持 `@nativeInvoke` 注解 {id="support-for-nativeinvoke-annotation"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="wasm"/>

Kotlin 2.3.20 为 `wasmJs` 编译目标引入了对 `@nativeInvoke` 注解的支持.
这个注解让你能够将 Kotlin 对象或类视当作 JavaScript 中的函数.
它的目的是用于将 `external` 声明 (类或接口) 的成员函数标记为 JavaScript 对象的 "调用运算符".

当你为函数添加这个注解时, Kotlin 中对这个函数的每次调用, 都被翻译为对 JavaScript 对象本身的直接调用:

```kotlin
import kotlin.js.nativeInvoke

@OptIn(ExperimentalWasmJsInterop::class)
external class JsAction {
    @nativeInvoke
    operator fun invoke(data: String)
}

fun main() {
    val action = JsAction()
    action("Run task")
}
```

这是一个临时解决方案, 直到设计出 Kotlin/Wasm 与 JavaScript 之间稳定的互操作性为止.
在未来版本中它可能被修改或删除, 编译器在你使用它时会报告警告.

关于 Kotlin/Wasm 与 JavaScript 互操作性, 详情请参见 [与 JavaScript 互操作](wasm-js-interop.md).

## Kotlin/JS {id="kotlin-js"}

Kotlin 2.3.20 允许在 TypeScript 中实现 Kotlin 接口, 并引入了对 SWC 编译平台的实验性支持.

### 从 JavaScript/TypeScript 实现 Kotlin 接口 {id="implementing-kotlin-interfaces-from-javascript-typescript"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

Kotlin 2.3.20 取消了在 JavaScript/TypeScript 端实现 Kotlin 接口的限制.
之前, 只能将 Kotlin 接口导出到 TypeScript, 作为 TypeScript 接口; 从 TypeScript 实现这些借口是禁止的.

现在你可以通过以下方式实现任何 Kotlin 接口:

```kotlin
// Kotlin
@JsExport
interface DataProcessor {
    suspend fun process(): String
}


@JsExport
fun registerProcessor(processor: DataProcessor) { ... }
```

```TypeScript
// TypeScript
import { DataProcessor, registerProcessor } from "my-kmp-library"


class JsonProcessor implements DataProcessor {
    readonly [DataProcessor.Symbol] = true


    async process(): Promise<string> {
        return "processed JSON data"
    }
}

registerProcessor(new JsonProcessor())
```

也可以在 TypeScript 中重用 Kotlin 的默认实现.
尽管 TypeScript 没有接口中默认实现的概念, 但你可以委托给 `DefaultImpls` 对象来解决这个问题:

```kotlin
// Kotlin
@JsExport
interface Logger {
    fun log(): String = "[INFO] Default log entry"
    val prefix: String get() = "LOG"
}
```

```TypeScript
// TypeScript
import { Logger, acceptLogger } from "my-kmp-library"

class ConsoleLogger implements Logger {
    readonly [Logger.Symbol] = true


    // 委托给默认方法实现
    log(): string {
        return Logger.DefaultImpls.log(this);
    }

    // 委托给默认属性实现
    get prefix(): string {
        return Logger.DefaultImpls.prefix.get(this);
    }
}

acceptLogger(new ConsoleLogger())
```

#### 如何启用 {id="how-to-enable-implementing-interfaces-from-typescript"}

在你的构建文件中, 添加新的编译器选项:

```kotlin
kotlin {
    js {
        // ...
        generateTypeScriptDefinitions()
        compilerOptions {
            freeCompilerArgs.add("-Xenable-implementing-interfaces-from-typescript")
        }
    }
}
```

详情请参见 [`@JsExport` 注解](js-to-kotlin-interop.md#jsexport-annotation).

### 支持 SWC 编译平台 {id="support-for-swc-compilation-platform"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

从 Kotlin 2.3.20 开始, Kotlin/JS 支持 [SWC](https://swc.rs/) 编译平台.
这个功能有助于将较新版本的 JavaScript/TypeScript 代码转换为较旧的, 而且更兼容的 JavaScript 代码.

将代码转换委托给外部工具, 让我们能够减少 Kotlin/JS 编译器生成的变体数量, 并加速编译器现代化, 只专注于支持最新的 JavaScript 功能特性.
目前, 支持的 ECMAScript 最新版本仍然是 `es2015`.

此外, 委托转换工作让我们能够改善 [内联 JavaScript](js-interop.md#inline-javascript) 功能.
目前它只支持 ES5 语法 (将在 2.4.0 中改变).
面向较低版本的编译目标, 同时又支持较新的语法, 这是很困难的, 因为需要编译器在内联的 JS 代码块中转换 JS 代码.
通过 SWC, 我们能够添加现代的 JS 语法, 工具会将代码转换为最终用户版本所需要的语法.

迁移到 SWC 也让你有机会在 Kotlin Gradle plugin 中实现基于 [browserlist](https://browsersl.ist/) 的 DSL.
你可以声明目标平台的浏览器或环境, 而不是特定的 JS 版本.

#### 如何启用 {id="how-to-enable-swc-compilation"}

在你的 `gradle.properties` 文件中, 添加以下选项:

```properties
kotlin.js.delegated.transpilation=true
```

在未来的 Kotlin 版本中, 我们计划让通过 SWC 进行转换的功能进入稳定版.
在它成为默认值功能后, 编译多个 JS 目标的功能将从 Kotlin/JS 编译器完全委托给转换器.

关于 SWC 平台, 详情请参见官方 [文档](https://swc.rs/docs/getting-started).

## Gradle {id="gradle"}

Kotlin 2.3.20 兼容于新版本的 Gradle, 并包含对 Kotlin Gradle plugin 中 Kotlin/JVM 编译的更改.

### 兼容 Gradle 9.3.0 {id="compatibility-with-gradle-9-3-0"}
<secondary-label ref="gradle"/>

Kotlin 2.3.20 完全兼容于 Gradle 7.6.3 到 9.3.0. 你也可以使用最新的 Gradle 版本,
但请注意, 这样做可能会导致废弃警告, 并且某些新的 Gradle 功能特性可能无法正常工作.

### KGP 中二进制兼容性验证的改善 {id="improvements-to-binary-compatibility-validation-in-kgp"}
<secondary-label ref="gradle"/>

Kotlin 2.2.0 第一次在 Kotlin Gradle plugin 中引入了 [二进制兼容性验证](gradle-binary-compatibility-validation.md) 功能.
Kotlin 2.3.20 添加了两项改善.

首先, 二进制兼容性验证 Gradle task 名称中不再包含 "Legacy".
我们进行这个更改, 是因为旧的命名约定让 Kotlin 开发者感到困惑:

| 旧名称             | 新名称                   |
|--------------------|--------------------------|
| `checkLegacyAbi`   | `checkKotlinAbi`         |
| `updateLegacyAbi`  | `updateKotlinAbi`        |
| `dumpLegacyAbi`    | `internalDumpKotlinAbi`  |

旧的 task 名称在 Kotlin 2.3.20 中仍然存在, 以便顺利过渡到新名称.

第二, 如果你在项目中启用了二进制兼容性验证, 在你运行 `check` task 时, Gradle 现在会自动运行 `checkKotlinAbi` task.
之前, Gradle 不会运行 `checkKotlinAbi` task, 尽管 `check` task 本来应该运行所有的验证 task.
这导致了 Gradle 项目中的行为不一致.

### Kotlin/JVM 编译默认使用构建工具 API {id="kotlin-jvm-compilation-uses-build-tools-api-by-default"}
<primary-label ref="experimental-general"/>
<secondary-label ref="gradle"/>

在 Kotlin 2.3.20 中, Kotlin Gradle plugin 中的 Kotlin/JVM 编译默认使用 [构建工具 API (Build Tools API, BTA)](build-tools-api.md).
对内部编译基础设施的这个变更, 让我们能够更快的开发 Kotlin 编译器的构建工具支持.

如果你发现任何问题, 请在我们的 [问题追踪系统](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)
中分享你的反馈意见.

## Maven {id="maven"}

Kotlin 2.3.20 带来了一项重要变更, 使设置 Maven 项目变得更加容易.

<include from="whatsnew2320.md" element-id="simplified-setup-for-kotlin-projects-content">
<var name="id1" value="maven-simplified-setup-for-kotlin-projects"/>
<var name="id2" value="maven-simplified-setup-for-kotlin-projects-how-to-enable"/>
</include>

## 构建工具 API {id="build-tools-api"}

Kotlin 2.3.20 为希望使用构建工具 API (Build Tools API, BTA) 将他们的构建系统与 Kotlin 编译器集成的开发者引入了更多变更.

### 构建操作的改进 {id="improvements-to-build-operations"}

在这个发布版中, BTA 改进了构建工具管理构建操作的方式.
构建操作让构建工具与 Kotlin 编译器交互.
每个构建操作都是 [`BuildOperation`](https://github.com/JetBrains/kotlin/blob/v2.3.20/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/BuildOperation.kt#L25)
接口的实现.

你现在可以使用 [`cancel()`](https://github.com/JetBrains/kotlin/blob/v2.3.20/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/BuildOperation.kt#L108)
函数, 取消实现了 [`CancellableBuildOperation`](https://github.com/JetBrains/kotlin/blob/v2.3.20/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/BuildOperation.kt#L94)
接口的构建操作.

`cancel()` 函数基于 "尽力而为" 的原则工作. 也就是说, 不保证操作会被取消.

例如:

```kotlin
val operation = toolchains.jvm.jvmCompilationOperationBuilder(sources, destination) {}

toolchains.createBuildSession().use {
    try {
        it.executeOperation(operation.build())
    } catch (e: OperationCancelledException) {
        println("Build operation has been cancelled.")
    }
}

// ...

// 从另一个线程:
operation.cancel()
```

此外, 构建操作现在更加健壮, 因为你可以创建它们, 使它们一旦开始就无法更改.
方法是, 构建工具必须使用 builder 模式:

1. 使用可变的 builder 来配置对象.
2. 调用 [`build()`](https://github.com/JetBrains/kotlin/blob/v2.3.20/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/jvm/operations/JvmCompilationOperation.kt#L59)
   函数, 创建对象的不可变实例.

例如:

```kotlin
fun prepareBuildOperation(toolchains: KotlinToolchains, sources: List<Path>, destination: Path): JvmCompilationOperation {
    val builder = toolchains.jvm.jvmCompilationOperationBuilder(sources, destination)

    // 使用 builder 配置操作
    builder.compilerArguments[CommonToolArguments.VERBOSE] = true
    builder[COMPILER_ARGUMENTS_LOG_LEVEL] = CompilerArgumentsLogLevel.ERROR

    // 返回一个不可变的操作
    return builder.build()
}
```

### 跨构建工具的, 一致的指标收集 {id="consistent-metric-collection-across-build-tools"}

在 Kotlin 2.3.20 之前, 构建指标基础设施以 Gradle 为中心, 这影响了基础设施的部分内容, 例如指标名称.
此外, 并不是所有的指标都适用于不同的 [编译器执行策略](compiler-execution-strategy.md).

在 Kotlin 2.3.20 中, BTA 为 JVM 提供了与独立于构建工具的指标收集功能.
BTA 还引入了一套一致的指标, 无论编译器执行策略如何.
特定编译方法或编译器执行策略专有的指标, 只有在适用时才会报告.
例如, 增量编译指标只适用于增量构建, 而 daemon 专有的指标只在使用 Kotlin daemon 时可用.

构建工具现在可以为构建操作配置 [`BuildMetricsCollector`](https://github.com/JetBrains/kotlin/blob/v2.3.20/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/trackers/BuildMetricsCollector.kt#L16)
对象, 以捕获构建指标, 帮助用户深入了解构建性能:

```kotlin
val operation =
    kotlinToolchains.jvm.jvmCompilationOperationBuilder(sources, outputDirectory)
operation[BuildOperation.METRICS_COLLECTOR] = object : BuildMetricsCollector {
    override fun collectMetric(
        name: String,
        type: BuildMetricsCollector.ValueType,
        value: Long
    ) {
        // ...
    }
}
```

### 构建工具更容易的配置编译器 plugin {id="easier-configuration-of-compiler-plugins-by-build-tools"}

在 Kotlin 2.3.20 中, BTA 为构建工具提供了新的, 更简单的方式, 用来配置编译器 plugin.
这种方法让构建工具能够直接向用户传播配置.

构建工具不再通过命令行, 使用实验性的编译器选项, 来配置编译器 plugin,
而是能够使用 `kotlin.buildtools.api.arguments.CommonCompilerArguments.COMPILER_PLUGINS` 选项,
配置一个对象列表, 表示编译器 plugin 的配置:

```kotlin
import org.jetbrains.kotlin.buildtools.api.KotlinToolchains
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPlugin
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPluginOption
import org.jetbrains.kotlin.buildtools.api.arguments.CommonCompilerArguments.Companion.COMPILER_PLUGINS
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPlugin
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPluginOption
import org.jetbrains.kotlin.buildtools.api.jvm.JvmPlatformToolchain
import org.jetbrains.kotlin.buildtools.api.jvm.JvmPlatformToolchain.Companion.jvm
import org.jetbrains.kotlin.buildtools.api.jvm.operations.JvmCompilationOperation
import java.nio.file.Path

...

val toolchains: KotlinToolchains = ...
val jvmToolchain: JvmPlatformToolchain = toolchains.jvm
val operation: JvmCompilationOperation.Builder = jvmToolchain.jvmCompilationOperationBuilder(...)
val noArgPluginClasspath: List<Path> = ...
operation.compilerArguments[COMPILER_PLUGINS] = listOf(
    CompilerPlugin(
        pluginId = "org.jetbrains.kotlin.noarg",
        classpath = noArgPluginClasspath,
        rawArguments = listOf(CompilerPluginOption("annotation", "GenerateNoArgsConstructor")),
        orderingRequirements = emptySet(),
    )
)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例代码"}

## 破坏性变更与废弃 {id="breaking-changes-and-deprecations"}

本节重点介绍重要的破坏性变更和废弃. 关于 Kotlin 2.3.0 和 2.3.20 中的废弃, 详情请参见 [兼容性指南](compatibility-guide-23.md).

* 在 Kotlin 2.3.20 中, Kotlin/Wasm 将模块初始化作为 Wasm 模块实例化过程的一部分执行,
  而不是依赖外部 JavaScript 在之后调用 `_initialize()` 函数.
  这个变更使 Kotlin/Wasm 更加独立, 并为 [ES 模块集成提案](https://github.com/WebAssembly/esm-integration) 做好准备.

  如果你使用 [`@EagerInitialization`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-eager-initialization/) 注解,
  相关代码如果在模块初始化完成之前运行, 可能会失败.
  我们建议不要使用 `@EagerInitialization` 注解, 除非你确实需要它.
* 不再支持实验性的上下文接收者功能, 由 [上下文参数](context-parameters.md) 替代.
* 这个版本在 [基于 Intel 芯片的 Apple 编译目标的废弃周期](whatsnew2220.md#deprecation-of-x86-64-apple-targets) 中更进了一步.
  从 Kotlin 2.3.20 开始, 我们废弃了 `macosX64`, `tvosX64` 和 `watchosX64` 编译目标.
  我们计划在下一个 Kotlin 版本中完全删除对这些编译目标的支持.

  由于许多第三方库仍然依赖 `iosX64` 编译目标, 我们暂时将它保留在第 3 层支持.
  也就是说, 我们不保证 CI 测试正确, 而且我们可能不会在不同的编译器版本之间提供源代码和二进制兼容性.
  关于支持层级, 详情请参见 [Kotlin/Native 编译目标支持](native-target-support.md).
* 在 Kotlin 2.3.20 中, Kotlin Multiplatform 中更严格的依赖项匹配, 在共通源代码与平台源代码集的依赖项解析发生差异时, 可能导致元数据编译失败.
  关于这个问题的详情和变通方法, 请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-84533#tldr-workaround) 中的问题.

## 文档更新 {id="documentation-updates"}

我们对 Kotlin 生态系统进行了以下文档变更:

* [Kotlin 路线图](roadmap.md)
  — 查看 Kotlin 在语言和生态系统演进方面优先级的最新列表.
* [升级到 AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html)
  — 查看我们将带有 Android 应用的跨平台项目迁移到 AGP 9 的建议.
* [为 KMP 应用配置 CI](https://kotlinlang.org/docs/multiplatform/kmp-ci-tutorial.html)
  — 按照教程为跨平台项目配置 GitHub Actions 持续集成.
* [Compose UI 预览](https://kotlinlang.org/docs/multiplatform/compose-previews.html)
  — 学习如何在不运行模拟器的情况下, 在 IDE 中预览可组合项.
* [处理 Web 资源](https://kotlinlang.org/docs/multiplatform/compose-web-resources.html)
  — 阅读关于在 Compose Multiplatform 中处理 Web 资源的信息.
* [设置 Viewport](https://kotlinlang.org/docs/multiplatform/compose-css-styles.html)
  — 学习使用 `ComposeViewport()` 函数, 在 HTML 画布上使用 Compose Multiplatform for web 渲染 UI.
* [自定义编译器 plugin](custom-compiler-plugins.md)
  — 学习编译器 plugin 的工作原理, 以及如果找不到适合你的使用场景的 plugin 该怎么做.
* [应用程序结构](https://ktor.io/docs/server-application-structure.html)
  — 为你的 Ktor Server 应用程序, 选择最佳的应用程序结构.
* [HTTP 请求的生命周期](https://ktor.io/docs/server-http-request-lifecycle.html)
  — 学习在 Ktor 中使用 HTTP 请求生命周期, 在客户端断开连接时取消请求处理.
* [依赖注入](https://ktor.io/docs/server-dependency-injection.html)
  — 学习在 Ktor Server 中配置依赖注入, 包含最新的指南和实际示例.
* [Exposed 的 Spring Boot 集成](https://www.jetbrains.com/help/exposed/spring-boot-integration.html#requirements)
  — 学习将 Exposed 与 Spring Boot 3 和 4 一起使用.
