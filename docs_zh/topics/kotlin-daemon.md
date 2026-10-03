[//]: # (title: Kotlin Daemon)

Kotlin Daemon 是一个后台进程, 通过它, 构建系统可以让编译器及其运行环境保持就绪状态以执行编译, 以此提高构建速度.
这种方案避免了对每次编译都启动一个新的 Java Virtual Machine (JVM) 实例, 并重新初始化编译器,
从而减少增量编译或频繁的小规模变更时的构建时间.

一些构建系统有自己的 Daemon 来降低启动开销,
例如 [Gradle Daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)
和 [Maven Daemon](https://maven.apache.org/tools/mvnd.html).
使用 Kotlin Daemon 代替它们, 可以降低启动开销, 同时还能将构建系统进程与编译器完全隔离.
在系统设置可能在运行期发生变化的动态环境中, 这样的隔离非常有用.

尽管 Kotlin Daemon 没有直接面向用户的接口, 但你可以通过构建系统或 [构建工具 API](build-tools-api.md) 使用它.

## Kotlin Daemon 配置 {id="kotlin-daemon-configuration"}

可以通过以下方式为 Gradle 或 Maven 配置 Kotlin Daemon 的某些设置.

### 内存管理 {id="memory-management"}

Kotlin Daemon 是一个独立的进程, 有它自己的内存空间, 与客户端隔离.
默认情况下, Kotlin Daemon 会尝试继承启动它的 JVM 进程的堆内存大小 (`-Xmx`).

要配置特定的内存限制, 例如 `-Xmx` 和 `-XX:MaxMetaspaceSize`, 请使用以下属性:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```properties
kotlin.daemon.jvmargs=-Xmx1500m
```

详情请参见 [`kotlin.daemon.jvmargs` 属性](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property).

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 生命周期 {id="lifetime"}

Kotlin Daemon 有两种常用的生命周期策略:

* **Attached Daemon**:
  在客户端进程关闭后不久, 或 Daemon 长时间未使用后关闭 Daemon.
  适用于客户端长期运行的情况.
* **Detached Daemon**:
  让 Daemon 保持更长时间的运行, 等待潜在的后续请求.
  适用于客户端短暂运行的情况.

要配置生命周期策略, 可以使用以下选项:

| 选项                          | 描述                                    | 默认值  |
|-----------------------------|---------------------------------------|------|
| `autoshutdownIdleSeconds`   | 在客户端仍连接的情况下, 上次编译结束后 Daemon 应保持存活的时长. | 2 小时 |
| `autoshutdownUnusedSeconds` | 新启动的 Daemon 在未被使用时, 等待第 1 个客户端连接的时长.  | 1 分钟 |
| `shutdownDelayMilliseconds` | 所有客户端断开连接后, Daemon 等待关闭的时长.           | 1 秒  |

要配置 Attached Daemon 的生命周期策略, 请将 `autoshutdownIdleSeconds` 设置为**较大**的值, 将 `shutdownDelayMilliseconds` 设置为**较小**的值.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

在 `gradle.properties` 文件中添加以下内容:

```properties
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

使用以下命令:

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

要配置 Detached Daemon 的生命周期策略, 请将 `shutdownDelayMilliseconds` 设置为**较大**的值.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

在 `gradle.properties` 文件中添加以下内容:

```properties
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

在 `pom.xml` 文件中添加以下属性:

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>
