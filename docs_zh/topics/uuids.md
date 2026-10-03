[//]: # (title: UUID)
[//]: # (description: 了解如何在 Kotlin 中使用 UUID, 包括在跨平台和 JVM 代码中, 创建, 解析, 格式化, 序列化以及操作 UUID 值.)

[`Uuid`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)
类表示通用唯一标识符 (Universally Unique Identifier, UUID),
也称为全局唯一标识符 (Globally Unique Identifier, GUID).

`Uuid` 是一个 128 位的值, 用于在不依赖集中式 ID 分配系统的情况下, 唯一标识一个实体.
这使得 UUID 在分布式应用程序, 数据库, 客户端生成的记录, 或 [Kotlin Multiplatform](get-started.topic) 应用程序中非常有用.

请使用 `Uuid` 类来处理 UUID 值.
与普通字符串不同, 专用的 UUID 类型能够让你的代码更加明确, 并防止意外使用无效的值.

要在你的项目中使用 UUID, 请从 `kotlin.uuid` 包导入 `Uuid` 类:

```kotlin
import kotlin.uuid.Uuid
```

## 生成 UUID {id="generate-uuids"}

要生成一个随机的版本 4 的 UUID 用做通常的标识符 (例如用户或数据库 ID),
请使用 [`Uuid.random()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/random.html) 函数:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.random()
    println(id)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

你还可以使用以下 [实验性](components-stability.md#stability-levels-explained) 函数, 生成特定版本的 UUID:

* [`Uuid.generateV4()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v4.html) 函数,
  生成与 `Uuid.random()` 函数相同类型的 UUID, 但明确指明返回值是版本 4 的 UUID.
* [`Uuid.generateV7()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html) 函数,
  生成版本 7 的 UUID, 带有时间戳, 可用于 UUID 排序.
* [`Uuid.generateV7NonMonotonicAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7-non-monotonic-at.html) 函数,
  为特定时刻生成版本 7 的 UUID.

这些 UUID 生成函数是实验性的.
要选择使用者同意, 请使用 `@OptIn(ExperimentalUuidApi::class)` 注解, 或在你的构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
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
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

下面的示例生成指定版本的 UUID:

```kotlin
import kotlin.time.Instant
import kotlin.time.ExperimentalTime
import kotlin.uuid.Uuid

@OptIn(kotlin.uuid.ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    // 生成版本 4 的 UUID
    val idVersion4 = Uuid.generateV4()
    println(idVersion4)

    // 生成版本 7 的 UUID
    val idVersion7 = Uuid.generateV7()
    println(idVersion7)

    // 为指定时间戳生成版本 7 的 UUID
    val timestamp = Instant.fromEpochMilliseconds(1757440583000L)
    val idVersion7SpecificTime = Uuid.generateV7NonMonotonicAt(timestamp)
    println(idVersion7SpecificTime)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 解析 UUID {id="parse-uuids"}

UUID 值通常以字符串形式表示, 例如在 URL 参数或数据库记录中.

要将 `String` 值转换为 `Uuid` 值,
请使用 [`Uuid.parse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse.html) 函数:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    println(id)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

`Uuid.parse()` 函数接受标准的 16 进制加横线分隔符格式, 以及不带横线分隔符的 16 进制格式.

如果输入无效, `Uuid.parse()` 函数会抛出 `IllegalArgumentException` 异常:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.parse("10")
    println(id)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

如果你的应用程序只接受一种表示形式, 请使用特定格式的函数:

* [`Uuid.parseHexDash()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash.html),
  用于 16 进制加横线分隔符的字符串表示.
* [`Uuid.parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html),
 用于不带横线分隔符的 16 进制字符串表示.

例如:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val standard = Uuid.parseHexDash("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val compact = Uuid.parseHex("de2bc56cea734f3c8a375a46fdb2d79a")

    println(standard)
    println(compact)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

如果你有来自外部来源的 UUID, 并且必须安全地处理无效输入,
请使用 [`Uuid.parseOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-or-null.html),
[`Uuid.parseHexDashOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash-or-null.html),
或 [`Uuid.parseHexOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-or-null.html) 函数.
这些函数在输入无效时会返回 `null`:

```kotlin
fun parseId(input: String): Uuid? {
    return Uuid.parseOrNull(input)
}
```

## 将 UUID 转换为字符串 {id="convert-uuids-to-strings"}

你可以使用以下函数, 将 `Uuid` 值转换为 `String` 值:

* [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-string.html)
  用于标准字符串表示
* [`toHexDashString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-dash-string.html)
  用于 16 进制加横线分隔符格式
* [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)
  用于不带横线分隔符的 16 进制格式

例如:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")

    println(id.toString())
    // 输出结果为: de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexDashString())
    // 输出结果为: de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexString())
    // 输出结果为: de2bc56cea734f3c8a375a46fdb2d79a
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 比较 UUID {id="compare-uuids"}

你可以使用 `==` 运算符, 检查 `Uuid` 值是否相等.

Kotlin 根据 UUID 值进行比较, 而不是根据文本表示.
例如, 如果不同形式的两个值表示相同的 128 位值, 则判定为相等:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val first = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val second = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a")

    println(first == second)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

这使得 `Uuid` 的比较比字符串比较更可靠, 因为字符串比较会将相同值的不同格式视为不同.
`Uuid` 比较检查的是实际的标识符值.

`Uuid` 实现了 `Comparable<Uuid>` 接口, 因此 UUID 值可以使用标准的集合函数(例如 `sorted()`) 进行排序.
在这种情况下, Kotlin 按字典序比较值 (从最高有效位到最低有效位):

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val first = Uuid.generateV7()
    val second = Uuid.generateV7()

    val sorted = listOf(first, second).sorted()
    println(sorted)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 使用二进制表达 {id="work-with-binary-representations"}

某些 API, 存储格式, 以及二进制协议, 不以字符串形式表示 UUID.
相反, 它们将 128 位 UUID 值存储为:

* 16 字节数组
* 两个 64 位值

当你需要与期望二进制 UUID 数据的系统交换 UUID 时, 请使用这些表达.

要在 UUID 和 16 字节表达之间进行转换, 请使用
[`.toByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-byte-array.html)
和 [`Uuid.fromByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-byte-array.html)
函数:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.random()

    val bytes = id.toByteArray()
    val original = Uuid.fromByteArray(bytes)

    println(id)

    println(bytes)
    println(original)

    println(id == original)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

也可以将相同的 128 位 UUID 值表示为 2 个 `Long` 值.
这很有用, 因为 Kotlin 没有提供内置的 128 位整数类型.
这 2 个 `Long` 值将 UUID 分为 2 部分存储:

* `mostSignificantBits` 参数, 存储 UUID 的前 64 位.
* `leastSignificantBits` 参数, 存储 UUID 的后 64 位.

要从 2 个 `Long` 值创建 `Uuid` 值,
请使用 [`Uuid.fromLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-longs.html) 函数:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.fromLongs(
        mostSignificantBits = -4653685776373167443,
        leastSignificantBits = -6288180676521310383.toLong()
    )
    println(id)
    // 输出结果为: bf6ac971-52fd-4aad-a8bb-e4fdac78c751
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

要从现有的 `Uuid` 值中提取 2 个部分, 请使用
[`Uuid.toLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-longs.html) 函数:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.random()

    id.toLongs { mostSignificantBits, leastSignificantBits ->
        println(mostSignificantBits)
        println(leastSignificantBits)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

## 序列化 UUID {id="serialize-uuids"}

Kotlin 支持对 `Uuid` 值进行序列化.
使用这个功能, 可以在 Kotlin 代码之外存储或传输 UUID 值, 例如在 JSON API 中, 或在配置文件中.

要序列化 `Uuid` 值, 请将其表示为字符串, 除非你的应用程序需要其他格式.
[`kotlinx.serialization`](https://kotlinlang.org/docs/serialization.html) 库使用 16 进制加横线分隔符格式:

```kotlin
//sampleStart
import kotlin.uuid.Uuid
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class User(
    val id: Uuid,
    val name: String
)

fun main() {
    val user = User(
        id = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a"),
        name = "Kotlin"
    )

    println(Json.encodeToString(user))
    // 输出结果为: {"id":"de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a","name":"Kotlin"}
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 在 Java API 中使用 UUID {id="use-uuids-with-java-apis"}

Java 使用 `java.util.UUID` 类来表示 UUID. 在 JVM 上, Java API 可能接受或返回此类型.
尽管 `java.util.UUID` 和 `kotlin.uuid.Uuid` 都表示 UUID, 但它们是两种不同的类型.

要在 Kotlin 和 Java 之间传递 UUID, 请进行明确的转换:

* 使用 [`.toKotlinUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-kotlin-uuid.html) 扩展函数,
  将 Java UUID 转换为 Kotlin:

  ```kotlin
  import kotlin.uuid.toKotlinUuid

  val kotlinId: Uuid = javaId.toKotlinUuid()
  ```

* 使用 [`.toJavaUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-java-uuid.html) 扩展函数,
  将 Kotlin UUID 转换为 Java:

  ```kotlin
  import kotlin.uuid.toJavaUuid

  val javaId: java.util.UUID = kotlinId.toJavaUuid()
  ```

通过这些函数, 你可以在 JVM 互操作边界处使用 `Uuid` 来表示 UUID 值.

> `java.util.UUID` 和 `kotlin.uuid.Uuid` 类可以进行比较, 但排序方式可能不同.
> 在从 Java API 迁移到 Kotlin API 之前, 请确保检查那些依赖于 UUID 排序的代码.
>
{style="note"}

Kotlin 还提供了对 Java 缓冲区的支持.
请使用 JVM 专用的函数, 在 `ByteBuffer` 中操作 UUID:

* 使用 [`.getUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/get-uuid.html) 函数,
  从缓冲区读取 UUID.
* 使用 [`.putUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/put-uuid.html) 函数,
  将 UUID 写入缓冲区.
