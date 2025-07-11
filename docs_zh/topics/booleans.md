[//]: # (title: 布尔(Boolean)类型)

`Boolean` 类型用来表示布尔型对象, 有两个可能的值: `true` 和 `false`.
`Boolean` 还有对应的 [可为 null](null-safety.md) 的类型, 声明为 `Boolean?`.

> 在 JVM 平台, 布尔值保存为基本类型(Primitive Type) `boolean`, 通常使用 8 位.
>
{style="note"}

布尔值的内建运算符有:

* `||` – 或运算 (逻辑 _或_)
* `&&` – 与运算 (逻辑 _与_)
* `!` – 非运算 (逻辑 _非_)

例如:

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    // 输出结果为 true
    println(myTrue && myFalse)
    // 输出结果为 false
    println(!myTrue)
    // 输出结果为 false
    println(boolNull)
    // 输出结果为 null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`||` 和 `&&` 运算符会进行短路计算, 也就是说:

* 如果第一个操作数为 `true`, `||` 运算符不会计算第二个操作数.
* 如果第一个操作数为 `false`, `&&` 运算符不会计算第二个操作数.

> 在 JVM 平台, 可为 null 的布尔对象引用会被装箱(box)为 Java 类, 与 [数值类型](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 一样.
>
{style="note"}
