[//]: # (title: 编译器执行策略)

_Kotlin 编译器执行策略_ 定义了 Kotlin 编译器在何处运行.
构建工具, 例如[Gradle](gradle.md) 或 [Maven](maven.md), 会配置这个策略.

有两种编译器执行策略:

| 策略                              | Kotlin 编译器的运行位置 | 其他特性和注意事项                                                                                                        |
|-----------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------|
| [Kotlin Daemon](kotlin-daemon.md) | 在独立的 daemon 进程内  | 这是 Gradle 和 Maven 中 _默认而且最快的策略_. Daemon 进程可以在不同的构建系统进程之间共用, 并且支持多个并行编译.          |
| In process                        | 在构建工具的进程内      | 从内存管理的角度来看这是最简单的策略, 但是, 由于它与同一进程中运行的其他逻辑共享状态 (例如 JVM 系统属性), 因此隔离性较差. |

## 在 Gradle 中配置 {id="configure-in-gradle"}

你可以使用以下属性之一, 定义 Kotlin 编译器执行策略:

* Gradle 属性 `kotlin.compiler.execution.strategy`.
* 编译任务属性 `compilerExecutionStrategy`.

### 使用 Gradle 属性 {id="use-the-gradle-property"}

`kotlin.compiler.execution.strategy` 属性的可选值为:

* `daemon` (默认值)
* `in-process`

在 `gradle.properties` 中设置 `kotlin.compiler.execution.strategy` 属性:

```properties
kotlin.compiler.execution.strategy=in-process
```

### 使用编译任务属性 {id="use-the-compile-task-property"}

`compilerExecutionStrategy` task 属性的优先级高于 Gradle 属性 `kotlin.compiler.execution.strategy`.

`compilerExecutionStrategy` task 属性的可选值为:

* [`DAEMON`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-d-a-e-m-o-n/)
  (默认值)
* [`IN_PROCESS`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-i-n_-p-r-o-c-e-s-s/)

在构建脚本中设置 `compilerExecutionStrategy` task 属性:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon).configureEach {
    compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
}
```

</tab>
</tabs>

### 回退策略 {id="fallback-strategy"}

如果与 Kotlin Daemon 的通信失败, 编译器会回退到 "In process" 策略.

发生这种回退时, Gradle 会在构建的输出中打印以下警告:

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

静默的回退可能消耗大量系统资源, 或导致不确定的构建结果.
详情请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy).

要禁止回退, 请使用 Gradle 属性 `kotlin.daemon.useFallbackStrategy`. 这个属性的默认值为 `true`.
当设置为 `false` 时, 如果 Daemon 的启动或通信出现问题, 构建会失败.
请在 `gradle.properties` 中声明这个属性:

```properties
kotlin.daemon.useFallbackStrategy=false
```

Kotlin 编译 task 中还有一个 `useDaemonFallbackStrategy` 属性.
如果两个属性都使用, `useDaemonFallbackStrategy` 属性的优先级更高.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```

</tab>
</tabs>

如果内存不足以运行编译, 日志中会显示相关信息.

## 在 Maven 中配置 {id="configure-in-maven"}

<include from ="maven-kotlin-compiler.md" element-id="maven-configure-execution-strategy"/>
