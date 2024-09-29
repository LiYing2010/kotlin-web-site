[//]: # (title: 时间测量)

最终更新: %latestDocDate%

Kotlin 标准库为你提供了一些工具, 使用不同的单位计算和测量时间.
精确的时间测量对下面这些活动是非常重要的:
  * 管理线程或进程
  * 收集统计数据
  * 检测超时
  * 调试

默认情况下, 会使用一个单调时间源(monotonic time source)测量时间, 但也可以配置使用其他时间源.
详情请参见, [创建时间源](#create-time-source).

## 计算持续时间

为了代表一段时间, 标注库提供了 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类.
一个 `Duration` 可以使用 [`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) 枚举类中的下面这些单位来表达:
  * `NANOSECONDS`
  * `MICROSECONDS`
  * `MILLISECONDS`
  * `SECONDS`
  * `MINUTES`
  * `HOURS`
  * `DAYS`

一个 `Duration` 可以是正值, 负值, 0, 正无穷, 或负无穷.

### 创建持续时间

要创建一个 `Duration`, 请使用 `Int`, `Long`, 和 `Double` 类型的 [扩展属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties) :
`nanoseconds`, `microseconds`, `milliseconds`, `seconds`, `minutes`, `hours`, 和 `days`.

> 天表示24小时的时间长度. 不是日历上的天.
>
{style="tip"}

示例:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.nanoseconds
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.days

fun main() {
//sampleStart
    val fiveHundredMilliseconds: Duration = 500.milliseconds
    val zeroSeconds: Duration = 0.seconds
    val tenMinutes: Duration = 10.minutes
    val negativeNanosecond: Duration = (-1).nanoseconds
    val infiniteDays: Duration = Double.POSITIVE_INFINITY.days
    val negativeInfiniteDays: Duration = Double.NEGATIVE_INFINITY.days

    println(fiveHundredMilliseconds) // 输出结果为 500ms
    println(zeroSeconds)             // 输出结果为 0s
    println(tenMinutes)              // 输出结果为 10m
    println(negativeNanosecond)      // 输出结果为 -1ns
    println(infiniteDays)            // 输出结果为 Infinity
    println(negativeInfiniteDays)    // 输出结果为 -Infinity
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-create-duration"}

你也可以对 `Duration` 对象进行基本的算数运算:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
    val fiveSeconds: Duration = 5.seconds
    val thirtySeconds: Duration = 30.seconds

    println(fiveSeconds + thirtySeconds)
    // 输出结果为 35s
    println(thirtySeconds - fiveSeconds)
    // 输出结果为 25s
    println(fiveSeconds * 2)
    // 输出结果为 10s
    println(thirtySeconds / 2)
    // 输出结果为 15s
    println(thirtySeconds / fiveSeconds)
    // 输出结果为 6.0
    println(-thirtySeconds)
    // 输出结果为 -30s
    println((-thirtySeconds).absoluteValue)
    // 输出结果为 30s
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-create-duration-arithmetic"}

### 获取字符串表达

得到 `Duration` 的字符串表达形式会非常有用, 你可以用来打印, 序列化, 传输, 或保存.

要得到字符串表达, 请使用 `.toString()` 函数.
默认情况下, 会使用存在的每个单位来报告时间.
例如: `1h 0m 45.677s` 或 `-(6d 5h 5m 28.284s)`

要配置输出, 请使用 `.toString()` 函数, 以你希望的 `DurationUnit` 和小数位数, 作为函数参数:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit

fun main() {
//sampleStart
    // 使用秒单位, 2 位小数
    println(5887.milliseconds.toString(DurationUnit.SECONDS, 2))
    // 输出结果为 5.89s
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-string-representation"}

要得到 [ISO-8601 兼容](https://en.wikipedia.org/wiki/ISO_8601) 的字符串, 请使用 [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 函数:

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
    println(86420.seconds.toIsoString()) // 输出结果为 PT24H0M20S
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-iso-string-representation"}

### 转换持续时间

要把你的 `Duration` 转换为不同的 `DurationUnit`, 请使用以下属性:
* `inWholeNanoseconds`
* `inWholeMicroseconds`
* `inWholeSeconds`
* `inWholeMinutes`
* `inWholeHours`
* `inWholeDays`

示例:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {
//sampleStart
    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.inWholeSeconds)
    // 输出结果为 1800
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-convert-duration"}

或者, 你也可以使用下面的扩展函数, 以你希望的 `DurationUnit` 作为函数参数:
* `.toInt()`
* `.toDouble()`
* `.toLong()`

示例:

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit

fun main() {
//sampleStart
    println(270.seconds.toDouble(DurationUnit.MINUTES))
    // 输出结果为 4.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-convert-duration-extension"}

### 比较持续时间

要检查 `Duration` 对象是否相等, 请使用相等操作符 (`==`):

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
//sampleStart
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // 输出结果为 true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-equality-duration"}

要比较 `Duration` 对象, 请使用比较操作符 (`<`, `>`):

```kotlin
import kotlin.time.Duration.Companion.microseconds
import kotlin.time.Duration.Companion.nanoseconds

fun main() {
//sampleStart
    println(3000.microseconds < 25000.nanoseconds)
    // 输出结果为 false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-compare-duration"}

### 将持续时间分解为不同的部分

要将一个 `Duration` 分解为不同的时间组成部分, 并进行后续的操作, 请使用
[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数的重载版本.
将你希望执行的后续操作, 以函数或 Lambda 表达式的形式, 作为 `toComponents()` 函数的参数.

示例:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {
//sampleStart
    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.toComponents { hours, minutes, _, _ -> "${hours}h:${minutes}m" })
    // 输出结果为 0h:30m
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-duration-components"}

在上面的示例中, Lambda 表达式使用 `hours` 和 `minutes` 作为参数, 另外还有下划线 (`_`) 对用于未使用的参数 `seconds` 和 `nanoseconds`.
Lambda 表达式使用 [字符串模板](strings.md#string-templates), 得到所需要的 `hours` 和 `minutes` 的输出格式, 最后返回拼接的字符串.

## 测量时间

为了跟踪时间的流逝, 标准库提供了工具, 以便你可以轻松的完成以下任务:
* 使用你希望的时间单位, 测量执行某些代码所需的时间.
* 标记一个时刻.
* 比较两个时刻, 并计算它们之间的差异.
* 检查从某个特定的时刻开始, 经过了多少时间.
* 检查当前时间是否已经经过了某个指定的时刻.

### 测量代码的执行时间

要测量执行一段代码消耗的时间,
请使用内联函数 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html):

```kotlin
import kotlin.time.measureTime

fun main() {
//sampleStart
    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // 例如 103 ms
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-time"}

要测量执行一段代码消耗的时间, **并且** 返回这段代码的执行结果,
请使用内联函数 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html).

示例:

```kotlin
import kotlin.time.measureTimedValue

fun main() {
//sampleStart
    val (value, timeTaken) = measureTimedValue {
        Thread.sleep(100)
        42
    }
    println(value)     // 输出结果为 42
    println(timeTaken) // 例如 103 ms
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-timed-value"}

默认情况下, 这两个函数使用一个单调时间源(monotonic time source).

### 标记一个时刻

要标记一个特定的时刻, 请使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
接口, 和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函数
来创建一个 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/):

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark = timeSource.markNow()
}
```

### 测量时刻之间的差异

要测量来自同一个时间源的 `TimeMarks` 对象之间的差异, 请使用减法操作符 (`-`).

要比较来自同一个时间源的 `TimeMark` 对象, 请使用比较操作符 (`<`, `>`).

示例:

```kotlin
import kotlin.time.*

fun main() {
//sampleStart
   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   Thread.sleep(500) // 睡眠 0.5 秒.
   val mark2 = timeSource.markNow()

   repeat(4) { n ->
       val mark3 = timeSource.markNow()
       val elapsed1 = mark3 - mark1
       val elapsed2 = mark3 - mark2

       println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
   }

   println(mark2 > mark1) // 比较结果为 true, 因为 mark2 是在 mark1 之后捕获的.
   // 输出结果为 true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-difference"}

要检查是否已经经过了某个截止时刻, 或者是否已经到达超时时间, 请使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)
扩展函数:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   val fiveSeconds: Duration = 5.seconds
   val mark2 = mark1 + fiveSeconds

   // 还没有经过 5 秒
   println(mark2.hasPassedNow())
   // 输出结果为 false

   // 等待 6 秒
   Thread.sleep(6000)
   println(mark2.hasPassedNow())
   // 输出结果为 true

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-deadline=passed"}

## 时间源

默认情况下, 会使用一个单调时间源(monotonic time source)测量时间.
单调时间源只会向前移动, 不会受系统变化的影响, 比如时区变化.
单调时间的替代方案是流逝的真实时间(elapsed real time), 也叫做挂钟时间(wall-clock time).
流逝的真实时间是相对于另一个时间点来测量的.

### 各个平台的默认时间源

下表是各个平台的默认单调时间源:

| 平台                  | 时间源                                                                 |
|---------------------|---------------------------------------------------------------------|
| Kotlin/JVM          | `System.nanoTime()`                                                 |
| Kotlin/JS (Node.js) | `process.hrtime()`                                                  |
| Kotlin/JS (browser) | `window.performance.now()` 或 `Date.now()`                           |
| Kotlin/Native       | `std::chrono::high_resolution_clock` or `std::chrono::steady_clock` |

### 创建时间源 {id="create-time-source"}

有些情况下, 你可能想要使用不同的时间源.
例如, 在 Android 中, `System.nanoTime()` 在设备活动时才计算时间.
当设备进入深度睡眠时, 它会失去对时间的追踪.
想要在设备深度睡眠时继续追踪时间, 你可以创建一个使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的时间源:

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

然后你就可以使用你的时间源来进行时间测量:

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // 例如 103 ms
}
```
{validate="false"}

关于 `kotlin.time` 包, 更多详情请参见我们的 [标准库 API 参考文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/).
