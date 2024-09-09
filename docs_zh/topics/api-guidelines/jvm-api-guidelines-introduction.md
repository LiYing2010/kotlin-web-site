---
type: doc
layout: reference
category:
title: "入门"
---

# 入门

最终更新: {{ site.data.releases.latestDocDate }}

一个好的库应该具备以下特征:
* 向后兼容性(Backward Compatibility)
* 完整而且易于理解的文档
* 最低的 [认知复杂度(cognitive complexity)](#cognitive-complexity)
* API 保持一贯

这篇向导概要性的介绍为你的库编写 API 时的最佳实践, 以及需要考虑的问题.
包含以下几章:
* [可读性](jvm-api-guidelines-readability.html)
* [可预测性](jvm-api-guidelines-predictability.html)
* [可调试性](jvm-api-guidelines-debuggability.html)
* [向后兼容性(Backward Compatibility)](jvm-api-guidelines-backward-compatibility.html)

下面的许多最佳实践提供了一些建议, 告诉你如何如何降低 API 的认知复杂度.
因此, 在进入到最佳实践之前, 我们先来解释一下认知复杂度.

### 认知复杂度(Cognitive complexity)

认知复杂度是指, 一个人为了理解一段代码所耗费的脑力劳动的多少.
认知复杂度高的代码库, 会更难理解更难维护, 因此导致发生 bug, 以及开发进度延迟.

一个没有遵循 [单一功能原则](https://en.wikipedia.org/wiki/Single-responsibility_principle) 的类或模块,
就是认知复杂度高的一个例子.
一个类或模块如果做了太多太多的事情, 就会难于理解和修改.
相反, 一个类或模块如果只包含一个清楚的, 明确定义的功能, 它就会更易于使用和维护.

函数也可能会有很高的认知复杂度. "写得不好" 的函数, 常见的特征是:
* 太多参数, 变量, 或循环.
* 太多嵌套的 if-else 语句构成的复杂的逻辑.

与逻辑清楚而且简单的函数(参数很少, 控制流易于理解) 相比, 这种认知复杂度高的函数更难于理解和维护. 
认知复杂度高的函数的一个示例如下:

```kotlin
fun processData(
    data: List<String>,
    delimiter: String,
    ignoreCase: Boolean,
    sort: Boolean,
    maxLength: Int
) {
    // 一些复杂的处理逻辑
}
```

分解这些功能, 降低认知复杂度:

```kotlin
fun delimit(data: List<String>, delimiter: String) { ... }
fun ignoreCase(data: List<String>) { ... }
fun sortAscending(data: List<String>) { ... }
fun sortDescending(data: List<String>) { ... }
fun maxLength(data: List<String>, maxLength: Int) { ... }
```

通过 [扩展函数](../extensions.html) 的帮助, 你可以更加简化上面的代码:

```kotlin
fun List<String>.delimit(delimiter: String): List<String> { ... }
fun List<String>.sortAscending(): List<String> { ... }
fun List<String>.sortDescending(): List<String> { ... }
fun List<String>.maxLength(maxLength: Int): List<String> { ... }
...
```

## 下一步做什么?

学习 API 的 [可读性](jvm-api-guidelines-readability.html).
