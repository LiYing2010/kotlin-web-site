---
type: doc
layout: reference
category:
title: "布尔类型"
---

# 布尔(Booleans)类型

最终更新: {{ site.data.releases.latestDocDate }}

`Boolean` 类型用来表示布尔型对象, 有两个可能的值: `true` 和 `false`.
对应的 `Boolean?` 类型还可以为 `null` 值.

布尔值的内建运算符有:

* `||` – 或运算 (逻辑 _或_)
* `&&` – 与运算 (逻辑 _与_)
* `!` – 非运算 (逻辑 _非_)

`||` 和 `&&` 会进行短路计算.


<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    println(myTrue && myFalse)
    println(!myTrue)
//sampleEnd
}
```

</div>

> **在 JVM 平台**: 可为 null 的布尔对象引用会被装箱(box), 与 [数值类型](#numbers-representation-on-the-jvm) 类似.
{:.note}
